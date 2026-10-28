/* ==========================================================================
   Varnika Health Care — site behaviour
   Shared header/footer, icons, and every interactive widget on the site.
   Content lives in data.js.
   ========================================================================== */
(function () {
  "use strict";

  const SITE = window.SITE;
  const DEPARTMENTS = window.DEPARTMENTS;
  const DOCTORS = window.DOCTORS;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const telHref = (p) => "tel:" + p.replace(/[^\d+]/g, "");
  const waHref = (text) => "https://wa.me/" + SITE.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  const deptById = (id) => DEPARTMENTS.find((d) => d.id === id);
  const docById = (id) => DOCTORS.find((d) => d.id === id);
  const initials = (name) => name.replace(/^Dr\.?\s*/, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  const formatINR = (n) => "₹" + n.toLocaleString("en-IN");

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    },
  };

  /* ---------------------------------------------------------------- Icons */
  const ICONS = {
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>',
    bone: '<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>',
    baby: '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
    venus: '<circle cx="12" cy="9" r="6"/><path d="M12 15v7"/><path d="M9 19h6"/>',
    pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>',
    ear: '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    ambulance: '<path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    person: '<circle cx="12" cy="5" r="1.5"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    stethoscope: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-left": '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    "arrow-up": '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    cross: '<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  };
  const icon = (name, cls = "") => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  function injectSprite() {
    const symbols = Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${symbols}</svg>`);
  }

  /* ---------------------------------------------------------------- Layout */
  const NAV = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "about.html", label: "About", page: "about" },
    { href: "departments.html", label: "Departments", page: "departments" },
    { href: "doctors.html", label: "Doctors", page: "doctors" },
    { href: "index.html#packages", label: "Health Packages", page: "packages" },
    { href: "contact.html", label: "Contact", page: "contact" },
  ];

  function brandHtml() {
    return `<a class="brand" href="index.html" aria-label="${SITE.name} home">
      <img src="img/logo.svg" alt="" width="44" height="44">
      <span class="brand-name">Varnika<small>Health Care</small></span>
    </a>`;
  }

  function renderHeader() {
    const slot = $("[data-include='header']");
    if (!slot) return;
    const page = document.body.dataset.page;
    slot.outerHTML = `
      <div class="topbar">
        <div class="container">
          <div class="topbar-info">
            <span>${icon("clock")} OPD: Mon–Sat 8 AM – 8 PM</span>
            <span>${icon("mail")} <a href="mailto:${SITE.email}">${SITE.email}</a></span>
          </div>
          <a class="emergency" href="${telHref(SITE.emergencyPhone)}"><span class="pulse"></span> 24/7 Emergency: ${SITE.emergencyPhone}</a>
        </div>
      </div>
      <header class="site-header" id="top">
        <div class="container">
          ${brandHtml()}
          <nav class="nav" id="nav" aria-label="Main">
            ${NAV.map((n) => `<a href="${n.href}"${n.page === page ? ' class="active" aria-current="page"' : ""}>${n.label}</a>`).join("")}
            <a class="btn btn-primary" href="appointment.html">${icon("calendar")} Book Appointment</a>
          </nav>
          <div class="header-actions">
            <button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode">${icon("moon", "i-moon")}${icon("sun", "i-sun")}</button>
            <a class="btn btn-primary" href="appointment.html">${icon("calendar")} Book Appointment</a>
            <button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav">${icon("menu")}</button>
          </div>
        </div>
      </header>`;
  }

  function renderFooter() {
    const slot = $("[data-include='footer']");
    if (!slot) return;
    const year = new Date().getFullYear();
    const topDepts = DEPARTMENTS.slice(0, 6);
    slot.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              ${brandHtml()}
              <p>Compassionate, affordable, multi-speciality care for every family — since ${SITE.founded}.</p>
              <p style="margin-bottom:6px;font-weight:700;color:#fff">Get health tips in your inbox</p>
              <form class="newsletter" data-newsletter>
                <label class="sr-only" for="nl-email">Email address</label>
                <input id="nl-email" type="email" placeholder="Your email" required>
                <button class="btn btn-primary btn-sm" type="submit">Subscribe</button>
              </form>
            </div>
            <div>
              <h4>Quick links</h4>
              <ul>
                <li><a href="about.html">About us</a></li>
                <li><a href="doctors.html">Find a doctor</a></li>
                <li><a href="appointment.html">Book appointment</a></li>
                <li><a href="index.html#packages">Health check-ups</a></li>
                <li><a href="index.html#faq">FAQs</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4>Departments</h4>
              <ul>
                ${topDepts.map((d) => `<li><a href="departments.html#${d.id}">${d.name}</a></li>`).join("")}
                <li><a href="departments.html">View all →</a></li>
              </ul>
            </div>
            <div>
              <h4>Reach us</h4>
              <ul class="footer-contact">
                <li>${icon("pin")}<span>${SITE.address}</span></li>
                <li>${icon("phone")}<a href="${telHref(SITE.phone)}">${SITE.phone}</a></li>
                <li>${icon("ambulance")}<a href="${telHref(SITE.emergencyPhone)}">Emergency: ${SITE.emergencyPhone}</a></li>
                <li>${icon("mail")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${SITE.name}. All rights reserved.</span>
            <span>Made with care for our community ♥</span>
          </div>
        </div>
      </footer>
      <div class="fab-wrap">
        <button class="fab top" type="button" aria-label="Back to top">${icon("arrow-up")}</button>
        <a class="fab wa" href="${waHref("Hello Varnika Health Care, I have a query.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("chat")}</a>
        <a class="fab call" href="${telHref(SITE.emergencyPhone)}" aria-label="Call emergency">${icon("phone")}</a>
      </div>
      <div class="toast" role="status" aria-live="polite"></div>`;
  }

  // Fill [data-site="key"] elements from SITE config so details live in one place.
  function fillSiteData() {
    $$("[data-site]").forEach((el) => {
      const key = el.dataset.site;
      if (SITE[key] == null) return;
      el.textContent = SITE[key];
      if (el.tagName === "A") {
        if (/phone/i.test(key)) el.href = telHref(SITE[key]);
        if (key === "email") el.href = "mailto:" + SITE[key];
      }
    });
    $$("[data-tel]").forEach((el) => { el.href = telHref(SITE[el.dataset.tel]); });
    $$("[data-wa]").forEach((el) => { el.href = waHref(el.dataset.wa); });
  }

  let toastTimer;
  function toast(msg) {
    const el = $(".toast");
    if (!el) return;
    el.innerHTML = icon("check") + `<span>${escapeHtml(msg)}</span>`;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  /* ---------------------------------------------------------------- Global UI */
  function initTheme() {
    const saved = store.get("vhc-theme", null);
    if (saved) document.documentElement.dataset.theme = saved;
    const btn = $(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme
        || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      store.set("vhc-theme", next);
    });
  }

  function initHeader() {
    const header = $(".site-header");
    const nav = $("#nav");
    const toggle = $(".menu-toggle");
    const topBtn = $(".fab.top");
    const onScroll = () => {
      header && header.classList.toggle("scrolled", window.scrollY > 10);
      topBtn && topBtn.classList.toggle("show", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    topBtn && topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    if (toggle && nav) {
      const setOpen = (open) => {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.innerHTML = icon(open ? "x" : "menu");
      };
      toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
      nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    }

    $$("[data-newsletter]").forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault();
      f.reset();
      toast("Thanks for subscribing! Health tips are on the way.");
    }));
  }

  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }

  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const start = performance.now();
      const dur = 1600;
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------- Departments */
  function deptCard(d) {
    return `<button class="card hover dept-card reveal" type="button" data-dept="${d.id}" id="${d.id}">
      <span class="dept-icon">${icon(d.icon)}</span>
      <h3>${d.name}</h3>
      <p>${d.short}</p>
      <span class="link-arrow">Learn more ${icon("arrow")}</span>
    </button>`;
  }

  function initDepartments() {
    const grid = $("#dept-grid");
    if (!grid) return;
    const limit = parseInt(grid.dataset.limit || "0", 10);
    const filters = $("#dept-filters");
    const search = $("#dept-search");
    let group = "all";
    let q = "";

    const render = () => {
      let list = DEPARTMENTS.filter((d) => (group === "all" || d.group === group)
        && (!q || (d.name + " " + d.short + " " + d.services.join(" ")).toLowerCase().includes(q)));
      if (limit) list = list.slice(0, limit);
      grid.innerHTML = list.length ? list.map(deptCard).join("")
        : `<div class="empty">${icon("search")}<p>No departments match “${escapeHtml(q)}”. Try another word, or <a href="contact.html">ask us</a>.</p></div>`;
      $$(".reveal", grid).forEach((el) => el.classList.add("in"));
    };

    if (filters) {
      filters.innerHTML = window.DEPT_GROUPS.map((g) => `<button class="chip" type="button" data-group="${g.id}" aria-pressed="${g.id === "all"}">${g.name}</button>`).join("");
      filters.addEventListener("click", (e) => {
        const b = e.target.closest("[data-group]");
        if (!b) return;
        group = b.dataset.group;
        $$(".chip", filters).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
        render();
      });
    }
    search && search.addEventListener("input", () => { q = search.value.trim().toLowerCase(); render(); });
    grid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-dept]");
      if (card) openDeptModal(card.dataset.dept);
    });
    render();

    const hash = location.hash.slice(1);
    if (hash && deptById(hash)) setTimeout(() => openDeptModal(hash), 300);
  }

  let lastFocus = null;
  function openDeptModal(id) {
    const d = deptById(id);
    if (!d) return;
    let modal = $("#dept-modal");
    if (!modal) {
      document.body.insertAdjacentHTML("beforeend", `
        <div class="modal" id="dept-modal" role="dialog" aria-modal="true" aria-labelledby="dept-modal-title">
          <div class="modal-backdrop" data-close></div>
          <div class="modal-dialog">
            <button class="icon-btn modal-close" type="button" data-close aria-label="Close">${icon("x")}</button>
            <div class="modal-content"></div>
          </div>
        </div>`);
      modal = $("#dept-modal");
      modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
    }
    const docs = DOCTORS.filter((doc) => doc.dept === id);
    $(".modal-content", modal).innerHTML = `
      <div class="modal-head">
        <span class="dept-icon">${icon(d.icon)}</span>
        <div><span class="tag">${window.DEPT_GROUPS.find((g) => g.id === d.group).name}</span><h2 id="dept-modal-title" style="margin:6px 0 0;font-size:1.7rem">${d.name}</h2></div>
      </div>
      <div class="modal-body">
        <p class="muted">${d.about}</p>
        <h4>Services</h4>
        <ul class="check-list">${d.services.map((s) => `<li>${icon("check")}<span>${s}</span></li>`).join("")}</ul>
        ${docs.length ? `<h4>Our specialists</h4><div class="mini-docs">${docs.map((doc) => `
          <div class="mini-doc">
            <span class="doc-avatar" style="background:${doc.color}">${initials(doc.name)}</span>
            <div><strong>${doc.name}</strong><small>${doc.title} · ${doc.exp} yrs</small></div>
            <a class="btn btn-sm btn-ghost" href="appointment.html?dept=${d.id}&doctor=${doc.id}">Book</a>
          </div>`).join("")}</div>` : ""}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:26px">
          <a class="btn btn-primary" href="appointment.html?dept=${d.id}">${icon("calendar")} Book in ${d.name}</a>
          <a class="btn btn-ghost" href="${telHref(SITE.phone)}">${icon("phone")} Call us</a>
        </div>
      </div>`;
    lastFocus = document.activeElement;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => $(".modal-close", modal).focus(), 50);
  }
  function closeModal() {
    const modal = $("#dept-modal");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  /* ---------------------------------------------------------------- Doctors */
  function doctorCard(doc) {
    const d = deptById(doc.dept);
    return `<article class="card hover doc-card reveal">
      <div class="doc-top">
        <span class="doc-avatar" style="background:linear-gradient(135deg, ${doc.color}, color-mix(in srgb, ${doc.color} 60%, #000))">${initials(doc.name)}</span>
        <div>
          <h3>${doc.name}</h3>
          <div class="role">${d ? d.name : ""}</div>
          <div class="quals">${doc.quals}</div>
        </div>
      </div>
      <div class="doc-meta">
        <span class="tag">${icon("award")} ${doc.exp}+ yrs</span>
        <span class="tag gold">${icon("star")} ${doc.rating.toFixed(1)}</span>
        <span class="tag accent">${icon("globe")} ${doc.langs.slice(0, 2).join(", ")}</span>
      </div>
      <div class="doc-days" aria-label="Available days">
        ${DAY_SHORT.map((n, i) => `<span class="${doc.days.includes(i) ? "on" : ""}" title="${DAY_LONG[i]}${doc.days.includes(i) ? " — available" : " — not available"}">${n[0]}</span>`).join("")}
      </div>
      <div class="doc-foot">
        <a class="btn btn-primary btn-sm" href="appointment.html?dept=${doc.dept}&doctor=${doc.id}">${icon("calendar")} Book visit</a>
        <a class="btn btn-ghost btn-sm" href="${waHref(`Hello, I'd like to consult ${doc.name} (${d ? d.name : ""}).`)}" target="_blank" rel="noopener">${icon("chat")} Enquire</a>
      </div>
    </article>`;
  }

  function initDoctors() {
    const grid = $("#doc-grid");
    if (!grid) return;
    const limit = parseInt(grid.dataset.limit || "0", 10);
    const search = $("#doc-search");
    const deptSel = $("#doc-dept");
    const daySel = $("#doc-day");
    const count = $("#doc-count");

    if (deptSel) {
      const used = DEPARTMENTS.filter((d) => DOCTORS.some((doc) => doc.dept === d.id));
      deptSel.innerHTML = `<option value="">All departments</option>` + used.map((d) => `<option value="${d.id}">${d.name}</option>`).join("");
      const p = new URLSearchParams(location.search).get("dept");
      if (p) deptSel.value = p;
    }
    if (daySel) {
      daySel.innerHTML = `<option value="">Any day</option><option value="today">Available today</option>` + DAY_LONG.map((n, i) => `<option value="${i}">${n}</option>`).join("");
    }

    const render = () => {
      const q = search ? search.value.trim().toLowerCase() : "";
      const dept = deptSel ? deptSel.value : "";
      let day = daySel ? daySel.value : "";
      if (day === "today") day = String(new Date().getDay());
      let list = DOCTORS.filter((doc) => {
        const d = deptById(doc.dept);
        const hay = [doc.name, doc.title, doc.quals, d ? d.name : "", doc.langs.join(" ")].join(" ").toLowerCase();
        return (!q || hay.includes(q)) && (!dept || doc.dept === dept) && (day === "" || doc.days.includes(Number(day)));
      });
      if (limit) list = list.slice(0, limit);
      grid.innerHTML = list.length ? list.map(doctorCard).join("")
        : `<div class="empty">${icon("stethoscope")}<p>No doctors match your filters. Try clearing them, or call <a href="${telHref(SITE.phone)}">${SITE.phone}</a>.</p></div>`;
      if (count) count.textContent = `${list.length} doctor${list.length === 1 ? "" : "s"}`;
      $$(".reveal", grid).forEach((el) => el.classList.add("in"));
    };
    [search, deptSel, daySel].forEach((el) => el && el.addEventListener(el.tagName === "INPUT" ? "input" : "change", render));
    render();
  }

  /* ---------------------------------------------------------------- Packages */
  function initPackages() {
    const wrap = $("#package-grid");
    if (!wrap) return;
    wrap.innerHTML = window.PACKAGES.map((p, i) => `
      <div class="card pkg reveal d${i + 1} ${p.featured ? "featured" : ""}">
        ${p.featured ? `<span class="ribbon">MOST POPULAR</span>` : ""}
        <h3>${p.name}</h3>
        <p style="margin:0">${p.desc}</p>
        <div class="price">${formatINR(p.price)}<s>${formatINR(p.mrp)}</s></div>
        <small class="muted">${p.tests} tests · Save ${Math.round((1 - p.price / p.mrp) * 100)}%</small>
        <ul>${p.items.map((it) => `<li>${icon("check")}<span>${it}</span></li>`).join("")}</ul>
        <a class="btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block" href="appointment.html?dept=general-medicine&package=${encodeURIComponent(p.name)}">Book this package</a>
      </div>`).join("");
  }

  /* ---------------------------------------------------------------- Testimonials */
  function initTestimonials() {
    const root = $("#testimonials");
    if (!root) return;
    const items = window.TESTIMONIALS;
    root.innerHTML = `
      <div class="carousel-track"><div class="carousel-slides">
        ${items.map((t, i) => `
          <figure class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}" style="margin:0">
            <div class="stars" aria-label="${t.rating} out of 5 stars">${icon("star").repeat(t.rating)}</div>
            <blockquote>“${t.text}”</blockquote>
            <figcaption class="who"><span style="background:${t.color}">${initials(t.name)}</span><span><strong>${t.name}</strong><small>${t.detail}</small></span></figcaption>
          </figure>`).join("")}
      </div></div>
      <div class="carousel-nav">
        <button class="icon-btn" type="button" data-prev aria-label="Previous testimonial">${icon("chevron-left")}</button>
        <div class="dots">${items.map((_, i) => `<button type="button" aria-label="Show testimonial ${i + 1}"></button>`).join("")}</div>
        <button class="icon-btn" type="button" data-next aria-label="Next testimonial">${icon("chevron-right")}</button>
      </div>`;
    const slides = $(".carousel-slides", root);
    const dots = $$(".dots button", root);
    let idx = 0;
    let timer;
    const go = (i) => {
      idx = (i + items.length) % items.length;
      slides.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle("active", j === idx));
    };
    const auto = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    $("[data-prev]", root).addEventListener("click", () => { go(idx - 1); auto(); });
    $("[data-next]", root).addEventListener("click", () => { go(idx + 1); auto(); });
    dots.forEach((d, j) => d.addEventListener("click", () => { go(j); auto(); }));
    root.addEventListener("mouseenter", () => clearInterval(timer));
    root.addEventListener("mouseleave", auto);
    let startX = null;
    root.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); auto(); }
      startX = null;
    });
    go(0);
    auto();
  }

  /* ---------------------------------------------------------------- FAQ */
  function initFaq() {
    const root = $("#faq-list");
    if (!root) return;
    root.innerHTML = window.FAQS.map((f, i) => `
      <details class="reveal"${i === 0 ? " open" : ""}>
        <summary>${f.q}${icon("chevron-down")}</summary>
        <div class="answer">${f.a}</div>
      </details>`).join("");
    // Keep only one answer open at a time.
    root.addEventListener("toggle", (e) => {
      if (e.target.open) $$("details", root).forEach((d) => { if (d !== e.target) d.open = false; });
    }, true);
  }

  /* ---------------------------------------------------------------- BMI calculator */
  function initBmi() {
    const root = $("#bmi");
    if (!root) return;
    const h = $("#bmi-height", root), w = $("#bmi-weight", root), a = $("#bmi-age", root);
    const ho = $("#bmi-height-out", root), wo = $("#bmi-weight-out", root), ao = $("#bmi-age-out", root);
    const val = $("#bmi-value", root), label = $("#bmi-label", root), tip = $("#bmi-tip", root), needle = $("#bmi-needle", root);
    const segBtns = $$(".seg button", root);
    segBtns.forEach((b) => b.addEventListener("click", () => {
      segBtns.forEach((x) => x.classList.toggle("active", x === b));
      update();
    }));
    const RANGES = [
      { max: 18.5, label: "Underweight", tip: "You may benefit from a nutrition plan. Our dietitians can help you gain healthy weight." },
      { max: 25, label: "Healthy weight", tip: "Great work! Keep it up with regular activity, balanced meals and a yearly health check." },
      { max: 30, label: "Overweight", tip: "Small changes add up. A preventive check-up can catch BP and sugar issues early." },
      { max: Infinity, label: "Obese", tip: "We recommend a consultation with our physician to build a safe, personalised plan." },
    ];
    function update() {
      const cm = +h.value, kg = +w.value;
      ho.textContent = cm + " cm";
      wo.textContent = kg + " kg";
      ao.textContent = a.value + " yrs";
      const bmi = kg / Math.pow(cm / 100, 2);
      const r = RANGES.find((x) => bmi < x.max);
      val.textContent = bmi.toFixed(1);
      label.textContent = r.label;
      tip.textContent = r.tip + (+a.value >= 40 ? " At your age, we suggest a full-body check-up every year." : "");
      // Gauge spans BMI 10 → 40.
      needle.style.left = Math.max(0, Math.min(100, ((bmi - 10) / 30) * 100)) + "%";
    }
    [h, w, a].forEach((el) => el.addEventListener("input", update));
    update();
  }

  /* ---------------------------------------------------------------- Hours / open status */
  const toMin = (hhmm) => { const [hh, mm] = hhmm.split(":").map(Number); return hh * 60 + mm; };
  const fmtTime = (hhmm) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    const ampm = hh >= 12 ? "PM" : "AM";
    const h12 = hh % 12 || 12;
    return `${h12}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${ampm}`;
  };

  function initHours() {
    const table = $("#hours-table");
    const status = $("#open-status");
    const now = new Date();
    const today = now.getDay();
    if (table) {
      const order = [1, 2, 3, 4, 5, 6, 0];
      table.innerHTML = order.map((d) => {
        const h = SITE.opdHours[d];
        return `<tr class="${d === today ? "today" : ""}"><td>${DAY_LONG[d]}${d === today ? " (today)" : ""}</td><td>${h ? fmtTime(h[0]) + " – " + fmtTime(h[1]) : "Closed"}</td></tr>`;
      }).join("") + `<tr><td>Emergency & Pharmacy</td><td>24 × 7</td></tr>`;
    }
    if (status) {
      const h = SITE.opdHours[today];
      const mins = now.getHours() * 60 + now.getMinutes();
      const open = h && mins >= toMin(h[0]) && mins < toMin(h[1]);
      status.className = "open-badge " + (open ? "open" : "closed");
      status.textContent = open ? `OPD open now · until ${fmtTime(h[1])}` : "OPD closed now · Emergency open 24/7";
    }
  }

  function initMap() {
    const map = $("#map");
    if (!map) return;
    map.innerHTML = `<iframe title="Map showing ${SITE.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed"></iframe>`;
  }

  /* ---------------------------------------------------------------- Form helpers */
  const VALIDATORS = {
    required: (v) => v.trim().length > 0,
    phone: (v) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
    email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    age: (v) => +v >= 0 && +v <= 120 && v !== "",
  };
  function validateFields(fields) {
    let ok = true;
    let first = null;
    fields.forEach((input) => {
      const rules = (input.dataset.validate || "").split(" ").filter(Boolean);
      const valid = rules.every((r) => VALIDATORS[r](input.value));
      input.closest(".field").classList.toggle("invalid", !valid);
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid) { ok = false; first = first || input; }
    });
    first && first.focus();
    return ok;
  }
  function liveClear(form) {
    form.addEventListener("input", (e) => {
      const f = e.target.closest(".field.invalid");
      if (f) { f.classList.remove("invalid"); e.target.removeAttribute("aria-invalid"); }
    });
  }

  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    liveClear(form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateFields($$("[data-validate]", form))) return;
      const data = Object.fromEntries(new FormData(form));
      const msg = `Hello ${SITE.name},\n\nName: ${data.name}\nPhone: ${data.phone}${data.email ? "\nEmail: " + data.email : ""}\nTopic: ${data.topic}\n\n${data.message}`;
      $("#contact-done").hidden = false;
      $("#contact-wa").href = waHref(msg);
      $("#contact-mail").href = `mailto:${SITE.email}?subject=${encodeURIComponent("Enquiry: " + data.topic)}&body=${encodeURIComponent(msg)}`;
      form.hidden = true;
      $("#contact-done").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    const again = $("#contact-again");
    again && again.addEventListener("click", () => { form.reset(); form.hidden = false; $("#contact-done").hidden = true; });
  }

  /* ---------------------------------------------------------------- Appointment wizard */
  const SLOT_SETS = {
    Morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
    Evening: ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"],
  };
  // Deterministic "already booked" slots so the demo feels real but stays stable.
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const prettyDate = (k) => { const d = parseKey(k); return `${DAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };

  function initBooking() {
    const root = $("#booking");
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const state = {
      step: 0,
      dept: deptById(params.get("dept")) ? params.get("dept") : null,
      doctor: docById(params.get("doctor")) ? params.get("doctor") : null,
      date: null,
      time: null,
      pkg: params.get("package"),
    };
    if (state.doctor && !state.dept) state.dept = docById(state.doctor).dept;
    if (state.dept) state.step = state.doctor ? 2 : 1;

    const panels = $$(".step-panel", root);
    const stepLis = $$(".steps li", root);
    const back = $("#wiz-back"), next = $("#wiz-next"), nav = $(".wizard-nav", root);
    const form = $("#patient-form");
    liveClear(form);

    const doctorsFor = (dept) => DOCTORS.filter((d) => d.dept === dept);
    const availableDays = () => {
      if (state.doctor && state.doctor !== "any") return docById(state.doctor).days;
      const docs = doctorsFor(state.dept);
      return docs.length ? [...new Set(docs.flatMap((d) => d.days))] : [1, 2, 3, 4, 5, 6];
    };

    function renderDepts() {
      $("#pick-dept").innerHTML = DEPARTMENTS.map((d) => `
        <button type="button" class="pick ${state.dept === d.id ? "selected" : ""}" data-id="${d.id}" aria-pressed="${state.dept === d.id}">
          <span class="dept-icon">${icon(d.icon)}</span><strong>${d.name}</strong>
        </button>`).join("");
    }
    function renderDoctors() {
      const docs = doctorsFor(state.dept);
      const d = deptById(state.dept);
      $("#doc-step-sub").textContent = d ? `Choose a specialist in ${d.name}, or let us assign the first available doctor.` : "";
      $("#pick-doc").innerHTML = `
        <button type="button" class="pick doc ${state.doctor === "any" ? "selected" : ""}" data-id="any" aria-pressed="${state.doctor === "any"}">
          <span class="doc-avatar" style="background:var(--brand)">${icon("users")}</span>
          <span><strong>Any available doctor</strong><br><small>Fastest appointment</small></span>
        </button>` + docs.map((doc) => `
        <button type="button" class="pick doc ${state.doctor === doc.id ? "selected" : ""}" data-id="${doc.id}" aria-pressed="${state.doctor === doc.id}">
          <span class="doc-avatar" style="background:${doc.color}">${initials(doc.name)}</span>
          <span><strong>${doc.name}</strong><br><small>${doc.exp} yrs · ★ ${doc.rating.toFixed(1)} · ${doc.days.map((x) => DAY_SHORT[x]).join(", ")}</small></span>
        </button>`).join("");
    }
    function renderDates() {
      const days = availableDays();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chips = [];
      for (let i = 0; i < 21; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const ok = days.includes(d.getDay()) && SITE.opdHours[d.getDay()];
        const k = dateKey(d);
        chips.push(`<button type="button" class="date-chip ${state.date === k ? "selected" : ""}" data-date="${k}" ${ok ? "" : "disabled"} aria-pressed="${state.date === k}">
          <small>${i === 0 ? "Today" : i === 1 ? "Tmrw" : DAY_SHORT[d.getDay()]}</small><strong>${d.getDate()}</strong><small>${MONTHS[d.getMonth()]}</small>
        </button>`);
      }
      $("#date-strip").innerHTML = chips.join("");
      renderSlots();
    }
    function renderSlots() {
      const wrap = $("#slot-wrap");
      if (!state.date) { wrap.innerHTML = `<p class="muted">${icon("calendar")} Pick a date to see available times.</p>`; return; }
      const d = parseKey(state.date);
      const hours = SITE.opdHours[d.getDay()];
      const now = new Date();
      const isToday = dateKey(now) === state.date;
      const nowMin = now.getHours() * 60 + now.getMinutes() + 30;
      wrap.innerHTML = Object.entries(SLOT_SETS).map(([label, times]) => {
        const inHours = times.filter((t) => toMin(t) >= toMin(hours[0]) && toMin(t) < toMin(hours[1]));
        if (!inHours.length) return "";
        return `<div class="slot-group"><h4>${label}</h4><div class="slots">${inHours.map((t) => {
          const taken = hash(`${state.doctor}|${state.date}|${t}`) % 4 === 0 || (isToday && toMin(t) < nowMin);
          return `<button type="button" class="slot ${state.time === t ? "selected" : ""}" data-time="${t}" ${taken ? "disabled aria-label='" + fmtTime(t) + " unavailable'" : ""} aria-pressed="${state.time === t}">${fmtTime(t)}</button>`;
        }).join("")}</div></div>`;
      }).join("") || `<p class="muted">No OPD slots on this day.</p>`;
    }
    function docLabel() {
      if (!state.doctor) return null;
      return state.doctor === "any" ? "First available doctor" : docById(state.doctor).name;
    }
    function renderSummary() {
      const d = deptById(state.dept);
      const rows = {
        "sum-dept": d ? d.name : null,
        "sum-doc": docLabel(),
        "sum-date": state.date ? prettyDate(state.date) : null,
        "sum-time": state.time ? fmtTime(state.time) : null,
      };
      Object.entries(rows).forEach(([id, v]) => {
        const el = $("#" + id);
        el.textContent = v || "Not selected";
        el.classList.toggle("empty-val", !v);
      });
      const pkgRow = $("#sum-pkg-row");
      if (pkgRow) { pkgRow.hidden = !state.pkg; $("#sum-pkg").textContent = state.pkg || ""; }
    }
    function renderReview() {
      const data = Object.fromEntries(new FormData(form));
      const rows = [
        ["Department", deptById(state.dept).name],
        ["Doctor", docLabel()],
        ["Date", prettyDate(state.date)],
        ["Time", fmtTime(state.time)],
        ...(state.pkg ? [["Health package", state.pkg]] : []),
        ["Patient", `${data.name} (${data.age} yrs, ${data.gender})`],
        ["Mobile", data.phone],
        ...(data.email ? [["Email", data.email]] : []),
        ["Visit type", data.visit],
        ...(data.reason ? [["Reason", data.reason]] : []),
      ];
      $("#review").innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><strong>${escapeHtml(v)}</strong></div>`).join("");
    }

    const canNext = () => [!!state.dept, !!state.doctor, !!(state.date && state.time), true, true][state.step];

    function show() {
      panels.forEach((p, i) => p.classList.toggle("active", i === state.step));
      stepLis.forEach((li, i) => { li.classList.toggle("done", i < state.step); li.classList.toggle("current", i === state.step); });
      back.style.visibility = state.step === 0 ? "hidden" : "visible";
      next.innerHTML = state.step === 4 ? `${icon("check")} Confirm booking` : `Continue ${icon("arrow")}`;
      next.disabled = !canNext();
      nav.hidden = state.step === 5;
      if (state.step === 0) renderDepts();
      if (state.step === 1) renderDoctors();
      if (state.step === 2) renderDates();
      if (state.step === 4) renderReview();
      renderSummary();
    }
    function scrollTop() {
      const y = root.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: "smooth" });
    }

    root.addEventListener("click", (e) => {
      const pickDept = e.target.closest("#pick-dept .pick");
      const pickDoc = e.target.closest("#pick-doc .pick");
      const dateChip = e.target.closest(".date-chip");
      const slot = e.target.closest(".slot");
      if (pickDept) {
        if (state.dept !== pickDept.dataset.id) { state.doctor = null; state.date = null; state.time = null; }
        state.dept = pickDept.dataset.id;
        renderDepts();
        next.disabled = false;
        renderSummary();
        // Advance automatically for a snappier flow.
        setTimeout(() => { state.step = 1; show(); scrollTop(); }, 220);
      } else if (pickDoc) {
        if (state.doctor !== pickDoc.dataset.id) { state.date = null; state.time = null; }
        state.doctor = pickDoc.dataset.id;
        renderDoctors();
        renderSummary();
        setTimeout(() => { state.step = 2; show(); scrollTop(); }, 220);
      } else if (dateChip && !dateChip.disabled) {
        state.date = dateChip.dataset.date;
        state.time = null;
        $$(".date-chip", root).forEach((c) => { c.classList.toggle("selected", c === dateChip); c.setAttribute("aria-pressed", String(c === dateChip)); });
        renderSlots();
        next.disabled = !canNext();
        renderSummary();
      } else if (slot && !slot.disabled) {
        state.time = slot.dataset.time;
        $$(".slot", root).forEach((s) => { s.classList.toggle("selected", s === slot); s.setAttribute("aria-pressed", String(s === slot)); });
        next.disabled = !canNext();
        renderSummary();
      }
    });

    back.addEventListener("click", () => { state.step = Math.max(0, state.step - 1); show(); scrollTop(); });
    next.addEventListener("click", () => {
      if (state.step === 3 && !validateFields($$("[data-validate]", form))) return;
      if (state.step === 4) { confirm(); return; }
      state.step += 1;
      show();
      scrollTop();
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); next.click(); });

    function confirm() {
      const data = Object.fromEntries(new FormData(form));
      const ref = "VHC-" + Date.now().toString(36).toUpperCase().slice(-6);
      const appt = { ref, dept: state.dept, doctor: state.doctor, date: state.date, time: state.time, pkg: state.pkg, name: data.name, phone: data.phone, created: Date.now() };
      const all = store.get("vhc-appointments", []);
      all.push(appt);
      store.set("vhc-appointments", all);

      const d = deptById(state.dept);
      const msg = `Hello ${SITE.name}, I'd like to confirm my appointment.\n\nRef: ${ref}\nPatient: ${data.name} (${data.age} yrs, ${data.gender})\nMobile: ${data.phone}\nDepartment: ${d.name}\nDoctor: ${docLabel()}\nDate: ${prettyDate(state.date)}\nTime: ${fmtTime(state.time)}${state.pkg ? "\nPackage: " + state.pkg : ""}${data.reason ? "\nReason: " + data.reason : ""}`;
      $("#success-ref").textContent = ref;
      $("#success-when").textContent = `${prettyDate(state.date)} at ${fmtTime(state.time)} · ${d.name} · ${docLabel()}`;
      $("#success-wa").href = waHref(msg);
      $("#success-ics").onclick = () => downloadIcs(appt);
      state.step = 5;
      show();
      scrollTop();
      renderMyAppointments();
    }

    $("#book-another").addEventListener("click", () => {
      Object.assign(state, { step: 0, dept: null, doctor: null, date: null, time: null, pkg: null });
      form.reset();
      history.replaceState(null, "", location.pathname);
      show();
      scrollTop();
    });
    $("#success-print").addEventListener("click", () => window.print());

    function renderMyAppointments() {
      const wrap = $("#my-appts");
      if (!wrap) return;
      const todayKey = dateKey(new Date());
      const list = store.get("vhc-appointments", []).filter((a) => a.date >= todayKey).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      wrap.closest(".my-appts").hidden = !list.length;
      wrap.innerHTML = list.map((a) => {
        const dt = parseKey(a.date);
        const doc = a.doctor === "any" ? "First available doctor" : (docById(a.doctor) || {}).name;
        return `<div class="appt-row">
          <div class="appt-date"><small>${MONTHS[dt.getMonth()]}</small><strong>${dt.getDate()}</strong></div>
          <div class="info"><strong>${escapeHtml(doc || "")} · ${fmtTime(a.time)}</strong><small>${(deptById(a.dept) || {}).name || ""} · ${escapeHtml(a.name)} · ${a.ref}</small></div>
          <button class="icon-btn" type="button" data-cancel="${a.ref}" aria-label="Cancel appointment ${a.ref}">${icon("trash")}</button>
        </div>`;
      }).join("");
    }
    const myWrap = $("#my-appts");
    myWrap && myWrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cancel]");
      if (!b) return;
      if (!window.confirm("Cancel this appointment? Please also call us so we can free the slot.")) return;
      store.set("vhc-appointments", store.get("vhc-appointments", []).filter((a) => a.ref !== b.dataset.cancel));
      renderMyAppointments();
      toast("Appointment removed from this device.");
    });

    show();
    renderMyAppointments();
  }

  function downloadIcs(a) {
    const start = parseKey(a.date);
    const [hh, mm] = a.time.split(":").map(Number);
    start.setHours(hh, mm);
    const end = new Date(start.getTime() + 30 * 60000);
    const fmt = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
    const doc = a.doctor === "any" ? "First available doctor" : docById(a.doctor).name;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Varnika Health Care//Appointments//EN", "BEGIN:VEVENT",
      `UID:${a.ref}@varnikahealthcare`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:Appointment at ${SITE.name} (${doc})`,
      `DESCRIPTION:Ref ${a.ref} - ${deptById(a.dept).name}. Please arrive 15 minutes early. Call ${SITE.phone} to reschedule.`,
      `LOCATION:${SITE.address.replace(/,/g, "\\,")}`,
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Hospital appointment reminder", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `varnika-appointment-${a.ref}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------------------------------------------------------------- Boot */
  function boot() {
    injectSprite();
    renderHeader();
    renderFooter();
    fillSiteData();
    initTheme();
    initHeader();
    initDepartments();
    initDoctors();
    initPackages();
    initTestimonials();
    initFaq();
    initBmi();
    initHours();
    initMap();
    initContactForm();
    initBooking();
    initCounters();
    initReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
