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
  { id: 'cat-1', name: 'Semiconductor', slug: 'semiconductor' },
  { id: 'cat-2', name: 'Artificial intelligence & data science', slug: 'ai-data-science' },
  { id: 'cat-3', name: 'Information security', slug: 'information-security' },
  { id: 'cat-4', name: 'Project management', slug: 'project-management' },
  { id: 'cat-5', name: 'Engineering', slug: 'engineering' }
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
    categoryId: 'cat-5'
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
        ? mockPrograms.filter(p => p.categoryId === categoryId).map(p => ({ ...p, imageUrl: null as string | null, imageUrls: [] as string[] })) 
        : mockPrograms.map(p => ({
            ...p,
            imageUrl: null as string | null,
            imageUrls: [] as string[],
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
      imageUrls: [] as string[],
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
        imageUrls: [] as string[],
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
        imageUrls: [] as string[],
        category: mockCategories.find(c => c.id === mock.categoryId)
      };
    }
    return null;
  }
}

export const mockStats = [
  { id: 'stat-1', number: '150,000+', label: 'Students & Professionals' },
  { id: 'stat-2', number: '20+', label: 'Experienced Trainers' },
  { id: 'stat-3', number: '10+', label: 'Core Programmes' }
];

export const mockPartners = [
  { id: 'partner-1', name: 'MSIA', logoUrl: '/images/partners/msia.svg' },
  { id: 'partner-2', name: 'TalentCorp', logoUrl: '/images/partners/talentcorp.svg' },
  { id: 'partner-3', name: 'CREST', logoUrl: '/images/partners/crest.svg' },
  { id: 'partner-4', name: 'Dassault Systèmes', logoUrl: '/images/partners/dassault.svg' },
  { id: 'partner-5', name: 'Inari Amertron', logoUrl: '/images/partners/inari.svg' },
  { id: 'partner-6', name: 'Keysight Technologies', logoUrl: '/images/partners/keysight.svg' },
  { id: 'partner-7', name: 'USM', logoUrl: '/images/partners/usm.svg' },
  { id: 'partner-8', name: 'UTM', logoUrl: '/images/partners/utm.svg' }
];

export async function getSafeStats() {
  try {
    const stats = await prisma.stat.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return stats.length > 0 ? stats : mockStats;
  } catch (e) {
    console.warn("Prisma Stat Fetch failed, falling back to mock details: ", e);
    return mockStats;
  }
}

export async function getSafePartners() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return partners.length > 0 ? partners : mockPartners;
  } catch (e) {
    console.warn("Prisma Partner Fetch failed, falling back to mock details: ", e);
    return mockPartners;
  }
}

export let mockWhyChooseUsCards = [
  {
    id: "mock-wcu-1",
    title: "Applied Learning & Lab Research",
    description: "Engage in hands-on, immersive learning experiences designed to enhance technical capabilities. Our coursework takes place in real R&D environments, ensuring students develop practical, industrial-ready expertise that matches standard developer workflows.",
    imageUrl: null as string | null,
    colspan: 2,
    order: 0
  },
  {
    id: "mock-wcu-2",
    title: "Research Mentorship",
    description: "Learn directly from MIMOS senior research scientists and engineers with decades of practical expertise in wafer fabrication, microelectronics, IC design, and enterprise-grade software development.",
    imageUrl: null as string | null,
    colspan: 1,
    order: 1
  },
  {
    id: "mock-wcu-3",
    title: "Accredited Credentials",
    description: "Earn industry-recognized, accredited certifications backed by Malaysia's National Applied R&D Centre. Boost your career authority and credentials with HRD Corp claimable modules.",
    imageUrl: null as string | null,
    colspan: 1,
    order: 2
  },
  {
    id: "mock-wcu-4",
    title: "National Technology Infrastructure",
    description: "Our facilities provide access to real industrial environments. Walk through our Semiconductor Cleanrooms, explore our 5G Demonstration Labs, and run machine learning algorithms on supercomputing systems. This level of physical training environment cannot be replicated in a standard academic classroom.",
    imageUrl: null as string | null,
    colspan: 2,
    order: 3
  }
];

