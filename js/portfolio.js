const specialtyContent = {
  Languages: {
    symbol: "{ }",
    description: "Core programming and web markup languages verified in the CV.",
    tags: ["Python", "JavaScript (ES6+)", "HTML5", "CSS3", "SQL", "PL/SQL"],
  },
  Backend: {
    symbol: "API",
    description: "Backend frameworks, REST API architecture, and test automation from CV.",
    tags: [
      "Django",
      "Django REST Framework (DRF)",
      "FastAPI",
      "Flask",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Pytest",
    ],
  },
  Frontend: {
    symbol: "UI",
    description: "Frontend libraries, CSS frameworks, and responsive design from CV.",
    tags: [
      "React.js",
      "jQuery",
      "Bootstrap",
      "Tailwind CSS",
      "Bulma",
      "Foundation",
      "Responsive Web Design",
    ],
  },
  "Data Science": {
    symbol: "DS",
    description: "Python libraries for numerical computing, data analysis, and visualization.",
    tags: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
  },
  Databases: {
    symbol: "SQL",
    description: "Relational and document databases plus query languages from CV.",
    tags: ["MySQL", "PostgreSQL", "MongoDB", "SQL", "PL/SQL"],
  },
  Analytics: {
    symbol: "BI",
    description: "Business intelligence dashboards, web analytics, and spreadsheets from CV.",
    tags: [
      "Power BI",
      "Google Analytics",
      "Microsoft Excel",
      "Google Sheets",
      "Qlik Sense",
      "Qlik View",
    ],
  },
  Platforms: {
    symbol: "AWS",
    description: "Cloud infrastructure, containerization, CI/CD pipelines, and hosting from CV.",
    tags: [
      "AWS (EC2, S3, RDS, IAM)",
      "GCP",
      "Docker",
      "GitHub Actions CI/CD",
      "ServiceNow",
      "Hostinger",
    ],
  },
  Tools: {
    symbol: "DEV",
    description: "Version control, AI coding assistance, API testing, and IDE tools from CV.",
    tags: [
      "Git",
      "GitHub",
      "GitLab",
      "Cursor AI",
      "Claude Code",
      "GitHub Copilot",
      "Postman",
      "VS Code",
      "Sublime",
      "Google Colab",
      "Tag Manager",
    ],
  },
};

const skillAliases = {
  Languages: /\b(python|javascript|es6\+?|html5?|css3?|sql|pl\/sql|programming languages?)\b/,
  Backend: /\b(django|drf|django\s*rest\s*framework|fastapi|flask|node(?:\.js)?|express(?:\.js)?|rest|apis?|mern|pytest|backend)\b/,
  Frontend:
    /\b(react(?:\.js)?|jquery(?:\.js)?|bootstrap|tailwind|bulma|foundation|responsive web design|frontend|front-end|ui)\b/,
  "Data Science": /\b(pandas|numpy|matplotlib|seaborn|data science|data scientist)\b/,
  Databases: /\b(mysql|postgres(?:ql)?|mongodb|mongo|sql|pl\/sql|database)s?\b/,
  Analytics:
    /\b(analytics|analyst|analysis|excel|sheets|power bi|qlik(?: sense|view)?|google analytics|bi tools?)\b/,
  Platforms: /\b(aws|amazon web services|gcp|google cloud|docker|ci\/cd|github actions|servicenow|hostinger|cloud|platforms?)\b/,
  Tools:
    /\b(vs code|visual studio code|sublime|jupyter|colab|postman|git|github|gitlab|cursor|claude code|copilot|tag manager|ai tools?|developer tools?)\b/,
};

const specialties = Object.keys(specialtyContent);
const projectCards = [...document.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const mapNodes = [...document.querySelectorAll(".map-node")];
const skillMapCanvas = document.querySelector("#skill-map-canvas");
const skillGraph = document.querySelector("#skill-graph");
const skillGraphHub = document.querySelector("#skill-graph-hub");
const skillGraphNodes = document.querySelector("#skill-graph-nodes");
const projectCount = document.querySelector("#project-count");
const emptyState = document.querySelector("#empty-state");
let activeFilter = "All";
let activeSpecialty = "Languages";

function projectHasDiscipline(card, discipline) {
  const token = discipline.replace(/\s+/g, "-");
  return card.dataset.disciplines.split(" ").includes(token);
}

function setFilter(filter) {
  activeFilter = filter;
  if (filter === "All" || !specialtyContent[filter]) showSkillMapOverview();
  let visibleCount = 0;

  for (const card of projectCards) {
    const matches = filter === "All" || projectHasDiscipline(card, filter);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  }

  for (const button of filterButtons) {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }

  projectCount.textContent = `${String(visibleCount).padStart(2, "0")} PROJECT${visibleCount === 1 ? "" : "S"}`;
  emptyState.hidden = visibleCount > 0;
}

function selectSpecialty(specialty, scrollToWork = false) {
  const content = specialtyContent[specialty];
  if (!content) return;
  activeSpecialty = specialty;

  document.querySelector("#lens-symbol").textContent = content.symbol;
  document.querySelector("#lens-title").textContent = specialty;
  document.querySelector("#lens-description").textContent = content.description;
  renderSkillTags(content.tags);
  renderSkillGraph(specialty, content.tags);

  for (const node of mapNodes) {
    const selected = node.dataset.specialty === specialty;
    node.classList.toggle("is-selected", selected);
    node.setAttribute("aria-pressed", String(selected));
  }

  setFilter(specialty);
  if (scrollToWork)
    document.querySelector("#work").scrollIntoView({ behavior: "smooth" });
}

function renderSkillTags(tags) {
  const tagList = document.querySelector("#lens-tags");
  tagList.replaceChildren(
    ...tags.map((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      return chip;
    }),
  );
}

function renderSkillGraph(specialty, skills) {
  skillMapCanvas.classList.add("is-detail-view");
  skillGraph.hidden = false;
  skillGraphHub.textContent = specialty;
  skillGraphHub.id = "skill-graph-hub";
  skillGraphNodes.setAttribute("role", "list");
  skillGraphNodes.replaceChildren(
    ...skills.map((skill) => {
      const node = document.createElement("div");
      node.className = "skill-graph-node";
      node.setAttribute("role", "listitem");

      const label = document.createElement("span");
      label.textContent = skill;
      node.append(label);
      return node;
    }),
  );
}

function showSkillMapOverview() {
  if (!skillMapCanvas || !skillGraph) return;
  skillMapCanvas.classList.remove("is-detail-view");
  skillGraph.hidden = true;
}

document.querySelector("#skill-graph-back").addEventListener("click", () => {
  showSkillMapOverview();
  mapNodes.find((node) => node.classList.contains("is-selected"))?.focus();
});

for (const node of mapNodes) {
  node.addEventListener("click", () => selectSpecialty(node.dataset.specialty));
}

function moveSpecialty(step) {
  const currentIndex = specialties.indexOf(activeSpecialty);
  const nextIndex =
    (currentIndex + step + specialties.length) % specialties.length;
  selectSpecialty(specialties[nextIndex]);
}

document
  .querySelector("#skill-previous")
  .addEventListener("click", () => moveSpecialty(-1));
document
  .querySelector("#skill-next")
  .addEventListener("click", () => moveSpecialty(1));

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    if (specialtyContent[filter]) selectSpecialty(filter);
    else setFilter(filter);
  });
}

