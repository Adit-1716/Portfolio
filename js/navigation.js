/**
 * Aditya Kadepure Portfolio — Navigation, Contact Form & UI Utilities Module
 * Handles mobile drawer navigation, accessible contact form submission with validation & loading states,
 * copyright year, and scroll-triggered reveal animations.
 */

export function initNavigation() {
  // 1. Mobile Menu Toggle with Accessible Drawer, Focus Management & Scroll Lock
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");

  function setMenuOpen(open) {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    siteNav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);

    if (open) {
      const firstLink = siteNav.querySelector("a");
      firstLink?.focus();
    } else {
      menuToggle.focus();
    }
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    // Close when clicking any nav link
    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenuOpen(false);
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    });

    // Close on outside click
    document.addEventListener("click", (event) => {
      if (
        siteNav.classList.contains("is-open") &&
        !siteNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });
  }

  // 2. Contact Form with Accessible Inline Validation, Error Messages & Loading States
  const contactFormToggle = document.querySelector("#contact-form-toggle");
  const contactFormToggleLabel = document.querySelector(
    "#contact-form-toggle-label",
  );
  const contactForm = document.querySelector("#contact-form");
  const formAlert = document.querySelector("#contact-form-alert");
  const submitBtn = document.querySelector("#contact-submit-btn") || contactForm?.querySelector('button[type="submit"]');
  const submitLabel = document.querySelector("#contact-submit-label");

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

      if (isOpen) {
        contactForm.querySelector('[name="name"]')?.focus();
      }
    });

    const nameInput = contactForm.querySelector('[name="name"]');
    const emailInput = contactForm.querySelector('[name="email"]');
    const phoneInput = contactForm.querySelector('[name="phone"]');
    const reasonInput = contactForm.querySelector('[name="reason"]');

    const nameError = document.querySelector("#name-error");
    const emailError = document.querySelector("#email-error");
    const phoneError = document.querySelector("#phone-error");
    const reasonError = document.querySelector("#reason-error");

    function clearError(input, errorEl) {
      if (!input) return;
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      if (errorEl) errorEl.textContent = "";
      if (formAlert) {
        formAlert.hidden = true;
        formAlert.className = "form-alert";
        formAlert.textContent = "";
      }
    }

    function setError(input, errorEl, message) {
      if (!input) return;
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = message;
    }

    // Clear field errors as soon as user types
    nameInput?.addEventListener("input", () => clearError(nameInput, nameError));
    emailInput?.addEventListener("input", () => clearError(emailInput, emailError));
    phoneInput?.addEventListener("input", () => clearError(phoneInput, phoneError));
    reasonInput?.addEventListener("input", () => clearError(reasonInput, reasonError));

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let hasError = false;
      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const reason = reasonInput ? reasonInput.value.trim() : "";

      // Validate Name
      if (!name || name.length < 2) {
        setError(nameInput, nameError, "Please enter your name (at least 2 characters).");
        hasError = true;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setError(emailInput, emailError, "Please enter a valid email address (e.g., name@example.com).");
        hasError = true;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Phone (optional or minimum 7 digits)
      const digitsOnly = phone.replace(/\D/g, "");
      if (!phone || digitsOnly.length < 7) {
        setError(phoneInput, phoneError, "Please enter a valid phone number (at least 7 digits).");
        hasError = true;
      } else {
        clearError(phoneInput, phoneError);
      }

      // Validate Reason
      if (!reason || reason.length < 10) {
        setError(reasonInput, reasonError, "Please describe the reason for reaching out (at least 10 characters).");
        hasError = true;
      } else {
        clearError(reasonInput, reasonError);
      }

      if (hasError) {
        if (formAlert) {
          formAlert.hidden = false;
          formAlert.className = "form-alert is-error";
          formAlert.textContent = "Please correct the highlighted fields before submitting.";
        }
        const firstInvalid = contactForm.querySelector(".is-invalid");
        firstInvalid?.focus();
        return;
      }

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
        if (submitLabel) submitLabel.textContent = "Opening email app...";
        const spinner = document.createElement("span");
        spinner.className = "button-spinner";
        spinner.setAttribute("aria-hidden", "true");
        submitBtn.prepend(spinner);
      }

      if (formAlert) {
        formAlert.hidden = false;
        formAlert.className = "form-alert is-success";
        formAlert.textContent = `Thank you, ${name}! Launching your email application with your inquiry...`;
      }

      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nReason for reaching out:\n${reason}`,
      );

      window.setTimeout(() => {
        window.location.href = `mailto:mradik731@gmail.com?subject=${subject}&body=${body}`;

        // Reset submit button state after opening mailto
        window.setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute("aria-busy");
            submitBtn.querySelector(".button-spinner")?.remove();
            if (submitLabel) submitLabel.textContent = "Compose email";
          }
        }, 1500);
      }, 350);
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