export async function getSafeWhyChooseUsCards() {
  try {
    const cards = await prisma.whyChooseUsCard.findMany({
      orderBy: { order: 'asc' }
    });
    return cards.length > 0 ? cards : mockWhyChooseUsCards;
  } catch (e) {
    console.warn("Prisma WhyChooseUsCard Fetch failed, falling back to mock details: ", e);
    return mockWhyChooseUsCards;
  }
}

export function setMockWhyChooseUsCards(newCards: typeof mockWhyChooseUsCards) {
  mockWhyChooseUsCards = newCards;
}

export let mockTestimonials = [
  {
    id: "mock-t-1",
    quote: "MIMOS Academy transformed my career with practical, hands-on training that gave me the confidence to succeed.",
    name: "Sarah Lim",
    role: "Software Engineer",
    company: "TechNova Solutions",
    order: 0
  },
  {
    id: "mock-t-2",
    quote: "The expert instructors at MIMOS made complex topics easy to understand, and the mentorship was invaluable.",
    name: "James Wong",
    role: "Data Analyst",
    company: "Insight Analytics",
    order: 1
  },
  {
    id: "mock-t-3",
    quote: "I landed my dream job thanks to the skills and certifications I gained through MIMOS Academy’s top-notch programmes.",
    name: "Aisha Rahman",
    role: "Cybersecurity Specialist",
    company: "SecureNet Global",
    order: 2
  },
  {
    id: "mock-t-4",
    quote: "MIMOS doesn’t just teach theory—they focus on real-world applications that make a real difference in the job market.",
    name: "Daniel Tan",
    role: "AI Developer",
    company: "FutureTech Innovations",
    order: 3
  },
  {
    id: "mock-t-5",
    quote: "Enrolling in MIMOS Academy was the best decision I made for my career—highly recommended for technical professionals.",
    name: "Priya Kumar",
    role: "Systems Architect",
    company: "GrowthWave Digital",
    order: 4
  }
];

export async function getSafeTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' }
    });
    return testimonials.length > 0 ? testimonials : mockTestimonials;
  } catch (e) {
    console.warn("Prisma Testimonial Fetch failed, falling back to mock details: ", e);
    return mockTestimonials;
  }
}

export function setMockTestimonials(newTestimonials: typeof mockTestimonials) {
  mockTestimonials = newTestimonials;
}

export let mockAboutSettings = {
  mission: "Empowering the future of technology through excellence in talent development and innovation.",
  vision: "MIMOS Academy aims to be recognized as a national leader in technology talent development and innovation, making significant contributions to Malaysia’s digital transformation agenda and positioning the country as a hub for technology excellence."
};

