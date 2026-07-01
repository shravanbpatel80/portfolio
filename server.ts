import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found in process.env. String analysis will run in high-fidelity mathematical mode with simulated semantic commentary.");
}

// Mathematical string comparison algorithms
function computeLevenshtein(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
      }
    }
  }
  return dp[m][n];
}

function computeJaccard(s1: string, s2: string): number {
  const words1 = new Set(s1.toLowerCase().match(/[\w\u0900-\u097F]+/g) || []); // Includes Devanagari characters
  const words2 = new Set(s2.toLowerCase().match(/[\w\u0900-\u097F]+/g) || []);
  if (words1.size === 0 && words2.size === 0) return 100;

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return (intersection.size / union.size) * 100;
}

function computeCosine(s1: string, s2: string): number {
  const getFrequencyMap = (str: string) => {
    const map: { [key: string]: number } = {};
    const words = str.toLowerCase().match(/[\w\u0900-\u097F]+/g) || [];
    for (const w of words) {
      map[w] = (map[w] || 0) + 1;
    }
    return map;
  };

  const freq1 = getFrequencyMap(s1);
  const freq2 = getFrequencyMap(s2);
  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const w of allWords) {
    const val1 = freq1[w] || 0;
    const val2 = freq2[w] || 0;
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return (dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2))) * 100;
}

// Initialize Supabase Client
const supabaseUrl = `https://${process.env.SUPABASE_PROJECT_ID || 'xqsyvmeypimvgzgqzwnq'}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_cHiDAREW_0YPQKplLUrDwQ_UEVau5mW';

let supabase: any = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized for URL:", supabaseUrl);
  }
} catch (err) {
  console.error("Error initializing Supabase client:", err);
}

// In-Memory Fallback Store
interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

let inMemoryEnquiries: Enquiry[] = [
  {
    id: "demo-1",
    name: "John Doe",
    email: "john@example.com",
    subject: "Collaboration Opportunity",
    message: "Hi Shravan, we are highly impressed with your NLP models and hackathon win. Let's schedule a call next week to discuss potential freelance or contract roles!",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "demo-2",
    name: "Aisha Sharma",
    email: "aisha@techventures.io",
    subject: "Full Stack Engineer Position",
    message: "Hello! I saw your portfolio. Do you have experience deploying Node/Express servers to AWS or Cloud Run? We have open developer roles available in our Mumbai office.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// 1. Admin Login Endpoint
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    return res.json({ success: true, token: "admin-token" });
  }
  return res.status(401).json({ error: "Invalid username or password" });
});

// 2. Create Visitor Enquiry
app.post("/api/enquiries", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: "Email and Message are required" });
  }

  const generatedId = Math.random().toString(36).substr(2, 9);
  const newEnquiry: Enquiry = {
    id: generatedId,
    name: name || "Anonymous",
    email,
    subject: subject || "No Subject",
    message,
    created_at: new Date().toISOString()
  };

  // Store in memory fallback
  inMemoryEnquiries.unshift(newEnquiry);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([{ name: name || "Anonymous", email, subject: subject || "No Subject", message }]);

      if (error) {
        console.error("Supabase insert error:", error);
        const isTableMissing = error.message?.includes("relation") && error.message?.includes("does not exist");
        return res.json({
          success: true,
          saved_to_supabase: false,
          supabase_error: error.message,
          supabase_table_missing: isTableMissing,
          data: newEnquiry
        });
      }

      return res.json({
        success: true,
        saved_to_supabase: true,
        data: newEnquiry
      });
    } catch (err: any) {
      console.error("Failed to insert into Supabase:", err);
      return res.json({
        success: true,
        saved_to_supabase: false,
        supabase_error: err.message || String(err),
        data: newEnquiry
      });
    }
  }

  return res.json({
    success: true,
    saved_to_supabase: false,
    supabase_error: "Supabase client not initialized",
    data: newEnquiry
  });
});

// 3. Fetch Enquiries (Protected)
app.get("/api/enquiries", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer admin-token") {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
        const isTableMissing = error.message?.includes("relation") && error.message?.includes("does not exist");
        return res.json({
          success: true,
          source: 'in-memory',
          supabase_error: error.message,
          supabase_table_missing: isTableMissing,
          data: inMemoryEnquiries
        });
      }

      return res.json({
        success: true,
        source: 'supabase',
        data: data || []
      });
    } catch (err: any) {
      console.error("Failed to select from Supabase:", err);
      return res.json({
        success: true,
        source: 'in-memory',
        supabase_error: err.message || String(err),
        data: inMemoryEnquiries
      });
    }
  }

  return res.json({
    success: true,
    source: 'in-memory',
    data: inMemoryEnquiries
  });
});

// 4. Delete Enquiry (Protected)
app.delete("/api/enquiries/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer admin-token") {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const { id } = req.params;

  // Filter out from in-memory fallback
  inMemoryEnquiries = inMemoryEnquiries.filter(e => e.id !== id && String(e.id) !== String(id));

  if (supabase) {
    try {
      // Attempt to delete from Supabase (by ID or UUID)
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Supabase delete error:", error);
        // Fall back to deleting by string if uuid match fails or other tables issue
      }
    } catch (err) {
      console.error("Failed to delete from Supabase:", err);
    }
  }

  return res.json({ success: true });
});

// 5. Semantic Analysis and Duplicate Detection (Unique Hackathon Sandbox Feature)
app.post("/api/semantic-analyze", async (req, res) => {
  const { stringA, stringB } = req.body;
  if (!stringA || !stringB) {
    return res.status(400).json({ error: "Both stringA and stringB are required for analysis." });
  }

  // 1. Compute local exact string metrics
  const levDist = computeLevenshtein(stringA, stringB);
  const maxLen = Math.max(stringA.length, stringB.length, 1);
  const levSimilarity = Math.max(0, (1 - levDist / maxLen) * 100);

  const jaccardSim = computeJaccard(stringA, stringB);
  const cosineSim = computeCosine(stringA, stringB);

  // 2. Perform server-side Gemini semantic reasoning if API key is active
  let aiReport = {
    semanticScore: Math.round((jaccardSim + cosineSim) / 2),
    detectedLanguages: ["English"],
    semanticExplanation: "Local mathematical algorithms evaluated word frequency and character distance. Gemini AI details will generate when active.",
    translationAlignment: "N/A",
    duplicateCategory: "Partial Overlap"
  };

  let usedGemini = false;

  if (ai) {
    try {
      const prompt = `Analyze the semantic similarity and duplicate level between these two data strings:
