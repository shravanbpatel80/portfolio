import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal, Briefcase, Award, Trophy, BookOpen, ArrowRight, ChevronRight, 
  Menu, X, ExternalLink, Github, Linkedin, FileText, MapPin, Mail, 
  User, Download, Sparkles, Cpu, Database, Monitor, Smartphone, Globe, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data & Subcomponents
import { 
  EDUCATION_DATA, SKILLS_DATA, PROJECTS_DATA, CERTIFICATES_DATA, 
  Project, SkillCategory 
} from './types';
import ProjectCard from './components/ProjectCard';
import InteractiveResume from './components/InteractiveResume';
import HackathonSection from './components/HackathonSection';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';
import SemanticSandbox from './components/SemanticSandbox';

const HERO_TITLES = [
  "Master of Computer Applications Candidate",
  "Full-Stack Web & Mobile Developer",
  "AI & NLP Pipeline Architect",
  "Cloud-Ready Software Engineer"
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'all' | 'ai-ml' | 'full-stack' | 'mobile' | 'other'>('all');
  const [selectedTechTag, setSelectedTechTag] = useState<string | null>(null);

  // URL Hash/Search listener to open Admin Portal instantly
  useEffect(() => {
    const handleHashAndSearch = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('view=admin')) {
        setAdminOpen(true);
      } else {
        setAdminOpen(false);
      }
    };

    handleHashAndSearch();
    window.addEventListener('hashchange', handleHashAndSearch);
    window.addEventListener('popstate', handleHashAndSearch);
    return () => {
      window.removeEventListener('hashchange', handleHashAndSearch);
      window.removeEventListener('popstate', handleHashAndSearch);
    };
  }, []);

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    } else if (window.location.search.includes('view=admin')) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('view');
      const searchStr = searchParams.toString();
      window.history.pushState(null, '', window.location.pathname + (searchStr ? '?' + searchStr : '') + window.location.hash);
    }
  };

  // Rotating title index in Hero
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % HERO_TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll spy setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Filter projects by both category tab and selected tech tag (if clicked)
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((proj) => {
      // 1. Filter by category tab
      const matchesCategory = 
        projectFilter === 'all' || 
        (projectFilter === 'ai-ml' && proj.category === 'ai-ml') ||
        (projectFilter === 'full-stack' && proj.category === 'full-stack') ||
        (projectFilter === 'mobile' && proj.category === 'mobile') ||
        (projectFilter === 'other' && ['ecommerce', 'game', 'sustainability'].includes(proj.category));

      // 2. Filter by tech tag if clicked
      const matchesTechTag = 
        !selectedTechTag || 
        proj.tags.includes(selectedTechTag);

      return matchesCategory && matchesTechTag;
    });
  }, [projectFilter, selectedTechTag]);

  // Handler when clicking on a technology item in "Technical Stack" section
  const handleTechClick = (techName: string) => {
    setSelectedTechTag(techName);
    // Find category that matches this tag if any to set proper category tab
    const projectWithTag = PROJECTS_DATA.find(p => p.tags.includes(techName));
    if (projectWithTag) {
      if (projectWithTag.category === 'ai-ml') setProjectFilter('ai-ml');
      else if (projectWithTag.category === 'full-stack') setProjectFilter('full-stack');
      else if (projectWithTag.category === 'mobile') setProjectFilter('mobile');
      else setProjectFilter('other');
    } else {
      setProjectFilter('all');
    }
    
    // Scroll smoothly to projects section
    const projSection = document.getElementById('projects');
    if (projSection) {
      projSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearTechFilter = () => {
    setSelectedTechTag(null);
    setProjectFilter('all');
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Education', id: 'education' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'AI Sandbox', id: 'ai-sandbox' },
    { name: 'Contact', id: 'contact' }
  ];

  if (adminOpen) {
    return <AdminPanel onClose={handleCloseAdmin} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 bg-dot-pattern text-slate-200 font-sans selection:bg-indigo-500/20 selection:text-indigo-400">
      
      {/* Dynamic Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="font-mono text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            &lt;Shravan /&gt;
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-3.5 py-2 text-xs font-mono font-medium tracking-wide rounded-lg transition relative ${
                  activeSection === link.id 
                    ? 'text-indigo-400' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="active-nav-indicator"
                    className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-indigo-400 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setResumeOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-indigo-500/30 text-xs font-mono rounded-xl text-slate-300 transition"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Download Resume
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-200 focus:outline-none transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-white/5 bg-slate-950/95 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 text-xs font-mono font-medium tracking-wider border-b border-white/5 last:border-0 ${
                      activeSection === link.id ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-400'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setResumeOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 border border-white/5 text-xs font-mono rounded-xl text-slate-300"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Resume
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-20">

        {/* Section: HERO / HOME */}
        <section id="home" className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 md:py-20 relative">
          
          {/* Subtle gradient glowing backgrounds */}
          <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-3xl -z-10"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-indigo-300 uppercase">
                    MCA Graduate Developer
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 font-mono tracking-wide">Hello, I'm</p>
                
                {/* Glitch/Gradient title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-none">
                  Shravankumar B. Patel
                </h1>

                {/* Rotating title block */}
                <div className="h-8 md:h-10 overflow-hidden relative flex items-center mt-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={titleIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="text-base md:text-xl font-mono text-indigo-400 font-bold"
                    >
                      {HERO_TITLES[titleIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Tagline details */}
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Master of Computer Applications (MCA) Candidate at BVIMIT, Navi Mumbai. I build robust full-stack web and mobile apps with growing experience in AI systems, cross-lingual semantic duplicate indexing pipelines, and DevOps pipelines.
              </p>

              <p className="text-xs text-slate-500 italic max-w-lg font-mono">
                The intro is short on purpose — scroll for live deployments, hackathon proof, and the full project list.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#projects"
                  className="flex items-center gap-1.5 px-6 py-3 bg-indigo-500 text-white font-bold text-xs font-mono rounded-full hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5"
                >
                  View Projects
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setResumeOpen(true)}
                  className="flex items-center gap-1.5 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-white/5 text-xs font-mono rounded-full text-slate-200 transition-all hover:-translate-y-0.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  View Resume
                </button>
                
                <div className="flex items-center gap-2 pl-2">
                  <a
                    href="https://linkedin.com/in/shravan-kumar-patel"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 rounded-xl text-slate-400 hover:text-slate-200 transition"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/shravanbpatel954"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 rounded-xl text-slate-400 hover:text-slate-200 transition"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Key Stats / Profile Summary */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              <div className="p-5 bg-slate-900/50 border border-white/5 rounded-3xl transition duration-300 neon-glow-indigo/5 hover:neon-glow-indigo/10 group">
                <span className="block text-3xl font-bold font-display text-white group-hover:text-indigo-400 transition-colors">10</span>
                <span className="block text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider font-bold">Total Projects</span>
                <span className="block text-[10px] text-slate-500 mt-1.5 leading-relaxed">MERN architectures, Android ML engines, and backend frameworks.</span>
              </div>

              <div className="p-5 bg-slate-900/50 border border-white/5 rounded-3xl transition duration-300 neon-glow-indigo/5 hover:neon-glow-indigo/10 group">
                <span className="block text-3xl font-bold font-display text-white group-hover:text-indigo-400 transition-colors">1</span>
                <span className="block text-xs font-mono text-indigo-400 mt-1 uppercase tracking-wider font-bold font-semibold">Live Product</span>
                <span className="block text-[10px] text-slate-500 mt-1.5 leading-relaxed">Deployed estate engine actively running on realtorbazaar.com</span>
              </div>

              <div className="p-5 bg-slate-900/50 border border-white/5 rounded-3xl transition duration-300 neon-glow-indigo/5 hover:neon-glow-indigo/10 group">
                <span className="block text-3xl font-bold font-display text-white group-hover:text-indigo-400 transition-colors">2nd</span>
                <span className="block text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider font-bold">Hackathon Winner</span>
                <span className="block text-[10px] text-slate-500 mt-1.5 leading-relaxed">Secured second prize out of 50+ entries at Innov8 (Pixels 2026).</span>
              </div>

              <div className="p-5 bg-slate-900/50 border border-white/5 rounded-3xl transition duration-300 neon-glow-indigo/5 hover:neon-glow-indigo/10 group">
                <span className="block text-2xl font-bold font-display text-white group-hover:text-indigo-400 transition-colors">Open</span>
                <span className="block text-xs font-mono text-slate-400 mt-1.5 uppercase tracking-wider font-bold">Graduate Roles</span>
                <span className="block text-[10px] text-slate-500 mt-1.5 leading-relaxed">Available immediately for Full-Time positions & Internships.</span>
              </div>
            </div>
          </div>

          {/* See what's below scroll anchor */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition duration-300">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">See what's below</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-indigo-400 text-sm font-black"
            >
              ↓
            </motion.div>
          </div>
        </section>

        {/* PROFILE AT A GLANCE (STICKY ROW) */}
        <div className="py-8 border-y border-white/5 bg-slate-900/10 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">🎓</span>
              <div>
                <span className="block text-xs font-bold text-slate-300">MCA (Pursuing)</span>
                <span className="block text-[10px] text-slate-500">BVIMIT, Navi Mumbai</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
              <span className="text-xl shrink-0">🥈</span>
              <div>
                <span className="block text-xs font-bold text-slate-300">2nd Prize — Innov8 Hackathon</span>
                <span className="block text-[10px] text-slate-500">SIES College (50+ teams)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
              <span className="text-xl shrink-0">☁️</span>
              <div>
                <span className="block text-xs font-bold text-indigo-400 font-semibold">NPTEL Elite Silver</span>
                <span className="block text-[10px] text-slate-500">Top 5% Cloud Computing</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
              <span className="text-xl shrink-0">⚡</span>
              <div>
                <span className="block text-xs font-bold text-slate-300">Live Deployed Project</span>
                <span className="block text-[10px] text-slate-500">realtorbazaar.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: ABOUT */}
        <section id="about" className="py-20 md:py-28 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Title / Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">About Me</span>
                <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
                  MCA Student · Aspiring Full-Stack & AI Developer
                </h2>
              </div>
              
              <div className="text-xs text-slate-300 leading-relaxed space-y-4">
                <p>
                  I am a postgraduate software engineering student specializing in the Master of Computer Applications (MCA) at Bharati Vidyapeeth Institute of Management & IT (BVIMIT), Navi Mumbai, with a solid foundational graduation in Computer Science.
                </p>
                <p>
                  My engineering expertise spans full-stack web and mobile development, utilizing the React.js, React Native, Node.js, and MongoDB ecosystems. I hold a growing focus in Artificial Intelligence and Natural Language Processing pipelines, working with technologies like sentence-level text embeddings (MiniLM), high-speed vector searching engines (FAISS), ONNX runtime acceleration, and LLM integrations.
                </p>
                <p>
                  I enjoy solving end-to-end practical problems—ranging from university examination administration platforms deployed onto secure networks to fully live real-estate products facilitating consumer-to-business trades. I am driven, curious, and seeking early career opportunities as a graduate systems developer.
                </p>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => setResumeOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-indigo-500/30 text-xs font-mono rounded-xl text-slate-300 transition"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  Download Complete Transcript (Resume)
                </button>
              </div>
            </div>

            {/* Coordinates / Details side pane */}
            <div className="lg:col-span-5 bg-slate-900/50 border border-white/5 rounded-3xl p-6 space-y-5 neon-glow-indigo/5">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-3">
                <User className="w-4 h-4 text-indigo-400" /> Key Profiles
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-slate-500 font-mono">Academic Track</span>
                  <span className="text-slate-200 font-medium text-right">MCA (Pursuing), BVIMIT · B.Sc. CS</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-slate-500 font-mono">Open For</span>
                  <span className="text-slate-200 font-medium text-right">Full-Time · Internship Roles</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-slate-500 font-mono">Mail Inbox</span>
                  <a href="mailto:shravan.b.patel954@gmail.com" className="text-indigo-400 font-medium hover:underline text-right">
                    shravan.b.patel954@gmail.com
                  </a>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-slate-500 font-mono">Location Base</span>
                  <span className="text-slate-200 font-medium text-right">Mumbai, India</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-slate-500 font-mono">LinkedIn Network</span>
                  <a href="https://linkedin.com/in/shravan-kumar-patel" target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer" className="text-slate-300 font-medium hover:underline text-right flex items-center gap-1">
                    linkedin.com/in/... <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />
                  </a>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-slate-500 font-mono">GitHub Repos</span>
                  <a href="https://github.com/shravanbpatel954" target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer" className="text-slate-300 font-medium hover:underline text-right flex items-center gap-1">
                    github.com/... <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Stack Interactive Grid */}
          <div className="mt-16 space-y-6">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest text-center">
              Technical Stack Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* Languages */}
              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-3xl hover:border-indigo-500/20 transition duration-300">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Languages
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => handleTechClick('JavaScript')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">JS</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">JavaScript</span>
                  </button>
                  <button onClick={() => handleTechClick('TypeScript')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">TS</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">TypeScript</span>
                  </button>
                  <button onClick={() => handleTechClick('Python')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">PY</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Python</span>
                  </button>
                  <button onClick={() => handleTechClick('Java')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">JV</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Java</span>
                  </button>
                </div>
              </div>

              {/* Front-End */}
              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-3xl hover:border-indigo-500/20 transition duration-300">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Front-End
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => handleTechClick('React.js')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">React</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">React.js</span>
                  </button>
                  <button onClick={() => handleTechClick('React Native')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">RN</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">React Native</span>
                  </button>
                  <button onClick={() => handleTechClick('HTML5')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">HTML</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">HTML5</span>
                  </button>
                  <button onClick={() => handleTechClick('CSS3')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">CSS</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">CSS3</span>
                  </button>
                </div>
              </div>

              {/* Backend / Db */}
              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-3xl hover:border-indigo-500/20 transition duration-300">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-indigo-400" /> Backend & DB
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => handleTechClick('Node.js')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Nodejs</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Node.js</span>
                  </button>
                  <button onClick={() => handleTechClick('Express')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Express</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Express</span>
                  </button>
                  <button onClick={() => handleTechClick('MongoDB')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Mongo</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">MongoDB</span>
                  </button>
                  <button onClick={() => handleTechClick('MySQL')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">MySQL</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">MySQL</span>
                  </button>
                </div>
              </div>

              {/* AI & ML */}
              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-3xl hover:border-indigo-500/20 transition duration-300">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" /> AI & ML
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => handleTechClick('MiniLM')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">MiniLM</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">MiniLM NLP</span>
                  </button>
                  <button onClick={() => handleTechClick('FAISS')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">FAISS</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">FAISS Vector</span>
                  </button>
                  <button onClick={() => handleTechClick('ONNX')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">ONNX</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">ONNX Run</span>
                  </button>
                  <button onClick={() => handleTechClick('Google Gemini')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Gemini</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">LLMs / APIs</span>
                  </button>
                </div>
              </div>

              {/* DevOps */}
              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-3xl hover:border-indigo-500/20 transition duration-300">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> Cloud / DevOps
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => handleTechClick('Docker')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Docker</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Docker Engine</span>
                  </button>
                  <button onClick={() => handleTechClick('Git')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Git</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Git / GitHub</span>
                  </button>
                  <button onClick={() => handleTechClick('Render')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Cloud</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Railway/Render</span>
                  </button>
                  <button onClick={() => handleTechClick('Firebase')} className="p-2 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-xl font-mono text-left group transition">
                    <span className="block font-bold text-slate-300 group-hover:text-indigo-400 transition">Firebase</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Auth & DB</span>
                  </button>
                </div>
              </div>

            </div>
            
            <p className="text-center text-[10px] text-slate-500 font-mono italic">
              * Click on any card technology to view and filter Shravankumar's projects compiled with that language or framework.
            </p>
          </div>
        </section>

        {/* Section: EDUCATION */}
        <section id="education" className="py-20 md:py-28 border-b border-white/5">
          <div className="space-y-12">
            
            <div className="space-y-1.5 text-center">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">Education Timeline</span>
              <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
                Academic Journey & Milestones
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Comprehensive tracking of formal qualifications, from postgraduate Master of Computer Applications to High School foundations.
              </p>
            </div>

            {/* Timelines Column */}
            <div className="relative max-w-3xl mx-auto pl-8 sm:pl-32 py-4">
              
              {/* Center Timeline Line */}
              <div className="absolute left-8 sm:left-32 top-0 bottom-0 w-[2px] bg-slate-900">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                  className="w-full bg-indigo-500/50 origin-top"
                />
              </div>

              {EDUCATION_DATA.map((item, index) => (
                <div key={item.id} className="relative mb-12 last:mb-0">
                  
                  {/* Left Date indicator for larger screens */}
                  <div className="hidden sm:block absolute -left-32 w-24 text-right pt-1 text-xs font-mono font-semibold text-slate-400">
                    {item.timeline}
                  </div>

                  {/* Node marker */}
                  <div className="absolute -left-10 sm:-left-6 w-4 h-4 rounded-full border-2 border-indigo-400 bg-slate-950 z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>

                  {/* Main card box */}
                  <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-indigo-500/20 transition duration-300 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                        {item.type === 'postgraduate' ? 'Postgraduate Degree' : item.type === 'graduation' ? 'Undergraduate Degree' : 'Secondary Education'}
                      </span>
                      {item.status && (
                        <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold">
                          {item.status}
                        </span>
                      )}
                      {/* Mobile Date layout */}
                      <span className="sm:hidden text-xs font-mono font-semibold text-slate-400 block w-full mt-1">
                        {item.timeline}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-white">{item.degree}</h3>
                    <p className="text-xs font-medium text-slate-400">{item.institution}</p>
                    
                    {item.details && (
                      <p className="text-xs text-slate-500 leading-relaxed pt-1.5 border-t border-white/5 mt-2">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: SKILLS */}
        <section id="skills" className="py-20 md:py-28 border-b border-white/5">
          <div className="space-y-12">
            
            <div className="space-y-1.5 text-center">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">Skills Core</span>
              <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
                Areas of Expertise
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Practical, technical domains applied dynamically across coursework projects, award hackathons, and production deployments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SKILLS_DATA.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-slate-900/50 border border-white/5 hover:border-indigo-500/20 rounded-3xl p-6 md:p-8 transition duration-300 space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 block" />
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Level Bars */}
                  <div className="space-y-3.5 pt-4 border-t border-white/5 mt-auto">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                          <button 
                            onClick={() => handleTechClick(skill.techName)}
                            className="hover:text-indigo-400 text-left font-semibold cursor-pointer transition"
                          >
                            {skill.name}
                          </button>
                          <span className="text-slate-500 font-bold">{skill.level}%</span>
                        </div>
                        {/* Custom Animated Track */}
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.1 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: PROJECTS */}
        <section id="projects" className="py-20 md:py-28 border-b border-white/5">
          <div className="space-y-10">
            
            {/* Header section with active filtering feedback */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">Engineering Work</span>
                <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
                  Selected Technical Creations
                </h2>
                <p className="text-xs text-slate-400 max-w-md">
                  Showing academic builds, hackathon software, and live platforms demonstrating complete full-stack competence.
                </p>
              </div>

              {/* Filtering tabs */}
              <div className="flex flex-wrap gap-1.5 bg-slate-900/50 p-1.5 rounded-full border border-white/5 font-mono text-[10px] font-bold shadow-inner">
                <button
                  onClick={() => { setProjectFilter('all'); setSelectedTechTag(null); }}
                  className={`px-4 py-1.5 rounded-full transition ${projectFilter === 'all' && !selectedTechTag ? 'bg-slate-950 text-indigo-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  ALL [10]
                </button>
                <button
                  onClick={() => { setProjectFilter('ai-ml'); setSelectedTechTag(null); }}
                  className={`px-4 py-1.5 rounded-full transition ${projectFilter === 'ai-ml' && !selectedTechTag ? 'bg-slate-950 text-indigo-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  AI / ML [4]
                </button>
                <button
                  onClick={() => { setProjectFilter('full-stack'); setSelectedTechTag(null); }}
                  className={`px-4 py-1.5 rounded-full transition ${projectFilter === 'full-stack' && !selectedTechTag ? 'bg-slate-950 text-indigo-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  FULL-STACK [2]
                </button>
                <button
                  onClick={() => { setProjectFilter('mobile'); setSelectedTechTag(null); }}
                  className={`px-4 py-1.5 rounded-full transition ${projectFilter === 'mobile' && !selectedTechTag ? 'bg-slate-950 text-indigo-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  MOBILE [1]
                </button>
                <button
                  onClick={() => { setProjectFilter('other'); setSelectedTechTag(null); }}
                  className={`px-4 py-1.5 rounded-full transition ${projectFilter === 'other' && !selectedTechTag ? 'bg-slate-950 text-indigo-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  OTHER [3]
                </button>
              </div>
            </div>

            {/* Filter tags feedback bar if selected */}
            {selectedTechTag && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs font-mono font-medium">
                <span>Filtered by tag: <strong>{selectedTechTag}</strong></span>
                <button 
                  onClick={handleClearTechFilter}
                  className="p-0.5 hover:text-white transition font-black ml-1 cursor-pointer"
                  title="Clear filter"
                >
                  ×
                </button>
              </div>
            )}

            {/* Project Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((proj) => (
                  <ProjectCard 
                    key={proj.id} 
                    project={proj} 
                    onTechClick={handleTechClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty filter fallbacks */}
            {filteredProjects.length === 0 && (
              <div className="py-20 text-center space-y-2 bg-slate-900/50 rounded-3xl border border-white/5">
                <span className="text-3xl">🧩</span>
                <p className="text-sm font-semibold text-slate-300">No matching projects found</p>
                <p className="text-xs text-slate-500">Try selecting another filter or clearing current technology badges.</p>
                <button
                  onClick={handleClearTechFilter}
                  className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-indigo-500/30 text-xs font-mono rounded-xl transition cursor-pointer text-slate-300"
                >
                  Reset Filtering Parameters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section: ACHIEVEMENTS & HACKATHON */}
        <section id="achievements" className="py-20 md:py-28 border-b border-white/5">
          <div className="space-y-16">
            
            <div className="space-y-1.5 text-center">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">Accomplishments</span>
              <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
                Hackathon Proof & Certifications
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Recognitions earned through academic competitive events, national test frameworks, and rigorous full-stack tracks.
              </p>
            </div>

            {/* Hackathon spotlight component */}
            <HackathonSection />

            {/* Certifications Grid list */}
            <div className="space-y-6 pt-10 border-t border-white/5">
              <h3 className="text-sm font-bold font-mono text-slate-400 uppercase tracking-widest text-center">
                Verified Credentials & Certifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CERTIFICATES_DATA.map((cert) => (
                  <div 
                    key={cert.id}
                    className="p-5 bg-slate-900/50 border border-white/5 rounded-3xl flex flex-col justify-between hover:border-indigo-500/20 transition duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        {cert.isNPTEL ? (
                          <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Elite Silver (IIT)
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-white/5 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Industry Certified
                          </span>
                        )}
                        <span className="text-xs text-slate-500">📜</span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-slate-250 font-display group-hover:text-indigo-400 leading-snug">
                        {cert.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">{cert.issuer}</p>
                    </div>

                    <p className="text-[10px] text-slate-400 border-t border-white/5 pt-2 mt-3 leading-relaxed">
                      {cert.achievement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: AI SANDBOX */}
        <SemanticSandbox />

        {/* Section: CONTACT */}
        <section id="contact" className="py-20 md:py-28">
          <div className="space-y-12">
            
            <div className="space-y-1.5 text-center">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">Communication Terminal</span>
              <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
                Establish Direct Contact
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Submit an inquiry using the direct messaging form below, or reach out immediately through secondary professional socials.
              </p>
            </div>

            {/* Custom Contact Form component with Confetti Particle systems */}
            <ContactForm />

            {/* Real-time Message Stream Console (Admin Link with credentials) */}
            <div className="max-w-2xl mx-auto mt-12 p-6 bg-indigo-950/20 hover:bg-indigo-950/30 border border-indigo-500/10 rounded-3xl text-center space-y-4 transition duration-300 shadow-xl backdrop-blur-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Real-time System Pipeline
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-display">Where do your submitted messages go?</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Every submission is written instantly to our live Supabase cloud database. Open the real-time stream console below to see your message in the queue.
                </p>
              </div>

              {/* Login credentials guide for easy testing */}
              <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="space-y-1 w-full sm:w-auto">
                  <span className="block text-[9px] font-mono uppercase text-slate-500 leading-none">Console Credentials</span>
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono font-semibold text-slate-300">
                    <span>User: <strong className="text-indigo-400">admin</strong></span>
                    <span className="text-slate-600">•</span>
                    <span>Pass: <strong className="text-indigo-400">admin123</strong></span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setAdminOpen(true);
                    window.location.hash = "admin";
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-mono font-bold text-xs rounded-xl transition duration-200 shadow-md cursor-pointer text-center flex items-center justify-center gap-1.5 shrink-0"
                >
                  Open Live Inbox
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950/40 border-t border-white/5 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-400">© 2026 Shravankumar B. Patel. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 font-mono">SEO Optimized · High Fidelity Performance Platform · Built in React 19</p>
          </div>
          
          <div className="flex gap-4 font-mono text-[10px] items-center">
            <a href="https://github.com/shravanbpatel954" target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer" className="hover:text-indigo-400 transition">GitHub</a>
            <a href="https://linkedin.com/in/shravan-kumar-patel" target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer" className="hover:text-indigo-400 transition">LinkedIn</a>
            <a href="mailto:shravan.b.patel954@gmail.com" className="hover:text-indigo-400 transition">Email</a>
            <span className="text-slate-700">|</span>
            <a href="#admin" className="text-indigo-400/95 hover:text-indigo-300 font-bold transition uppercase tracking-wider">Admin Portal</a>
          </div>
        </div>
      </footer>

      {/* Interactive Resume Transcript PDF Modal */}
      <InteractiveResume 
        isOpen={resumeOpen} 
        onClose={() => setResumeOpen(false)} 
      />
    </div>
  );
}