export let mockTeamMembers = [
  { id: "mock-tm-1", name: "Ir. Dr. Ahmad Nizar", role: "CEO-Designate", imageUrl: "/images/team/nizar.jpg" as string | null, initials: "AN", order: 0 },
  { id: "mock-tm-2", name: "Fatin Firzana", role: "Office Administrator", imageUrl: "/images/team/fatin.jpg", initials: "FF", order: 1 },
  { id: "mock-tm-3", name: "Siti Sarah Ramli", role: "Head of Governance & Operation", imageUrl: "/images/team/sarah.jpg", initials: "SR", order: 2 },
  { id: "mock-tm-4", name: "Zalina Sayuti", role: "TPM Operation & L&D Management", imageUrl: "/images/team/zalina.jpg", initials: "ZS", order: 3 },
  { id: "mock-tm-5", name: "Abu Said", role: "KHTP Operation & Facilities Management", imageUrl: "/images/team/abu.jpg", initials: "AS", order: 4 },
  { id: "mock-tm-6", name: "Saidatul Farrah", role: "Head of Business Development", imageUrl: "/images/team/farrah.jpg", initials: "SF", order: 5 },
  { id: "mock-tm-7", name: "Adilah", role: "Business Development Executive", imageUrl: "/images/team/adilah.jpg", initials: "AD", order: 6 },
  { id: "mock-tm-8", name: "Fuziah", role: "Business Development Executive", imageUrl: "/images/team/fuziah.jpg", initials: "FZ", order: 7 },
  { id: "mock-tm-9", name: "Sholihin", role: "Business Development Executive", imageUrl: "/images/team/sholihin.jpg", initials: "SH", order: 8 },
  { id: "mock-tm-10", name: "Mohd Suhairi", role: "Head of Program Development & Delivery", imageUrl: "/images/team/suhairi.jpg", initials: "MS", order: 9 },
  { id: "mock-tm-11", name: "Omar", role: "Program Development Specialist", imageUrl: "/images/team/omar.jpg", initials: "OM", order: 10 },
  { id: "mock-tm-12", name: "Dr. Afiq", role: "Program Development Specialist", imageUrl: "/images/team/afiq.jpg", initials: "AF", order: 11 },
  { id: "mock-tm-13", name: "Ainur", role: "Program Development Specialist", imageUrl: "/images/team/ainur.jpg", initials: "AI", order: 12 }
];

export async function getSafeAboutSettings() {
  try {
    const settings = await prisma.aboutSettings.findFirst();
    return settings || mockAboutSettings;
  } catch (e) {
    console.warn("Prisma AboutSettings Fetch failed, falling back to mock details: ", e);
    return mockAboutSettings;
  }
}

export async function getSafeTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    });
    return members.length > 0 ? members : mockTeamMembers;
  } catch (e) {
    console.warn("Prisma TeamMember Fetch failed, falling back to mock details: ", e);
    return mockTeamMembers;
  }
}

export function setMockAboutSettings(newSettings: typeof mockAboutSettings) {
  mockAboutSettings = newSettings;
}

export function setMockTeamMembers(newTeam: typeof mockTeamMembers) {
  mockTeamMembers = newTeam;
}

