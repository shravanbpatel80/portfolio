export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'ai-ml' | 'full-stack' | 'mobile' | 'ecommerce' | 'game' | 'sustainability';
  isFeatured: boolean;
  isLive: boolean;
  tags: string[];
  badge?: string;
  role: string;
  timeline: string;
  description: string;
  points: string[];
  links: {
    live?: string;
    github?: string;
    demoText?: string;
  };
  iconType: 'duplicate' | 'realtor' | 'mindguard' | 'inventory' | 'studybuddy' | 'prepa' | 'advisor' | 'ecommerce' | 'game' | 'recycle';
}

export interface EducationItem {
  id: string;
  type: 'postgraduate' | 'graduation' | 'highschool';
  status?: string;
  degree: string;
  institution: string;
  timeline: string;
  details?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: {
    name: string;
    level: number; // 0-100 for visual bars
    icon?: string;
    techName: string; // for searching projects
  }[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  achievement?: string;
  credentialUrl?: string;
  isNPTEL?: boolean;
}

export interface HackathonContribution {
  id: string;
  title: string;
  desc: string;
}

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'edu-1',
    type: 'postgraduate',
    status: 'Pursuing',
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Bharati Vidyapeeth Institute of Management & IT (BVIMIT), Navi Mumbai',
    timeline: 'Sep 2025 – Present',
    details: 'Actively studying advanced software architectures, AI pipelines, cloud technologies, database management, and mobile frameworks.'
  },
  {
    id: 'edu-2',
    type: 'graduation',
    degree: 'B.Sc Computer Science',
    institution: 'N.E.S Ratnam College of Arts, Science & Commerce',
    timeline: '2022 – 2025',
    details: 'Foundation in computer science principles, core programming in Java, Python, C++, operating systems, and web technologies.'
  },
  {
    id: 'edu-3',
    type: 'highschool',
    degree: 'PCMB (Physics, Chemistry, Mathematics, Biology)',
    institution: 'Raminiranjan Jhunjhunwala College',
    timeline: '2021 – 2022',
    details: 'Higher secondary coursework in general science with a strong focus on mathematics and analytical reasoning.'
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    id: 'skill-web',
    title: 'Full-Stack Web Development',
    description: 'MERN stack applications with React.js, Node.js, Express, REST APIs, and MongoDB — built for coursework, hackathons, and deployed projects.',
    skills: [
      { name: 'React.js', level: 92, techName: 'React.js' },
      { name: 'Node.js', level: 88, techName: 'Node.js' },
      { name: 'Express', level: 88, techName: 'Express' },
      { name: 'MongoDB', level: 85, techName: 'MongoDB' },
      { name: 'JavaScript', level: 90, techName: 'JavaScript' },
      { name: 'TypeScript', level: 82, techName: 'TypeScript' }
    ]
  },
  {
    id: 'skill-ai',
    title: 'AI & Machine Learning',
    description: 'NLP pipelines with MiniLM embeddings, FAISS search, ONNX optimization, and LLM integration (Gemini) for academic and hackathon projects.',
    skills: [
      { name: 'MiniLM / NLP', level: 85, techName: 'MiniLM' },
      { name: 'FAISS Vector Search', level: 82, techName: 'FAISS' },
      { name: 'ONNX Runtime', level: 80, techName: 'ONNX' },
      { name: 'Gemini / LLMs', level: 88, techName: 'Google Gemini' },
      { name: 'Python', level: 84, techName: 'Python' }
    ]
  },
  {
    id: 'skill-mobile',
    title: 'Mobile Development',
    description: 'React Native Android applications with Firebase, on-device ML (Isolation Forest), and privacy-conscious feature design.',
    skills: [
      { name: 'React Native', level: 80, techName: 'React Native' },
      { name: 'Firebase', level: 85, techName: 'Firebase' },
      { name: 'Android Studio', level: 78, techName: 'Android app' },
      { name: 'Isolation Forest', level: 75, techName: 'Isolation Forest' }
    ]
  },
  {
    id: 'skill-devops',
    title: 'DevOps & Cloud Basics',
    description: 'Git/GitHub, Docker fundamentals, CI/CD awareness, and deployment experience on Render, Railway, Vercel, and Firebase.',
    skills: [
      { name: 'Docker', level: 70, techName: 'Docker' },
      { name: 'Git & GitHub', level: 88, techName: 'Git' },
      { name: 'Render / Railway', level: 85, techName: 'Render' },
      { name: 'PostgreSQL / MySQL', level: 82, techName: 'MySQL' }
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-1',
    title: 'Multilingual Duplicate Detection System',
    subtitle: '2nd Prize · Innov8 Hackathon (Pixels 2026)',
    category: 'ai-ml',
    isFeatured: true,
    isLive: false,
    tags: ['Python', 'MiniLM', 'FAISS', 'ONNX', 'Streamlit'],
    badge: 'Award Winner',
    role: 'Backend & ML Pipeline Lead',
    timeline: 'May 2026',
    description: '2nd place among 50+ teams at SIES College. Cross-lingual semantic duplicate detection system processing entries in multiple languages with sub-second retrieval.',
    points: [
      'Engineered core search pipeline utilizing MiniLM sentence embeddings combined with a FAISS index for high-speed multi-lingual similarity checks.',
      'Optimized PyTorch pipeline to ONNX Runtime, achieving an approximate 4.5× speedup on standard CPU hosting.',
      'Developed a real-time validation dashboard using Streamlit to showcase capabilities directly to hackathon judges.'
    ],
    links: {
      demoText: 'Event demo — available on request'
    },
    iconType: 'duplicate'
  },
  {
    id: 'proj-2',
    title: 'RealtorBazaar',
    subtitle: 'Industry Project · Live & Deployed',
    category: 'full-stack',
    isFeatured: true,
    isLive: true,
    tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
    badge: 'Live Project',
    role: 'Full-Stack Developer (Solo)',
    timeline: 'Mar 2026 – Apr 2026',
    description: 'An end-to-end real estate solution serving property listing and searching requirements, fully deployed and running in production.',
    points: [
      'Built a custom, responsive, responsive property-search engine with categorization filters (Residential, Commercial, Plot, PG).',
      'Engineered secure administrative dashboards allowing list management, verification status updates, and lead management.',
      'Successfully deployed and optimized the platform at realtorbazaar.com with robust DB connection pools and clean REST endpoints.'
    ],
    links: {
      live: 'https://realtorbazaar.com'
    },
    iconType: 'realtor'
  },
  {
    id: 'proj-3',
    title: 'MindGuard',
    subtitle: 'Academic Project · Android Application',
    category: 'mobile',
    isFeatured: true,
    isLive: false,
    tags: ['React Native', 'Firebase', 'Isolation Forest', 'Node.js'],
    badge: 'MCA Project',
    role: 'Developer · MCA Project',
    timeline: 'Feb 2026 – Mar 2026',
    description: 'AI-powered privacy-first Android app designed to monitor and identify behavioral deviations on-device for cognitive assistance.',
    points: [
      'Developed low-level tracking hooks for screen time, app usage, physical mobility, and nighttime activity patterns.',
      'Implemented an on-device anomaly detection system utilizing the Isolation Forest algorithm to protect user privacy.',
      'Leveraged Firebase for secure authentication and lightweight configuration data caching.'
    ],
    links: {
      demoText: 'Android app — private build (APK available on request)'
    },
    iconType: 'mindguard'
  },
  {
    id: 'proj-4',
    title: 'Mumbai University Inventory Management',
    subtitle: 'University Project · Examination Department',
    category: 'full-stack',
    isFeatured: true,
    isLive: false,
    tags: ['React.js', 'Node.js', 'MySQL', 'REST APIs', 'Express'],
    badge: 'University',
    role: 'Full-Stack Developer · Team Project',
    timeline: 'Dec 2024 – Apr 2025',
    description: 'Full-stack inventory and logistics tracking system designed specifically for the operations of the university examination department.',
    points: [
      'Architected transactional workflows covering purchase entries, ledger reporting, stock issue, and delivery challenge documents.',
      'Designed complex SQL schemas and optimized queries in MySQL to ensure accurate audit trails of examination resources.',
      'Deployed securely onto the university\'s intranet for staff-only access.'
    ],
    links: {
      demoText: 'Internal / institutional deployment'
    },
    iconType: 'inventory'
  },
  {
    id: 'proj-5',
    title: 'StudyBuddy',
    subtitle: 'AI-Powered Adaptive Learning Platform',
    category: 'ai-ml',
    isFeatured: false,
    isLive: true,
    tags: ['React.js', 'Node.js', 'MongoDB', 'Google Gemini'],
    badge: 'Live Demo',
    role: 'Full-Stack Developer',
    timeline: 'Oct 2025 – Nov 2025',
    description: 'Adaptive educational web app delivering personalized study guides, recommendations, and dynamic testing based on user strengths.',
    points: [
      'Integrated Google Gemini API to analyze student performance and generate real-time targeted study questions and notes.',
      'Created MERN-based state trackers with clean visual graphs to monitor individual score progress over time.',
      'Deployed on Render cloud hosting.'
    ],
    links: {
      live: 'https://render.com' // Custom representative link
    },
    iconType: 'studybuddy'
  },
  {
    id: 'proj-6',
    title: 'Prepa – AI Interview Prep',
    subtitle: 'AI Interview Practice Application',
    category: 'ai-ml',
    isFeatured: false,
    isLive: true,
    tags: ['React', 'Python', 'Firebase', 'Google Gemini'],
    badge: 'AI Product',
    role: 'Full-Stack Developer',
    timeline: '2024',
    description: 'An AI-powered preparation environment mimicking HR and technical rounds with dynamic instant feedback based on verbal input.',
    points: [
      'Engineered an interactive conversational pipeline leveraging speech-to-text and LLM prompting for tailored interviewing.',
      'Designed responsive reporting summaries grading technical knowledge, presentation skills, and structural response.',
      'Saved history sessions securely using Firebase Firestore.'
    ],
    links: {
      live: 'https://github.com/shravanbpatel954',
      github: 'https://github.com/shravanbpatel954'
    },
    iconType: 'prepa'
  },
  {
    id: 'proj-7',
    title: 'AIO – AI Advisor',
    subtitle: 'Intelligent Advisory Web Application',
    category: 'ai-ml',
    isFeatured: false,
    isLive: true,
    tags: ['React', 'Node.js', 'Express', 'Google Gemini'],
    badge: 'Live Demo',
    role: 'Full-Stack Developer',
    timeline: '2024',
    description: 'An intelligent consultation assistant providing smart analytical guidance across business and professional decisions.',
    points: [
      'Structured custom system prompts for consistent, professional, contextual advisory roles.',
      'Wrote streamlined backend controllers in Express to parse, sanitize, and speed up query processing.'
    ],
    links: {
      live: 'https://github.com/shravanbpatel954',
      github: 'https://github.com/shravanbpatel954'
    },
    iconType: 'advisor'
  },
  {
    id: 'proj-8',
    title: 'Lakshwear E-commerce',
    subtitle: 'Clothing E-commerce Platform',
    category: 'ecommerce',
    isFeatured: false,
    isLive: true,
    tags: ['React', 'JavaScript', 'CSS3', 'Node.js'],
    badge: 'E-commerce',
    role: 'Frontend Developer',
    timeline: '2024',
    description: 'E-commerce shopping portal with catalog filters, persistent shopping cart experiences, and mock checkout mechanisms.',
    points: [
      'Created modular, highly responsive layout screens displaying grids of items with instant filtering and pricing sliders.',
      'Wrote client-side routing and synchronized state engines for a seamless bag check flow.'
    ],
    links: {
      live: 'https://github.com/shravanbpatel954',
      github: 'https://github.com/shravanbpatel954'
    },
    iconType: 'ecommerce'
  },
  {
    id: 'proj-9',
    title: 'Online Game Lab',
    subtitle: 'Interactive Web Games Collection',
    category: 'game',
    isFeatured: false,
    isLive: true,
    tags: ['React', 'JavaScript', 'HTML5', 'CSS3'],
    badge: 'Portfolio',
    role: 'Solo Developer',
    timeline: '2024',
    description: 'A playground gallery showcasing simple, lightweight interactive arcade and logic puzzle games in React.',
    points: [
      'Programmed core game logic grids, win condition algorithms, and speed settings purely client-side.',
      'Designed responsive gamepads and mobile touch-friendly controls.'
    ],
    links: {
      live: 'https://github.com/shravanbpatel954',
      github: 'https://github.com/shravanbpatel954'
    },
    iconType: 'game'
  },
  {
    id: 'proj-10',
    title: 'Creative Recycle Solution',
    subtitle: 'Sustainability Web Application',
    category: 'sustainability',
    isFeatured: false,
    isLive: true,
    tags: ['React', 'JavaScript', 'HTML5', 'TailwindCSS'],
    badge: 'Live Demo',
    role: 'Full-Stack Developer',
    timeline: '2024',
    description: 'An educational catalog pointing users to ingenious reuse and repurpose opportunities for household waste.',
    points: [
      'Built custom categorizations for plastic, metal, wood, paper, and electronic items.',
      'Implemented clean educational steps and materials checklists for DIY crafting.'
    ],
    links: {
      live: 'https://github.com/shravanbpatel954',
      github: 'https://github.com/shravanbpatel954'
    },
    iconType: 'recycle'
  }
];