String A: "${stringA}"
String B: "${stringB}"

Evaluate meaning alignment, language differences (e.g. cross-lingual equivalents like English to Hindi or Marathi), conceptual overlap, and provide a similarity score (0 to 100) along with categories. Returns strict JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert NLP systems evaluator designed for a high-performance cross-lingual duplicate detection platform. Respond strictly with a valid JSON object matching the requested schema. No conversational preamble, markdown formatting or markdown wrappers.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              semanticScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing semantic meaning overlap." },
              detectedLanguages: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of languages detected across both strings."
              },
              semanticExplanation: { type: Type.STRING, description: "Detailed explanation of meaning similarities, focus differences, or duplication level." },
              translationAlignment: { type: Type.STRING, description: "Specific alignment description if strings are translated/cross-lingual versions of each other, otherwise N/A." },
              duplicateCategory: { type: Type.STRING, description: "Must be exactly one of: 'Exact Duplicate', 'Semantic Duplicate', 'Partial Overlap', 'Entirely Different'" }
            },
            required: ["semanticScore", "detectedLanguages", "semanticExplanation", "translationAlignment", "duplicateCategory"]
          }
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed && typeof parsed.semanticScore === 'number') {
          aiReport = parsed;
          usedGemini = true;
        }
      }
    } catch (err: any) {
      console.error("Gemini semantic analysis API error:", err);
      // Fallback with a smarter rule-based categorization
      let category = "Partial Overlap";
      const avg = (jaccardSim + cosineSim) / 2;
      if (avg > 95) category = "Exact Duplicate";
      else if (avg > 75) category = "Semantic Duplicate";
      else if (avg < 20) category = "Entirely Different";

      aiReport = {
        semanticScore: Math.round(avg),
        detectedLanguages: ["Detected via local math parsing"],
        semanticExplanation: `Computed via offline similarity metrics: Cosine Similarity of ${cosineSim.toFixed(1)}% and Jaccard word-overlap index of ${jaccardSim.toFixed(1)}%. [Offline mode: Gemini API was temporarily bypassed or key was omitted]`,
        translationAlignment: "Cross-lingual alignment analysis requires live Gemini AI API activation.",
        duplicateCategory: category
      };
    }
  } else {
    // Graceful offline fallback
    let category = "Partial Overlap";
    const avg = (jaccardSim + cosineSim) / 2;
    if (avg > 95) category = "Exact Duplicate";
    else if (avg > 75) category = "Semantic Duplicate";
    else if (avg < 20) category = "Entirely Different";

    aiReport = {
      semanticScore: Math.round(avg),
      detectedLanguages: ["Identified via character tokenization"],
      semanticExplanation: `Computed using high-fidelity local vector space modeling. Jaccard Index: ${jaccardSim.toFixed(1)}%, Cosine Similarity: ${cosineSim.toFixed(1)}%, Levenshtein Edit Distance: ${levDist} operations. Connect a Gemini API key in Secrets to activate full cross-lingual NLP reasoning!`,
      translationAlignment: "Active cross-lingual translation parsing requires a live Gemini API cloud node.",
      duplicateCategory: category
    };
  }

  return res.json({
    success: true,
    stringA,
    stringB,
    metrics: {
      levenshteinDistance: levDist,
      levenshteinSimilarity: Math.round(levSimilarity),
      jaccardSimilarity: Math.round(jaccardSim),
      cosineSimilarity: Math.round(cosineSim)
    },
    aiReport,
    usedGemini
  });
});

// Vite Middleware & SPA serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Production static file server configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Error setting up Vite dev server middleware:", err);
});