document.querySelector("#lens-work-link").addEventListener("click", () => {
  if (activeFilter === "All") setFilter("Languages");
  document.querySelector("#work").scrollIntoView({ behavior: "smooth" });
});

const guideForm = document.querySelector("#portfolio-guide");
const guideInput = document.querySelector("#ai-prompt");
const guideResponse = document.querySelector("#ai-response");

const candidateInfo = {
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

function portfolioText(element, selector) {
  const text = element?.querySelector(selector)?.innerText ?? "";
  return text.replace(/\s+/g, " ").trim();
}

function portfolioExperience() {
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

const hrCoreCompetencies = {
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

const hrToolsDatabase = [
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
  {
    name: "FastAPI",
    pattern: /\bfastapi\b/i,
    category: "Python High-Performance Web Framework",
    competency: "Proficiency in",
    specialtyKey: "Backend",
    applied: [
      "Technical Skills in CV: High-performance asynchronous REST API development, type hints, and OpenAPI validation in Python.",
    ],
    complementary: "Python, REST APIs, PostgreSQL, Docker, Postman",
  },
  {
    name: "Django REST Framework (DRF)",
    pattern: /\b(?:drf|django\s*rest\s*framework)\b/i,
    category: "Web Technologies & REST API Framework",
    competency: "Expertise in",
    specialtyKey: "Backend",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd: Built and integrated 15 REST APIs for B2B inventory management SaaS, cutting manual reporting processes by 60%.",
    ],
    complementary: "Django, Python, PostgreSQL, REST APIs, Postman",
  },
  {
    name: "Express.js",
    pattern: /\bexpress(?:\.js)?\b/i,
    category: "Backend Web Framework (Node.js)",
    competency: "Skilled at",
    specialtyKey: "Backend",
    applied: [
      "Inno-I Inventory Management System: Designed 15+ REST endpoints with Node.js and Express for managing products, suppliers, and stock levels.",
    ],
    complementary: "Node.js, JavaScript, MySQL, REST APIs",
  },
  {
    name: "Pytest",
    pattern: /\bpytest\b/i,
    category: "Python Test Automation Framework",
    competency: "Skilled at",
    specialtyKey: "Backend",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd: Wrote Pytest test suites covering 90% of core modules, significantly reducing post-release bugs.",
    ],
    complementary: "Python, Django, FastAPI, CI/CD",
  },
  {
    name: "Docker",
    pattern: /\bdocker\b/i,
    category: "Containerization & DevOps",
    competency: "Skilled at",
    specialtyKey: "Platforms",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd: Containerized applications with Docker and deployed to AWS via GitHub Actions CI/CD pipelines, cutting deployment time from 30 minutes to 4 minutes.",
    ],
    complementary: "AWS, GitHub Actions, Linux, Python",
  },
  {
    name: "GitHub Actions & CI/CD",
    pattern: /\b(?:ci[\s/-]*cd|github[\s-_]*actions)\b/i,
    category: "DevOps & Continuous Integration / Deployment",
    competency: "Skilled at",
    specialtyKey: "Platforms",
    applied: [
      "EPA Cybernest Solutions Pvt Ltd: Automated deployment pipelines to AWS with GitHub Actions CI/CD, reducing deployment duration by 86%.",
    ],
    complementary: "Docker, AWS, Git, GitHub",
  },
  {
    name: "GCP (Google Cloud Platform)",
    pattern: /\b(?:gcp|google[\s-_]*cloud(?:[\s-_]*platform)?)\b/i,
    category: "Cloud Computing Platform",
    competency: "Advanced knowledge of",
    specialtyKey: "Platforms",
    applied: [
      "Technical Skills in CV: Cloud computing, storage, compute resources, and cloud integrations alongside AWS.",
    ],
    complementary: "AWS, Docker, Linux, Python",
  },
  {
    name: "Google Analytics",
    pattern: /\bgoogle[\s-_]*analytics\b/i,
    category: "BI & Web Traffic Analytics",
    competency: "Advanced knowledge of",
    specialtyKey: "Analytics",
    applied: [
      "Technical Skills in CV: Tracking user traffic, conversion funnels, visitor KPIs, and engagement metrics.",
    ],
    complementary: "Google Tag Manager, Power BI, Web Design",
  },
  {
    name: "Tag Manager (Google Tag Manager)",
    pattern: /\b(?:tag[\s-_]*manager|gtm)\b/i,
    category: "Web & Event Tracking Management",
    competency: "Skilled at",
    specialtyKey: "Tools",
    applied: [
      "Technical Skills in CV: Tag deployment, event trigger management, and analytics script coordination.",
    ],
    complementary: "Google Analytics, JavaScript, HTML5",
  },
];

