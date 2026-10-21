/**
 * Aditya Kadepure Portfolio — Projects Module
 * Handles project card filtering, discipline mapping, project count, and empty states.
 */

import { specialtyContent } from "./data.js";
import { showSkillMapOverview } from "./skills.js";

let activeFilter = "All";
let onFilterChangeCallback = null;

const projectCards = [...document.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const projectCount = document.querySelector("#project-count");
const emptyState = document.querySelector("#empty-state");

export function projectHasDiscipline(card, discipline) {
  const token = discipline.replace(/\s+/g, "-");
  return card.dataset.disciplines.split(" ").includes(token);
}

export function setFilter(filter) {
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

  if (projectCount) {
    projectCount.textContent = `${String(visibleCount).padStart(2, "0")} PROJECT${visibleCount === 1 ? "" : "S"}`;
  }
  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

export function getActiveFilter() {
  return activeFilter;
}

export function initProjects(options = {}) {
  if (options.onFilterChange) {
    onFilterChangeCallback = options.onFilterChange;
  }

  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      if (typeof onFilterChangeCallback === "function") {
        onFilterChangeCallback(filter);
      } else {
        setFilter(filter);
      }
    });
  }

  const lensWorkLink = document.querySelector("#lens-work-link");
  if (lensWorkLink) {
    lensWorkLink.addEventListener("click", () => {
      if (activeFilter === "All") setFilter("Languages");
      document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  const resetFilterBtn = document.querySelector("#reset-filter-btn");
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", () => {
      if (typeof onFilterChangeCallback === "function") {
        onFilterChangeCallback("All");
      } else {
        setFilter("All");
      }
    });
  }
}
