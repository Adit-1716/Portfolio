/**
 * Aditya Kadepure Portfolio — Portfolio Agent & HR Technical Screening Engine
 * Handles recruiter queries, Core Competencies matrix, exact tool verification,
 * and the draggable conversational UI.
 */

import {
  candidateInfo,
  specialties,
  specialtyContent,
  skillAliases,
  hrCoreCompetencies,
  hrToolsDatabase,
  portfolioText,
  portfolioExperience,
} from "./data.js";
import { selectSpecialty } from "./skills.js";
import { setFilter, projectHasDiscipline } from "./projects.js";

const chatPositionKey = "mradi-portfolio-chat-position";
let chatOpener = null;
let dragStart = null;
let didDrag = false;
let suppressChatClick = false;
let hasSavedChatPosition = false;

const guideForm = document.querySelector("#portfolio-guide");
const guideInput = document.querySelector("#ai-prompt");
const guideResponse = document.querySelector("#ai-response");
const chatbotPanel = document.querySelector("#chatbot-panel");
const chatbotToggle = document.querySelector("#ai-open-chat");
const floatingChat = document.querySelector(".portfolio-chat");
const floatingToggle = document.querySelector("#chatbot-toggle");
const chatbotToggleLabel = chatbotToggle?.querySelector(".ai-open-label");

export function runPortfolioAgent(question) {
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
  const projectCards = [...document.querySelectorAll(".project-card")];

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
• Contact: ${candidateInfo.email} | ${candidateInfo.phone} | GitHub: ${candidateInfo.github}`,
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

  // 16. Contact Details
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

  // 17. Resume / CV
  if (hasIntent(/\b(resume|cv|curriculum vitae|download)\b/)) {
    return {
      action: "DOWNLOAD CV / RESUME",
      answer:
        "You can download Aditya Kadepure's official resume & CV directly from this website using the 'Download resume & CV' button or via the file: assets/documents/ADITYA_KADEPURE_CV.pdf.",
    };
  }

  // 18. Experience & Employment
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

  // 19. Education & Academics
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

  // 20. Specific Projects
  const asksAboutInno = /\binno.?i\b|inventory|overstock|stock management/.test(
    normalizedQuestion,
  );
  const asksAboutCommunityProject =
    /chhatrapati|shivray|marathi|sahitya|sanskriti|mandal|donation/.test(
      normalizedQuestion,
    );

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

  // 21. External coding request redirection
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
    /\b(docker|kubernetes|k8s|java\b|c\+\+|c#|\.net|php\b|ruby\b|golang\b|go\s*lang|rust\b|swift\b|kotlin\b|angular|vue(?:\.js)?|svelte|graphql|tableau|salesforce|terraform|ansible|jenkins|azure|gcp|google\s*cloud)\b/i,
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

  // 22. Work / Projects Filter & Browse
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

  // 23. Skill specialty group details
  if (specialty) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    selectSpecialty(specialty);
    return {
      action: `OPENED ${specialty.toUpperCase()} SKILLS`,
      answer: `The portfolio lists these ${specialty} skills: ${specialtyContent[specialty].tags.join(", ")}.`,
    };
  }

  // 24. General Projects query
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

  // 25. AI & Data Science
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

  // 26. Technical Skills / Tech Stack
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

  // 27. Strict Out-of-Scope Fallback (Refuse anything not related to this portfolio)
  return {
    action: "PORTFOLIO-ONLY SCOPE",
    answer: `I am the Aditya Kadepure Portfolio Guide, strictly trained to answer questions about this portfolio website only.\n\nI can provide verified information on:\n• Core Competencies ("Expertise in", "Proficiency in", "Skilled at", "Advanced knowledge of")\n• Exact Tool Names, Programming Languages & Technical Frameworks\n• Candidate Profile, Shortlist, Talent Pool & Candidate Roster\n• First Name (Aditya), Middle Name (Ganesh), Last Name (Kadepure)\n• Selected Projects (Inno-I, Chhatrapati Shivray Mandal)\n• Professional Work Experience & Education (BCA)\n• Contact Details & Location\n\nPlease ask a question related to Aditya Kadepure's portfolio!`,
  };
}