function runPortfolioAgent(question) {
  const rawQuestion = (question ?? "").trim();
  const cleanQuestion = rawQuestion.replace(/^[\s•*–—\->#.]+/g, "").trim();
  const normalizedQuestion = cleanQuestion.toLowerCase();
  const hasIntent = (pattern) => pattern.test(normalizedQuestion);

  const contactSection = document.querySelector("#contact");
  const experienceSection = document.querySelector("#experience");
  const educationSection = document.querySelector("#education");
  const workSection = document.querySelector("#work");
  const atlasSection = document.querySelector("#atlas");
  const aboutSection = document.querySelector("#about");
  const aiSection = document.querySelector("#ai");

  // --- Candidate Name and Profile Intent Detection ---
  const matchesFirstName = /\b(first[\s-_]*name|firstname|given[\s-_]*name)\b/.test(normalizedQuestion);
  const matchesLastName = /\b(last[\s-_]*name|lastname|surname|family[\s-_]*name)\b/.test(normalizedQuestion);
  const matchesMiddleName = /\b(middle[\s-_]*name|middlename|middle[\s-_]*initial|middleinitial)\b/.test(normalizedQuestion);
  const matchesFullName = /\b(full[\s-_]*name|fullname|complete[\s-_]*name)\b/.test(normalizedQuestion);
  const matchesCandidateProfile =
    /\b(candidate[\s-_]*profile|candidate[\s-_]*summary|candidate[\s-_]*overview|professional[\s-_]*summary)\b/.test(
      normalizedQuestion,
    );

  // --- Recruitment, Talent Pool & Selection Inquiries ---
  const matchesApplicant =
    /\b(applicant[\s-_]*names?|list of applicants?|applicants? list|applicants?)\b/.test(
      normalizedQuestion,
    );
  const matchesNominee =
    /\b(nominees?|list of nominees?|nominees? list|nomination)\b/.test(
      normalizedQuestion,
    );
  const matchesRoster =
    /\b(roster of candidates?|candidate list|candidate roster|roster|list of candidates?)\b/.test(
      normalizedQuestion,
    );
  const matchesShortlist =
    /\b(short[\s-_]*lists?|short[\s-_]*listed|short[\s-_]*listing)\b/.test(
      normalizedQuestion,
    );
  const matchesTalentPool =
    /\b(talent[\s-_]*pools?|talent pool)\b/.test(normalizedQuestion);
  const matchesJobSeeker =
    /\b(job[\s-_]*seekers?|job[\s-_]*seeking)\b/.test(normalizedQuestion);
  const matchesAspirantContender =
    /\b(aspirants?|contenders?)\b/.test(normalizedQuestion);

  // If multiple recruitment / candidate attributes are requested in one prompt
  const identityMatchCount = [
    matchesFirstName,
    matchesLastName,
    matchesMiddleName,
    matchesFullName,
    matchesCandidateProfile,
  ].filter(Boolean).length;

  const recruitmentMatches = [
    matchesApplicant,
    matchesNominee,
    matchesRoster,
    matchesShortlist,
    matchesTalentPool,
    matchesJobSeeker,
    matchesAspirantContender,
  ].filter(Boolean).length;

  if (recruitmentMatches >= 2 || (identityMatchCount >= 1 && recruitmentMatches >= 1)) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "RECRUITMENT & CANDIDATE DOSSIER",
      answer: `• Applicant Name / List of Applicants: ${candidateInfo.fullName} (sole applicant represented on this portfolio).
• Nominee / List of Nominees: ${candidateInfo.fullName} (Nominated for Full-Stack Developer, Python, and Web roles).
• Roster of Candidates / Candidate List: 1. ${candidateInfo.fullName} — Full-Stack Developer (Python / React / Django / SQL / Data Tools).
• Shortlist: Recommended for technical shortlist based on end-to-end full-stack development, modern UI, APIs, and data solutions.
• Talent Pool: Python Engineering, Full-Stack Web Development, Data Science & Analytics.
• Job Seeker: ${candidateInfo.fullName} — Actively open to full-stack, backend, frontend, and Python software developer roles.
• Aspirant / Contender: ${candidateInfo.fullName} — High-potential contender dedicated to scalable web and data systems.`,
    };
  }

  if (identityMatchCount >= 2) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "CANDIDATE DETAILS & IDENTITY",
      answer: `• First Name: ${candidateInfo.firstName}
• Middle Name / Middle Initial: ${candidateInfo.middleName}
• Last Name: ${candidateInfo.lastName}
• Full Name: ${candidateInfo.fullName}
• Candidate Profile: ${candidateInfo.role} (${candidateInfo.summary})`,
    };
  }

  // 1. Middle Name / Middle Initial
  if (matchesMiddleName) {
    return {
      action: "CANDIDATE MIDDLE NAME",
      answer: `• Middle Name / Middle Initial: ${candidateInfo.middleName}\n(Full Name: Aditya Ganesh Kadepure).`,
    };
  }

  // 2. First Name
  if (matchesFirstName) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "CANDIDATE FIRST NAME",
      answer: `• First Name: ${candidateInfo.firstName}\n(Full Name: ${candidateInfo.fullName} · Full-Stack Developer).`,
    };
  }

  // 3. Last Name
  if (matchesLastName) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "CANDIDATE LAST NAME",
      answer: `• Last Name: ${candidateInfo.lastName}\n(Surname / Family Name: ${candidateInfo.lastName}).`,
    };
  }

  // 4. Full Name
  if (matchesFullName) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "CANDIDATE FULL NAME",
      answer: `• Full Name: ${candidateInfo.fullName}\n(First Name: ${candidateInfo.firstName}, Last Name: ${candidateInfo.lastName}).`,
    };
  }

  // 5. Employee Number / ID Inquiry
  const matchesEmployeeId =
    /\b(employee[\s-_]*(?:number|no\.?|id|code)|candidate[\s-_]*(?:id|number|no\.?|code)|applicant[\s-_]*(?:id|number|no\.?)|emp[\s-_]*(?:id|no\.?|number)|portfolio[\s-_]*id|id[\s-_]*number|employee\s*(?:\/|or)\s*id|employee\s*id|adit-?1716)\b/i.test(
      normalizedQuestion,
    ) || /\b(?:your|his|the|candidate\'?s?|employee\'?s?)?\s*id\b/i.test(cleanQuestion);

  if (matchesEmployeeId) {
    return {
      action: "EMPLOYEE ID NOT APPLICABLE",
      answer:
        "Employee ID is not listed or applicable on this portfolio. Aditya Kadepure is an independent full-stack developer and candidate, so no corporate or employee identification number is used.",
    };
  }

  // 6. Applicant Name / List of Applicants
  if (matchesApplicant) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "APPLICANT INFORMATION",
      answer: `• Applicant Name: ${candidateInfo.fullName}
• Target Role: ${candidateInfo.role}
• List of Applicants: ${candidateInfo.fullName} is the sole applicant and candidate represented on this portfolio website.
• Status: Available for hire / Active applicant
• Contact: ${candidateInfo.email} | ${candidateInfo.phone} | ${candidateInfo.location}`,
    };
  }

  // 7. Nominee / List of Nominees
  if (matchesNominee) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "NOMINEE DETAILS",
      answer: `• Nominee: ${candidateInfo.fullName}
• Discipline: ${candidateInfo.role} (Python, Web Technologies & Data Tools)
• List of Nominees: ${candidateInfo.fullName} is the primary candidate nominated for software engineering and full-stack positions.
• Current Position: ${candidateInfo.currentRole}`,
    };
  }

  // 8. Roster of Candidates / Candidate List
  if (matchesRoster) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "CANDIDATE ROSTER",
      answer: `• Roster of Candidates / Candidate List:
  1. ${candidateInfo.fullName}
     - Role: ${candidateInfo.role}
     - Core Stack: Python, JavaScript, React.js, Django, Flask, Node.js, SQL, REST APIs
     - Location: ${candidateInfo.location}
     - Availability: Actively open to new software development roles.
(This personal portfolio website represents Aditya Kadepure as the sole candidate on this roster).`,
    };
  }

  // 9. Shortlist Evaluation
  if (matchesShortlist) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "SHORTLIST EVALUATION",
      answer: `• Candidate for Shortlist: ${candidateInfo.fullName}
• Shortlist Evaluation Highlights:
  - Full-stack web application development with Python, React.js, Django, Flask, Node.js, and REST APIs.
  - Database management across MySQL, PostgreSQL, MongoDB, and SQL.
  - Proven live projects: Inno-I (Inventory Management System) and Chhatrapati Shivray Marathi Sahitya Mandal web platform.
  - Education: BCA (Bachelor of Computer Applications), 2023–2026.
  - Experience: Python Full Stack Developer at EPA Cybernest Solutions Pvt Ltd; Web Developer at Zidio Development; Junior Web Developer at Gurukul.
• Verdict: Recommended for Shortlist in Full-Stack, Python, and Web Development positions.`,
    };
  }

  // 10. Talent Pool Classification
  if (matchesTalentPool) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "TALENT POOL CLASSIFICATION",
      answer: `• Talent Pool Category: Full-Stack Engineering, Python Web Development & Data Analytics
• Candidate: ${candidateInfo.fullName}
• Core Competencies:
  - Languages: Python, JavaScript (ES6+), HTML5, CSS3, SQL
  - Frameworks: React.js, Django, Flask, Node.js, Bootstrap, Tailwind CSS
  - Data & Analytics: Pandas, NumPy, Power BI, Excel
  - Cloud & Tools: AWS, Git, GitHub, VS Code, Postman
• Pool Status: Pre-vetted, active developer profile ready for technical evaluation.`,
    };
  }

  // 11. Job Seeker Profile
  if (matchesJobSeeker) {
    contactSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "JOB SEEKER PROFILE",
      answer: `• Job Seeker: ${candidateInfo.fullName}
• Seeking Roles: Full-Stack Developer / Python Developer / Frontend Developer / Web Developer
• Preferred Location: ${candidateInfo.location} / Remote / Hybrid
• Current Status: Actively exploring software engineering opportunities.
• Direct Contact: ${candidateInfo.email} | ${candidateInfo.phone}`,
    };
  }

  // 12. Aspirant / Contender
  if (matchesAspirantContender) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "ASPIRANT / CONTENDER PROFILE",
      answer: `• Aspirant / Contender: ${candidateInfo.fullName}
• Career Aspiration: Python Full-Stack Developer dedicated to building scalable web applications, modern user interfaces, and data-driven systems.
• Competitive Edge: Hands-on development experience across the complete application lifecycle (UI design, backend services, REST APIs, databases, testing, and deployment).`,
    };
  }

  // 13. Candidate Profile / Summary
  if (
    matchesCandidateProfile ||
    hasIntent(
      /\b(who is aditya|who are you|about (?:aditya|the candidate|yourself)|profile|introduction|bio|overview)\b/,
    )
  ) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "CANDIDATE PROFILE",
      answer: `• Candidate Profile: ${candidateInfo.fullName}
• Role: ${candidateInfo.role}
• Location: ${candidateInfo.location}
• Summary: ${candidateInfo.summary}
• Education: ${candidateInfo.education}
• Current Position: ${candidateInfo.currentRole}
• Contact: ${candidateInfo.email} | ${candidateInfo.phone} | GitHub: github.com/Adit-1716`,
    };
  }

  // 14. General Name
  if (hasIntent(/\b(name)\b/)) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "CANDIDATE FULL NAME",
      answer: `• Full Name: ${candidateInfo.fullName}\n• First Name: ${candidateInfo.firstName}\n• Last Name: ${candidateInfo.lastName}\n• Middle Name: ${candidateInfo.middleName}`,
    };
  }

  // 15. Greetings & Agent Help
  if (hasIntent(/^(hi|hello|hey|greetings|good (morning|afternoon|evening)|help)\b/)) {
    return {
      action: "PORTFOLIO GUIDE / READY",
      answer: `Hello! I am Aditya Kadepure's Portfolio Guide, trained exclusively on the contents of this portfolio website.\n\nYou can ask me directly about:\n• Core Competencies ("Expertise in", "Proficiency in", "Skilled at", "Advanced knowledge of")\n• Exact Tool Names, Programming Languages & Technical Frameworks\n• First Name, Last Name, Middle Name, Full Name\n• Candidate Profile, Shortlist, Talent Pool & Candidate Roster\n• Job Seeker Status & Career Aspirations\n• Selected Projects (Inno-I, Chhatrapati Shivray Mandal)\n• Professional Work Experience & Education (BCA)\n• Contact Details & Location\n\nHow can I help you explore Aditya's portfolio?`,
    };
  }

  // 9. Contact Details
  if (
    hasIntent(
      /\b(contact|talk|hire|email|phone|call|reach out|get in touch|location|city|address|where (?:do you|does aditya) live|where are you located|github)\b/,
    )
  ) {
    contactSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED CONTACT",
      answer: `Aditya Kadepure's Contact & Location Details:
• Email: ${candidateInfo.email}
• Phone: ${candidateInfo.phone}
• Location: ${candidateInfo.location}
• GitHub: ${candidateInfo.github}`,
    };
  }

  // 10. Resume / CV
  if (hasIntent(/\b(resume|cv|curriculum vitae|download)\b/)) {
    return {
      action: "DOWNLOAD CV / RESUME",
      answer:
        "You can download Aditya Kadepure's official resume & CV directly from this website using the 'Download resume & CV' button or via the file: assets/documents/ADITYA_KADEPURE_CV.pdf.",
    };
  }

  // 11. Experience & Employment
  if (
    hasIntent(
      /\b(experience|employment|career|work history|job|jobs|company|companies|work experience)\b/,
    )
  ) {
    experienceSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED EXPERIENCE",
      answer: `Aditya Kadepure's Professional Work Experience:\n${portfolioExperience().join("\n")}`,
    };
  }

  // 12. Education & Academics
  if (
    hasIntent(
      /\b(education|degree|college|university|bca|graduation|qualification|academics|study|studied|school)\b/,
    )
  ) {
    educationSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED EDUCATION",
      answer: `Aditya Kadepure's Education:
• Degree: Bachelor of Computer Applications (BCA)
• Institution: S.S.K. Basaveshwar UG & PG College
• Affiliation: Bidar University
• Location: Basavakalyan - 585327
• Duration: 08/2023 – 09/2026`,
    };
  }

  // 13. Specific Projects
  const asksAboutInno = /\binno.?i\b|inventory|overstock|stock management/.test(
    normalizedQuestion,
  );
  const asksAboutCommunityProject =
    /chhatrapati|shivray|marathi|sahitya|sanskriti|mandal|donation/.test(
      normalizedQuestion,
    );
  const projectMatches = projectCards.filter((card) => {
    const title = portfolioText(card, "h3").toLowerCase();
    if (asksAboutInno) return /inno.?i|inventory/.test(title);
    if (asksAboutCommunityProject) {
      return /chhatrapati|shivray|marathi|sahitya|mandal/.test(title);
    }
    return true;
  });

  if (asksAboutInno) {
    workSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED PROJECT DETAILS",
      answer:
        "Inno-I (Inventory Management System):\nDeveloped an inventory management system to prevent overstocking, reduce waste and losses, improve inventory accuracy, minimize stock losses, and enhance cash flow.\nTechnologies: HTML5, CSS3, JavaScript, Bootstrap, Hostinger, Git, and GitHub.",
    };
  }

  if (asksAboutCommunityProject) {
    workSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED PROJECT DETAILS",
      answer:
        "Chhatrapati Shivray Marathi Sahitya Sanskriti Mandal:\nDeveloped and deployed a responsive community website to support marketing, individual donations, digital presence, and organizational growth.\nTechnologies: HTML5, CSS3, JavaScript, Bootstrap, Hostinger, Git, and GitHub.",
    };
  }

  // 14. External coding request redirection (redirect to portfolio work)
  if (
    hasIntent(
      /\b(write|create|generate|implement|solve|run|execute)\s+(?:\w+\s+){0,3}(?:code|script|program|function|algorithm|query|problem)\b/,
    ) ||
    hasIntent(/\b(bubble sort|binary search|reverse string|fibonacci|leetcode)\b/)
  ) {
    return {
      action: "PORTFOLIO CODE REFERENCE",
      answer: `Aditya is an experienced Python Full-Stack Developer who builds production applications with Python, Django, Flask, React, and SQL. You can view his implementation work in the Selected Projects section (Inno-I, Chhatrapati Mandal) or inspect his GitHub repositories at https://github.com/Adit-1716. As a portfolio agent, I only answer questions regarding Aditya's portfolio and qualifications.`,
    };
  }

  // --- HR & Recruiter Technical Screening & Competency Matching ---

  // A. Core Competencies Matrix & Tiers
  const matchesCoreCompetencies =
    /\b(core[\s-_]*competenc(?:ies|y)|competenc(?:ies|y)|key[\s-_]*competenc(?:ies|y)|competency[\s-_]*matrix)\b/i.test(
      normalizedQuestion,
    );
  const matchesExpertiseIn = /\bexpertise\s+in\b/i.test(normalizedQuestion);
  const matchesProficiencyIn = /\bproficiency\s+in\b/i.test(normalizedQuestion);
  const matchesSkilledAt = /\bskilled\s+at\b/i.test(normalizedQuestion);
  const matchesAdvancedKnowledge =
    /\badvanced\s+knowledge(?:\s+of)?\b/i.test(normalizedQuestion);

  if (
    matchesCoreCompetencies ||
    matchesExpertiseIn ||
    matchesProficiencyIn ||
    matchesSkilledAt ||
    matchesAdvancedKnowledge
  ) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });

    if (matchesExpertiseIn && !matchesCoreCompetencies) {
      return {
        action: "HR / CORE COMPETENCIES (EXPERTISE IN)",
        answer: `Aditya Kadepure — Core Competencies ("Expertise in"):
${hrCoreCompetencies.expertiseIn.map((item) => `• ${item}`).join("\n")}

(Verified across production applications at EPA Cybernest Solutions, live Inno-I system, and full-stack web builds).`,
      };
    }
    if (matchesProficiencyIn && !matchesCoreCompetencies) {
      return {
        action: "HR / CORE COMPETENCIES (PROFICIENCY IN)",
        answer: `Aditya Kadepure — Core Competencies ("Proficiency in"):
${hrCoreCompetencies.proficiencyIn.map((item) => `• ${item}`).join("\n")}

(Demonstrated across React.js frontends at Zidio Development and Django/SQL backends).`,
      };
    }
    if (matchesSkilledAt && !matchesCoreCompetencies) {
      return {
        action: "HR / CORE COMPETENCIES (SKILLED AT)",
        answer: `Aditya Kadepure — Core Competencies ("Skilled at"):
${hrCoreCompetencies.skilledAt.map((item) => `• ${item}`).join("\n")}

(Applied in Node.js/Prisma backend logic for Inno-I, Tailwind/Bootstrap UIs, and Pandas/NumPy data processing).`,
      };
    }
    if (matchesAdvancedKnowledge && !matchesCoreCompetencies) {
      return {
        action: "HR / CORE COMPETENCIES (ADVANCED KNOWLEDGE OF)",
        answer: `Aditya Kadepure — Core Competencies ("Advanced knowledge of"):
${hrCoreCompetencies.advancedKnowledgeOf.map((item) => `• ${item}`).join("\n")}

(Applied across complete software delivery, Power BI reporting, and AWS/Hostinger deployments).`,
      };
    }

    return {
      action: "HR / CORE COMPETENCIES MATRIX",
      answer: `Aditya Kadepure — Core Technical Competencies (HR & Recruiter Matrix):

• Expertise in:
${hrCoreCompetencies.expertiseIn.map((item) => `  - ${item}`).join("\n")}

• Proficiency in:
${hrCoreCompetencies.proficiencyIn.map((item) => `  - ${item}`).join("\n")}

• Skilled at:
${hrCoreCompetencies.skilledAt.map((item) => `  - ${item}`).join("\n")}

• Advanced knowledge of:
${hrCoreCompetencies.advancedKnowledgeOf.map((item) => `  - ${item}`).join("\n")}

(All competencies are grounded in Aditya's production work at EPA Cybernest, Zidio Development, and live projects).`,
    };
  }

  // B. Technical Frameworks Query
  const matchesTechnicalFrameworks =
    /\b(technical[\s-_]*frameworks?|web[\s-_]*frameworks?|backend[\s-_]*frameworks?|frontend[\s-_]*frameworks?|frameworks?\s*(?:used|known|required|list)|what\s+frameworks|which\s+frameworks)\b/i.test(
      normalizedQuestion,
    );

  if (matchesTechnicalFrameworks) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    selectSpecialty("Backend");
    return {
      action: "HR / TECHNICAL FRAMEWORKS",
      answer: `Aditya Kadepure — Verified Technical Frameworks (HR Reference):

• Backend Web Frameworks:
  - Django (Proficiency in): High-level Python framework for scalable, secure backend systems & REST APIs.
  - Flask (Skilled at): Modular Python micro-framework for microservices and lightweight APIs.
  - Node.js & Express (Skilled at): Asynchronous JavaScript runtime for server-side logic and RESTful services.
  - Prisma ORM (Skilled at): Schema modeling, migrations, and type-safe database access used in Inno-I.

• Frontend & UI Frameworks:
  - React.js (Proficiency in): Component-driven SPA architecture, interactive state management, and modern hooks.
  - Tailwind CSS (Skilled at): Utility-first styling for custom responsive web layouts.
  - Bootstrap (Skilled at): Responsive grid system, UI components, and cross-browser styling.
  - Bulma & Foundation CSS (Skilled at): Flexbox-based responsive interfaces.
  - jQuery.js (Skilled at): DOM manipulation and web application maintenance.

• API & Architecture:
  - RESTful APIs (Expertise in): End-to-end design, HTTP status codes, JSON exchange, and integration.
  - MERN Stack (Skilled at): Full-stack JavaScript development combining MongoDB, Express, React, and Node.js.`,
    };
  }

  // C. Programming Languages Query
  const matchesProgrammingLanguages =
    /\b(programming[\s-_]*languages?|coding[\s-_]*languages?|languages?\s*(?:known|used|required|list)|what\s+languages|which\s+languages)\b/i.test(
      normalizedQuestion,
    );

  if (matchesProgrammingLanguages) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    selectSpecialty("Languages");
    return {
      action: "HR / PROGRAMMING LANGUAGES",
      answer: `Aditya Kadepure — Verified Programming Languages (HR Reference):

• Python (Expertise in): Primary language for Full-Stack development, backend services at EPA Cybernest Solutions, and Data Science (Pandas/NumPy).
• JavaScript / ES6+ (Proficiency in): Dynamic frontend logic (React.js), backend scripts (Node.js), and interactive web components.
• SQL & PL/SQL (Proficiency in): Relational database queries, schema design, transactions, and indexing across MySQL & PostgreSQL.
• HTML5 (Expertise in): Semantic markup, web accessibility, and structured document standards.
• CSS3 (Expertise in): Flexbox, CSS Grid, media queries, animations, and responsive mobile-first styling.`,
    };
  }

  // D. Developer Tools & Exact Tool Names Query
  const matchesExactTools =
    /\b(exact[\s-_]*tool[\s-_]*names?|developer[\s-_]*tools?|tools?\s*(?:used|required|stack|list)|what\s+tools|which\s+tools|tools?\s*(?:and|&)\s*platforms?)\b/i.test(
      normalizedQuestion,
    );

  if (matchesExactTools) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    selectSpecialty("Tools");
    return {
      action: "HR / DEVELOPER TOOLS & PLATFORMS",
      answer: `Aditya Kadepure — Verified Developer Tools & Platforms (HR Reference):

• Version Control & Collaboration: Git, GitHub, GitLab (Daily commits, branching, PRs, code reviews; profile: https://github.com/Adit-1716).
• API Testing & Development: Postman (Endpoint verification, headers, JSON payloads, environment variables).
• Code Editors & IDEs: VS Code (Visual Studio Code), Sublime Text.
• Interactive Computing & Notebooks: Jupyter Notebook, Google Colab (Data exploration with Pandas/NumPy).
• Cloud & Hosting Platforms: AWS (Cloud deployment & hosting), ServiceNow (Enterprise platform), Hostinger (Production deployment for Inno-I and Chhatrapati Trust).
• Database Tools: MySQL Workbench, pgAdmin, MongoDB Compass.
• AI-Assisted Developer Tooling: Cursor AI, Claude Code, GitHub Copilot (Workflow acceleration, code refactoring, test drafting).`,
    };
  }

  // E. HR Screening & Job Requirements Match
  const matchesHrScreening =
    /\b(hr[\s-_]*(?:search|screening|vetting|inquiry)|skills?[\s-_]*required(?:\s+for\s+the\s+job)?|job[\s-_]*requirements?|tech(?:nical)?[\s-_]*stack[\s-_]*(?:match|requirements?)|skills?[\s-_]*match|hiring[\s-_]*requirements?)\b/i.test(
      normalizedQuestion,
    );

  if (matchesHrScreening) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "HR / JOB REQUIREMENTS MATCH",
      answer: `Aditya Kadepure — HR Screening & Technical Match Summary:

• Candidate: Aditya Kadepure
• Target Roles: Python Full-Stack Developer / Backend Developer / Frontend Developer (React)
• Status: Available for hire / Active applicant (${candidateInfo.location} · Remote / Hybrid)

• Core Competencies Breakdown:
  - Expertise in: Python Full-Stack Development, RESTful API Architecture, Responsive Web Design.
  - Proficiency in: React.js, Django, Flask, SQL & Relational Databases (MySQL, PostgreSQL), JavaScript (ES6+), HTML5/CSS3.
  - Skilled at: Node.js/Express, Tailwind CSS, Bootstrap, Pandas, NumPy, MongoDB, Git/GitHub, Postman, Prisma ORM.
  - Advanced knowledge of: Web Application Lifecycle, Database Schema Design, Power BI/Excel BI, AWS Cloud, AI Developer Tools (Cursor/Copilot).

• Verified Experience:
  - Python Full Stack Developer at EPA Cybernest Solutions Pvt Ltd (09/2026 – Present, Hyderabad)
  - Web Developer at Zidio Development Company (12/2025 – 08/2026, Bangalore / Remote)
  - Junior Web Developer at Shri Channabasaveshwar Gurukul (04/2024 – 11/2025, Bidar)

• Contact for HR / Interview Scheduling: ${candidateInfo.email} | ${candidateInfo.phone}`,
    };
  }

  // F. Unlisted Technology Inquiries (Provide clear recruiter verification)
  const unlistedMatch = normalizedQuestion.match(
    /\b(kubernetes|k8s|java\b|c\+\+|c#|\.net|php\b|ruby\b|golang\b|go\s*lang|rust\b|swift\b|kotlin\b|angular|vue(?:\.js)?|svelte|graphql|tableau|salesforce|terraform|ansible|jenkins|azure)\b/i,
  );

  if (unlistedMatch) {
    const unlistedToolName = unlistedMatch[0].toUpperCase();
    return {
      action: "HR / SKILL VERIFICATION NOTICE",
      answer: `HR Skill Verification Assessment:

• Tool Queried: ${unlistedToolName}
• Verification Status: NOT listed on Aditya Kadepure's official portfolio or CV records.

• Verified Core Tech Stack:
  - Programming Languages: Python, JavaScript (ES6+), HTML5, CSS3, SQL, PL/SQL
  - Technical Frameworks: React.js, Django, Flask, Node.js, Express, REST APIs, Tailwind CSS, Bootstrap, Prisma ORM
  - Databases: MySQL, PostgreSQL, MongoDB
  - Analytics & Cloud: Power BI, Pandas, NumPy, AWS, ServiceNow, Hostinger
  - Developer Tools: Git, GitHub, GitLab, Postman, VS Code, Jupyter Notebook

• Recruiter Note: Aditya has strong software engineering fundamentals and picks up complementary tools quickly based on team and stack requirements.`,
    };
  }

  // G. Exact Individual Tool / Framework / Language Search (HR Matcher)
  const matchedTool = hrToolsDatabase.find((tool) =>
    tool.pattern.test(normalizedQuestion),
  );

  if (matchedTool) {
    if (matchedTool.specialtyKey) {
      selectSpecialty(matchedTool.specialtyKey);
      atlasSection?.scrollIntoView({ behavior: "smooth" });
    }
    return {
      action: `HR / VERIFIED TOOL (${matchedTool.name.toUpperCase()})`,
      answer: `HR Skill Verification — ${matchedTool.name}:

• Exact Tool / Framework: ${matchedTool.name}
• Category: ${matchedTool.category}
• Competency Rating: "${matchedTool.competency}"
• Verification Status: VERIFIED IN PORTFOLIO & CV

• Where Applied in Experience & Projects:
${matchedTool.applied.map((bullet) => `  - ${bullet}`).join("\n")}

• Complementary Tech Stack: ${matchedTool.complementary}
• Candidate: ${candidateInfo.fullName} (Available for technical screening / interviews).`,
    };
  }

  // 15. Work / Projects Filter & Browse
  const specialty =
    specialties.find((item) =>
      new RegExp(`\\b${item.toLowerCase()}\\b`).test(normalizedQuestion),
    ) ??
    Object.entries(skillAliases).find(([, pattern]) =>
      pattern.test(normalizedQuestion),
    )?.[0];

  const wantsWork =
    hasIntent(/\b(show|find|filter|browse|see|look at)\b/) &&
    hasIntent(/\b(work|projects?|cases?)\b/);
  if (wantsWork) {
    if (specialty) {
      selectSpecialty(specialty, true);
      const count = projectCards.filter((card) =>
        projectHasDiscipline(card, specialty),
      ).length;
      return {
        action: `FILTERED ${specialty.toUpperCase()} WORK`,
        answer: `Showing ${count} ${specialty} ${count === 1 ? "project" : "projects"} in selected work.`,
      };
    }

    setFilter("All");
    workSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED SELECTED WORK",
      answer:
        "Here are all selected projects. Add a discipline (like Languages or Frontend) to narrow the results.",
    };
  }

  // 16. Skill specialty group details
  if (specialty) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    selectSpecialty(specialty);
    return {
      action: `OPENED ${specialty.toUpperCase()} SKILLS`,
      answer: `The portfolio lists these ${specialty} skills: ${specialtyContent[specialty].tags.join(", ")}.`,
    };
  }

  // 17. General Projects query
  if (
    hasIntent(
      /\b(projects?|selected work|portfolio work|latest project|case studies)\b/,
    )
  ) {
    workSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED SELECTED WORK",
      answer: `Aditya's Selected Portfolio Projects:
1. Inno-I (Inventory Management System) — Prevents overstocking, reduces inventory losses, improves stock accuracy and cash flow (HTML5, CSS3, JavaScript, Bootstrap, Hostinger, Git).
2. Chhatrapati Shivray Marathi Sahitya Sanskriti Mandal — Responsive website for community marketing, donations, and organization growth (HTML5, CSS3, JavaScript, Bootstrap, Hostinger, Git).`,
    };
  }

  // 18. AI & Data Science
  if (
    hasIntent(
      /\b(machine learning|artificial intelligence|ai|data science|practical ml|analytics)\b/,
    )
  ) {
    aiSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "SEARCHED AI & DATA SCIENCE",
      answer:
        "Aditya Kadepure's Data Science & AI Background:\nCombines Python, SQL, Pandas, NumPy, and machine learning to make complex information actionable. Core principles: (1) Clean and validate data, (2) Choose methods suited for the question, (3) Explain results clearly.",
    };
  }

  // 19. Technical Skills / Tech Stack
  if (
    hasIntent(
      /\b(skill|skills|technology|technologies|tech stack|stack|tools|expertise|programming languages)\b/,
    )
  ) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED TECHNICAL SKILLS",
      answer: `Aditya Kadepure's Technical Skills by Category:
• Programming Languages: Python, JavaScript, ES6+, HTML5, CSS3, SQL
• Frameworks & Backend: Django, Flask, Node.js, REST APIs
• Frontend: React.js, jQuery.js, Bootstrap, Tailwind CSS, Bulma, Foundation CSS, Responsive Design
• Databases: MySQL, PostgreSQL, MongoDB, SQL, PL/SQL
• Data Science & ML: Pandas, NumPy
• Analytics & BI: Power BI, Qlik Sense, Qlik View, Microsoft Excel, Google Sheets
• Cloud & Platforms: AWS, ServiceNow
• Tools & AI Assistance: VS Code, Sublime, Jupyter Notebook, Google Colab, Postman, Git, GitHub, GitLab, Cursor AI, Claude Code, Copilot`,
    };
  }

  // 20. Strict Out-of-Scope Fallback (Refuse anything not related to this portfolio)
  return {
    action: "PORTFOLIO-ONLY SCOPE",
    answer: `I am the Aditya Kadepure Portfolio Guide, strictly trained to answer questions about this portfolio website only.\n\nI can provide verified information on:\n• Core Competencies ("Expertise in", "Proficiency in", "Skilled at", "Advanced knowledge of")\n• Exact Tool Names, Programming Languages & Technical Frameworks\n• Candidate Profile, Shortlist, Talent Pool & Candidate Roster\n• First Name (Aditya), Middle Name (Ganesh), Last Name (Kadepure)\n• Selected Projects (Inno-I, Chhatrapati Shivray Mandal)\n• Professional Work Experience & Education (BCA)\n• Contact Details & Location\n\nPlease ask a question related to Aditya Kadepure's portfolio!`,
  };
}

