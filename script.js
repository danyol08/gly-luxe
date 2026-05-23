document.addEventListener("DOMContentLoaded", function () {
  const loader       = document.getElementById("loader");
  const header       = document.getElementById("site-header");
  const navToggle    = document.querySelector(".nav-toggle");
  const navLinks     = document.querySelector(".nav-links");
  const backToTop    = document.getElementById("back-to-top");
  const lightbox     = document.getElementById("lightbox");
  const lightboxImg  = lightbox ? lightbox.querySelector(".lightbox-image") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  /* ─── Page Loader ─── */
  function hideLoader() {
    if (!loader || loader.classList.contains("loaded")) return;
    loader.classList.add("loaded");
    setTimeout(function () { loader.style.display = "none"; }, 600);
  }
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 3200);

  /* ─── Scroll: header + back-to-top ─── */
  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 16);
    }
    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 450);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ─── Back to Top ─── */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ─── Mobile Nav Toggle ─── */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.contains("open");
      navLinks.classList.toggle("open", !isOpen);
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    // Close when a link is clicked
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName.toLowerCase() === "a") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ─── Scroll Reveal (sections + children) ─── */
  var revealEls      = document.querySelectorAll(".reveal");
  var revealChildren = document.querySelectorAll(".reveal-child");

  if ("IntersectionObserver" in window) {
    var sectionObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    var childObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealEls.forEach(function (el) { sectionObs.observe(el); });
    revealChildren.forEach(function (el) { childObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
    revealChildren.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ─── Services Tabs ─── */
  var tabBtns   = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");

  function activateTab(btn) {
    var target = btn.getAttribute("data-tab");

    // Update button states
    tabBtns.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    // Update panel visibility
    tabPanels.forEach(function (panel) {
      panel.classList.remove("active");
    });
    var activePanel = document.querySelector('.tab-panel[data-panel="' + target + '"]');
    if (activePanel) activePanel.classList.add("active");

    // Scroll the active tab button into view inside the wrapper (mobile)
    var wrap = document.querySelector(".services-tabs-wrap");
    if (wrap) {
      var btnLeft   = btn.offsetLeft;
      var btnWidth  = btn.offsetWidth;
      var wrapWidth = wrap.offsetWidth;
      var scrollTo  = btnLeft - (wrapWidth / 2) + (btnWidth / 2);
      wrap.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }

  tabBtns.forEach(function (btn) {
    // Both click (desktop) and touchend (mobile) for instant response
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      activateTab(btn);
    });
  });

  /* ─── Lightbox ─── */
  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Gallery preview";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  var clickableImgs = document.querySelectorAll(
    ".gallery-grid img, .at-work-photo, .cert-feat-img, .cert-photo-img"
  );

  if (lightbox && clickableImgs.length) {
    clickableImgs.forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        if (img.src) openLightbox(img.src, img.alt);
      });
    });

    var backdrop = lightbox.querySelector(".lightbox-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeLightbox);
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  /* ─── Active nav link on scroll ─── */
  var sections  = document.querySelectorAll("section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  if ("IntersectionObserver" in window && navAnchors.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            a.classList.toggle(
              "nav-active",
              a.getAttribute("href") === "#" + id
            );
          });
        }
      });
    }, { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" });

    sections.forEach(function (sec) { navObs.observe(sec); });
  }
});