export function showAgentResponse(question) {
  if (!guideResponse) return;
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

export function updateChatPanelPlacement() {
  if (!floatingChat) return;
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

export function setChatPosition(left, top) {
  if (!floatingChat) return;
  const bounds = floatingChat.getBoundingClientRect();
  const maxLeft = Math.max(8, window.innerWidth - bounds.width - 8);
  const maxTop = Math.max(8, window.innerHeight - bounds.height - 8);

  floatingChat.style.left = `${Math.min(maxLeft, Math.max(8, left))}px`;
  floatingChat.style.top = `${Math.min(maxTop, Math.max(8, top))}px`;
  floatingChat.style.right = "auto";
  floatingChat.style.bottom = "auto";
  updateChatPanelPlacement();
}

export function setChatbotOpen(isOpen, opener = chatOpener) {
  if (!chatbotPanel) return;
  chatbotPanel.hidden = !isOpen;
  chatbotPanel.classList.toggle("is-open", isOpen);
  chatOpener = opener;
  if (chatbotToggle) {
    chatbotToggle.setAttribute("aria-expanded", String(isOpen));
    chatbotToggle.setAttribute(
      "aria-label",
      isOpen ? "Close portfolio agent" : "Open portfolio agent",
    );
  }
  if (floatingToggle) {
    floatingToggle.setAttribute("aria-expanded", String(isOpen));
  }
  if (chatbotToggleLabel) {
    chatbotToggleLabel.textContent = isOpen
      ? "Close the conversation"
      : "Open the conversation";
  }

  if (isOpen) {
    updateChatPanelPlacement();
    guideInput?.focus();
  } else if (chatOpener) {
    chatOpener.focus();
  }
}

export function initAgent() {
  if (guideForm) {
    guideForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = guideInput?.value.trim();
      if (!question) return;
      showAgentResponse(question);
      if (guideInput) guideInput.value = "";
    });
  }

  for (const promptButton of document.querySelectorAll("[data-prompt]")) {
    promptButton.addEventListener("click", () => {
      const question = promptButton.dataset.prompt;
      if (guideInput) guideInput.value = question;
      showAgentResponse(question);
    });
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
    // Storage can be unavailable in restricted sandbox sessions.
  }

  if (!hasSavedChatPosition) updateChatPanelPlacement();

  if (chatbotToggle) {
    chatbotToggle.addEventListener("click", () => {
      setChatbotOpen(chatbotPanel.hidden, chatbotToggle);
    });
  }

  if (floatingToggle) {
    floatingToggle.addEventListener("click", (event) => {
      if (suppressChatClick) {
        event.preventDefault();
        suppressChatClick = false;
        return;
      }
      setChatbotOpen(chatbotPanel.hidden, floatingToggle);
    });

    floatingToggle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || !floatingChat) return;
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
      if (!dragStart || event.pointerId !== dragStart.pointerId || !floatingChat) return;
      const deltaX = event.clientX - dragStart.pointerX;
      const deltaY = event.clientY - dragStart.pointerY;
      if (!didDrag && Math.hypot(deltaX, deltaY) < 6) return;

      didDrag = true;
      floatingChat.classList.add("is-dragging");
      setChatPosition(dragStart.left + deltaX, dragStart.top + deltaY);
      event.preventDefault();
    });

    const finishChatDrag = (event) => {
      if (!dragStart || event.pointerId !== dragStart.pointerId || !floatingChat) return;
      floatingChat.classList.remove("is-dragging");

      if (didDrag) {
        const bounds = floatingChat.getBoundingClientRect();
        try {
          localStorage.setItem(
            chatPositionKey,
            JSON.stringify({ left: bounds.left, top: bounds.top }),
          );
        } catch {
          // Dragging still functions when storage is blocked.
        }
        hasSavedChatPosition = true;
        suppressChatClick = true;
        window.setTimeout(() => {
          suppressChatClick = false;
        }, 0);
      }

      dragStart = null;
      didDrag = false;
    };

    floatingToggle.addEventListener("pointerup", finishChatDrag);
    floatingToggle.addEventListener("pointercancel", finishChatDrag);
  }

  const closeBtn = document.querySelector("#chatbot-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => setChatbotOpen(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatbotPanel && !chatbotPanel.hidden) {
      setChatbotOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (hasSavedChatPosition && floatingChat) {
      const bounds = floatingChat.getBoundingClientRect();
      setChatPosition(bounds.left, bounds.top);
    } else {
      updateChatPanelPlacement();
    }
  });
}
