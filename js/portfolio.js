const specialtyContent = {
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
    description:
      "Business-intelligence and spreadsheet tools listed in the CV.",
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
    description:
      "Developer, collaboration, notebook, API, and coding-assistant tools.",
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

const skillAliases = {
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
      answer: `• Middle Name / Middle Initial: ${candidateInfo.middleName}\nAditya Kadepure does not have a middle name or middle initial listed in his official portfolio and CV records.`,
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
      answer: `Hello! I am Aditya Kadepure's Portfolio Guide, trained exclusively on the contents of this portfolio website.\n\nYou can ask me directly about:\n• First Name, Last Name, Middle Name, Full Name\n• Candidate Profile\n• Applicant Name, Candidate Roster, Shortlist & Talent Pool\n• Job Seeker Status & Career Aspirations\n• Technical Skills & Tech Stack\n• Selected Projects (Inno-I, Chhatrapati Shivray Mandal)\n• Professional Experience & Work History\n• Education (BCA) & Resume / CV\n• Contact Details & Location\n\nHow can I help you explore Aditya's portfolio?`,
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
    answer: `I am the Aditya Kadepure Portfolio Guide, strictly trained to answer questions about this portfolio website only.\n\nI can only provide information on:\n• Candidate Profile & Summary\n• First Name (Aditya), Last Name (Kadepure), Middle Name (N/A)\n• Applicant Name, Candidate Roster, Shortlist & Talent Pool\n• Job Seeker Status & Career Aspirations\n• Technical Skills & Tech Stack\n• Selected Projects (Inno-I, Chhatrapati Mandal)\n• Professional Experience & Work History\n• Education (BCA) & Resume / CV\n• Contact Details & Location\n\nPlease ask a question related to Aditya Kadepure's portfolio!`,
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
