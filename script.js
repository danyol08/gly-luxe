document.addEventListener("DOMContentLoaded", function () {
  const loader        = document.getElementById("loader");
  const header        = document.getElementById("site-header");
  const navToggle     = document.querySelector(".nav-toggle");
  const navLinks      = document.querySelector(".nav-links");
  const backToTop     = document.getElementById("back-to-top");
  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = lightbox ? lightbox.querySelector(".lightbox-image") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  /* ─────────────────────────────────────
     PAGE LOADER
  ───────────────────────────────────── */
  function hideLoader() {
    if (!loader || loader.classList.contains("loaded")) return;
    loader.classList.add("loaded");
    setTimeout(function () { loader.style.display = "none"; }, 600);
  }
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 3200);

  /* ─────────────────────────────────────
     CUSTOM CURSOR (desktop only)
  ───────────────────────────────────── */
  var hasFineCursor = window.matchMedia("(pointer: fine)").matches;
  if (hasFineCursor) {
    var cursor     = document.createElement("div");
    var cursorRing = document.createElement("div");
    cursor.id      = "gl-cursor";
    cursorRing.id  = "gl-cursor-ring";
    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top  = my + "px";
    });

    // Ring follows with lag
    (function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      cursorRing.style.left = rx + "px";
      cursorRing.style.top  = ry + "px";
      requestAnimationFrame(animRing);
    })();

    // Hover states
    var hoverEls = document.querySelectorAll(
      "a, button, [role='tab'], .gallery-item, .cert-photo-card, " +
      ".at-work-item, .map-card, .eyelash-svc-card, .stat-box, .social-pill"
    );
    hoverEls.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("cursor-hover");
        cursorRing.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("cursor-hover");
        cursorRing.classList.remove("cursor-hover");
      });
    });

    document.addEventListener("mousedown", function () {
      cursor.classList.add("cursor-click");
      cursorRing.classList.add("cursor-click");
    });
    document.addEventListener("mouseup", function () {
      cursor.classList.remove("cursor-click");
      cursorRing.classList.remove("cursor-click");
    });
  }

  /* ─────────────────────────────────────
     SCROLL: header + back-to-top
  ───────────────────────────────────── */
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 16);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 450);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ─────────────────────────────────────
     MOBILE NAV TOGGLE
  ───────────────────────────────────── */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.contains("open");
      navLinks.classList.toggle("open", !isOpen);
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName.toLowerCase() === "a") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("click", function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ─────────────────────────────────────
     BUTTON RIPPLE
  ───────────────────────────────────── */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var r = btn.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + "%";
      var y = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + "%";
      btn.style.setProperty("--mx", x);
      btn.style.setProperty("--my", y);
    });
  });

  /* ─────────────────────────────────────
     SCROLL REVEAL — directional variants
  ───────────────────────────────────── */
  var allReveal = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-child"
  );

  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    allReveal.forEach(function (el) { revealObs.observe(el); });

    // Mark stagger parents so children animate
    document.querySelectorAll(
      ".cert-photo-grid, .eyelash-grid, .about-stats, .certs-mini-grid"
    ).forEach(function (parent) {
      parent.classList.add("stagger-parent");
      var parentObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      parentObs.observe(parent);
    });

    // Gallery grid stagger
    var galleryGrid = document.querySelector(".gallery-grid");
    if (galleryGrid) {
      var galleryObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible-grid");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      galleryObs.observe(galleryGrid);
    }

  } else {
    allReveal.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ─────────────────────────────────────
     ANIMATED COUNTERS (about stats)
  ───────────────────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    var start     = 0;
    var startTime = null;
    var isFloat   = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease     = 1 - Math.pow(1 - progress, 4); // ease-out-quart
      var value    = isFloat
        ? (start + (target - start) * ease).toFixed(1)
        : Math.floor(start + (target - start) * ease);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statBoxes = document.querySelectorAll(".stat-box");
  if ("IntersectionObserver" in window && statBoxes.length) {
    var statObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var numEl = entry.target.querySelector(".stat-num");
        if (!numEl) return;
        var raw     = numEl.textContent.trim();
        var suffix  = raw.replace(/[\d.]/g, ""); // e.g. "+"
        var target  = parseFloat(raw);
        if (!isNaN(target)) animateCounter(numEl, target, suffix, 1600);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    statBoxes.forEach(function (b) { statObs.observe(b); });
  }

  /* ─────────────────────────────────────
     SERVICES TABS
  ───────────────────────────────────── */
  var tabBtns   = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");

  function activateTab(btn) {
    var target = btn.getAttribute("data-tab");
    tabBtns.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    tabPanels.forEach(function (p) { p.classList.remove("active"); });
    var panel = document.querySelector('.tab-panel[data-panel="' + target + '"]');
    if (panel) panel.classList.add("active");

    var wrap = document.querySelector(".services-tabs-wrap");
    if (wrap) {
      var scrollTo = btn.offsetLeft - (wrap.offsetWidth / 2) + (btn.offsetWidth / 2);
      wrap.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      activateTab(btn);
    });
  });

  /* ─────────────────────────────────────
     LIGHTBOX
  ───────────────────────────────────── */
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
      img.style.cursor = hasFineCursor ? "none" : "zoom-in";
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

  /* ─────────────────────────────────────
     ACTIVE NAV LINK ON SCROLL
  ───────────────────────────────────── */
  var sections   = document.querySelectorAll("section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  if ("IntersectionObserver" in window && navAnchors.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            a.classList.toggle("nav-active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" });
    sections.forEach(function (sec) { navObs.observe(sec); });
  }

  /* ─────────────────────────────────────
     PARALLAX — subtle on hero image
  ───────────────────────────────────── */
  var heroBgImg = document.querySelector(".hero-bg-img");
  if (heroBgImg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      heroBgImg.style.transform = "translateY(" + (y * 0.22) + "px)";
    }, { passive: true });
  }

  /* ─────────────────────────────────────
     SECTION ORNAMENTS — inject dynamically
  ───────────────────────────────────── */
  document.querySelectorAll(".section-header.centered").forEach(function (header) {
    var kicker = header.querySelector(".section-kicker");
    if (!kicker) return;
    var orn = document.createElement("div");
    orn.className = "section-ornament";
    orn.innerHTML = '<span>✦</span>';
    header.insertBefore(orn, kicker);
  });
});
