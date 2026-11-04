/* =========================================================
   Interactions — small, focused, no dependencies
   ========================================================= */

(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */

  const themeToggle = document.querySelector("[data-theme-toggle]");

  const syncThemeUi = (theme) => {
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#15110e" : "#f3ede3");
    }
  };

  const setTheme = (theme) => {
    if (theme === "dark") {
      root.dataset.theme = "dark";
    } else {
      delete root.dataset.theme;
    }

    try {
      localStorage.setItem("mi-theme", theme);
    } catch (error) {
      /* storage can be unavailable; the toggle still works */
    }

    syncThemeUi(theme);
  };

  syncThemeUi(root.dataset.theme === "dark" ? "dark" : "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  /* ---------- mobile menu ---------- */

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector(".nav");

  const closeMenu = () => {
    body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
  }

  if (nav) {
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  /* ---------- header state + progress ---------- */

  const header = document.querySelector("[data-header]");
  const progressBar = document.querySelector(".progress span");
  let ticking = false;

  const updateScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle("is-scrolled", scrollY > 8);
    }

    if (progressBar) {
      progressBar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScroll);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScroll();

  /* ---------- reveal on scroll ---------- */

  const revealItems = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  /* ---------- certificate lightbox ---------- */

  const lightbox = document.querySelector("[data-lightbox]");

  if (lightbox) {
    const triggers = Array.from(document.querySelectorAll("[data-lightbox-src]"));
    const image = lightbox.querySelector("[data-lightbox-img]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const counter = lightbox.querySelector("[data-lightbox-count]");
    const pdfLink = lightbox.querySelector("[data-lightbox-pdf]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    let current = 0;
    let lastTrigger = null;

    const pad = (number) => String(number).padStart(2, "0");

    const show = (index) => {
      if (!triggers.length) return;

      current = (index + triggers.length) % triggers.length;
      const trigger = triggers[current];

      image.src = trigger.dataset.lightboxSrc;
      image.alt = trigger.dataset.lightboxAlt || "Certificate document";
      caption.textContent = trigger.dataset.lightboxCaption || "";
      counter.textContent = `${pad(current + 1)} / ${pad(triggers.length)}`;

      if (pdfLink) {
        if (trigger.dataset.lightboxPdf) {
          pdfLink.href = trigger.dataset.lightboxPdf;
          pdfLink.hidden = false;
        } else {
          pdfLink.hidden = true;
          pdfLink.removeAttribute("href");
        }
      }
    };

    const open = (index) => {
      lastTrigger = triggers[index] || null;
      show(index);
      lightbox.showModal();
      if (closeButton) closeButton.focus();
    };

    lightbox.addEventListener("close", () => {
      if (lastTrigger && document.contains(lastTrigger)) {
        lastTrigger.focus();
      }
    });

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => open(index));
    });

    if (closeButton) {
      closeButton.addEventListener("click", () => lightbox.close());
    }

    const previous = lightbox.querySelector("[data-lightbox-prev]");
    const next = lightbox.querySelector("[data-lightbox-next]");

    if (previous) {
      previous.addEventListener("click", () => show(current - 1));
    }

    if (next) {
      next.addEventListener("click", () => show(current + 1));
    }

    if (triggers.length < 2) {
      if (previous) previous.hidden = true;
      if (next) next.hidden = true;
    }

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1);
      }
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });
  }

  /* ---------- local time ---------- */

  const clocks = document.querySelectorAll("[data-clock]");

  if (clocks.length) {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const updateClock = () => {
      const time = formatter.format(new Date());
      clocks.forEach((clock) => {
        clock.textContent = `${time} IST`;
      });
    };

    updateClock();
    window.setInterval(updateClock, 30000);
  }

  /* ---------- copy email ---------- */

  const legacyCopy = (text) => {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.setAttribute("aria-hidden", "true");
    field.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
    document.body.appendChild(field);

    const selection = document.getSelection();
    const previous =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    field.select();
    field.setSelectionRange(0, field.value.length);

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    field.remove();

    if (previous && selection) {
      selection.removeAllRanges();
      selection.addRange(previous);
    }

    return copied;
  };

  document.querySelectorAll("[data-copy]").forEach((button) => {
    const original = button.textContent;
    let resetTimer;

    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      let copied = false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          copied = true;
        }
      } catch (error) {
        copied = false;
      }

      if (!copied) {
        copied = legacyCopy(value);
      }

      window.clearTimeout(resetTimer);
      button.textContent = copied ? "copied" : "copy failed";
      resetTimer = window.setTimeout(() => {
        button.textContent = original;
      }, 1800);
    });
  });

  /* ---------- year ---------- */

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
