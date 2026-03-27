interface Basics {
  name: string;
  label: string;
  email: string;
  phone: string;
  url: string;
  image: string;
  summary: string;
  location: {
    city: string;
    region: string;
    countryCode: string;
  };
  profiles: Profile[];
}

interface Profile {
  network: string;
  username: string;
  url: string;
}

interface WorkPosition {
  company: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  responsibilities: string[];
  achievements: string[];
}

interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  location: string;
}

interface Patent {
  name: string;
  filedDate: string;
  issuedDate: string;
  numbers: { id: string; url: string }[];
}

interface Project {
  name: string;
  url: string;
  description: string;
}

interface SkillCategory {
  name: string;
  keywords: string[];
}

export const basics: Basics = {
  name: "Frank Blechschmidt",
  label: "Senior Engineering Manager",
  email: "contact@frank-blechschmidt.com",
  phone: "+1 (650) 213-2619",
  url: "https://frank-blechschmidt.com",
  image: "https://frank-blechschmidt.com/avatar.jpg",
  summary:
    "Product-minded Senior Engineering Manager with 10+ years of experience building scalable cloud infrastructure and developer platforms. Expert in transforming internal tooling into reliable, product-grade systems that drive developer velocity and enterprise-grade reliability. Proven track record of scaling engineering cultures while maintaining a focus on simplicity and speed. Currently at dbt Labs, previously at Lattice, Box, and SAP.",
  location: {
    city: "Sunnyvale",
    region: "CA",
    countryCode: "US",
  },
  profiles: [
    {
      network: "LinkedIn",
      username: "fblechschmidt",
      url: "https://www.linkedin.com/in/fblechschmidt",
    },
    {
      network: "GitHub",
      username: "FraBle",
      url: "https://github.com/FraBle",
    },
    {
      network: "X",
      username: "FraBle90",
      url: "https://x.com/FraBle90",
    },
  ],
};

