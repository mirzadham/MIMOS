import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prismaInstance: PrismaClient | null = null;

// Lazy-loaded Prisma Client proxy to bypass Next.js build-time collection instantiation checks
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      const connectionString = process.env.DATABASE_URL;
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      prismaInstance = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return Reflect.get(prismaInstance, prop);
  }
});

// Rich default mock database for fallback and local development
export const mockCategories = [
  { id: 'cat-1', name: 'Semiconductor Technology', slug: 'semiconductor' },
  { id: 'cat-2', name: 'Artificial Intelligence & Data Science', slug: 'ai-data-science' },
  { id: 'cat-3', name: 'Information Security & 5G', slug: 'security-5g' },
  { id: 'cat-4', name: 'Professional Management & PMP', slug: 'management-pmp' }
];

export const mockPrograms = [
  {
    id: 'prog-1',
    title: 'Semiconductor Wafer Fabrication',
    slug: 'semiconductor-wafer-fabrication',
    description: 'Build your foundation in CMOS Manufacturing. Gain a structured introduction to wafer fabrication processes in CMOS manufacturing, combining fundamental theory with real industry practices.',
    syllabus: '### Course Modules\n\n1. **Safety & Hazard in Wafer Fabrication** (Day 1)\n   - Safety regulations & compliance requirements\n   - Chemical safety & hazard classification\n   - Cleanroom safety practices\n   - Emergency response procedures\n2. **Cleanroom Technology & Protocol** (Day 2)\n   - Cleanroom classification & standards\n   - Environmental control (temperature, humidity, particles)\n   - Gowning & degowning procedures\n   - Cleanroom protocol & contamination control\n3. **Semiconductor Devices & IC Design Fundamentals** (Day 3)\n   - Semiconductor fundamentals (silicon, doping concept)\n   - PN junction & basic device operation\n   - CMOS devices structure (NMOS & PMOS)\n   - Relationship between device & fabrication process\n   - Introduction to IC design flow (high level)\n4. **Wafer Fabrication Overview & Integration** (Day 4)\n   - Overview of semiconductor wafer fabrication flow\n   - Key fabrication processes: thin film, lithography, etching, diffusion\n   - Process sequence & interdependency\n   - Introduction to process integration concepts\n   - Impact of process variation on yield & defects\n5. **CMOS Fabrication Process Flow** (Day 5)\n   - Overview of CMOS device structure (NMOS & PMOS)\n   - Step-by-step CMOS fabrication flow\n   - Well formation & isolation techniques\n   - Gate formation & patterning\n   - Source & drain formation\n   - Metal interconnect formation',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'Contact Academy for Fee Details (HRD Corp Claimable)',
    duration: '5 Days',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/wafer-fab',
    categoryId: 'cat-1'
  },
  {
    id: 'prog-2',
    title: 'Advanced Analytical & Failure Analysis Training',
    slug: 'advanced-analytical-failure-analysis',
    description: 'Master failure analysis for semiconductor & material applications. Focus on theory, test execution, data analysis & equipment handling.',
    syllabus: '### Course Modules\n\n1. **Failure Analysis & Electrical Techniques** (Day 1)\n   - Failure analysis basics & workflows\n   - Electrical fault detection methods\n   - Non-destructive testing (X-ray)\n   - PEM & thermal emission techniques\n2. **Physical & Material Characterization** (Day 2)\n   - Microscopy (AFM, SEM, TEM)\n   - Advanced defect analysis (FIB-SEM, EBSD)\n   - Material identification (FTIR, Raman, EDS, WDS)\n   - Failure verification techniques',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'Contact Academy for Fee Details (HRD Corp Claimable)',
    duration: '2 Days',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/failure-analysis',
    categoryId: 'cat-1'
  },
  {
    id: 'prog-3',
    title: 'Fundamental of CMOS Amplifier Design',
    slug: 'fundamental-cmos-amplifier-design',
    description: 'Master the Basics of Analog IC Design. Learn theoretical concepts, design techniques, simulation, physical layout, and measurement.',
    syllabus: '### Course Modules\n\n1. **Design Fundamentals** (Day 1)\n   - Introduction to CMOS amplifiers\n   - Fundamentals of operational amplifiers\n   - CMOS op-amps theoretical design (single-stage & multi-stage)\n2. **Schematic & Simulation** (Day 2)\n   - CMOS op-amp design with CADENCE\n   - Schematic Design\n   - DC & AC simulation\n3. **Layout Design** (Day 3)\n   - Layout design with CADENCE\n   - DRC & LVS Rule check\n   - Bond-pad placement\n   - Back-end metal filling\n4. **Post-Layout & Measurement** (Day 4)\n   - Post-layout simulation\n   - GDS stream-out\n   - Practical measurement',
    location: 'MIMOS Semiconductor Technology Centre (STC), Bukit Jalil',
    price: 'Contact Academy for Fee Details (HRD Corp Claimable)',
    duration: '4 Days',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/cmos-amplifier',
    categoryId: 'cat-1'
  },
  {
    id: 'prog-4',
    title: 'Nanoindentation Training',
    slug: 'nanoindentation-training',
    description: 'Intro to nanoindentation & sample testing. Learn theory, test execution, data analysis & equipment handling.',
    syllabus: '### Course Modules\n\n1. **Theory & Data Analysis** (Day 1)\n   - Basics & Applications\n   - Hardness & Modulus (Indentation mechanics)\n   - Test Execution\n   - Data Interpretation & Common Errors\n   - Case Studies\n2. **Sample Prep & Equipment** (Day 2)\n   - Sample Preparation\n   - Surface Quality (Flatness & Polishing)\n   - Equipment Operation & Calibration\n   - Troubleshooting & Maintenance',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'Contact Academy for Fee Details (HRD Corp Claimable)',
    duration: '2 Days',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/nanoindentation',
    categoryId: 'cat-1'
  },
  {
    id: 'prog-5',
    title: 'Electrical Engineering for Non-Electrical Engineers',
    slug: 'electrical-engineering-non-engineers',
    description: 'Understand basic electrical concepts, components, safety, and troubleshooting. Designed for mechanical, civil, chemical, and process engineers.',
    syllabus: '### Course Modules\n\n1. **Core Concepts & Circuits** (Day 1)\n   - Voltage, current, resistance, power, AC vs DC\n   - Ohm\'s Law and calculations\n   - Single-phase vs three-phase power\n   - Circuit breakers, fuses, relays, contactors, capacitors\n   - Industrial power systems overview (LV, MV, HV, VFD)\n   - Power system case scenarios (load calculations, SLD)\n2. **Electrical Hazards & Industrial Automation** (Day 2)\n   - Electrical hazards, risks, and arc-flash awareness\n   - Lock-out Tag-Out (LOTO) & earthing systems\n   - Protection devices (MCB, MCCB, RCD) & safety standards\n   - Motor types, starters (DOL, Star-Delta, Soft Starter), VFD basics\n   - Sensors, transmitters, PLC, SCADA, HMI fundamentals\n   - Troubleshooting simulation & multimeter usage basics\n   - SLD interpretation & fault analysis mini project',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'RM 1,990 / pax (HRD Corp Claimable)',
    duration: '2 Days',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/electrical-eng',
    categoryId: 'cat-1'
  },
  {
    id: 'prog-6',
    title: 'Certified Data Science Practitioner',
    slug: 'certified-data-science-practitioner',
    description: 'Understand key concepts of AI, Machine Learning & data-driven problem solving. Apply the full Machine Learning workflow from data to prediction using Python tools.',
    syllabus: '### Course Modules\n\n1. **Foundations, Setup & Data Understanding** (Day 1)\n   - Introduction to AI & Machine Learning\n   - Environment Setup & Data Pre-processing\n   - Hands-on Practice: Data Exploration & Preparation\n2. **Supervised Learning** (Day 2)\n   - Linear Regression\n   - Model Optimisation & Persistence\n   - K-Nearest Neighbors (KNN)\n   - Support Vector Machine (SVM)\n3. **Clustering & Capstone Project** (Day 3)\n   - K-Means Clustering\n   - Hands-on: Clustering Lab & Evaluation\n   - Capstone Project development & presentation',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'RM 2,800 / pax (HRD Corp Claimable)',
    duration: '3 Days',
    dates: 'July 2026',
    microsoftFormUrl: 'https://forms.office.com/r/data-science',
    categoryId: 'cat-2'
  },
  {
    id: 'prog-7',
    title: 'AI System Thinking: Training for Efficiency',
    slug: 'ai-system-thinking',
    description: 'Apply intermediate AI system thinking, design AI agent workflows, and leverage tools like NotebookLM, Qwen, and Grok for efficiency and creative projects.',
    syllabus: '### Course Modules\n\n1. **Advanced Research & Agent Automation** (Day 1)\n   - Apply intermediate AI system thinking\n   - Use AI tools like NotebookLM for advanced research & structured outputs\n   - Design and implement AI agent workflows\n2. **Professional Visual & Video Design** (Day 2)\n   - AI tools for generating professional images\n   - Specialized tools for creative projects (Google NanoBanana)\n   - AI writing assistants that integrate with visuals and videos (Qwen, Grok)',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'RM 1,990 / pax (HRD Corp Claimable)',
    duration: '2 Days',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/system-thinking',
    categoryId: 'cat-2'
  },
  {
    id: 'prog-8',
    title: 'Train-The-Trainer: Certified AI Trainer Program',
    slug: 'ttt-certified-ai-trainer',
    description: 'Empower internal trainers with a TTT curriculum blending core facilitation skills with hands-on AI tools to conduct certified AI trainings.',
    syllabus: '### Course Modules\n\n1. **Core Facilitation & AI Integration** (5-Day Curriculum)\n   - Conduct Training Needs Analysis (TNA) and write clear learning objectives\n   - Develop session plans, storyboards, and learner-centric materials\n   - Facilitate adult learners using proven engagement techniques\n   - Integrate AI tools into training activities for teaching\n   - Design assessments, collect feedback, and implement continuous improvements\n   - Certified as trainer to conduct AI training',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'RM 10,500 / pax (HRD Corp Claimable)',
    duration: '5 Days (35 Contact Hours)',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/ai-ttt',
    categoryId: 'cat-2'
  },
  {
    id: 'prog-9',
    title: 'The AI-Augmented Developer: Mastering Vibe Coding Workflows',
    slug: 'mastering-vibe-coding',
    description: 'Integrate top AI-powered coding tools like GitHub Copilot and Google Antigravity to automate repetitive tasks and optimize full-stack workflows.',
    syllabus: '### Course Modules\n\n1. **Foundations of Vibe Coding & Core Tooling** (Day 1)\n   - Introduction to Vibe Coding & AI Tools\n   - Overview of AI Coding Assistants\n   - Hands-On - AI Powered IDE Tools\n   - Prompt Engineering for Code (Part 1)\n2. **Advanced Prompting & Full-Stack Development** (Day 2)\n   - Prompt Engineering for Code (Part 2)\n   - Hands-On - AI Tools IDE Deep Dive\n   - AI-Powered Full-Stack Development (Architecture, Backend, Frontend & Integration)\n3. **Code Quality, Refactoring & Capstone Project** (Day 3)\n   - Code Review & Refactoring with AI (Debugging, Performance, Security & Modernization)\n   - Capstone Project Development & Presentation',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'RM 1,990 / pax (HRD Corp Claimable)',
    duration: '3 Days',
    dates: 'End of May/Early June 2026',
    microsoftFormUrl: 'https://forms.office.com/r/vibe-coding',
    categoryId: 'cat-2'
  },
  {
    id: 'prog-10',
    title: 'Cybersecurity Awareness',
    slug: 'cybersecurity-awareness',
    description: 'Identify cyber threats, apply the CIA Triad in workplace scenarios, and practice effective cyber hygiene. No prior technical knowledge required.',
    syllabus: '### Course Modules\n\n1. **Foundation of Security & Landscape** (Morning)\n   - Importance of cybersecurity in organizations\n   - Information security governance & risk management lifecycle\n   - Data classification & protection principles\n   - Cybersecurity vs IT security overview\n   - Introduction to major security frameworks (ISO 27001, NIST, OWASP)\n2. **Security Components, Threats & CIA Triad** (Afternoon)\n   - Hardware, software & application security basis\n   - Network & infrastructure security overview\n   - Common cyber threats (phishing, malware, social engineering, insider threats)\n   - Preventive, detective & corrective controls (Case study & exercise)\n   - CIA Triad (Confidentiality, Integrity, Availability) explained & applied\n   - Cyber hygiene best practices',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'RM 1,000 / pax (HRD Corp Claimable)',
    duration: '1 Day',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/cybersecurity-awareness',
    categoryId: 'cat-3'
  },
  {
    id: 'prog-11',
    title: 'PMP Certification Training',
    slug: 'pmp-certification-training',
    description: 'Official PMP preparation training course covering agile, predictive, and hybrid project management frameworks, aligned with the latest PMBOK Guide.',
    syllabus: '### Course Modules\n\n1. **Who Should Attend & Course Focus** (5-Day Curriculum)\n   - Preparation for Project Management Professional (PMP) certification\n   - People: Managing teams, stakeholder engagement & negotiation\n   - Process: Project lifecycles, budget, schedule, risk & quality\n   - Agile & Hybrid: Scrum, Kanban, iteration planning\n   - Business Environment: Compliance, value delivery & organizational change\n   - Mock exams, scenario-based question analysis & strategies',
    location: 'MIMOS Berhad, Bukit Jalil',
    price: 'RM 7,500 / pax',
    duration: '5 Days',
    dates: 'Scheduled Soon',
    microsoftFormUrl: 'https://forms.office.com/r/pmp-cert',
    categoryId: 'cat-4'
  }
];

