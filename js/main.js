/**
 * Aditya Kadepure Portfolio — Main Entry Point
 * Attaches and orchestrates all submodules:
 * - data.js: Candidate profile, skill trees, HR competencies, and tools
 * - skills.js: Skill atlas, interactive network, and carousel
 * - projects.js: Project cards and discipline filtering
 * - agent.js: AI portfolio agent, recruiter search engine, and chat panel
 * - navigation.js: Mobile menu, contact form, and scroll animations
 */

import * as Data from "./data.js";
import { initSkills, selectSpecialty, getActiveSpecialty } from "./skills.js";
import { initProjects, setFilter, getActiveFilter } from "./projects.js";
import { initAgent, runPortfolioAgent, showAgentResponse, setChatbotOpen } from "./agent.js";
import { initNavigation } from "./navigation.js";

// Global Portfolio namespace for developer inspection and cross-module access
window.Portfolio = {
  data: Data,
  skills: { selectSpecialty, getActiveSpecialty },
  projects: { setFilter, getActiveFilter },
  agent: { runPortfolioAgent, showAgentResponse, setChatbotOpen },
  navigation: { initNavigation },
};

function initPortfolio() {
  // 1. Initialize Site Navigation & Scroll Reveal
  initNavigation();

  // 2. Initialize Project Filtering
  initProjects({
    onFilterChange: (filter) => {
      if (Data.specialtyContent[filter]) {
        selectSpecialty(filter);
      } else {
        setFilter(filter);
      }
    },
  });

  // 3. Initialize Technical Skills Atlas & Carousel
  initSkills({
    onSelectSpecialty: (specialty, scrollToWork) => {
      setFilter(specialty);
      if (scrollToWork) {
        document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
      }
    },
  });

  // 4. Initialize Portfolio Agent & Recruiter Guide
  initAgent();

  // 5. Set Initial Filter & View
  setFilter("All");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}

export { initPortfolio };
