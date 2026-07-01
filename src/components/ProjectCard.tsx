import React, { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Github, ChevronRight, Terminal, Server, Shield, Layers, Code, CheckCircle, Database, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectCardProps {
  key?: string;
  project: Project;
  onTechClick?: (tech: string) => void;
}

export default function ProjectCard({ project, onTechClick }: ProjectCardProps) {
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  // Helper to render customized visual isometric canvas illustrations based on project type
  const renderProjectIllustration = (type: string) => {
    switch (type) {
      case 'duplicate':
        return (
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
            <div className="space-y-2 text-center z-10 p-4">
              <div className="flex justify-center gap-1.5 text-indigo-400 font-mono text-xs">
                <span>[Input: EN]</span>
                <span>⇆</span>
                <span>[Output: ES]</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded border border-white/5 max-w-xs mx-auto">
                <span className="text-slate-400">FAISS Index Match:</span> 98.4% Similarity
              </div>
              <div className="flex justify-center gap-1">
                <span className="h-1.5 w-10 bg-slate-850 rounded-full overflow-hidden">
                  <span className="h-full w-4/5 bg-indigo-500 block"></span>
                </span>
                <span className="h-1.5 w-10 bg-slate-850 rounded-full overflow-hidden">
                  <span className="h-full w-1/2 bg-purple-500 block"></span>
                </span>
              </div>
            </div>
          </div>
        );
      case 'realtor':
        return (
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
            <div className="z-10 text-center p-4">
              <div className="text-3xl mb-1">🏠</div>
              <div className="text-xs font-semibold text-slate-300">RealtorBazaar.com</div>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">Residential · Commercial · Plots · PG Listings</p>
              <div className="mt-2.5 flex justify-center gap-1">
                <span className="text-[9px] bg-slate-900 px-2.5 py-0.5 rounded-full border border-white/5 text-indigo-400">MongoDB Active</span>
              </div>
            </div>
          </div>
        );
      case 'mindguard':
        return (
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
            <div className="z-10 text-center p-4 space-y-2">
              <div className="text-2xl">🛡️</div>
              <div className="text-xs font-semibold text-slate-300">Privacy Shield Running</div>
              <div className="font-mono text-[9px] text-indigo-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5 max-w-xs mx-auto inline-block">
                Isolation Forest: Anomaly Score 0.23 (Normal)
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 to-transparent"></div>
            <div className="z-10 text-center p-4">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs font-semibold text-slate-300">MU Examination Inventory</div>
              <div className="mt-2.5 grid grid-cols-2 gap-1 text-[9px] font-mono">
                <div className="bg-slate-900 p-1 rounded border border-white/5 text-indigo-400">Ledger Report</div>
                <div className="bg-slate-900 p-1 rounded border border-white/5 text-indigo-400">Stock Issue</div>
              </div>
            </div>
          </div>
        );
      case 'studybuddy':
        return (
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 to-transparent"></div>
            <div className="z-10 text-center p-4 space-y-1.5">
              <div className="text-2xl">🎓</div>
              <div className="text-xs font-semibold text-purple-300">StudyBuddy AI</div>
              <p className="text-[10px] text-slate-500">Gemini-Powered Adaptive Syllabus</p>
              <span className="text-[8px] font-mono text-slate-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40 inline-block">
                Gemini LLM Active
              </span>
            </div>
          </div>
        );
      case 'prepa':
        return (
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 to-transparent"></div>
            <div className="z-10 text-center p-4 space-y-1">
              <div className="text-2xl">🎙️</div>
              <p className="text-xs font-semibold text-slate-300">Prepa AI Interview</p>
              <div className="flex gap-1 justify-center">
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                <span className="text-[9px] text-slate-400 font-mono">Real-Time Speech Feedback</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
            <div className="z-10 text-center p-4">
              <div className="text-xl mb-1">💻</div>
              <div className="text-xs font-semibold text-slate-300">{project.title}</div>
              <p className="text-[9px] text-slate-500 mt-1">Full-Stack Application Node / React</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Project Card Container */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="group relative flex flex-col justify-between bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all duration-300 neon-glow-indigo/5 hover:neon-glow-indigo/10"
      >
        {/* Card Header & Media */}
        <div>
          <div className="p-3 bg-slate-950/40">
            {renderProjectIllustration(project.iconType)}
          </div>
          
          <div className="p-5 pb-1">
            {/* Badges & Timeline */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] text-slate-400 font-mono">{project.timeline}</span>
              {project.badge && (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  project.badge === 'Award Winner' 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                    : project.badge === 'Live Project'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-slate-800 text-slate-300 border border-white/5'
                }`}>
                  {project.badge}
                </span>
              )}
            </div>

            {/* Title & Role */}
            <h3 className="text-lg font-bold font-display text-white group-hover:text-indigo-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">{project.subtitle}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-1 italic">Role: {project.role}</p>

            {/* Intro Description */}
            <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Card Actions & Tech badges */}
        <div className="p-5 pt-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTechClick?.(tag)}
                className="text-[10px] font-mono bg-slate-950 text-slate-400 hover:text-indigo-350 hover:bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1 transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setShowWalkthrough(true)}
              className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              Technical Blueprint
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </button>

            <div className="flex gap-2">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-white/5 rounded-lg transition"
                  title="Source Code"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="p-1.5 text-indigo-400 hover:text-indigo-350 bg-indigo-950/20 border border-indigo-900/30 rounded-lg transition"
                  title="Live Demo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technical Walkthrough / Blueprint Modal */}
      <AnimatePresence>
        {showWalkthrough && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            {/* Backdrop Close */}
            <div className="absolute inset-0" onClick={() => setShowWalkthrough(false)}></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-slate-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-slate-900/40 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="font-mono text-xs text-slate-300">shravan@portfolio:~/{project.id}_walkthrough</span>
                </div>
                <button
                  onClick={() => setShowWalkthrough(false)}
                  className="p-1 text-slate-400 hover:text-white transition"
                >
                  <span className="text-lg font-bold">×</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                <div>
                  <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">{project.subtitle} · {project.timeline}</p>
                </div>

                {/* Simulated Console block */}
                <div className="bg-slate-950 rounded-2xl border border-white/5 p-4 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-slate-500"># Fetching architectural components...</div>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Role: {project.role}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400">Tech Stack: </span>
                      <span className="text-slate-300">{project.tags.join(', ')}</span>
                    </div>
                  </div>
                  {project.links.demoText && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{project.links.demoText}</span>
                    </div>
                  )}
                </div>

                {/* Key Contributions & Engineering Steps */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-widest font-mono flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-400" /> Core Contributions
                  </h4>
                  <ul className="space-y-3.5">
                    {project.points.map((pt, i) => (
                      <li key={i} className="flex gap-3 text-xs text-slate-300 leading-relaxed">
                        <span className="text-indigo-450 font-bold shrink-0 font-mono">{i+1}.</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Security and DevOps blueprint */}
                <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span>Development & Deployment Strategy</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This project is designed for efficiency, secure access parameters, and rapid runtime load times. Wrote clean modular API endpoints with secure data sanitization, proper database indexing structures, and deployed onto highly available platforms with zero cold start strategies in mind.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 text-xs font-mono text-slate-200 bg-slate-900 border border-white/5 rounded-xl hover:bg-slate-850 hover:border-indigo-500/25 transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Source Code
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 text-xs font-mono text-white bg-indigo-500 rounded-xl hover:bg-indigo-450 transition font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Site
                    </a>
                  )}
                  <button
                    onClick={() => setShowWalkthrough(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
