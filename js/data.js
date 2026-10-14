/**
 * Aditya Kadepure Portfolio — Data & Candidate Information Module
 * Contains candidate profiles, technical skill trees, HR competencies, and tool databases.
 */

export const specialtyContent = {
  Languages: {
    symbol: "{ }",
    description: "Core programming and web languages listed in the CV.",
    tags: ["Python", "JavaScript", "ES6+", "HTML5", "CSS3", "SQL"],
  },
  Backend: {
    symbol: "API",
    description: "Backend frameworks, runtime, and web-service technologies.",
    tags: ["Django", "Flask", "Node.js", "REST APIs"],
  },
  Frontend: {
    symbol: "UI",
    description: "Frontend libraries, CSS frameworks, and responsive design.",
    tags: [
      "React.js",
      "jQuery.js",
      "Bootstrap",
      "Tailwind CSS",
      "Bulma",
      "Foundation CSS",
      "Responsive Web Design",
    ],
  },
  "Data Science": {
    symbol: "DS",
    description: "Python libraries for numerical computing and data analysis.",
    tags: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
  },
  Databases: {
    symbol: "SQL",
    description: "Relational and document databases plus query languages.",
    tags: ["MySQL", "PostgreSQL", "MongoDB", "SQL", "PL/SQL"],
  },
  Analytics: {
    symbol: "BI",
    description: "Business-intelligence and spreadsheet tools listed in the CV.",
    tags: [
      "Microsoft Excel",
      "Google Sheets",
      "Power BI",
      "Qlik Sense",
      "Qlik View",
    ],
  },
  Platforms: {
    symbol: "AWS",
    description: "Cloud and enterprise platforms.",
    tags: ["AWS", "ServiceNow"],
  },
  Tools: {
    symbol: "DEV",
    description: "Developer, collaboration, notebook, API, and coding-assistant tools.",
    tags: [
      "VS Code",
      "Sublime",
      "Jupyter Notebook",
      "Google Colab",
      "Postman",
      "Git",
      "GitHub",
      "GitLab",
      "Cursor AI",
      "Claude Code",
      "Copilot",
    ],
  },
};

export const skillAliases = {
  Languages: /\b(python|javascript|es6\+?|html5?|css3?)\b/,
  Backend: /\b(django|flask|node(?:\.js)?|rest|apis?|mern|express)\b/,
  Frontend:
    /\b(react(?:\.js)?|jquery(?:\.js)?|bootstrap|tailwind|bulma|foundation|responsive web design|frontend|front-end)\b/,
  "Data Science": /\b(pandas|numpy|data science|data scientist)\b/,
  Databases: /\b(mysql|postgres(?:ql)?|mongodb|mongo|sql|pl\/sql|database)s?\b/,
  Analytics:
    /\b(analytics|analyst|analysis|excel|sheets|power bi|qlik(?: sense|view)?)\b/,
  Platforms: /\b(aws|servicenow|cloud)\b/,
  Tools:
    /\b(vs code|visual studio code|sublime|jupyter|colab|postman|git|github|gitlab|cursor|claude code|copilot|ai tools?)\b/,
};

export const specialties = Object.keys(specialtyContent);

export const candidateInfo = {
  firstName: "Aditya",
  lastName: "Kadepure",
  middleName: "Ganesh",
  fullName: "Aditya Kadepure",
  role: "Full-Stack Developer",
  summary:
    "Full-Stack Developer with experience building web applications with Python and modern front-end and back-end technologies. Strong foundation in responsive web design, user interface development, database management, version control, full-stack application development, REST APIs, and data analytics tools.",
  location: "Hyderabad, India",
  email: "mradik731@gmail.com",
  phone: "+91 73537 58627",
  github: "https://github.com/Adit-1716",
  linkedin: "https://www.linkedin.com/in/aditya-kadepure-9696163b3",
  education:
    "Bachelor of Computer Applications (BCA) at S.S.K. Basaveshwar UG & PG College (Affiliated with Bidar University, Basavakalyan), 08/2023 – 09/2026.",
  currentRole:
    "Python Full Stack Developer at EPA Cybernest Solutions Pvt Ltd (09/2026 – Present, Hyderabad)",
};