export const work: WorkPosition[] = [
  {
    company: "dbt Labs",
    position: "Senior Engineering Manager — Multi-Cell & Networking",
    url: "https://www.getdbt.com/",
    startDate: "2024-10",
    endDate: "",
    location: "United States (Remote)",
    summary:
      "Directing the strategy and execution of dbt Labs' Multi-Cell Cloud Architecture across AWS, Azure, and GCP, enabling infinite horizontal scalability and data residency compliance for global enterprise customers.",
    responsibilities: [],
    achievements: [
      "Operationalized next-gen cell architecture, supporting a 3x increase in revenue share by expanding global footprint to 8 regions.",
      "Orchestrated a strategic shift from manual scripting to service-based, end-to-end automation, reducing cell-to-cell account migration execution time by 80%.",
    ],
  },
  {
    company: "Lattice",
    position: "Engineering Manager — Developer Experience & Cloud Engineering",
    url: "https://lattice.com/",
    startDate: "2022-01",
    endDate: "2024-10",
    location: "San Francisco, CA",
    summary:
      "Led the Developer Experience and Cloud Engineering organization (15 engineers), delivering the platform foundation for 150+ developers. Treated the internal platform as a product, utilizing NPS-style surveys (90% participation) to drive roadmap prioritization and increase developer satisfaction by 50%.",
    responsibilities: [
      "Bootstrapped the Developer Experience team from the ground up, establishing technical strategy, SLOs, and DORA metrics to drive data-driven resource allocation. Expanded scope to lead Cloud Engineering, supporting Lattice's expansion into EMEA.",
    ],
    achievements: [
      "Architected a 'Safety First' deployment pipeline for the monolith, shifting validation left to build-time and creating a 4-hour guaranteed instant rollback window, significantly reducing mean-time-to-recovery (MTTR) for critical incidents.",
      "Migrated from CircleCI to GitHub Actions with self-hosted runners, cutting CI spending by 30%. Achieved an 80% reduction in build time and increased success rates from 70% to 99% via merge queue and flaky test automation.",
      "Modernized the local development ecosystem by facilitating the migration to M1-powered hardware and rolling out GitHub Copilot, driving a 50% increase in developer productivity.",
      "Fostered a culture of high performance with 100% engagement scores for Management and Team Climate; successfully mentored a senior engineer through a promotion to Engineering Manager within six months.",
    ],
  },
  {
    company: "Box",
    position: "Engineering Manager — Kubernetes Engineering",
    url: "https://www.box.com/",
    startDate: "2021-10",
    endDate: "2022-01",
    location: "Redwood City, CA",
    summary:
      "Led Box's cloud platform of 12 engineers, building and expanding its internal Kubernetes-based Platform-as-a-Service (PaaS) offering.",
    responsibilities: [
      "Developed vision & strategy and drove the execution for Box's Kubernetes-based platform.",
      "Worked with product managers and architects on cross-team project initiatives, including data-driven prioritization, technical strategy, and OKR management.",
      "Mentored and supervised engineers with individual growth plans, custom-tailored training, and continuous feedback.",
      "Sourced, recruited, and interviewed software engineers to grow the team on all levels, from junior to staff.",
    ],
    achievements: [
      "Managed the migration of Box's Kubernetes platform from on-prem, multi-region data centers to Google Kubernetes Engine (GKE).",
    ],
  },
  {
    company: "Box",
    position: "Tech Lead Manager — Kubernetes Engineering",
    url: "https://www.box.com/",
    startDate: "2021-03",
    endDate: "2021-10",
    location: "Redwood City, CA",
    summary:
      "Tech Lead Manager (TLM) is Box's 6-12 months program to support ICs in the transition to engineering management.",
    responsibilities: [
      "Worked as a member of a cross-functional recruiting team to hire and interview Box's interns for the summer of 2021.",
    ],
    achievements: [
      "Delivered key projects, such as the rollout of declarative observability tooling, Kubernetes cluster landscape rebalance and expansion, the onboarding of Box's monolithic core app to Kubernetes, and the modernization of Box's Kubernetes infrastructure.",
      "Increased team productivity by streamlining status updates processes and OKR management using Atlassian tooling and reducing redundancies.",
      "Completely redesigned the end-of-quarter team retrospective making it an objective and democratic ritual leading to increased contributions, enhanced accountability, and greater team satisfaction.",
    ],
  },
  {
    company: "Box",
    position: "Senior Software Engineer — Kubernetes Engineering",
    url: "https://www.box.com/",
    startDate: "2019-05",
    endDate: "2021-03",
    location: "Redwood City, CA",
    summary: "",
    responsibilities: [
      "Onboarded, supervised, and mentored 4 full-time team members and 2 interns to foster Box's engineering principles and values.",
    ],
    achievements: [
      "Architected and implemented new components for Box's Kubernetes-based cloud platform, including deployment configurations, application management, high-availability setups, migration tooling, and platform integrations.",
      "Planned and coordinated the introduction of new Kubernetes clusters and availability zones, including rebalancing existing services across multiple clusters and regions for improved availability guarantees.",
      "Implemented a promotion model for deployment pipelines to enable secure and safe rollouts of service changes across environments and increase the reliability of services deployed on Box's cloud platform.",
      "Migrated platform to role-based access control (RBAC) with LDAP integration for granular authorization and reduced toil.",
      "Received nomination for 12-month Tech Lead Manager (TLM) program as Box's training for the transition to engineering management.",
    ],
  },
  {
    company: "SAP Conversational AI",
    position: "Lead Software Engineer",
    url: "https://cai.tools.sap/",
    startDate: "2016-07",
    endDate: "2019-05",
    location: "Palo Alto, CA",
    summary: "",
    responsibilities: [
      "Led a global engineering team and spearheaded SAP's Conversational AI initiative as part of SAP's strategy to become the industry leader in Intelligent Enterprise software.",
      "Managed post-acquisition activities for Recast.AI by migrating services to SAP infrastructure and running engineering efforts to bring Recast.AI's existing technology to SAP's high level of product standards and compliance.",
      "Supervised recruiting new engineering talents and mentored a growing team of software developers and data scientists.",
      "Collaborated with internal stakeholders and customers for Proof-of-Concept (PoC) development and platform onboarding.",
      "Represented the team and product on an increasing list of developer conferences and architecture summits, such as O'Reilly AI Conference, SAP TechEd, and Google I/O.",
    ],
    achievements: [
      "Defined and executed the development of a microservice-based cloud-scale architecture on top of SAP's Cloud Foundry and Kubernetes offering through SAP Cloud Platform.",
      "Won the Request-for-Proposal (RFP) of one of SAP's most strategic customers, Bayer, showcasing SAP's capabilities in the transformation of procurement through Conversational AI leading to the nomination for the Hasso Plattner Founders' Award.",
      "Led the development and launch of SAP's first end consumer-facing chatbot enabling all customers of SAP's co-working space, HanaHaus, to manage reservations through SMS.",
    ],
  },
  {
    company: "SAP Innovation Center",
    position: "Software Engineer",
    url: "https://www.sap.com/about/company/innovation/icn.html",
    startDate: "2015-10",
    endDate: "2016-06",
    location: "Palo Alto, CA",
    summary: "",
    responsibilities: [],
    achievements: [
      "Created a Twitter bot to accompany attendees of SAP's most significant customer conference SAPPHIRE NOW through summarizing and recommending conference events based on the context and interest of the individual attendee.",
      "Developed a software component for converting resumes from PDF to machine-readable format for data-driven recruiting PoC showcasing the power of Machine Learning (ML) and Natural Language Processing (NLP) for the Human Resources (HR) domain.",
      "Implemented a web app to visualize the performance tests of database queries using Google Charts and leveraging dynamic information retrieval through descriptive programming.",
    ],
  },
  {
    company: "SAP Innovation Center",
    position: "Software Engineering Intern",
    url: "https://www.sap.com/about/company/innovation/icn.html",
    startDate: "2014-09",
    endDate: "2015-09",
    location: "Palo Alto, CA",
    summary: "",
    responsibilities: [],
    achievements: [
      "Implemented a demo web app for SAP's co-founder Hasso Plattner's SAPPHIRE NOW keynote displaying the simplification potential for decision-making in the consumer product industry through holistic, real-time views for short supply management.",
      "Extended the web video player for openHPI/openSAP Massive Open Online Course (MOOC) platform by providing information based on semantic analysis of video and user content with SAP HANA Text Analysis.",
      "Developed a prototype for advanced explorative learning on unsorted education material through summarization of video and text content and a recommendation engine.",
    ],
  },
];