function showAgentResponse(question) {
  const { action, answer } = runPortfolioAgent(question);
  const questionLabel = document.createElement("span");
  questionLabel.className = "ai-speaker ai-question";
  questionLabel.textContent = `YOU / ${question}`;
  const actionLabel = document.createElement("span");
  actionLabel.className = "ai-speaker";
  actionLabel.textContent = `AGENT ACTION / ${action}`;
  const answerLabel = document.createElement("span");
  answerLabel.className = "ai-speaker";
  answerLabel.textContent = "AGENT / LOCAL RESPONSE";
  const answerText = document.createElement("p");
  answerText.style.whiteSpace = "pre-line";
  answerText.style.wordBreak = "break-word";
  answerText.textContent = answer;

  guideResponse.replaceChildren(
    questionLabel,
    actionLabel,
    answerLabel,
    answerText,
  );
  guideResponse.classList.remove("is-updated");
  void guideResponse.offsetWidth;
  guideResponse.classList.add("is-updated");
}

guideForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = guideInput.value.trim();
  if (!question) return;
  showAgentResponse(question);
  guideInput.value = "";
});

for (const promptButton of document.querySelectorAll("[data-prompt]")) {
  promptButton.addEventListener("click", () => {
    const question = promptButton.dataset.prompt;
    guideInput.value = question;
    showAgentResponse(question);
  });
}

