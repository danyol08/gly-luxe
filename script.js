document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
  const heroCta = document.querySelector(".btn-primary");
    const revealElements = document.querySelectorAll(".reveal");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-image") : null;
    const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  
  /* Page Loader with fallback timeout */
  function hideLoader() {
    if (!loader || loader.classList.contains("loaded")) return;
    loader.classList.add("loaded");
    setTimeout(function () {
      loader.style.display = "none";
    }, 550);
  }

  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 3500);
  
    /* Sticky header shadow */
    function updateHeaderShadow() {
      if (!header) return;
      if (window.scrollY > 12) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    updateHeaderShadow();
    window.addEventListener("scroll", updateHeaderShadow);
  
  /* Hero primary button now links out to Facebook directly (no smooth scroll needed) */
  
    /* Mobile navigation toggle */
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.contains("open");
        navLinks.classList.toggle("open", !isOpen);
        navToggle.setAttribute("aria-expanded", String(!isOpen));
      });
  
      navLinks.addEventListener("click", function (event) {
        if (event.target.tagName.toLowerCase() === "a") {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  
    /* Scroll reveal using IntersectionObserver */
    if ("IntersectionObserver" in window && revealElements.length > 0) {
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
  
      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      /* Fallback: just show all */
      revealElements.forEach(function (el) {
        el.classList.add("visible");
      });
    }
  
    /* Gallery lightbox */
    const galleryImages = document.querySelectorAll(".gallery-grid img");
  
    function openLightbox(src, alt) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = alt || "Expanded gallery preview";
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
  
    if (galleryImages.length > 0 && lightbox) {
      galleryImages.forEach(function (img) {
        img.addEventListener("click", function () {
          openLightbox(img.src, img.alt);
        });
      });
  
      const backdrop = lightbox.querySelector(".lightbox-backdrop");
      if (backdrop) {
        backdrop.addEventListener("click", closeLightbox);
      }
      if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
      }
  
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && lightbox.classList.contains("open")) {
          closeLightbox();
        }
      });
    }
  
  /* Contact form removed – bookings handled via Facebook and phone */
  });