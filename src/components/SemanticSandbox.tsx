import React, { useState } from 'react';
import { 
  Cpu, FileCode, CheckCircle2, AlertTriangle, ArrowLeftRight, 
  Sparkles, RefreshCw, BarChart3, Languages, HelpCircle, 
  Settings, ChevronRight, Zap, RefreshCw as SpinIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisMetrics {
  levenshteinDistance: number;
  levenshteinSimilarity: number;
  jaccardSimilarity: number;
  cosineSimilarity: number;
}

interface AIReport {
  semanticScore: number;
  detectedLanguages: string[];
  semanticExplanation: string;
  translationAlignment: string;
  duplicateCategory: string;
}

interface AnalysisResponse {
  success: boolean;
  stringA: string;
  stringB: string;
  metrics: AnalysisMetrics;
  aiReport: AIReport;
  usedGemini: boolean;
}

const PRESET_DATASETS = [
  {
    name: "🌐 Cross-Lingual (Eng ↔ Hindi)",
    stringA: "My name is Shravankumar Patel, I am a software developer.",
    stringB: "मेरा नाम श्रवणकुमार पटेल है, मैं एक सॉफ्टवेयर डेवलपर हूँ।",
    description: "Detects identical core meaning across entirely distinct languages."
  },
  {
    name: "📝 Semantic Paraphrase",
    stringA: "Fully responsive full-stack real-estate web application utilizing Express, Node, and MongoDB cloud.",
    stringB: "A mobile-friendly house buying portal with a Node.js backend, NoSQL database cluster, and custom APIs.",
    description: "Evaluates meaning similarity when words share zero lexical characters."
  },
  {
    name: "🚫 False Positive (Word Salad)",
    stringA: "The quick brown fox jumps over the lazy dog in Seattle.",
    stringB: "Seattle quick lazy brown dog over jumps brown the fox.",
    description: "Words are 100% matching but meaning/order is highly broken."
  },
  {
    name: "💎 Exact Duplicate",
    stringA: "Innov8 Hackathon SIES College Second Prize Winner.",
    stringB: "Innov8 Hackathon SIES College Second Prize Winner.",
    description: "A flawless, identical exact match detection."
  }
];

export default function SemanticSandbox() {
  const [stringA, setStringA] = useState(PRESET_DATASETS[1].stringA);
  const [stringB, setStringB] = useState(PRESET_DATASETS[1].stringB);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'math'>('ai');

  const handlePresetSelect = (preset: typeof PRESET_DATASETS[0]) => {
    setStringA(preset.stringA);
    setStringB(preset.stringB);
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!stringA.trim() || !stringB.trim()) {
      setError('Please provide text strings for both inputs.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/semantic-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stringA, stringB })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResult(data);
          return;
        }
      }
      
      // Fallback if status is 404 or other server failure (e.g. deployed on static Netlify)
      throw new Error("Server response failed, running client-side fallback engine...");
    } catch (err) {
      console.warn("Express backend unavailable (likely running on static host like Netlify). Activating client-side math models...", err);
      
      // Local Client-side Math Implementations
      const computeLevenshtein = (s1: string, s2: string): number => {
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
      };

      const computeJaccard = (s1: string, s2: string): number => {
        const rx = /[\w\u0900-\u097F]+/g;
        const words1 = new Set(s1.toLowerCase().match(rx) || []);
        const words2 = new Set(s2.toLowerCase().match(rx) || []);
        if (words1.size === 0 && words2.size === 0) return 100;
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return (intersection.size / union.size) * 100;
      };

      const computeCosine = (s1: string, s2: string): number => {
        const rx = /[\w\u0900-\u097F]+/g;
        const getFrequencyMap = (str: string) => {
          const map: { [key: string]: number } = {};
          const words = str.toLowerCase().match(rx) || [];
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
      };

      const levDist = computeLevenshtein(stringA, stringB);
      const maxLen = Math.max(stringA.length, stringB.length, 1);
      const levSimilarity = Math.max(0, (1 - levDist / maxLen) * 100);
      const jaccardSim = computeJaccard(stringA, stringB);
      const cosineSim = computeCosine(stringA, stringB);

      const avgSim = (jaccardSim + cosineSim) / 2;
      let duplicateCategory = "Partial Overlap";
      if (avgSim > 95) duplicateCategory = "Exact Duplicate";
      else if (avgSim > 75) duplicateCategory = "Semantic Duplicate";
      else if (avgSim < 20) duplicateCategory = "Entirely Different";

      const clientReport: AnalysisResponse = {
        success: true,
        stringA,
        stringB,
        metrics: {
          levenshteinDistance: levDist,
          levenshteinSimilarity: Math.round(levSimilarity),
          jaccardSimilarity: Math.round(jaccardSim),
          cosineSimilarity: Math.round(cosineSim)
        },
        aiReport: {
          semanticScore: Math.round(avgSim),
          detectedLanguages: ["Calculated on Client Node"],
          semanticExplanation: `Computed on-the-fly inside the browser canvas using static client-side mathematical models. (Jaccard Match: ${jaccardSim.toFixed(1)}%, Cosine Vector Match: ${cosineSim.toFixed(1)}%, Character operations: ${levDist}). To activate deep neural NLP descriptions, run in full-stack Node environments.`,
          translationAlignment: "Note: Real-time translation parsing requires server-side Gemini AI integration.",
          duplicateCategory
        },
        usedGemini: false
      };

      setResult(clientReport);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Exact Duplicate': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Semantic Duplicate': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'Partial Overlap': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Entirely Different': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div id="ai-sandbox" className="py-20 md:py-28 border-b border-white/5 relative">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-indigo-500/[0.01] pointer-events-none rounded-3xl blur-3xl -z-10" />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-2 text-center md:text-left max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">
              Interactive AI Sandbox
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
            Cross-Lingual Semantic Duplicate Detector
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This live playground demonstrates the system architecture that secured <strong>2nd Place at SIES Pixels 2026</strong>. 
            Compare text blocks or cross-lingual queries to test how our indices score textual redundancy using a hybrid of classic mathematical vector-space algorithms and deep Gemini semantic reasoning.
          </p>
        </div>

        {/* Preset Selector Bar */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">
            Select a Preset Evaluation Dataset:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_DATASETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetSelect(p)}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-white/5 bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-white transition duration-200 cursor-pointer text-left flex flex-col gap-1 max-w-xs"
              >
                <span className="font-bold text-slate-200">{p.name}</span>
                <span className="text-[9px] text-slate-500 truncate leading-none">{p.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Workspaces left */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-5 md:p-6 space-y-4">
              
              {/* String A */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> String Element A
                  </label>
                  <span className="text-[9px] font-mono text-slate-500">{stringA.length} chars</span>
                </div>
                <textarea
                  value={stringA}
                  onChange={(e) => { setStringA(e.target.value); setResult(null); }}
                  placeholder="Enter first text block or code comment..."
                  className="w-full h-24 text-xs font-sans bg-slate-950/80 text-white border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition duration-300 resize-none"
                />
              </div>

              {/* Interaction Node */}
              <div className="flex justify-center py-1">
                <div className="p-2 bg-slate-950 border border-white/5 rounded-full text-slate-500 shadow-lg">
                  <ArrowLeftRight className="w-4 h-4 rotate-90 lg:rotate-0" />
                </div>
              </div>

              {/* String B */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> String Element B
                  </label>
                  <span className="text-[9px] font-mono text-slate-500">{stringB.length} chars</span>
                </div>
                <textarea
                  value={stringB}
                  onChange={(e) => { setStringB(e.target.value); setResult(null); }}
                  placeholder="Enter second text block, paraphrase, or translation..."
                  className="w-full h-24 text-xs font-sans bg-slate-950/80 text-white border border-white/5 rounded-2xl p-4 outline-none focus:border-purple-500/50 focus:bg-slate-950 transition duration-300 resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-mono font-bold rounded-2xl text-xs transition duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing Semantic Duplicate Matrix...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    Compute Similarity Index
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Report Right */}
          <div className="lg:col-span-6 h-full">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900/10 border border-white/5 border-dashed rounded-3xl p-10 text-center h-[380px] flex flex-col items-center justify-center space-y-3"
                >
                  <div className="p-4 bg-slate-900/50 rounded-full text-slate-600 border border-white/5">
                    <FileCode className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-300">Awaiting Computation</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Write original sentences, copy an article fragment, or click a preset dataset above to run the dual NLP testing pipeline.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md"
                >
                  {/* Results Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Duplicate Index Categorization</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border uppercase tracking-wider ${getCategoryColor(result.aiReport.duplicateCategory)}`}>
                          {result.aiReport.duplicateCategory}
                        </span>
                        {result.usedGemini && (
                          <span className="p-1 bg-indigo-500/10 rounded-md text-indigo-400" title="Refined by Gemini live cloud reasoning">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Circular Score Gauge */}
                    <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-white/5">
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="absolute w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="18" className="stroke-slate-800" strokeWidth="2.5" fill="none" />
                          <circle cx="20" cy="20" r="18" className="stroke-indigo-400" strokeWidth="2.5" strokeDasharray={113} strokeDashoffset={113 - (113 * result.aiReport.semanticScore) / 100} strokeLinecap="round" fill="none" />
                        </svg>
                        <span className="text-xs font-bold font-mono text-white">{result.aiReport.semanticScore}%</span>
                      </div>
                      <div className="text-left">
                        <span className="block text-[9px] font-mono text-slate-500 uppercase leading-none">Semantic Match</span>
                        <span className="text-[10px] font-semibold text-slate-300">Overall Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-white/5 text-xs font-mono">
                    <button
                      onClick={() => setActiveTab('ai')}
                      className={`px-4 py-2 border-b-2 font-bold transition duration-200 cursor-pointer flex items-center gap-2 ${
                        activeTab === 'ai' 
                          ? 'border-indigo-400 text-indigo-300' 
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      AI Semantic Report
                    </button>
                    <button
                      onClick={() => setActiveTab('math')}
                      className={`px-4 py-2 border-b-2 font-bold transition duration-200 cursor-pointer flex items-center gap-2 ${
                        activeTab === 'math' 
                          ? 'border-indigo-400 text-indigo-300' 
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                      Low-Level Math Indices
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="min-h-[180px]">
                    {activeTab === 'ai' ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {/* Detected Languages */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-mono text-slate-500 uppercase">Languages:</span>
                          {result.aiReport.detectedLanguages.map((l, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-950 border border-white/5 rounded-lg text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                              <Languages className="w-3 h-3 text-indigo-400" /> {l}
                            </span>
                          ))}
                        </div>

                        {/* Semantic Explanation */}
                        <div className="space-y-1 bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                          <span className="text-[9px] font-mono uppercase text-slate-500 block leading-none">NLP Analyst Explanation:</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                            {result.aiReport.semanticExplanation}
                          </p>
                        </div>

                        {/* Cross Lingual Alignment */}
                        {result.aiReport.translationAlignment && result.aiReport.translationAlignment !== 'N/A' && (
                          <div className="space-y-1 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl">
                            <span className="text-[9px] font-mono uppercase text-indigo-400 block leading-none">Translation Alignment Map:</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                              {result.aiReport.translationAlignment}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {/* Jaccard Similarity */}
                        <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-500">Jaccard word index</span>
                            <span className="text-white font-bold">{result.metrics.jaccardSimilarity}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.metrics.jaccardSimilarity}%` }} />
                          </div>
                          <p className="text-[9px] text-slate-500 leading-tight pt-1">
                            Measures precise token intersection over union. Perfect for literal word overlap matching.
                          </p>
                        </div>

                        {/* Cosine Similarity */}
                        <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-500">Cosine angle index</span>
                            <span className="text-white font-bold">{result.metrics.cosineSimilarity}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${result.metrics.cosineSimilarity}%` }} />
                          </div>
                          <p className="text-[9px] text-slate-500 leading-tight pt-1">
                            Measures frequency vector angle projections in multidimensional token space.
                          </p>
                        </div>

                        {/* Levenshtein Edit Distance */}
                        <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-500">Levenshtein similarity</span>
                            <span className="text-white font-bold">{result.metrics.levenshteinSimilarity}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${result.metrics.levenshteinSimilarity}%` }} />
                          </div>
                          <p className="text-[9px] text-slate-500 leading-tight pt-1">
                            Inverse percentage of edit operations (insert, delete, replace) required to convert String A to B.
                          </p>
                        </div>

                        {/* Structural Raw operations */}
                        <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-500">Edit Distance Score</span>
                            <span className="text-indigo-400 font-bold font-mono">{result.metrics.levenshteinDistance} ops</span>
                          </div>
                          <div className="text-[9px] text-slate-500 leading-tight mt-1">
                            Classic dynamic programming matrix computing character-level distance. Excellent for spelling errors or slight plagiarisms.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Summary note */}
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-2 border-t border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Calculated with O(M*N) string distance algorithms paired with Google Gemini NLP analysis models.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