export const hrCoreCompetencies = {
  expertiseIn: [
    "Python Full-Stack Development (Frontend & Backend integration, application architecture, API development)",
    "RESTful API Architecture, Endpoint Design, Integration & Testing",
    "Responsive Web Design, Mobile-First Interface Development & Cross-Device Compatibility",
  ],
  proficiencyIn: [
    "React.js & Modern Component-Driven User Interfaces",
    "Django & Flask Backend Web Frameworks",
    "Relational Database Management & SQL Query Optimization (MySQL, PostgreSQL)",
    "Modern JavaScript (ES6+), Semantic HTML5 & Responsive CSS3",
  ],
  skilledAt: [
    "Node.js Runtime & Express Server Development",
    "Utility & Component CSS Frameworks (Tailwind CSS, Bootstrap, Bulma, Foundation)",
    "Data Analysis, Cleaning & Numerical Computing (Pandas, NumPy, Matplotlib, Seaborn)",
    "NoSQL Database Schema Design (MongoDB / MERN Stack)",
    "Version Control & Code Collaboration Workflows (Git, GitHub, GitLab)",
    "REST API Testing, Headers & Payload Validation with Postman",
    "Database ORM & Migrations with Prisma ORM",
  ],
  advancedKnowledgeOf: [
    "Full-Stack Web Application Lifecycle (UI, API Layer, Data Persistence, Testing, Deployment)",
    "Database Schema Modeling, Relational Integrity & Performance Tuning",
    "Business Intelligence, KPI Dashboards & Spreadsheet Analysis (Power BI, Microsoft Excel, Qlik Sense)",
    "Cloud Infrastructure, Web Hosting & Deployment (AWS, ServiceNow, Hostinger)",
    "AI-Assisted Developer Tooling & Productivity (Cursor AI, Claude Code, GitHub Copilot)",
  ],
};