const chatbotPanel = document.querySelector("#chatbot-panel");
const chatbotToggle = document.querySelector("#ai-open-chat");
const floatingChat = document.querySelector(".portfolio-chat");
const floatingToggle = document.querySelector("#chatbot-toggle");
const chatbotToggleLabel = chatbotToggle.querySelector(".ai-open-label");
const chatPositionKey = "mradi-portfolio-chat-position";
let chatOpener = chatbotToggle;
let dragStart = null;
let didDrag = false;
let suppressChatClick = false;
let hasSavedChatPosition = false;

function updateChatPanelPlacement() {
  const bounds = floatingChat.getBoundingClientRect();
  const panelWidth = Math.min(390, window.innerWidth - 26);
  const spaceAbove = bounds.top;
  const spaceBelow = window.innerHeight - bounds.bottom;

  floatingChat.dataset.panelAlign =
    bounds.left + bounds.width + panelWidth > window.innerWidth - 12
      ? "right"
      : "left";
  floatingChat.dataset.panelPosition =
    spaceAbove > spaceBelow ? "above" : "below";
}

function setChatPosition(left, top) {
  const bounds = floatingChat.getBoundingClientRect();
  const maxLeft = Math.max(8, window.innerWidth - bounds.width - 8);
  const maxTop = Math.max(8, window.innerHeight - bounds.height - 8);

  floatingChat.style.left = `${Math.min(maxLeft, Math.max(8, left))}px`;
  floatingChat.style.top = `${Math.min(maxTop, Math.max(8, top))}px`;
  floatingChat.style.right = "auto";
  floatingChat.style.bottom = "auto";
  updateChatPanelPlacement();
}

