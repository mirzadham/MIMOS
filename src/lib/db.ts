import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

// Lazy-loaded Prisma Client proxy to bypass Next.js build-time collection instantiation checks
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      prismaInstance = new PrismaClient({
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
    title: 'Advanced Wafer Fabrication & Lithography',
    slug: 'advanced-wafer-fab',
    description: 'A comprehensive, hands-on physical training program focusing on semiconductor fabrication, thin-film processes, and cleanroom operations at the MIMOS STC Lab.',
    syllabus: '### Course Modules\n\n1. **Cleanroom Protocols & Safety** (Day 1)\n   - Introduction to cleanroom standards, safety, and clothing protocols.\n2. **Silicon Wafer Preparation & Cleaning** (Day 2)\n   - Chemical cleaning protocols (RCA cleaning) and substrate inspection.\n3. **Photolithography & Etching** (Day 3)\n   - Photoresist coating, alignment, UV exposure, development, and wet/dry etching.\n4. **Thin Film Deposition** (Day 4)\n   - PVD, CVD, and thermal oxidation techniques.\n5. **Metrology & Quality Inspection** (Day 5)\n   - SEM, ellipsometry, and profilometry inspection.',
    location: 'MIMOS Semiconductor Technology Centre (STC), Bukit Jalil',
    price: 'RM 4,500 / pax (HRD Corp Claimable)',
    duration: '5 Days (Physical Classroom & Lab)',
    dates: '15th - 19th July 2026',
    microsoftFormUrl: 'https://forms.office.com/r/mockWaferFab',
    categoryId: 'cat-1'
  },
  {
    id: 'prog-2',
    title: 'IC Design & Layout Verification',
    slug: 'ic-design-layout',
    description: 'Learn the principles of integrated circuit (IC) design, schematic capture, physical layout design, and Design Rule Checking (DRC) using industry-standard EDA tools.',
    syllabus: '### Course Modules\n\n1. **Introduction to VLSI & IC Design** (Day 1)\n   - Semiconductor basics, MOSFET models, and simple CMOS gates.\n2. **Schematic Entry & Simulation** (Day 2)\n   - Functional simulation, circuit netlists, and analog simulation basics.\n3. **Physical Layout Design** (Day 3)\n   - Transistor sizing, layout styling, guard rings, and design hierarchies.\n4. **Physical Verification (DRC & LVS)** (Day 4)\n   - Run design rule check (DRC) and layout-versus-schematic (LVS) checks.\n5. **Parasitic Extraction & Tape-out Prep** (Day 5)\n   - Post-layout simulation and GDSII generation.',
    location: 'MIMOS Semiconductor Technology Centre (STC), Bukit Jalil',
    price: 'RM 4,800 / pax (HRD Corp Claimable)',
    duration: '5 Days (Physical Lab)',
    dates: '24th - 28th August 2026',
    microsoftFormUrl: 'https://forms.office.com/r/mockIcDesign',
    categoryId: 'cat-1'
  },
  {
    id: 'prog-3',
    title: 'Generative AI & LLM Deployment in Enterprise',
    slug: 'generative-ai-llm',
    description: 'A deep-dive corporate cohort training course designed to upskill engineers and IT professionals in fine-tuning, prompting, and securely deploying LLMs on-premise.',
    syllabus: '### Course Modules\n\n1. **Foundations of Deep Learning & Transformers** (Day 1)\n   - Feedforward nets, attention mechanisms, and Transformer architectures.\n2. **Prompt Engineering & RAG Systems** (Day 2)\n   - Vector databases, semantic retrieval, and building RAG pipelines.\n3. **Fine-Tuning Techniques (LoRA/QLoRA)** (Day 3)\n   - Parameter-efficient fine-tuning, preparing datasets, and GPU training.\n4. **LLM Quantization & Local Serving** (Day 4)\n   - Quantizing models (GGUF/AWQ) and running local model servers (Ollama/vLLM).\n5. **Enterprise Security & Red-Teaming** (Day 5)\n   - Safety guardrails, prompt injection defenses, and compliance.',
    location: 'MIMOS 5G & AI Innovation Hub, TPM Bukit Jalil',
    price: 'RM 3,500 / pax (HRD Corp Claimable)',
    duration: '5 Days (Physical)',
    dates: '10th - 14th August 2026',
    microsoftFormUrl: 'https://forms.office.com/r/mockGenAiLLM',
    categoryId: 'cat-2'
  },
  {
    id: 'prog-4',
    title: 'Certified CyberSecurity Defense & Penetration Testing',
    slug: 'cyberdefense-pentest',
    description: 'Learn modern network penetration testing, web app vulnerability scanning, and cybersecurity defense response mechanisms in our custom cyber-range lab.',
    syllabus: '### Course Modules\n\n1. **Reconnaissance & Network Scanning** (Day 1)\n   - Information gathering, OSINT, Nmap scans, and banner grabbing.\n2. **Web Application Pen Testing** (Day 2)\n   - OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, IDOR).\n3. **Exploitation & Privilege Escalation** (Day 3)\n   - Utilizing Metasploit, writing exploit scripts, and escalating user permissions.\n4. **Defensive Configurations & Log Analysis** (Day 4)\n   - Deploying IDSs/IPSs, firewall configurations, and analyzing security logs.\n5. **Incident Response & Report Writing** (Day 5)\n   - Forensic basics and writing standard professional pen test reports.',
    location: 'MIMOS Cybersecurity Range, TPM Bukit Jalil',
    price: 'RM 3,800 / pax',
    duration: '5 Days (Physical)',
    dates: '07th - 11th September 2026',
    microsoftFormUrl: 'https://forms.office.com/r/mockCybersec',
    categoryId: 'cat-3'
  },
  {
    id: 'prog-5',
    title: 'Project Management Professional (PMP)® Exam Prep',
    slug: 'pmp-exam-prep',
    description: 'Official PMP preparation training course covering agile, predictive, and hybrid project management frameworks, aligned with the latest PMBOK Guide.',
    syllabus: '### Course Modules\n\n1. **People: Managing Team & Stakeholders** (Day 1)\n   - Building teams, defining rules, negotiating agreements, and leading stakeholders.\n2. **Process: Running Project Lifecycles** (Day 2)\n   - Project planning, budgeting, scheduling, risk mitigation, and quality guidelines.\n3. **Agile & Hybrid Frameworks** (Day 3)\n   - Scrum, Kanban, iteration planning, velocity charts, and hybrid methodologies.\n4. **Business Environment: Compliance & Value** (Day 4)\n   - Organizational change, continuous improvement, and contract options.\n5. **Mock Exam & Question Analysis** (Day 5)\n   - Reviewing scenario-based questions and test-taking strategies.',
    location: 'MIMOS Executive Academy Classroom, Bukit Jalil',
    price: 'RM 2,900 / pax',
    duration: '5 Days (Physical)',
    dates: '19th - 23rd October 2026',
    microsoftFormUrl: 'https://forms.office.com/r/mockPmp',
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
        ? mockPrograms.filter(p => p.categoryId === categoryId) 
        : mockPrograms.map(p => ({
            ...p,
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
        category: mockCategories.find(c => c.id === mock.categoryId)
      };
    }
    return null;
  }
}