export async function getSafeCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return categories.length > 0 ? categories : mockCategories;
  } catch (e) {
    console.warn("Prisma Category Fetch failed, falling back to mock details: ", e);
    return mockCategories;
  }
}

export async function getSafePrograms(categoryId?: string) {
  try {
    const programs = await prisma.program.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: { title: 'asc' }
    });
    return programs.length > 0 ? programs : (
      categoryId 
        ? mockPrograms.filter(p => p.categoryId === categoryId).map(p => ({ ...p, imageUrl: null as string | null })) 
        : mockPrograms.map(p => ({
            ...p,
            imageUrl: null as string | null,
            category: mockCategories.find(c => c.id === p.categoryId)
          }))
    );
  } catch (e) {
    console.warn("Prisma Program Fetch failed, falling back to mock details: ", e);
    const fallback = categoryId 
      ? mockPrograms.filter(p => p.categoryId === categoryId) 
      : mockPrograms;
    return fallback.map(p => ({
      ...p,
      imageUrl: null as string | null,
      category: mockCategories.find(c => c.id === p.categoryId)
    }));
  }
}

export async function getSafeProgramBySlug(slug: string) {
  try {
    const program = await prisma.program.findUnique({
      where: { slug },
      include: { category: true }
    });
    if (program) return program;
    
    const mock = mockPrograms.find(p => p.slug === slug);
    if (mock) {
      return {
        ...mock,
        imageUrl: null as string | null,
        category: mockCategories.find(c => c.id === mock.categoryId)
      };
    }
    return null;
  } catch (e) {
    console.warn(`Prisma Program Fetch for slug ${slug} failed, falling back to mock: `, e);
    const mock = mockPrograms.find(p => p.slug === slug);
    if (mock) {
      return {
        ...mock,
        imageUrl: null as string | null,
        category: mockCategories.find(c => c.id === mock.categoryId)
      };
    }
    return null;
  }
}
