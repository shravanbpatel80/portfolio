import React from 'react';
import { X, Mail, Phone, MapPin, Globe, Linkedin, Github, Download, Award, BookOpen, Briefcase, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveResumeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InteractiveResume({ isOpen, onClose }: InteractiveResumeProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          {/* Overlay Close */}
          <div className="absolute inset-0" onClick={onClose}></div>
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8 print:border-none print:shadow-none print:my-0 print:rounded-none"
          >
            {/* Header controls (Hidden during print) */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-2 text-xs text-zinc-400 font-mono">shravan_patel_cv.pdf</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Resume Document Content */}
            <div className="p-8 md:p-12 bg-white text-zinc-900 overflow-y-auto max-h-[80vh] print:max-h-none print:p-0">
              {/* Header */}
              <div className="border-b-2 border-zinc-900 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-zinc-950">
                      SHRAVANKUMAR B. PATEL
                    </h1>
                    <p className="text-lg font-medium text-emerald-600 font-sans mt-1">
                      Master of Computer Applications (MCA) Candidate · Aspiring Full-Stack & AI Developer
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs md:text-right font-mono text-zinc-600">
                    <span className="flex items-center md:justify-end gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-800" /> shravan.b.patel954@gmail.com
                    </span>
                    <span className="flex items-center md:justify-end gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-800" /> Mumbai, India
                    </span>
                    <span className="flex items-center md:justify-end gap-1.5">
                      <Github className="w-3.5 h-3.5 text-zinc-800" /> github.com/shravanbpatel954
                    </span>
                    <span className="flex items-center md:justify-end gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-zinc-800" /> linkedin.com/in/shravan-kumar-patel
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6">
                <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-zinc-900" /> Professional Summary
                </h2>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  MCA student at BVIMIT, Navi Mumbai with a B.Sc. in Computer Science. Experienced in building end-to-end full-stack web and mobile applications using the MERN stack and React Native, alongside growing competencies in Artificial Intelligence and NLP pipelines (embeddings, vector indexes, ONNX acceleration). Recognized with a 2nd place award at a major collegiate hackathon for an optimized semantic search solution. Driven to solve practical cloud-scale and intelligence-backed engineering problems in graduate-level positions.
                </p>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                {/* Left Side: Education, Certificates & Details */}
                <div className="md:col-span-1 space-y-6">
                  {/* Education */}
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-zinc-900" /> Education
                    </h2>
                    <div className="space-y-4 text-xs">
                      <div>
                        <p className="font-bold text-zinc-900">Master of Computer Applications (MCA)</p>
                        <p className="text-zinc-600">BVIMIT, Navi Mumbai</p>
                        <p className="text-zinc-500 italic">Sep 2025 – Present</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">B.Sc. Computer Science</p>
                        <p className="text-zinc-600">N.E.S Ratnam College, Mumbai</p>
                        <p className="text-zinc-500 italic">2022 – 2025</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">High School (PCMB Science)</p>
                        <p className="text-zinc-600">Ramniranjan Jhunjhunwala College</p>
                        <p className="text-zinc-500 italic">2021 – 2022</p>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-zinc-900" /> Certifications
                    </h2>
                    <div className="space-y-3 text-xs text-zinc-700">
                      <div>
                        <p className="font-bold text-zinc-900">NPTEL Cloud Computing</p>
                        <p className="text-zinc-600">IIT Kharagpur · Elite Silver (Top 5%)</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">NPTEL OOP in Java</p>
                        <p className="text-zinc-600">IIT Roorkee · Elite Silver (77%)</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">Full-Stack Web Development</p>
                        <p className="text-zinc-600">DevTown Certification</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">Web Development NSDC Approved</p>
                        <p className="text-zinc-600">Internshala & Skill India</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2 mb-3">
                      <Code className="w-4 h-4 text-zinc-900" /> Technical Skills
                    </h2>
                    <div className="space-y-2 text-xs text-zinc-700">
                      <div>
                        <p className="font-bold text-zinc-900">Languages</p>
                        <p className="text-zinc-600">JavaScript, TypeScript, Python, Java, HTML5, CSS3</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">Frameworks / Databases</p>
                        <p className="text-zinc-600">React.js, React Native, Node.js, Express, MongoDB, MySQL, PostgreSQL, Firebase</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">AI / Machine Learning</p>
                        <p className="text-zinc-600">MiniLM, NLP, FAISS Vector Search, ONNX Runtime, Google Gemini API, Anomaly Detection</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">DevOps & Cloud</p>
                        <p className="text-zinc-600">Docker, Git & GitHub, CI/CD, Deployment (Render, Railway, Vercel)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Major Projects & Hackathons */}
                <div className="md:col-span-2 space-y-6">
                  {/* Selected Projects */}
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2 mb-3">
                      <Code className="w-4 h-4 text-zinc-900" /> Key Projects
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-zinc-950">Multilingual Duplicate Detection System</h3>
                          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">Hackathon Winner</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 italic">May 2026 · Lead Backend & ML Architect</p>
                        <ul className="list-disc list-inside mt-1 text-xs text-zinc-600 space-y-1">
                          <li>Developed a cross-lingual duplicate check processing system across 50+ languages.</li>
                          <li>Implemented MiniLM text embeddings and mapped into a FAISS index to run semantic search.</li>
                          <li>Compiled models into ONNX Format, accelerating execution times by 4.5× on normal CPU containers.</li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-zinc-950">RealtorBazaar</h3>
                          <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-bold">Live Product</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 italic">Mar 2026 – Apr 2026 · Solo Developer</p>
                        <ul className="list-disc list-inside mt-1 text-xs text-zinc-600 space-y-1">
                          <li>Built and deployed an end-to-end estate trading service currently operating live at realtorbazaar.com.</li>
                          <li>Engineered responsive filtered searches (PG, plot, houses) and an integrated admin reporting dashboard.</li>
                          <li>Connected a highly robust Node.js backend linked to MongoDB with reliable index structures.</li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-zinc-950">MindGuard</h3>
                          <span className="text-xs bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded font-bold">Android Application</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 italic">Feb 2026 – Mar 2026 · Developer (MCA Project)</p>
                        <ul className="list-disc list-inside mt-1 text-xs text-zinc-600 space-y-1">
                          <li>Created an Android app with React Native detecting shifts in daily behaviors securely on-device.</li>
                          <li>Integrated Isolation Forest anomaly detection code running client-side to protect privacy.</li>
                          <li>Monitored variables: active screen engagement, mobility records, app counts, and bedtime patterns.</li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-zinc-950">Mumbai University Inventory System</h3>
                          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-bold">Intranet App</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 italic">Dec 2024 – Apr 2025 · Core Full-Stack Developer</p>
                        <ul className="list-disc list-inside mt-1 text-xs text-zinc-600 space-y-1">
                          <li>Engineered an inventory ledger system deployed inside the examination department intranet.</li>
                          <li>Coded features for stock issue receipts, purchase ledger entries, challan tracking, and reports.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Accomplishments */}
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-zinc-900" /> Awards & Milestones
                    </h2>
                    <ul className="list-disc list-inside text-xs text-zinc-600 space-y-2">
                      <li>
                        <span className="font-bold text-zinc-900">2nd Place (Innov8 Hackathon - Pixels 2026):</span> Competed against 50+ intercollegiate squads at SIES College. Devised semantic duplicate screening algorithms on stage.
                      </li>
                      <li>
                        <span className="font-bold text-zinc-900">IIT Kharagpur NPTEL Elite Silver:</span> Awarded Top 5% ranking nationwide in the specialized Cloud Computing course (examination score of 81%).
                      </li>
                      <li>
                        <span className="font-bold text-zinc-900">IIT Roorkee NPTEL Elite Silver:</span> Achieved elite silver distinction in Fundamentals of Object-Oriented Programming in Java (score of 77%).
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-200 pt-6 mt-8 text-center text-[10px] text-zinc-400 font-mono print:mt-12">
                Certified authentic portfolio transcript for Shravankumar Patel · Generated July 2026
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