export let mockNewsArticles = [
  {
    id: "mock-news-1",
    title: "New tools from Stripe allow German businesses to sell globally—including to AI agents",
    category: "Administration",
    date: "30 June 2026",
    description: "Stripe today shared new tools to help businesses in Germany sell to and via AI agents, and reach more markets around the world.",
    content: "BERLIN—Stripe today shared new tools to help businesses in Germany sell to and via AI agents, and reach more markets around the world. Stripe works with half of the DAX40—including BMW, E.ON, Allianz, and SAP—and over three hundred thousand other German businesses, from large family enterprises like Viessmann to tech leaders like DeepL, N26, and Black Forest Labs.\n\n### Enabling online commerce in the AI era\n\nStripe announced that, beginning later this year, businesses in Germany will be able to sell to customers inside AI interfaces with the [Agentic Commerce Suite](https://stripe.com), which makes products discoverable and purchasable from inside AI interfaces through a single integration. Businesses with entities in the US can already sell to customers in the US via platforms including Gemini and Copilot.\n\nAI companies in Germany can now meter token consumption and charge customers for their exact usage in real time with [Metronome](https://stripe.com), integrated into [Stripe Billing](https://stripe.com). And [Stripe Radar](https://stripe.com), which blocked over €2 billion in fraudulent volume for German merchants last year, now defends against [token theft](https://stripe.com), with protection against multi-account abuse, free trial fraud, and pay-as-you-go abuse.",
    imageUrl: "/semiconductor_cleanroom.png" as string | null,
    isHighlighted: true,
    order: 0
  },
  {
    id: "mock-news-2",
    title: "Corporate HRD Corp Claimable status active",
    category: "Administration",
    date: "15 May 2026",
    description: "All upskilling programs under MIMOS Academy are officially claiming-enabled. Corporate groups can claim training costs directly through HRD Corp.",
    content: "All upskilling programs under MIMOS Academy are officially claiming-enabled. Corporate groups can claim training costs directly through HRD Corp.\n\nThis update is part of our commitment to supporting the continuous upskilling of the technical workforce in Malaysia. Organisations registered with HRD Corp can now claim 100% of the training fee under the HRD Corp levy scheme. Our certified training coordinators will handle the registration process and provide the necessary compliance documents for submission.",
    imageUrl: "/training_seminar_room.png",
    isHighlighted: true,
    order: 1
  },
  {
    id: "mock-news-3",
    title: "Generative AI LLM Enterprise Deployment track launched",
    category: "Syllabus Update",
    date: "18 March 2026",
    description: "A brand-new hands-on learning track covering private fine-tuning, retrieval-augmented generation (RAG), and quantization strategies.",
    content: "A brand-new hands-on learning track covering private fine-tuning, retrieval-augmented generation (RAG), and quantization strategies is now open for enrollment.\n\nThis syllabus track is designed for software developers and technical architects looking to deploy large language models locally and privately within enterprise infrastructures. Attendees will gain direct experience setting up localized model pipelines, managing context length limits, and configuring safe vector search layers.",
    imageUrl: "/ai_5g_hub.png",
    isHighlighted: true,
    order: 2
  },
  {
    id: "mock-news-4",
    title: "IC Design & layout verification program certified",
    category: "Certifications",
    date: "28 February 2026",
    description: "Our analog and digital IC layout training programs have been officially certified by leading global fabless semiconductor design houses.",
    content: "Our analog and digital IC layout training programs have been officially certified by leading global fabless semiconductor design houses.\n\nThis certification guarantees that participants learn industry-standard electronic design automation (EDA) tools and design rules. Graduates of this program will be eligible for direct internship and job placements with our partner semiconductor design firms, addressing the growing demand for silicon design talent in the region.",
    imageUrl: "/images/programs/cmosamplifierdesign.webp",
    isHighlighted: true,
    order: 3
  },
  {
    id: "mock-news-5",
    title: "PMP hybrid Agile frameworks alignment completed",
    category: "Syllabus Update",
    date: "2 April 2026",
    description: "Our Project Management courses have been updated to reflect the latest agile methodologies in PMBOK Guide 7th Edition.",
    content: "Our Project Management courses have been updated to reflect the latest agile methodologies in PMBOK Guide 7th Edition.\n\nThe updated course structure introduces hybrid lifecycle modules combining predictive milestones with iterative sprint executions. Participants will learn how to design flexible governance structures and lead multi-disciplinary technical teams under modern PM frameworks.",
    imageUrl: "/images/programs/pmp.webp",
    isHighlighted: false,
    order: 4
  },
  {
    id: "mock-news-6",
    title: "Cyber Security Range training lab upgrade completed",
    category: "Facilities Update",
    date: "15 January 2026",
    description: "Upgraded our cybersecurity simulation range with real-time multi-vector threat injection tools.",
    content: "Upgraded our cybersecurity simulation range with real-time multi-vector threat injection tools.\n\nThe upgraded range enables trainees to simulate complex threat scenarios including DDoS, zero-day exploits, and ransomware injection. Trainees can practice response procedures and forensic analysis inside isolated server environments.",
    imageUrl: "/cyber_security_range.png",
    isHighlighted: false,
    order: 5
  }
];

export async function getSafeNewsArticles() {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { order: 'asc' }
    });
    return articles.length > 0 ? articles : mockNewsArticles;
  } catch (e) {
    console.warn("Prisma NewsArticle Fetch failed, falling back to mock details: ", e);
    return mockNewsArticles;
  }
}

export async function getSafeHighlightedNews() {
  try {
    const highlighted = await prisma.newsArticle.findMany({
      where: { isHighlighted: true },
      orderBy: { order: 'asc' }
    });
    return highlighted.length > 0 ? highlighted : mockNewsArticles.filter(a => a.isHighlighted);
  } catch (e) {
    console.warn("Prisma Highlighted News Fetch failed, falling back to mock details: ", e);
    return mockNewsArticles.filter(a => a.isHighlighted);
  }
}

