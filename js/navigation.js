/**
 * Aditya Kadepure Portfolio — Navigation, Contact Form & UI Utilities Module
 * Handles mobile hamburger navigation, contact form submission, copyright year,
 * and scroll-triggered reveal animations.
 */

export function initNavigation() {
  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");

  if (menuToggle && siteNav) {
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
  }

  // 2. Contact Form Toggle & Submission
  const contactFormToggle = document.querySelector("#contact-form-toggle");
  const contactFormToggleLabel = document.querySelector(
    "#contact-form-toggle-label",
  );
  const contactForm = document.querySelector("#contact-form");

  if (contactFormToggle && contactForm) {
    contactFormToggle.addEventListener("click", () => {
      const isOpen = contactForm.hidden;
      contactForm.hidden = !isOpen;
      contactFormToggle.setAttribute("aria-expanded", String(isOpen));
      if (contactFormToggleLabel) {
        contactFormToggleLabel.textContent = isOpen
          ? "Close the form"
          : "Start a conversation";
      }

      if (isOpen) contactForm.querySelector('[name="name"]')?.focus();
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
  }

  // 3. Current Year in Footer
  const yearElement = document.querySelector("#current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 4. Scroll Reveal Animations (IntersectionObserver)
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
}
