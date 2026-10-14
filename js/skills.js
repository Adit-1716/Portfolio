/**
 * Aditya Kadepure Portfolio — Skills & Skill Atlas Module
 * Handles technical skill category selection, carousel navigation, and the interactive skill graph.
 */

import { specialtyContent, specialties } from "./data.js";

let activeSpecialty = "Languages";
let onSelectSpecialtyCallback = null;

const skillMapCanvas = document.querySelector("#skill-map-canvas");
const skillGraph = document.querySelector("#skill-graph");
const skillGraphHub = document.querySelector("#skill-graph-hub");
const skillGraphNodes = document.querySelector("#skill-graph-nodes");
const mapNodes = [...document.querySelectorAll(".map-node")];

export function renderSkillTags(tags) {
  const tagList = document.querySelector("#lens-tags");
  if (!tagList) return;
  tagList.replaceChildren(
    ...tags.map((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      return chip;
    }),
  );
}

export function renderSkillGraph(specialty, skills) {
  if (!skillMapCanvas || !skillGraph || !skillGraphHub || !skillGraphNodes) return;
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

export function showSkillMapOverview() {
  if (!skillMapCanvas || !skillGraph) return;
  skillMapCanvas.classList.remove("is-detail-view");
  skillGraph.hidden = true;
}

export function selectSpecialty(specialty, scrollToWork = false) {
  const content = specialtyContent[specialty];
  if (!content) return;
  activeSpecialty = specialty;

  const symbolEl = document.querySelector("#lens-symbol");
  const titleEl = document.querySelector("#lens-title");
  const descEl = document.querySelector("#lens-description");

  if (symbolEl) symbolEl.textContent = content.symbol;
  if (titleEl) titleEl.textContent = specialty;
  if (descEl) descEl.textContent = content.description;

  renderSkillTags(content.tags);
  renderSkillGraph(specialty, content.tags);

  for (const node of mapNodes) {
    const selected = node.dataset.specialty === specialty;
    node.classList.toggle("is-selected", selected);
    node.setAttribute("aria-pressed", String(selected));
  }

  if (typeof onSelectSpecialtyCallback === "function") {
    onSelectSpecialtyCallback(specialty, scrollToWork);
  }
}

export function moveSpecialty(step) {
  const currentIndex = specialties.indexOf(activeSpecialty);
  const nextIndex =
    (currentIndex + step + specialties.length) % specialties.length;
  selectSpecialty(specialties[nextIndex]);
}

export function getActiveSpecialty() {
  return activeSpecialty;
}

export function initSkills(options = {}) {
  if (options.onSelectSpecialty) {
    onSelectSpecialtyCallback = options.onSelectSpecialty;
  }

  const backBtn = document.querySelector("#skill-graph-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showSkillMapOverview();
      mapNodes.find((node) => node.classList.contains("is-selected"))?.focus();
    });
  }

  for (const node of mapNodes) {
    node.addEventListener("click", () => selectSpecialty(node.dataset.specialty));
  }

  const prevBtn = document.querySelector("#skill-previous");
  const nextBtn = document.querySelector("#skill-next");
  if (prevBtn) prevBtn.addEventListener("click", () => moveSpecialty(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => moveSpecialty(1));
}