try {
  const savedPosition = JSON.parse(localStorage.getItem(chatPositionKey));
  if (
    Number.isFinite(savedPosition?.left) &&
    Number.isFinite(savedPosition?.top)
  ) {
    setChatPosition(savedPosition.left, savedPosition.top);
    hasSavedChatPosition = true;
  }
} catch {
  // Storage can be unavailable for local files or restricted browser sessions.
}

if (!hasSavedChatPosition) updateChatPanelPlacement();

function setChatbotOpen(isOpen, opener = chatOpener) {
  chatbotPanel.hidden = !isOpen;
  chatbotPanel.classList.toggle("is-open", isOpen);
  chatOpener = opener;
  chatbotToggle.setAttribute("aria-expanded", String(isOpen));
  floatingToggle.setAttribute("aria-expanded", String(isOpen));
  chatbotToggle.setAttribute(
    "aria-label",
    isOpen ? "Close portfolio agent" : "Open portfolio agent",
  );
  chatbotToggleLabel.textContent = isOpen
    ? "Close the conversation"
    : "Open the conversation";

  if (isOpen) {
    updateChatPanelPlacement();
    guideInput.focus();
  } else {
    chatOpener.focus();
  }
}

chatbotToggle.addEventListener("click", () => {
  setChatbotOpen(chatbotPanel.hidden, chatbotToggle);
});
floatingToggle.addEventListener("click", (event) => {
  if (suppressChatClick) {
    event.preventDefault();
    suppressChatClick = false;
    return;
  }
  setChatbotOpen(chatbotPanel.hidden, floatingToggle);
});
document.querySelector("#chatbot-close").addEventListener("click", () => {
  setChatbotOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !chatbotPanel.hidden) {
    setChatbotOpen(false);
  }
});