export async function getSafeNewsArticleById(id: string) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id }
    });
    return article || mockNewsArticles.find(a => a.id === id) || null;
  } catch (e) {
    console.warn("Prisma NewsArticle findUnique failed, falling back to mock: ", e);
    return mockNewsArticles.find(a => a.id === id) || null;
  }
}

export function setMockNewsArticles(newArticles: typeof mockNewsArticles) {
  mockNewsArticles = newArticles;
}

export let mockFacilities = [
  {
    id: "mock-fac-1",
    index: "01",
    title: "Semiconductor Technology Centre (STC)",
    subtitle: "Wafer Fabrication & Microelectronics R&D",
    imageUrl: "/semiconductor_cleanroom.png" as string | null,
    desc: "Malaysia's premier shared R&D fabrication center. Providing hands-on practical training space for engineering cohorts inside advanced cleanroom environments.",
    specs: [
      "Wafer Fabrication: Complete 6-inch wafer processing line",
      "Cleanroom Class: Certified Class 10 to Class 1000 environments",
      "Lithography: Precision E-beam & photolithography systems",
      "Thin Film Deposition: PECVD, LPCVD, and sputtering chambers",
      "Failure Analysis: Scanning electron microscopes (SEM)"
    ],
    order: 0
  },
  {
    id: "mock-fac-2",
    index: "02",
    title: "5G & AI Innovation Hub",
    subtitle: "Enterprise Workloads & Generative Modeling",
    imageUrl: "/ai_5g_hub.png",
    desc: "A cooperative facility simulating enterprise workloads. Students train and deploy generative models and verify networking latency in real-world scenarios.",
    specs: [
      "AI Compute: NVIDIA H100 GPU nodes with NVMe SAN storage",
      "Standalone 5G: Private sub-6GHz testbeds for latency testing",
      "Secure Sandbox: Air-gapped model training and verification",
      "IoT Arrays: Comprehensive protocol verification frameworks"
    ],
    order: 1
  },
  {
    id: "mock-fac-3",
    index: "03",
    title: "Cyber Security Range",
    subtitle: "Threat Simulation & Incident Response",
    imageUrl: "/cyber_security_range.png",
    desc: "Designed to train cybersecurity groups. The lab runs physical simulations of high-level threat profiles, privilege escalation, and active logging analytics.",
    specs: [
      "Cyber-Range: Active threat simulation and response testing",
      "Network Racks: Modular hardware racks for network virtualization",
      "Packet Capture: Real-time packet inspection and analysis nodes",
      "Verification: Dedicated air-gapped forensic sandboxes"
    ],
    order: 2
  },
  {
    id: "mock-fac-4",
    index: "04",
    title: "Training & Seminar Rooms",
    subtitle: "Technical Lecture & Seminars",
    imageUrl: "/training_seminar_room.png",
    desc: "Premium multi-functional spaces tailored for technical training cohorts and executive presentations with state-of-the-art visual hardware.",
    specs: [
      "AV Systems: Interactive smart displays & dual-projector arrays",
      "Dev Terminals: Pre-configured developer stations for students",
      "Conferencing: High-definition audio-visual integration",
      "Seating Capacity: Flexible layouts accommodating up to 60 pax",
      "Power Reliability: Localized UPS backup arrays"
    ],
    order: 3
  }
];

export async function getSafeFacilities() {
  try {
    const facilities = await prisma.facility.findMany({
      orderBy: { order: 'asc' }
    });
    return facilities.length > 0 ? facilities : mockFacilities;
  } catch (e) {
    console.warn("Prisma Facility Fetch failed, falling back to mock details: ", e);
    return mockFacilities;
  }
}

export function setMockFacilities(newFacilities: typeof mockFacilities) {
  mockFacilities = newFacilities;
}