export const hrToolsDatabase = [
  {
    name: "Python",
    pattern: /\bpython(?:3)?\b/i,
    category: "Programming Language (Core Full-Stack)",
    competency: "Expertise in",
    specialtyKey: "Languages",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd (Python Full Stack Developer): Developed end-to-end web applications, managed frontend and backend logic with Python, implemented database layers, API integrations, testing, and deployment.",
      "Data Science & Analytics: Applied Python for numerical computing, data transformations, and exploratory data analysis using Pandas and NumPy.",
    ],
    complementary: "Django, Flask, Pandas, NumPy, MySQL, PostgreSQL, REST APIs, Git",
  },
  {
    name: "JavaScript (ES6+)",
    pattern: /\b(?:javascript|js|es6\+?)\b/i,
    category: "Programming Language (Web & Full-Stack)",
    competency: "Proficiency in",
    specialtyKey: "Languages",
    applied: [
      "Zidio Development Company: Engineered dynamic, responsive frontend web interfaces with React, modern JavaScript (ES6+), HTML, and CSS.",
      "Inno-I Inventory Management System & Chhatrapati Trust Website: Core client-side interactions, event handling, asynchronous HTTP requests, and server scripting.",
    ],
    complementary: "React.js, Node.js, Express, REST APIs, HTML5, CSS3",
  },
  {
    name: "React.js",
    pattern: /\breact(?:\.js)?\b/i,
    category: "Frontend Framework / UI Library",
    competency: "Proficiency in",
    specialtyKey: "Frontend",
    applied: [
      "Zidio Development Company: Built modular, reusable frontend components, stateful UI views, and responsive web pages.",
      "Inno-I Inventory Management System: Real-time UI for stock tracking, inventory levels, and transaction management.",
    ],
    complementary: "JavaScript (ES6+), Tailwind CSS, Bootstrap, REST APIs, Node.js",
  },
  {
    name: "Django",
    pattern: /\bdjango\b/i,
    category: "Backend Web Framework (Python)",
    competency: "Proficiency in",
    specialtyKey: "Backend",
    applied: [
      "Architected secure, scalable Python backend applications, ORM data models, user authentication, and high-performance RESTful APIs.",
    ],
    complementary: "Python, REST APIs, MySQL, PostgreSQL, Postman",
  },
  {
    name: "Flask",
    pattern: /\bflask\b/i,
    category: "Micro Web Framework (Python)",
    competency: "Skilled at",
    specialtyKey: "Backend",
    applied: [
      "Engineered lightweight Python web services, modular backend microservices, and rapid REST API prototyping.",
    ],
    complementary: "Python, REST APIs, Postman, SQL",
  },
  {
    name: "Node.js & Express",
    pattern: /\b(?:node(?:\.js)?|express(?:\.js)?|mern(?:\s+stack)?)\b/i,
    category: "Backend Runtime & Framework",
    competency: "Skilled at",
    specialtyKey: "Backend",
    applied: [
      "Inno-I Inventory Management System: Asynchronous backend server, REST API routing, inventory CRUD operations, and Prisma ORM database connection.",
    ],
    complementary: "JavaScript (ES6+), Express.js, MySQL, MongoDB, REST APIs, Prisma ORM",
  },
  {
    name: "REST APIs",
    pattern: /\b(?:rest(?:ful)?[\s-_]*apis?|apis?[\s-_]*integration)\b/i,
    category: "Web Service Architecture & Integration",
    competency: "Expertise in",
    specialtyKey: "Backend",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd: Engineered API integrations between frontend UI and Python backend services.",
      "Inno-I Project: Designed, developed, and tested complete RESTful endpoints for real-time inventory updates and reporting.",
    ],
    complementary: "Postman, JSON, Django, Flask, Node.js, Python",
  },
  {
    name: "SQL & PL/SQL",
    pattern: /\b(?:sql|pl\/sql)\b/i,
    category: "Database Query Language",
    competency: "Proficiency in",
    specialtyKey: "Databases",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd: Wrote queries for database management, data validation, and backend service integration.",
      "Relational schema modeling, multi-table joins, subqueries, grouping, indexes, and transactional data integrity.",
    ],
    complementary: "MySQL, PostgreSQL, Prisma ORM, Python",
  },
  {
    name: "MySQL",
    pattern: /\bmysql\b/i,
    category: "Relational Database Management System (RDBMS)",
    competency: "Proficiency in",
    specialtyKey: "Databases",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd: Relational database management, tables, and API data synchronization.",
      "Inno-I Inventory Management System: Structured relational schema for inventory records, stock adjustments, and audit trails.",
    ],
    complementary: "SQL, Prisma ORM, Node.js, Python",
  },
  {
    name: "PostgreSQL",
    pattern: /\bpostgres(?:ql)?\b/i,
    category: "Enterprise Relational Database (RDBMS)",
    competency: "Proficiency in",
    specialtyKey: "Databases",
    applied: [
      "Designed normalized relational database schemas, foreign keys, transactions, and backend data persistence.",
    ],
    complementary: "SQL, Python, Django, REST APIs",
  },
  {
    name: "MongoDB",
    pattern: /\bmongo(?:db)?\b/i,
    category: "NoSQL Document Database",
    competency: "Skilled at",
    specialtyKey: "Databases",
    applied: [
      "MERN stack development, JSON-like document modeling, collection indexing, and flexible data schemas.",
    ],
    complementary: "Node.js, Express, React.js, REST APIs",
  },
  {
    name: "Prisma ORM",
    pattern: /\bprisma(?:\s*orm)?\b/i,
    category: "Next-Gen Database ORM / Data Layer",
    competency: "Skilled at",
    specialtyKey: "Backend",
    applied: [
      "Inno-I Inventory Management System: Utilized Prisma ORM for type-safe database queries, schema migrations, and MySQL integration.",
    ],
    complementary: "Node.js, MySQL, REST APIs, JavaScript",
  },
  {
    name: "HTML5 & CSS3",
    pattern: /\b(?:html5?|css3?)\b/i,
    category: "Core Web Markup & Styling",
    competency: "Expertise in",
    specialtyKey: "Languages",
    applied: [
      "Zidio Development Company, Shri Channabasaveshwar Gurukul, Inno-I System, and Chhatrapati Trust website.",
      "Modern CSS Flexbox, Grid, semantic HTML, cross-browser support, and accessibility.",
    ],
    complementary: "Responsive Web Design, Tailwind CSS, Bootstrap, JavaScript",
  },
  {
    name: "Tailwind CSS",
    pattern: /\btailwind(?:\s*css)?\b/i,
    category: "Utility-First CSS Framework",
    competency: "Skilled at",
    specialtyKey: "Frontend",
    applied: [
      "Zidio Development Company: Crafted modern, responsive, mobile-first layouts and component designs alongside React.js.",
    ],
    complementary: "React.js, HTML5, CSS3, JavaScript",
  },
  {
    name: "Bootstrap",
    pattern: /\bbootstrap\b/i,
    category: "Responsive CSS Framework",
    competency: "Skilled at",
    specialtyKey: "Frontend",
    applied: [
      "Zidio Development Company, Chhatrapati Shivray Mandal website, and Inno-I Inventory project.",
    ],
    complementary: "HTML5, CSS3, JavaScript, jQuery",
  },
  {
    name: "Responsive Web Design (RWD)",
    pattern: /\bresponsive(?:\s+web)?(?:\s+design)?\b/i,
    category: "Frontend UI Architecture",
    competency: "Expertise in",
    specialtyKey: "Frontend",
    applied: [
      "Implemented mobile-first, responsive web layouts across all client and live projects (Inno-I, Chhatrapati Trust, Zidio).",
    ],
    complementary: "CSS Media Queries, Flexbox, CSS Grid, Tailwind CSS, Bootstrap",
  },
  {
    name: "Pandas & NumPy",
    pattern: /\b(?:pandas|numpy|matplotlib|seaborn)\b/i,
    category: "Data Science & Numerical Computing",
    competency: "Skilled at",
    specialtyKey: "Data Science",
    applied: [
      "Applied Pandas and NumPy for tabular data manipulation, data cleaning, validation, aggregation, and analytical computations.",
    ],
    complementary: "Python, Jupyter Notebook, Google Colab, Data Analytics",
  },
  {
    name: "Power BI",
    pattern: /\bpower[\s-_]*bi\b/i,
    category: "Business Intelligence & Visualization Tool",
    competency: "Advanced knowledge of",
    specialtyKey: "Analytics",
    applied: [
      "Constructed interactive BI dashboards, KPI tracking metrics, DAX measures, and visual business reporting.",
    ],
    complementary: "Microsoft Excel, SQL, Data Analytics, Reporting",
  },
  {
    name: "Microsoft Excel & Google Sheets",
    pattern: /\b(?:excel|google[\s-_]*sheets?|spreadsheets?)\b/i,
    category: "Spreadsheet & Business Analysis",
    competency: "Advanced knowledge of",
    specialtyKey: "Analytics",
    applied: [
      "Formulas, VLOOKUP/XLOOKUP, Pivot Tables, summary reporting, data validation, and financial calculations.",
    ],
    complementary: "Power BI, CSV, SQL",
  },
  {
    name: "Qlik Sense & Qlik View",
    pattern: /\bqlik(?:[\s-_]*sense|[\s-_]*view)?\b/i,
    category: "Business Intelligence & Analytics Platform",
    competency: "Advanced knowledge of",
    specialtyKey: "Analytics",
    applied: [
      "Associative data model exploration, KPI dashboards, and analytics applications.",
    ],
    complementary: "Power BI, SQL, Data Analytics",
  },
  {
    name: "AWS (Amazon Web Services)",
    pattern: /\b(?:aws|amazon[\s-_]*web[\s-_]*services)\b/i,
    category: "Cloud Computing Platform",
    competency: "Advanced knowledge of",
    specialtyKey: "Platforms",
    applied: [
      "Cloud platform knowledge for deploying web applications, cloud hosting, and compute/storage infrastructure.",
    ],
    complementary: "Python, Linux, Web Applications, Git",
  },
  {
    name: "ServiceNow",
    pattern: /\bservicenow\b/i,
    category: "Enterprise Cloud & Workflow Platform",
    competency: "Advanced knowledge of",
    specialtyKey: "Platforms",
    applied: [
      "Enterprise cloud workflow management and IT service management listed in CV.",
    ],
    complementary: "Enterprise Systems, Cloud Platforms",
  },
  {
    name: "Hostinger",
    pattern: /\bhostinger\b/i,
    category: "Web Hosting & Cloud Deployment",
    competency: "Skilled at",
    specialtyKey: "Platforms",
    applied: [
      "Production deployment and hosting for Inno-I Inventory Management System and Chhatrapati Shivray Mandal web platform.",
    ],
    complementary: "Git, GitHub, Web Hosting, DNS",
  },
  {
    name: "Git, GitHub & GitLab",
    pattern: /\b(?:git|github|gitlab|version[\s-_]*control)\b/i,
    category: "Version Control & Code Collaboration",
    competency: "Skilled at",
    specialtyKey: "Tools",
    applied: [
      "Daily version control, branching strategies, commits, pull requests, and team code reviews across all roles.",
      "Public GitHub profile: https://github.com/Adit-1716",
    ],
    complementary: "VS Code, Terminal, Git Flow",
  },
  {
    name: "Postman",
    pattern: /\bpostman\b/i,
    category: "API Testing & Development Tool",
    competency: "Skilled at",
    specialtyKey: "Tools",
    applied: [
      "REST API endpoint testing, HTTP method verification (GET/POST/PUT/DELETE), header validation, JSON payload inspection, and API debugging.",
    ],
    complementary: "REST APIs, Django, Flask, Node.js, JSON",
  },
  {
    name: "VS Code & Sublime Text",
    pattern: /\b(?:vs[\s-_]*code|visual[\s-_]*studio[\s-_]*code|sublime(?:\s*text)?)\b/i,
    category: "Code Editors & IDEs",
    competency: "Skilled at",
    specialtyKey: "Tools",
    applied: [
      "Primary code editing environments, terminal integration, debugging, and linting for Python, React, and SQL projects.",
    ],
    complementary: "Git, Extensions, Python, JavaScript",
  },
  {
    name: "Jupyter Notebook & Google Colab",
    pattern: /\b(?:jupyter(?:[\s-_]*notebook)?|google[\s-_]*colab|colab)\b/i,
    category: "Interactive Computing & Notebooks",
    competency: "Skilled at",
    specialtyKey: "Tools",
    applied: [
      "Data analysis pipelines, step-by-step code execution, and data validation with Pandas and NumPy.",
    ],
    complementary: "Python, Pandas, NumPy, Data Analytics",
  },
  {
    name: "Cursor AI, Claude Code & Copilot",
    pattern: /\b(?:cursor(?:\s*ai)?|claude(?:\s*code)?|copilot|ai[\s-_]*tools?)\b/i,
    category: "AI-Assisted Developer Productivity Tools",
    competency: "Advanced knowledge of",
    specialtyKey: "Tools",
    applied: [
      "AI-augmented engineering workflows for rapid code refactoring, test scaffolding, documentation, and architecture optimization.",
    ],
    complementary: "VS Code, Git, Full-Stack Architecture",
  },
];

