document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const revealElements = document.querySelectorAll(".reveal");
  const revealChildren = document.querySelectorAll(".reveal-child");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-image") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const backToTop = document.getElementById("back-to-top");

  /* Page Loader */
  function hideLoader() {
    if (!loader || loader.classList.contains("loaded")) return;
    loader.classList.add("loaded");
    setTimeout(function () { loader.style.display = "none"; }, 550);
  }
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 3500);

  /* Sticky header + back-to-top on scroll */
  function onScroll() {
    if (header) {
      if (window.scrollY > 12) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    if (backToTop) {
      if (window.scrollY > 400) backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Back to top click */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Mobile nav toggle */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.contains("open");
      navLinks.classList.toggle("open", !isOpen);
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName.toLowerCase() === "a") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Scroll reveal — sections */
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach(function (el) { sectionObserver.observe(el); });

    /* Scroll reveal — staggered children */
    const childObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealChildren.forEach(function (el) { childObserver.observe(el); });

  } else {
    revealElements.forEach(function (el) { el.classList.add("visible"); });
    revealChildren.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Gallery + At-Work lightbox */
  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Expanded preview";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  const clickableImages = document.querySelectorAll(".gallery-grid img, .at-work-photo, .cert-image");
  if (clickableImages.length > 0 && lightbox) {
    clickableImages.forEach(function (img) {
      img.addEventListener("click", function () {
        if (img.src && !img.src.includes("YOUR_")) openLightbox(img.src, img.alt);
      });
    });

    const backdrop = lightbox.querySelector(".lightbox-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeLightbox);
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }
});
