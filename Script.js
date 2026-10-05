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
    tags: ["Pandas", "NumPy"],
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
function portfolioText(element, selector) {
  const text = element.querySelector(selector)?.innerText ?? "";
  return text.replace(/\s+/g, " ").trim();
}

function portfolioExperience() {
  return [...document.querySelectorAll(".experience-item")].map((item) => {
    const [dates, location] = [...item.querySelectorAll(".experience-date span")]
      .map((span) => span.textContent.trim())
      .filter(Boolean);
    const details = [...item.querySelectorAll("li")]
      .map((detail) => detail.textContent.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join(" ");
    const experienceTitle = portfolioText(item, "h3");
    const company = portfolioText(item, ".experience-company");
    return `${experienceTitle} at ${company} (${dates ?? "Unknown period"}, ${location ?? "Unknown location"}): ${details}`;
  });
}

function portfolioContactSummary() {
  const section = document.querySelector("#contact");
  if (!section) return "The contact details are not listed on this page.";

  const contactInfo = [...section.querySelectorAll(".contact-side p")]
    .map((paragraph) => paragraph.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return contactInfo.length > 0
    ? contactInfo.slice(0, 3).join(", ")
    : "The contact details are not listed on this page.";
}

function projectSummary(project) {
  const tags = [...project.querySelectorAll(".tag-row span")]
    .map((tag) => tag.textContent.trim())
    .filter(Boolean);
  return `${portfolioText(project, "h3")}: ${portfolioText(project, ".project-summary")} Tools listed: ${tags.join(", ") || "not listed"}.`;
}

function runPortfolioAgent(question) {
  const normalizedQuestion = (question ?? "").toLowerCase();
  const hasIntent = (pattern) => pattern.test(normalizedQuestion);
  const specialty =
    specialties.find((item) =>
      new RegExp(`\\b${item.toLowerCase()}\\b`).test(normalizedQuestion),
    ) ??
    Object.entries(skillAliases).find(([, pattern]) =>
      pattern.test(normalizedQuestion),
    )?.[0];

  const contactSection = document.querySelector("#contact");
  const experienceSection = document.querySelector("#experience");
  const educationSection = document.querySelector("#education");
  const workSection = document.querySelector("#work");
  const atlasSection = document.querySelector("#atlas");
  const aboutSection = document.querySelector("#about");
  const aiSection = document.querySelector("#ai");

  if (hasIntent(/\b(contact|talk|hire|email|available|reach out|get in touch)\b/)) {
    contactSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED CONTACT",
      answer: `The portfolio lists ${portfolioContactSummary()}.`,
    };
  }

  if (hasIntent(/\b(experience|employment|career|work history|resume)\b/)) {
    experienceSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED EXPERIENCE",
      answer: portfolioExperience().join(" ") || "The portfolio does not list employment history.",
    };
  }

  if (hasIntent(/\b(education|degree|college|university|bca)\b/)) {
    educationSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED EDUCATION",
      answer: `${portfolioText(educationSection, "h2")} at ${portfolioText(educationSection, ".education-copy > p")}. ${portfolioText(educationSection, ".education-copy > span")} (${portfolioText(educationSection, ".education-date")}).`,
    };
  }

  const asksAboutInno = /\binno.?i\b|inventory|overstock|stock management/.test(
    normalizedQuestion,
  );
  const asksAboutCommunityProject =
    /chhatrapati|shivray|marathi|sahitya|mandal|donation/.test(
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

  if (asksAboutInno || asksAboutCommunityProject) {
    const project = projectMatches[0];
    if (project) {
      workSection?.scrollIntoView({ behavior: "smooth" });
      return {
        action: "OPENED PROJECT DETAILS",
        answer: projectSummary(project),
      };
    }
  }

  const wantsWork =
    hasIntent(/\b(show|find|filter|browse|see|look at)\b/) &&
    hasIntent(/\b(work|projects?|cases?)\b/);
  if (wantsWork) {
    const filter = specialty;
    if (filter) {
      selectSpecialty(filter, true);
      const count = projectCards.filter((card) =>
        projectHasDiscipline(card, filter),
      ).length;
      return {
        action: `FILTERED ${filter.toUpperCase()} WORK`,
        answer: `Showing ${count} ${filter} ${count === 1 ? "project" : "projects"} in selected work.`,
      };
    }

    setFilter("All");
    workSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED SELECTED WORK",
      answer:
        "Here are all selected projects. Add a discipline to narrow the results.",
    };
  }

  if (specialty) {
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: `OPENED ${specialty.toUpperCase()} SKILLS`,
      answer: `The portfolio lists these ${specialty} skills: ${specialtyContent[specialty].tags.join(", ")}.`,
    };
  }

  if (/\b(projects?|selected work|portfolio work|latest project|case studies)\b/.test(normalizedQuestion)) {
    const summaries = projectMatches.map((card) => projectSummary(card));
    workSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "SEARCHED SELECTED WORK",
      answer: summaries.length > 0 ? summaries.join(" ") : "There are no matching projects to list right now.",
    };
  }

  if (hasIntent(/\b(machine learning|artificial intelligence|ai|data science)\b/)) {
    return {
      action: "SEARCHED PORTFOLIO CONTEXT",
      answer: portfolioText(aiSection, ".ai-copy > p:not(.eyebrow)") || "The portfolio includes a data and AI section with the latest work in analytics and intelligent systems.",
    };
  }

  if (hasIntent(/\b(project|inno.?i|inventory|chhatrapati|shivray|marathi|sahitya|mandal|donation)\b/)) {
    const project = projectMatches[0];
    if (project) {
      return {
        action: "SEARCHED PORTFOLIO CONTEXT",
        answer: projectSummary(project),
      };
    }
  }

  if (hasIntent(/\b(skill|skills|technology|technologies|tech stack|expertise|stack)\b/)) {
    const groups = specialties
      .map((name) => `${name}: ${specialtyContent[name].tags.join(", ")}`)
      .join(". ");
    atlasSection?.scrollIntoView({ behavior: "smooth" });
    return {
      action: "OPENED TECHNICAL SKILLS",
      answer: `The portfolio lists these technical skill groups: ${groups}.`,
    };
  }

  if (hasIntent(/\b(about|who are you|yourself|name|profile|background|introduction)\b/)) {
    aboutSection?.scrollIntoView({ behavior: "smooth" });
    const hero = document.querySelector(".hero");
    return {
      action: "OPENED ABOUT",
      answer: `${portfolioText(hero, ".eyebrow")} ${portfolioText(hero, "h1")} ${portfolioText(hero, ".hero-description")}`,
    };
  }

  return {
    action: "SEARCHED PORTFOLIO CONTEXT",
    answer:
      "I can only answer from the information on this portfolio website, such as Aditya's profile, skills, projects, experience, education, and contact details. That information is not listed on the site.",
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