const contactFormToggle = document.querySelector("#contact-form-toggle");
const contactFormToggleLabel = document.querySelector(
  "#contact-form-toggle-label",
);
const contactForm = document.querySelector("#contact-form");
contactFormToggle.addEventListener("click", () => {
  const isOpen = contactForm.hidden;
  contactForm.hidden = !isOpen;
  contactFormToggle.setAttribute("aria-expanded", String(isOpen));
  contactFormToggleLabel.textContent = isOpen
    ? "Close the form"
    : "Start a conversation";

  if (isOpen) contactForm.querySelector('[name="name"]').focus();
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const fields = new FormData(contactForm);
  const name = String(fields.get("name"))
    .replace(/[\r\n]+/g, " ")
    .trim();
  const email = String(fields.get("email")).trim();
  const phone = String(fields.get("phone")).trim();
  const reason = String(fields.get("reason")).trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nReason for reaching out:\n${reason}`,
  );

  window.location.href = `mailto:mradik731@gmail.com?subject=${subject}&body=${body}`;
});

floatingToggle.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const bounds = floatingChat.getBoundingClientRect();
  dragStart = {
    pointerId: event.pointerId,
    pointerX: event.clientX,
    pointerY: event.clientY,
    left: bounds.left,
    top: bounds.top,
  };
  didDrag = false;
  floatingToggle.setPointerCapture(event.pointerId);
});

floatingToggle.addEventListener("pointermove", (event) => {
  if (!dragStart || event.pointerId !== dragStart.pointerId) return;
  const deltaX = event.clientX - dragStart.pointerX;
  const deltaY = event.clientY - dragStart.pointerY;
  if (!didDrag && Math.hypot(deltaX, deltaY) < 6) return;

  didDrag = true;
  floatingChat.classList.add("is-dragging");
  setChatPosition(dragStart.left + deltaX, dragStart.top + deltaY);
  event.preventDefault();
});

function finishChatDrag(event) {
  if (!dragStart || event.pointerId !== dragStart.pointerId) return;
  floatingChat.classList.remove("is-dragging");

  if (didDrag) {
    const bounds = floatingChat.getBoundingClientRect();
    try {
      localStorage.setItem(
        chatPositionKey,
        JSON.stringify({ left: bounds.left, top: bounds.top }),
      );
    } catch {
      // Dragging still works when the browser blocks persistent storage.
    }
    hasSavedChatPosition = true;
    suppressChatClick = true;
    window.setTimeout(() => {
      suppressChatClick = false;
    }, 0);
  }

  dragStart = null;
  didDrag = false;
}

floatingToggle.addEventListener("pointerup", finishChatDrag);
floatingToggle.addEventListener("pointercancel", finishChatDrag);
window.addEventListener("resize", () => {
  if (hasSavedChatPosition) {
    const bounds = floatingChat.getBoundingClientRect();
    setChatPosition(bounds.left, bounds.top);
  } else {
    updateChatPanelPlacement();
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
setFilter("All");

const revealTargets = document.querySelectorAll(
  ".section-heading, .ai-copy, .ai-console, .project-card, .experience-item, .education-copy, .atlas-heading, .atlas-detail, .about-stamp, .about-copy, .about-aside, .contact-main, .contact-side",
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("reveal-on-scroll", "is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 },
  );

  for (const target of revealTargets) {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  }
} else {
  for (const target of revealTargets) {
    target.classList.add("reveal-on-scroll", "is-visible");
  }
}