export const education: Education[] = [
  {
    institution: "University of Illinois Urbana-Champaign",
    url: "https://illinois.edu/",
    area: "Computer Science",
    studyType: "Master",
    startDate: "2019-01",
    endDate: "2021-08",
    location: "Urbana, Illinois, USA",
  },
  {
    institution: "Hasso Plattner Institute, University of Potsdam",
    url: "https://hpi.de/",
    area: "IT-Systems Engineering",
    studyType: "Bachelor of Science",
    startDate: "2011-08",
    endDate: "2014-08",
    location: "Potsdam, Germany",
  },
];

export const patents: Patent[] = [
  {
    name: "Cognitive Enterprise System",
    filedDate: "2017-03",
    issuedDate: "2022-03",
    numbers: [
      {
        id: "US 11,275,894 B2",
        url: "https://patents.google.com/patent/US11275894B2/en",
      },
      {
        id: "US 2019/0332956 A1",
        url: "https://patents.google.com/patent/US20190332956A1/en",
      },
      {
        id: "US 2018/0144053 A1",
        url: "https://patents.google.com/patent/US20180144053A1/en",
      },
      {
        id: "US 2018/0144257 A1",
        url: "https://patents.google.com/patent/US20180144257A1/en",
      },
    ],
  },
];

export const projects: Project[] = [
  {
    name: "python-sutime",
    url: "https://github.com/FraBle/python-sutime",
    description:
      "Python wrapper for Stanford's NLP library SUTime; officially mentioned on Stanford NLP website; downloaded 4,500x/month.",
  },
  {
    name: "python-duckling",
    url: "https://github.com/FraBle/python-duckling",
    description:
      "Python wrapper for wit.ai's NLP library Duckling; used by leading Open Source NLU library Rasa NLU; downloaded 1,000x/month.",
  },
];

export const managerToolbox: SkillCategory[] = [
  { name: "Goal Setting", keywords: ["OKRs", "SMART Goals"] },
  { name: "Recruiting", keywords: ["Greenhouse", "Gem", "LinkedIn", "HackerRank"] },
  { name: "Engagement", keywords: ["Lattice", "Culture Amp", "DX", "SurveyMonkey"] },
  { name: "Prioritization", keywords: ["RICE", "Eisenhower Matrix", "MoSCoW"] },
  { name: "Decision Making", keywords: ["SPADE", "DACI", "RACI", "SWOT Analysis"] },
  { name: "Agile Frameworks", keywords: ["Kanban", "Scrum", "eXtreme Programming"] },
  { name: "Project Tracking", keywords: ["Jira", "GitHub Projects", "Trello"] },
  { name: "HR Tools", keywords: ["Lattice", "BambooHR", "Workday", "ADP", "WorkRamp"] },
  { name: "Communication", keywords: ["Slack", "Google Workspace", "Zoom"] },
  { name: "Mentorship", keywords: ["Plato", "Torch"] },
  { name: "Metrics and KPIs", keywords: ["DORA", "Datadog", "SLAs & SLOs", "MTT*"] },
  { name: "Collaboration", keywords: ["Figma", "Lucid", "Notion", "Confluence"] },
];

export const technicalSkills: SkillCategory[] = [
  { name: "Programming Languages", keywords: ["Python", "TypeScript", "JavaScript", "Go", "GraphQL"] },
  { name: "Databases", keywords: ["PostgreSQL", "Redis", "MySQL", "Timescale"] },
  { name: "Frameworks", keywords: ["FastAPI", "Node.js", "Express", "React", "Tornado"] },
  { name: "DevOps", keywords: ["Terraform", "Ansible", "Docker", "Git", "pnpm"] },
  { name: "CI/CD", keywords: ["GitHub Actions", "ArgoCD", "CircleCI", "Travis CI", "GitLab"] },
  { name: "NLP", keywords: ["SpaCy", "Rasa", "CoreNLP", "Duckling", "SUTime"] },
  { name: "Cloud Platforms", keywords: ["Kubernetes", "GCP", "AWS"] },
  { name: "Message Queues / Streaming", keywords: ["RabbitMQ", "Kafka", "Celery"] },
  { name: "Machine Learning / AI", keywords: ["TensorFlow", "Keras", "scikit-learn"] },
  {
    name: "Observability",
    keywords: ["Datadog", "Grafana", "ELK Stack", "Prometheus", "PagerDuty", "OpenTelemetry", "Splunk", "Sentry"],
  },
  { name: "DevSecOps", keywords: ["Snyk", "FOSSA", "GHAS", "StackHawk"] },
];

// Helper: format date range for display
export function formatDateRange(startDate: string, endDate: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    const month = months[parseInt(m, 10) - 1];
    if (!month) throw new Error(`Invalid date format (expected YYYY-MM): ${d}`);
    return `${month} ${y}`;
  };
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : "Present"}`;
}