export const unlistedTechPattern =
  /\b(docker|kubernetes|k8s|java\b|c\+\+|c#|\.net|php\b|ruby\b|golang\b|go\s*lang|rust\b|swift\b|kotlin\b|angular|vue(?:\.js)?|svelte|graphql|tableau|salesforce|terraform|ansible|jenkins|azure|gcp|google\s*cloud)\b/i;

export function portfolioText(element, selector) {
  const text = element?.querySelector(selector)?.innerText ?? "";
  return text.replace(/\s+/g, " ").trim();
}

export function portfolioExperience() {
  const items = [...document.querySelectorAll(".experience-item")];
  if (!items.length) {
    return [
      "1. Python Full Stack Developer at EPA Cybernest Solutions Pvt Ltd (09/2026 – Present, Hyderabad): Develop real-world applications using modern technologies; manage front-end & back-end with Python; database management, API integration, deployment & testing.",
      "2. Web Developer at Zidio Development company (12/2025 – 08/2026, Bangalore / Remote): Developed frontend with React.js, HTML, CSS, JavaScript, Tailwind CSS, and Bootstrap for responsive design.",
      "3. Junior Web Developer at Shri Channabasaveshwar Gurukul (04/2024 – 11/2025, Bidar): Built, updated, and maintained websites and web applications under senior guidance; code maintenance, debugging, testing, and team collaboration.",
    ];
  }

  return items.map((item, index) => {
    const [dates, location] = [...item.querySelectorAll(".experience-date span")]
      .map((span) => span.textContent.trim())
      .filter(Boolean);
    const details = [...item.querySelectorAll("li")]
      .map((detail) => detail.textContent.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join(" ");
    const experienceTitle = portfolioText(item, "h3");
    const company = portfolioText(item, ".experience-company");
    return `${index + 1}. ${experienceTitle} at ${company} (${dates ?? "Unknown period"}, ${location ?? "Unknown location"}): ${details}`;
  });
}
