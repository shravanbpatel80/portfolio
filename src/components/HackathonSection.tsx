import React, { useState } from 'react';
import { Award, Users, Trophy, ChevronRight, Eye, Shield, Cpu, Code2, Layers, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HACKATHON_CONTRIBUTIONS } from '../types';

interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  type: 'certificate' | 'award' | 'team' | 'stage';
}

export default function HackathonSection() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gallery-1',
      title: 'Certificate of Merit',
      caption: 'Official SIES College Pixels 2026 2nd Prize Certification',
      type: 'certificate'
    },
    {
      id: 'gallery-2',
      title: 'Receiving the 2nd Prize Award',
      caption: 'Team StackStorm receiving accolades at the SIES main auditorium stage',
      type: 'award'
    },
    {
      id: 'gallery-3',
      title: 'Team StackStorm with Certificates',
      caption: 'Post-award celebration: Pooja, Kaif, Vrushket, and Shravankumar Patel',
      type: 'team'
    },
    {
      id: 'gallery-4',
      title: 'SIES College Event Stage',
      caption: 'Presenting the stream-deduplication system architecture to 5 expert panelists',
      type: 'stage'
    }
  ];

  const renderLightboxContent = (item: GalleryItem) => {
    switch (item.type) {
      case 'certificate':
        return (
          <div className="bg-amber-500/5 border-4 border-amber-500/30 rounded-3xl p-6 md:p-10 text-center font-serif text-amber-100 max-w-lg mx-auto relative overflow-hidden backdrop-blur-md shadow-xl">
            {/* Certificate border decoration */}
            <div className="absolute inset-2 border border-amber-500/10 rounded-2xl"></div>
            <div className="text-3xl text-amber-400 mb-4 relative z-10">🏆</div>
            <p className="text-xs tracking-widest text-amber-300 font-mono uppercase relative z-10">CERTIFICATE OF EXCELLENCE</p>
            <h4 className="text-2xl font-bold font-display mt-2 text-white relative z-10">INNOV8 HACKATHON</h4>
            <p className="text-xs text-slate-400 mt-1 italic relative z-10">Organized by SIES College (Pixels 2026)</p>
            
            <div className="my-6 space-y-2 relative z-10">
              <p className="text-xs text-slate-400 font-sans">This is to certify that team</p>
              <p className="text-xl font-bold text-amber-400 font-mono">StackStorm</p>
              <p className="text-xs text-slate-400 font-sans">comprising of Shravankumar B. Patel & partners was awarded</p>
              <p className="text-2xl font-extrabold text-white tracking-wide uppercase mt-1">SECOND PRIZE (🥈)</p>
              <p className="text-xs text-slate-400 font-sans">out of 50+ contesting teams for their project</p>
              <p className="text-sm font-semibold text-indigo-400 font-mono italic">"Multilingual Semantic Duplicate Detection System"</p>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans border-t border-white/5 pt-6 mt-8 font-mono relative z-10">
              <div>Date: May 2026</div>
              <div>SIES Convener Signature</div>
            </div>
          </div>
        );
      case 'award':
        return (
          <div className="bg-slate-950 border border-white/5 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="text-4xl">🥈</div>
            <h4 className="text-lg font-bold text-white">SIES Pixels 2026 Podium</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Out of over 50 highly competitive tech teams from across the Mumbai metropolitan region, Team StackStorm secured the 2nd prize. Our core system optimization using ONNX Runtime for semantic text indexing was highlighted by judges as an industry-ready software pipeline.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 text-center">
                <span className="block text-lg font-bold text-slate-400">50+</span>
                <span className="text-[9px] text-slate-500">Contesting Teams</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 text-center">
                <span className="block text-lg font-bold text-indigo-400">2nd</span>
                <span className="text-[9px] text-slate-500">Overall Rank</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 text-center">
                <span className="block text-lg font-bold text-purple-400">4.5x</span>
                <span className="text-[9px] text-slate-500">ONNX Speedup</span>
              </div>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 max-w-lg mx-auto">
            <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-indigo-400" /> Team StackStorm Roster
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-white/5">
                <div>
                  <span className="block text-xs font-bold text-white">Shravankumar Patel</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Backend & ML Pipeline Lead</span>
                </div>
                <span className="text-[10px] text-slate-500">MiniLM + FAISS + ONNX</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-white/5">
                <div>
                  <span className="block text-xs font-bold text-white">Pooja Naik</span>
                  <span className="text-[10px] text-slate-400 font-mono">Data Specialist</span>
                </div>
                <span className="text-[10px] text-slate-500">Multilingual Corpora</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-white/5">
                <div>
                  <span className="block text-xs font-bold text-white">Kaif Khan</span>
                  <span className="text-[10px] text-slate-400 font-mono">Frontend Engineer</span>
                </div>
                <span className="text-[10px] text-slate-500">Dashboard & Charts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-white/5">
                <div>
                  <span className="block text-xs font-bold text-white">Vrushket Mulye</span>
                  <span className="text-[10px] text-slate-400 font-mono">Integration Specialist</span>
                </div>
                <span className="text-[10px] text-slate-500">API Sync</span>
              </div>
            </div>
          </div>
        );
      case 'stage':
        return (
          <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 max-w-lg mx-auto space-y-3">
            <div className="text-3xl text-indigo-400">🎤</div>
            <h4 className="text-base font-bold text-white">SIES Audit Stage presentation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Successfully pitched the product architecture in front of an expert panel of tech leaders and academia. Faced technical deep-dives regarding sub-second scaling speeds, embedding translation matrices, and FAISS indexing accuracy, demonstrating exceptional verbal communication and professional engineering readiness.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-12">
      {/* Hackathon Hero Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/50 border border-white/5 rounded-3xl p-6 md:p-8 neon-glow-indigo/5">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">
              2nd Prize · Innov8 Hackathon (Pixels 2026)
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
            Multilingual Duplicate Detection System
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            As part of team <strong className="text-white">StackStorm</strong>, we competed at SIES College against 50+ intercollegiate engineering squads to solve the cross-lingual semantic deduplication problem. Built a lightning-fast semantic indexing engine processing entries across multiple regional languages.
          </p>

          <div className="space-y-3.5">
            <p className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Key Contributions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {HACKATHON_CONTRIBUTIONS.map((contrib) => (
                <div key={contrib.id} className="p-3 bg-slate-950 border border-white/5 rounded-2xl space-y-1 hover:border-indigo-500/20 transition duration-300">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{contrib.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-5">{contrib.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-slate-950 border border-white/5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              Team StackStorm
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Pooja Naik</span>
                <span className="text-slate-500">Data Specialist</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-white/5 pt-2">
                <span>Kaif Khan</span>
                <span className="text-slate-500">Frontend Engineer</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-white/5 pt-2">
                <span>Vrushket Mulye</span>
                <span className="text-slate-500">Integration Lead</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-white/5 pt-2 font-semibold">
                <span className="text-indigo-400">Shravankumar Patel</span>
                <span className="text-slate-400">Backend & ML Lead</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Gallery */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold font-mono text-slate-400 uppercase tracking-widest text-center">
          Hackathon Exhibition Gallery
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer bg-slate-900/50 border border-white/5 rounded-3xl p-4 hover:border-indigo-500/20 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-20 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/5 text-2xl group-hover:bg-slate-900 transition duration-300">
                  {item.type === 'certificate' && '📜'}
                  {item.type === 'award' && '🥈'}
                  {item.type === 'team' && '👥'}
                  {item.type === 'stage' && '🎤'}
                </div>
                <h5 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                  {item.title}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono text-indigo-400 group-hover:translate-x-0.5 transition self-start">
                <Eye className="w-3 h-3" />
                Examine Record
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setActiveItem(null)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg z-10 space-y-4"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute -top-10 right-0 p-1.5 text-slate-400 hover:text-white text-sm font-mono font-bold cursor-pointer"
              >
                CLOSE [×]
              </button>
              
              {renderLightboxContent(activeItem)}
              
              <div className="text-center text-xs text-slate-400 italic">
                {activeItem.caption}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