export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'NPTEL Cloud Computing (Elite Silver | Top 5%)',
    issuer: 'Indian Institute of Technology, Kharagpur',
    achievement: 'Elite Silver Certificate (Top 5% score nationally)',
    isNPTEL: true
  },
  {
    id: 'cert-2',
    title: 'NPTEL Fundamentals of OOP in Java (Elite Silver | 77%)',
    issuer: 'Indian Institute of Technology, Roorkee',
    achievement: 'Elite Silver Certificate (77% final examination score)',
    isNPTEL: true
  },
  {
    id: 'cert-3',
    title: 'Full-Stack Web Development',
    issuer: 'DevTown',
    achievement: 'End-to-end full stack MERN specialization with hands-on labs.'
  },
  {
    id: 'cert-4',
    title: 'Web Development Training (NSDC approved)',
    issuer: 'Internshala & Skill India',
    achievement: 'Comprehensive frontend and backend web frameworks training.'
  },
  {
    id: 'cert-5',
    title: 'Web Development Training',
    issuer: 'Internshala',
    achievement: 'Certified training covering core JavaScript, PHP, MySQL, and deployment.'
  }
];

export const HACKATHON_CONTRIBUTIONS: HackathonContribution[] = [
  {
    id: 'contrib-1',
    title: 'Core NLP Pipeline',
    desc: 'Created the Python pipeline mapping raw texts to MiniLM sentence embeddings, indexing them inside a FAISS Vector database for real-time multilingual matching.'
  },
  {
    id: 'contrib-2',
    title: 'ONNX Compilation',
    desc: 'Converted deep learning models from PyTorch formats into ONNX Runtime structures, cutting down server latency and boosting speed by 4.5× on direct CPUs.'
  },
  {
    id: 'contrib-3',
    title: 'Productization & Demo Dashboard',
    desc: 'Wrote the complete stream validation dashboard in Streamlit, connecting inputs, processing, and multi-threaded queries for the live event pitch.'
  }
];
