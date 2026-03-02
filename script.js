// c:\Users\danie\Desktop\Web Salon\script.js
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const loader = $("#loader");
  const header = $(".site-header");
  const navToggle = $(".nav-toggle");
  const navLinks = $(".nav-links");
  const revealElements = $$(".reveal");
  const lightbox = $("#lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-image") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  /* =========================
     PAGE LOADER – soft fade
  ========================== */
  const hideLoader = () => {
    if (!loader || loader.classList.contains("loaded")) return;
    loader.classList.add("loaded");
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  };

  window.addEventListener("load", hideLoader);
  // Fallback kung may mabagal na asset
  setTimeout(hideLoader, 3000);

  /* =========================
     STICKY HEADER (with hide-on-scroll)
  ========================== */
  let lastScroll = 0;

  const onScrollHeader = () => {
    if (!header) return;
    const current = window.scrollY;

    header.classList.toggle("scrolled", current > 10);

    // Hide kapag nag‑scroll pababa, show kapag pataas
    if (current > lastScroll && current > 120) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }

    lastScroll = current;
  };

  window.addEventListener("scroll", onScrollHeader);

  /* =========================
     MOBILE NAV
  ========================== */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("open");
      navLinks.classList.toggle("open", !isOpen);
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      document.body.classList.toggle("nav-open", !isOpen);
    });

    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "a") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
  }

  /* =========================
     SMOOTH SCROLL FOR INTERNAL LINKS
  ========================== */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href === "#0") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* =========================
     SCROLL REVEAL – subtle, staggered
  ========================== */
  if ("IntersectionObserver" in window && revealElements.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 40}ms`; // konting pagka‑stagger
      observer.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* =========================
     GALLERY LIGHTBOX
  ========================== */
  const galleryImages = $$(".gallery-grid img");

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Gallery preview";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.body.style.overflow = "";
  };

  if (galleryImages.length && lightbox) {
    galleryImages.forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.src, img.alt));
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    const backdrop = lightbox.querySelector(".lightbox-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

  /* =========================
     SCROLL PROGRESS BAR (thin line on top)
  ========================== */
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  /* =========================
     MAGNETIC PRIMARY BUTTONS (subtle luxury feel)
  ========================== */
  const magneticButtons = $$(".btn-primary");

  magneticButtons.forEach((btn) => {
    const strength = 10; // max px movement

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY =
        (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      const moveX = Math.max(Math.min(relX * strength, strength), -strength);
      const moveY = Math.max(Math.min(relY * strength, strength), -strength);

      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});