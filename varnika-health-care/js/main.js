/* ==========================================================================
   Varnika Speciality Hospital — site behaviour
   Shared header/footer, icons, the English / Tamil switch and the interactive
   widgets. Content lives in data.js, Tamil text in i18n.js.
   ========================================================================== */
(function () {
  "use strict";

  const SITE = window.SITE;
  const I = window.I18N;
  const t = (key, vars) => I.t(key, vars);
  const L = (v) => I.L(v);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const telHref = (p) => "tel:" + p.replace(/[^\d+]/g, "");
  const waHref = (text) => "https://wa.me/" + SITE.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");

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
    bone: '<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>',
    baby: '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
    bandage: '<path d="M10 10.01h.01"/><path d="M10 14.01h.01"/><path d="M14 10.01h.01"/><path d="M14 14.01h.01"/><path d="M18 6v12"/><path d="M6 6v12"/><rect x="2" y="6" width="20" height="12" rx="2"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    footprints: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>',
    spine: '<rect x="9" y="2" width="6" height="3.5" rx="1"/><rect x="8.5" y="7" width="7" height="3.5" rx="1"/><rect x="8" y="12" width="8" height="3.5" rx="1"/><rect x="8.5" y="17" width="7" height="3.5" rx="1"/>',
    syringe: '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
    hospital: '<path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>',
    dumbbell: '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
    person: '<circle cx="12" cy="5" r="1.5"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    stethoscope: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-left": '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    "arrow-up": '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    clinic: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M10 21v-5h4v5"/><path d="M12 8v4"/><path d="M10 10h4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  };
  const icon = (name, cls = "") => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  function injectSprite() {
    const symbols = Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${symbols}</svg>`);
  }

  /* ---------------------------------------------------------------- Time helpers */
  const toMin = (hhmm) => { const [hh, mm] = hhmm.split(":").map(Number); return hh * 60 + mm; };
  const fmtTime = (hhmm) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    return `${hh % 12 || 12}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${hh >= 12 ? "PM" : "AM"}`;
  };
  const HOURS_TEXT = `${fmtTime(SITE.hours[0])} – ${fmtTime(SITE.hours[1])}`;
  const LAB_TEXT = `${fmtTime(SITE.labHours[0])} – ${fmtTime(SITE.labHours[1])}`;
  const nowMinutes = () => { const now = new Date(); return now.getHours() * 60 + now.getMinutes(); };
  const inHours = (h, m = nowMinutes()) => m >= toMin(h[0]) && m < toMin(h[1]);

  /* ---------------------------------------------------------------- Layout */
  const NAV = [
    { href: "index.html", key: "nav.home", label: ["Home", "முகப்பு"], page: "home" },
    { href: "about.html", key: "nav.about", label: ["Doctor", "மருத்துவர்"], page: "about" },
    { href: "services.html", key: "nav.services", label: ["Services", "சிகிச்சைகள்"], page: "services" },
    { href: "appointment.html", key: "nav.book", label: ["Appointment", "முன்பதிவு"], page: "appointment" },
    { href: "contact.html", key: "nav.contact", label: ["Contact", "தொடர்பு"], page: "contact" },
  ];
  const navLabel = (n) => n.label[I.lang === "ta" ? 1 : 0];

  function brandHtml(light) {
    return `<a class="brand${light ? " light" : ""}" href="index.html" aria-label="${SITE.name}">
      <img src="img/logo.svg" alt="" width="52" height="52">
      <span class="brand-text"><span class="brand-name">Varnika <span>Speciality Hospital</span></span><span class="brand-tag">${L(SITE.tagline)}</span></span>
    </a>`;
  }

  function renderHeader() {
    const slot = $("[data-include='header']");
    if (!slot) return;
    const page = document.body.dataset.page;
    slot.innerHTML = `
      <div class="topbar">
        <div class="container">
          <span class="status-pill sm" data-open-status="short"></span>
          <span class="tb-item hide-sm">${icon("pin")} ${L(SITE.addressShort)}</span>
          <a class="tb-item" href="${telHref(SITE.phone)}">${icon("phone")} ${SITE.phone}</a>
        </div>
      </div>
      <header class="site-header">
        <div class="container">
          ${brandHtml(false)}
          <nav class="nav" id="nav" aria-label="Main">
            ${NAV.map((n) => `<a href="${n.href}"${n.page === page ? ' class="active" aria-current="page"' : ""}>${navLabel(n)}</a>`).join("")}
            <a class="btn btn-gold nav-book" href="appointment.html">${icon("calendar")} ${I.lang === "ta" ? "முன்பதிவு செய்ய" : "Book appointment"}</a>
          </nav>
          <div class="header-actions">
            <button class="lang-btn" type="button" data-lang-toggle aria-label="${t("switchLabel")}" lang="${I.lang === "ta" ? "en" : "ta"}">${icon("globe")}<span>${t("switchTo")}</span></button>
            <a class="btn btn-gold btn-sm header-book" href="appointment.html">${icon("calendar")} <span>${I.lang === "ta" ? "முன்பதிவு" : "Book"}</span></a>
            <button class="menu-toggle" type="button" aria-label="${t("menu")}" aria-expanded="false" aria-controls="nav">${icon("menu")}</button>
          </div>
        </div>
      </header>`;
  }

  function renderFooter() {
    const slot = $("[data-include='footer']");
    if (!slot) return;
    const d = SITE.doctor;
    slot.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              ${brandHtml(true)}
              <p>${L(d.name)}, ${L(d.quals)}<br>${L(d.title)}<br>${I.lang === "ta" ? "பதிவு எண்" : "Reg. No."} ${d.reg}</p>
            </div>
            <div>
              <h4>${t("pages")}</h4>
              <ul>${NAV.map((n) => `<li><a href="${n.href}">${navLabel(n)}</a></li>`).join("")}</ul>
            </div>
            <div>
              <h4>${t("visitUs")}</h4>
              <ul class="footer-contact">
                <li>${icon("pin")}<span>${L(SITE.address)}<br><a href="${SITE.mapLink}" target="_blank" rel="noopener">${t("openMaps")}</a></span></li>
                <li>${icon("clock")}<span>${t("everyDayHours", { h: HOURS_TEXT, lab: LAB_TEXT })}</span></li>
                <li><span class="g-logo" aria-hidden="true">G</span><a href="${SITE.googleProfile}" target="_blank" rel="noopener">${t("googleProfile")}</a></li>
                <li>${icon("phone")}<a href="${telHref(SITE.phone)}">${SITE.phone}</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} ${SITE.name} · ${SITE.domain}</span>
            <span>${t("notEmergency")}</span>
          </div>
        </div>
      </footer>
      <div class="fab-wrap">
        <button class="fab top" type="button" aria-label="${t("backTop")}">${icon("arrow-up")}</button>
        <a class="fab wa" href="${waHref(t("waHello"))}" target="_blank" rel="noopener" aria-label="${t("chatWa")}">${icon("chat")}</a>
        <a class="fab call" href="${telHref(SITE.phone)}" aria-label="${t("callUs")}">${icon("phone")}</a>
      </div>
      <div class="toast" role="status" aria-live="polite"></div>`;
  }

  // Fill [data-site="key"] / [data-doctor="key"] elements from SITE so details live in one place.
  function fillSiteData() {
    $$("[data-site]").forEach((el) => {
      const v = L(SITE[el.dataset.site]);
      if (v == null) return;
      el.textContent = v;
    });
    $$("[data-doctor]").forEach((el) => { el.textContent = L(SITE.doctor[el.dataset.doctor]); });
    $$("[data-hours]").forEach((el) => { el.textContent = HOURS_TEXT; });
    $$("[data-lab-hours]").forEach((el) => { el.textContent = LAB_TEXT; });
    $$("[data-google]").forEach((a) => { a.href = SITE.googleProfile; });
    $$("[data-wa]").forEach((el) => { el.href = waHref(t("waHello")); });
    $$("[data-tel]").forEach((el) => { el.href = telHref(SITE.phone); });
    $$("[data-directions]").forEach((a) => { a.href = SITE.mapLink; });
    $$("[data-email]").forEach((a) => { a.href = "mailto:" + SITE.email; a.textContent = SITE.email; });
    // Doctor photo: show initials until img/doctor.jpg exists.
    $$("[data-photo]:not([data-ready])").forEach((el) => {
      el.dataset.ready = "1";
      el.textContent = SITE.doctor.initials;
      const img = new Image();
      img.alt = L(SITE.doctor.name);
      img.onload = () => { el.textContent = ""; el.appendChild(img); el.classList.add("has-img"); };
      img.src = SITE.doctor.photo;
    });
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
  // One set of listeners on the document, so they survive the header/footer being re-drawn.
  function initGlobal() {
    const setMenu = (open) => {
      const nav = $("#nav"), toggle = $(".menu-toggle");
      if (!nav || !toggle) return;
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = icon(open ? "x" : "menu");
    };
    document.addEventListener("click", (e) => {
      if (e.target.closest(".menu-toggle")) { setMenu(!$("#nav").classList.contains("open")); return; }
      if (e.target.closest("#nav a")) setMenu(false);
      if (e.target.closest("[data-lang-toggle]")) {
        I.set(I.lang === "ta" ? "en" : "ta");
        renderAll();
        return;
      }
      if (e.target.closest(".fab.top")) window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    const onScroll = () => {
      const y = window.scrollY;
      const top = $(".fab.top");
      top && top.classList.toggle("show", y > 600);
      document.body.classList.toggle("scrolled", y > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  let revealer = null;
  function initReveal() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    revealer = revealer || new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealer.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    // Stagger cards that sit side by side.
    els.forEach((el) => {
      const siblings = el.parentElement ? $$(":scope > .reveal", el.parentElement) : [el];
      el.style.setProperty("--delay", `${Math.min(siblings.indexOf(el), 5) * 80}ms`);
      revealer.observe(el);
    });
  }

  // Open = the lab is open; the long label also says whether the doctor is in yet.
  function renderOpenStatus() {
    const open = inHours(SITE.labHours);
    const doctorIn = inHours(SITE.hours);
    $$("[data-open-status]").forEach((el) => {
      el.classList.toggle("closed", !open);
      const short = el.dataset.openStatus === "short";
      const text = !open ? t(short ? "closedShort" : "closedNow", { t: fmtTime(SITE.labHours[0]) })
        : short ? t("openShort")
        : doctorIn ? t("openDoctor", { t: fmtTime(SITE.hours[1]) }) : t("openLab", { t: fmtTime(SITE.hours[0]) });
      el.innerHTML = `<span class="dot"></span> ${text}`;
    });
    $$("[data-hours-table]").forEach((table) => {
      const today = new Date().getDay();
      const row = (th, cls) => `<tr class="${cls || ""}"><th>${th}</th><td class="lab">${LAB_TEXT}</td><td>${HOURS_TEXT}</td></tr>`;
      table.innerHTML = `<tr class="head"><th>${t("colDay")}</th><td class="lab">${t("colLab")}</td><td>${t("colDoctor")}</td></tr>`
        + [1, 2, 3, 4, 5, 6, 0].map((d) => row(`${I.dayLong(d)}${d === today ? t("todayMark") : ""}`, d === today ? "today" : "")).join("")
        + row(t("holidays"));
    });
  }

  /* ---------------------------------------------------------------- Facilities & services */
  const renderers = []; // re-run when the language changes

  function initFacilities() {
    const wrap = $("#facility-grid");
    if (!wrap) return;
    const render = () => {
      wrap.innerHTML = window.FACILITIES.map((f) => `
        <div class="feature c-${f.color} reveal">
          <span class="feature-icon">${icon(f.icon)}</span>
          <h3>${L(f.title)}</h3>
          <p>${L(f.text)}</p>
        </div>`).join("");
    };
    render();
    renderers.push(() => { render(); $$(".reveal", wrap).forEach((el) => el.classList.add("in")); });
  }

  const groupOf = (id) => window.SERVICE_GROUPS.find((g) => g.id === id);
  function serviceCard(s) {
    const g = groupOf(s.group);
    const where = { here: `<span class="chip here">${icon("clinic")} ${t("atHere")}</span>`, hospital: `<span class="chip away">${icon("hospital")} ${t("atHospital")}</span>` };
    return `<article class="svc c-${g.color} reveal">
      <div class="svc-head"><span class="svc-icon">${icon(s.icon)}</span><div><span class="svc-group">${L(g.name)}</span><h3>${L(s.title)}</h3></div></div>
      <p>${L(s.text)}</p>
      <ul class="ticks">${L(s.items).map((i) => `<li>${icon("check")}<span>${i}</span></li>`).join("")}</ul>
      <div class="where">${s.where.map((w) => where[w]).join("")}</div>
    </article>`;
  }

  function initServices() {
    const grid = $("#service-grid");
    if (!grid) return;
    const limit = parseInt(grid.dataset.limit || "0", 10);
    const tabs = $("#service-tabs");
    const search = $("#service-search");
    let group = new URLSearchParams(location.search).get("group") || "all";
    if (!window.SERVICE_GROUPS.some((g) => g.id === group)) group = "all";

    const render = (animate) => {
      const q = search ? search.value.trim().toLowerCase() : "";
      let list = window.SERVICES.filter((s) => (group === "all" || s.group === group)
        && (!q || [s.title.en, s.title.ta, s.text.en, s.text.ta, ...s.items.en, ...s.items.ta].join(" ").toLowerCase().includes(q)));
      if (limit) list = list.slice(0, limit);
      grid.innerHTML = list.length ? list.map(serviceCard).join("")
        : `<div class="empty">${t("noService", { q: escapeHtml(q) })}</div>`;
      if (!animate) $$(".reveal", grid).forEach((el) => el.classList.add("in"));
    };
    const renderTabs = () => {
      if (!tabs) return;
      tabs.innerHTML = window.SERVICE_GROUPS.map((g) => `<button class="tab c-${g.color}" type="button" data-group="${g.id}" aria-pressed="${g.id === group}">${L(g.name)}</button>`).join("");
    };
    if (tabs) {
      tabs.addEventListener("click", (e) => {
        const b = e.target.closest("[data-group]");
        if (!b) return;
        group = b.dataset.group;
        $$(".tab", tabs).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        render(false);
      });
    }
    search && search.addEventListener("input", () => render(false));
    renderTabs();
    render(true);
    renderers.push(() => { renderTabs(); render(false); });
  }

  function initFaq() {
    const root = $("#faq-list");
    if (!root) return;
    const render = () => {
      const open = $$("details", root).findIndex((d) => d.open);
      root.innerHTML = window.FAQS.map((f, i) => `
        <details class="reveal${root.dataset.drawn ? " in" : ""}"${i === (open < 0 && !root.dataset.drawn ? 0 : open) ? " open" : ""}>
          <summary>${L(f.q)}${icon("chevron-down")}</summary>
          <div class="faq-a">${L(f.a).replace(/\{hours\}/g, HOURS_TEXT).replace(/\{lab\}/g, LAB_TEXT).replace(/\{labStart\}/g, fmtTime(SITE.labHours[0]))}</div>
        </details>`).join("");
      root.dataset.drawn = "1";
    };
    render();
    root.addEventListener("toggle", (e) => {
      if (e.target.open) $$("details", root).forEach((d) => { if (d !== e.target) d.open = false; });
    }, true);
    renderers.push(render);
  }

  function initMap() {
    const map = $("#map");
    if (!map) return;
    map.innerHTML = `<iframe title="Map showing ${SITE.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed"></iframe>`;
  }

  /* ---------------------------------------------------------------- Forms */
  const VALIDATORS = {
    required: (v) => v.trim().length > 0,
    phone: (v) => /^(\+?91[\s-]?|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
    age: (v) => v !== "" && +v >= 0 && +v <= 120,
  };
  function validateFields(fields) {
    let first = null;
    fields.forEach((input) => {
      const valid = (input.dataset.validate || "").split(" ").filter(Boolean).every((r) => VALIDATORS[r](input.value));
      input.closest(".field").classList.toggle("invalid", !valid);
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid && !first) first = input;
    });
    first && first.focus();
    return !first;
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
      const msg = `Hello ${SITE.name},\n\nName: ${data.name}\nPhone: ${data.phone}\nTopic: ${data.topic}\n\n${data.message}`;
      window.open(waHref(msg), "_blank", "noopener");
      toast(t("waOpening"));
    });
  }

  /* ---------------------------------------------------------------- Appointment */
  // label[0] (English) is what reception sees in the OPD app.
  const REASONS = [
    { id: "injury", icon: "bandage", color: "orange", label: ["Fracture or injury", "எலும்பு முறிவு / காயம்"], hint: ["Fall, accident, sprain", "விழுதல், விபத்து, சுளுக்கு"] },
    { id: "joint", icon: "bone", color: "blue", label: ["Joint pain", "மூட்டு வலி"], hint: ["Knee, hip, shoulder…", "முழங்கால், இடுப்பு, தோள்…"] },
    { id: "spine", icon: "spine", color: "purple", label: ["Back or neck pain", "முதுகு / கழுத்து வலி"], hint: ["Including sciatica", "சியாட்டிகா உட்பட"] },
    { id: "child", icon: "baby", color: "pink", label: ["Child's bone problem", "குழந்தையின் எலும்புப் பிரச்சனை"], hint: ["Clubfoot, bow legs, limp…", "கோணல் பாதம், வளைந்த கால்…"] },
    { id: "sports", icon: "dumbbell", color: "green", label: ["Sports injury", "விளையாட்டுக் காயம்"], hint: ["Ligament, meniscus", "தசைநார், மெனிஸ்கஸ்"] },
    { id: "hand-foot", icon: "hand", color: "teal", label: ["Hand, wrist or foot", "கை, மணிக்கட்டு / பாதம்"], hint: ["Numbness, heel pain…", "மரத்துப்போதல், குதிகால் வலி…"] },
    { id: "followup", icon: "calendar", color: "navy", label: ["Follow-up / plaster check", "மறுபரிசோதனை / மாவுக்கட்டு"], hint: ["Review after treatment", "சிகிச்சைக்குப் பின்"] },
    { id: "tests", icon: "scan", color: "red", label: ["X-ray, ECG or lab test", "எக்ஸ்-ரே, ECG / லேப்"], hint: ["Investigations only", "பரிசோதனை மட்டும்"] },
    { id: "other", icon: "stethoscope", color: "gold", label: ["Other", "மற்றவை"], hint: ["Describe in the next step", "அடுத்த படியில் விவரிக்கவும்"] },
  ];
  const li = () => (I.lang === "ta" ? 1 : 0);
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const prettyDate = (k) => { const d = parseKey(k); return `${I.day(d.getDay())}, ${d.getDate()} ${I.month(d.getMonth())} ${d.getFullYear()}`; };
  // For messages to the hospital: always English.
  const prettyDateEn = (k) => { const d = parseKey(k); return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); };
  const slotTimes = () => {
    const out = [];
    for (let m = toMin(SITE.hours[0]); m < toMin(SITE.hours[1]); m += 15) out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    return out;
  };

  function initBooking() {
    const root = $("#booking");
    if (!root) return;
    const state = { step: 0, reason: null, date: null, time: null };
    const panels = $$(".step-panel", root);
    const prog = $$(".progress li", root);
    const back = $("#wiz-back"), next = $("#wiz-next"), nav = $(".wizard-nav", root);
    const form = $("#patient-form");
    const errorBox = $("#book-error");
    liveClear(form);
    const reason = () => REASONS.find((r) => r.id === state.reason);
    const reasonLabel = () => (reason() ? reason().label[li()] : "");

    // Online booking: requests go straight into the hospital's OPD software. Until the
    // service answers (or when it is off or unreachable) the request is sent on WhatsApp.
    const api = window.BookingAPI;
    const service = { online: false, closed: false, lastDate: null };
    const upi = { fee: 0, id: null, name: null }; // the hospital's UPI, when it takes an online fee
    const taken = {}; // date -> Set of "HH:MM" that are full or past
    const useOnline = () => service.online && !service.closed;
    if (api) {
      api.options().then((o) => {
        service.online = true;
        service.closed = !o.accepting;
        service.lastDate = o.last_date || null;
        if (o.fee > 0 && o.upi_id) Object.assign(upi, { fee: o.fee, id: o.upi_id, name: o.upi_name || SITE.name });
        renderMine();
        drawPayment();
        $("#booking-closed").hidden = !service.closed;
        if (state.step === 1) renderDates();
      }).catch(() => { service.online = false; });
    }
    function loadTaken(date) {
      if (!useOnline()) return;
      api.takenSlots(date).then((list) => {
        taken[date] = new Set(Array.isArray(list) ? list : []);
        if (state.date !== date) return;
        if (state.time && taken[date].has(state.time)) state.time = null;
        renderSlots();
        next.disabled = !canNext();
        renderSummary();
      }).catch(() => { /* times just stay open; the booking itself is checked again */ });
    }
    function showError(msg) {
      errorBox.hidden = !msg;
      $("span", errorBox).textContent = msg || "";
      if (msg) errorBox.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function renderReasons() {
      $("#pick-reason").innerHTML = REASONS.map((r) => `
        <button type="button" class="pick c-${r.color}" data-id="${r.id}" aria-pressed="${state.reason === r.id}">
          <span class="pick-icon">${icon(r.icon)}</span><span><strong>${r.label[li()]}</strong><small>${r.hint[li()]}</small></span>
        </button>`).join("");
    }
    function renderDates() {
      const today = new Date();
      const chips = [];
      for (let i = 0; i < 14; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        const k = dateKey(d);
        if (service.lastDate && k > service.lastDate) break;
        chips.push(`<button type="button" class="date-chip ${state.date === k ? "selected" : ""}" data-date="${k}" aria-pressed="${state.date === k}">
          <small>${i === 0 ? t("today") : I.day(d.getDay())}</small><strong>${d.getDate()}</strong><small>${I.month(d.getMonth())}</small></button>`);
      }
      $("#date-strip").innerHTML = chips.join("");
      renderSlots();
    }
    function renderSlots() {
      const wrap = $("#slot-wrap");
      if (!state.date) { wrap.innerHTML = `<p class="muted pick-hint">${t("pickDate")}</p>`; return; }
      const now = new Date();
      const isToday = dateKey(now) === state.date;
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const times = slotTimes();
      const full = taken[state.date] || new Set();
      const html = times.map((x) => {
        const past = isToday && toMin(x) <= nowMin;
        const isFull = !past && full.has(x);
        return `<button type="button" class="slot ${state.time === x ? "selected" : ""}${isFull ? " taken" : ""}" data-time="${x}" ${past || isFull ? "disabled" : ""} aria-pressed="${state.time === x}"${isFull ? ` title="${t("fullTitle")}"` : ""}>${fmtTime(x)}${isFull ? `<small>${t("full")}</small>` : ""}</button>`;
      }).join("");
      const allPast = isToday && times.every((x) => toMin(x) <= nowMin);
      const allFull = times.every((x) => (isToday && toMin(x) <= nowMin) || full.has(x));
      wrap.innerHTML = allPast ? `<p class="muted pick-hint">${t("hoursOver")}</p>`
        : allFull ? `<p class="muted pick-hint">${t("dayFull")}</p>`
        : `<div class="slots">${html}</div>
           <p class="slot-legend"><span class="key open"></span> ${t("available")} <span class="key full"></span> ${t("full")} <span class="key mine"></span> ${t("yourChoice")}</p>`;
    }
    function renderSummary() {
      const rows = { "sum-reason": reasonLabel(), "sum-date": state.date && prettyDate(state.date), "sum-time": state.time && fmtTime(state.time) };
      Object.entries(rows).forEach(([id, v]) => {
        const el = $("#" + id);
        el.textContent = v || t("notSelected");
        el.classList.toggle("empty-val", !v);
      });
    }
    const genderLabel = (g) => ({ Female: ["Female", "பெண்"], Male: ["Male", "ஆண்"], Other: ["Other", "மற்றவர்"] }[g] || [g, g])[li()];
    function renderReview() {
      const data = Object.fromEntries(new FormData(form));
      const rows = [
        [t("rReason"), reasonLabel()],
        [t("rDoctor"), `${L(SITE.doctor.name)} (${L(SITE.doctor.title)})`],
        [t("rDate"), prettyDate(state.date)],
        [t("rTime"), fmtTime(state.time)],
        [t("rPatient"), `${data.name}, ${t("yrs", { n: data.age })}, ${genderLabel(data.gender)}`],
        [t("rMobile"), data.phone],
        ...(data.notes ? [[t("rDetails"), data.notes]] : []),
      ];
      $("#review").innerHTML = `<tbody>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${escapeHtml(v)}</td></tr>`).join("")}</tbody>`;
    }
    const canNext = () => [!!state.reason, !!(state.date && state.time), true, true][state.step];

    function show() {
      panels.forEach((p, i) => p.classList.toggle("active", i === state.step));
      prog.forEach((el, i) => { el.classList.toggle("done", i < state.step); el.classList.toggle("current", i === state.step); });
      back.style.visibility = state.step === 0 ? "hidden" : "visible";
      next.innerHTML = state.step === 3 ? `${icon("check")} ${t("confirm")}` : `${t("next")} ${icon("arrow")}`;
      next.className = state.step === 3 ? "btn btn-gold" : "btn btn-navy";
      next.disabled = !canNext();
      nav.hidden = state.step === 4;
      showError("");
      if (state.step === 0) renderReasons();
      if (state.step === 1) renderDates();
      if (state.step === 3) renderReview();
      renderSummary();
    }
    function scrollToTop() {
      const y = root.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: "smooth" });
    }

    root.addEventListener("click", (e) => {
      const pick = e.target.closest("#pick-reason .pick");
      const chip = e.target.closest(".date-chip");
      const slot = e.target.closest(".slot");
      if (pick) {
        state.reason = pick.dataset.id;
        renderReasons();
        renderSummary();
        setTimeout(() => { state.step = 1; show(); scrollToTop(); }, 220);
      } else if (chip) {
        state.date = chip.dataset.date;
        state.time = null;
        $$(".date-chip", root).forEach((c) => { c.classList.toggle("selected", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
        renderSlots();
        loadTaken(state.date);
        next.disabled = !canNext();
        renderSummary();
      } else if (slot && !slot.disabled) {
        state.time = slot.dataset.time;
        $$(".slot", root).forEach((s) => { s.classList.toggle("selected", s === slot); s.setAttribute("aria-pressed", String(s === slot)); });
        next.disabled = !canNext();
        renderSummary();
      }
    });
    back.addEventListener("click", () => { state.step = Math.max(0, state.step - 1); show(); scrollToTop(); });
    next.addEventListener("click", () => {
      if (state.step === 2 && !validateFields($$("[data-validate]", form))) return;
      if (state.step === 3) { confirm(); return; }
      state.step += 1;
      show();
      scrollToTop();
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); next.click(); });

    const newRef = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const bytes = crypto.getRandomValues(new Uint8Array(6));
      return "VHC-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
    };
    // Which wizard step / field to send the patient back to for each service error.
    const FIELD_ERRORS = { bad_name: "p-name", bad_phone: "p-phone", bad_age: "p-age", bad_gender: null, bad_notes: "p-notes" };
    const SLOT_ERRORS = ["bad_date", "bad_time", "slot_past", "slot_full", "day_full"];
    let sending = false;
    let last = null; // the finished booking, so the success screen can be re-drawn in the other language

    async function confirm() {
      if (sending) return;
      const data = Object.fromEntries(new FormData(form));
      const appt = { ref: newRef(), reason: reason().label[0], date: state.date, time: state.time, name: data.name.trim() };
      if (!useOnline()) { finish(appt, data, false); return; }

      sending = true;
      next.disabled = back.disabled = true;
      next.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${t("sending")}`;
      const send = () => api.book({
        ref: appt.ref, reason: appt.reason, preferred_date: appt.date, preferred_time: appt.time,
        patient_name: appt.name, phone: data.phone, age: parseInt(data.age, 10), gender: data.gender,
        notes: (data.notes || "").trim() || null,
      });
      let r = null;
      try {
        r = await send();
        if (r && r.ok === false && (r.error === "bad_ref" || r.error === "ref_taken")) { appt.ref = newRef(); r = await send(); }
      } catch { r = null; }
      sending = false;
      back.disabled = false;
      show();

      // No answer, a broken answer, or booking switched off: send it on WhatsApp instead.
      if (!r || typeof r.ok !== "boolean" || r.error === "closed") { finish(appt, data, false); return; }
      if (r.ok) {
        appt.fee = r.fee || 0;
        appt.payStatus = r.payment_status || "none";
        finish(appt, data, true);
        return;
      }

      if (r.error in FIELD_ERRORS) {
        state.step = 2;
        show();
        const input = FIELD_ERRORS[r.error] && $("#" + FIELD_ERRORS[r.error]);
        if (input) { input.closest(".field").classList.add("invalid"); input.setAttribute("aria-invalid", "true"); input.focus(); }
      } else if (SLOT_ERRORS.includes(r.error)) {
        delete taken[state.date];
        state.time = null;
        state.step = 1;
        show();
        loadTaken(state.date);
      }
      showError(I.errorText(r.error, r.message || t("bookFailed")));
    }

    // sent = the hospital's OPD software has the request; otherwise the patient sends it on WhatsApp.
    function finish(appt, data, sent) {
      const all = store.get("vhc-appointments", []);
      all.push({ ...appt, sent, phone: data.phone, data: { age: data.age, gender: data.gender, notes: data.notes || "" } });
      store.set("vhc-appointments", all);
      last = { appt, data, sent };
      drawSuccess();
      state.step = 4;
      show();
      scrollToTop();
      renderMine();
    }
    function drawSuccess() {
      if (!last) return;
      const { appt, data, sent } = last;
      const msg = `Hello ${SITE.name}, I would like an appointment.\n\nRef: ${appt.ref}\nPatient: ${appt.name} (${data.age} yrs, ${data.gender})\nMobile: ${data.phone}\nReason: ${appt.reason}\nPreferred: ${prettyDateEn(appt.date)} at ${fmtTime(appt.time)}${data.notes ? "\nDetails: " + data.notes : ""}`;
      $("#success-title").textContent = sent ? t("titleSent") : t("titleReady");
      $("#success-sent").hidden = !sent;
      $("#success-unsent").hidden = sent;
      $("#success-ref").textContent = appt.ref;
      $("#success-when").textContent = `${prettyDate(appt.date)} · ${fmtTime(appt.time)} · ${L(SITE.doctor.name)}`;
      $("#success-wa").href = waHref(msg);
      $("#success-wa").hidden = sent;
      $("#success-ics").onclick = () => downloadIcs(appt);
      drawPayment();
    }

    // The OPD fee by UPI (when the hospital takes one): open the UPI app or scan the QR,
    // then send the 12-digit UTR, which reception checks against the bank / UPI app.
    const payBox = $("#pay-box"), payError = $("#pay-error");
    const showPayError = (msg) => { payError.hidden = !msg; $("span", payError).textContent = msg || ""; };
    function drawPayment() {
      const a = last && last.sent ? last.appt : null;
      const due = !!(a && a.fee > 0 && upi.id && (a.payStatus === "pending" || a.payStatus === "rejected"));
      payBox.hidden = !due;
      $("#pay-done").hidden = !(a && a.fee > 0 && (a.payStatus === "submitted" || a.payStatus === "verified"));
      if (!due) return;
      const link = `upi://pay?pa=${encodeURIComponent(upi.id)}&pn=${encodeURIComponent(upi.name)}&am=${a.fee}.00&cu=INR&tn=${encodeURIComponent("OPD " + a.ref)}`;
      $("#pay-amount").textContent = `₹${a.fee}`;
      $("#pay-upi").href = link;
      $("#pay-upi-id").textContent = upi.id;
      $("#pay-name").textContent = upi.name;
      const qrBox = $("#pay-qr");
      if (qrBox.dataset.link !== link && window.qrcode) {
        const qr = window.qrcode(0, "M");
        qr.addData(link);
        qr.make();
        qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
        qrBox.dataset.link = link;
      }
    }
    $("#pay-copy").addEventListener("click", () => {
      if (navigator.clipboard) navigator.clipboard.writeText(upi.id).then(() => toast(t("copied")), () => undefined);
    });
    $("#pay-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!last || sending) return;
      const a = last.appt;
      const utr = $("#pay-utr").value.replace(/\D/g, "");
      if (!/^\d{12}$/.test(utr)) { showPayError(t("utrBad")); $("#pay-utr").focus(); return; }
      showPayError("");
      const btn = $("#pay-send");
      btn.disabled = sending = true;
      let r = null;
      try { r = await api.submitPayment(a.ref, a.phone || last.data.phone, utr); } catch { r = null; }
      btn.disabled = sending = false;
      if (r && r.ok) {
        a.payStatus = r.payment_status || "submitted";
        store.set("vhc-appointments", store.get("vhc-appointments", []).map((x) => (x.ref === a.ref ? { ...x, payStatus: a.payStatus } : x)));
        drawPayment();
        renderMine();
        $("#pay-done").scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else if (r && r.error) {
        showPayError(I.errorText(r.error, r.message));
      } else {
        showPayError(t("payFailed"));
      }
    });
    $("#book-another").addEventListener("click", () => {
      Object.assign(state, { step: 0, reason: null, date: null, time: null });
      last = null;
      form.reset();
      show();
      scrollToTop();
    });
    $("#success-print").addEventListener("click", () => window.print());

    function renderMine() {
      const wrap = $("#my-appts");
      const todayKey = dateKey(new Date());
      const list = store.get("vhc-appointments", []).filter((a) => a.date >= todayKey).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      $("#my-appts-box").hidden = !list.length;
      const due = (a) => a.sent && a.fee > 0 && (a.payStatus === "pending" || a.payStatus === "rejected");
      wrap.innerHTML = list.map((a) => `<div class="appt-row${a.sent ? " sent" : ""}${due(a) ? " due" : ""}">
        <div class="info"><strong>${prettyDate(a.date)} · ${fmtTime(a.time)}</strong><small>${escapeHtml(a.name)} · ${escapeHtml(a.reason)} · ${escapeHtml(a.ref)}${a.sent ? t("sentTag") : ""}${a.fee > 0 ? t(due(a) ? "payDue" : "paySent") : ""}</small>
          ${due(a) && upi.id ? `<button class="btn btn-gold btn-sm pay-again" type="button" data-pay="${escapeHtml(a.ref)}">${t("payNow", { fee: a.fee })}</button>` : ""}</div>
        <button class="icon-btn" type="button" data-cancel="${escapeHtml(a.ref)}" aria-label="${t("remove")} ${escapeHtml(a.ref)}">${icon("trash")}</button>
      </div>`).join("");
    }
    $("#my-appts").addEventListener("click", (e) => {
      const p = e.target.closest("[data-pay]");
      if (p) {
        const a = store.get("vhc-appointments", []).find((x) => x.ref === p.dataset.pay);
        if (!a) return;
        last = { appt: a, data: { phone: a.phone, ...(a.data || {}) }, sent: true };
        state.step = 4;
        drawSuccess();
        show();
        scrollToTop();
        return;
      }
      const b = e.target.closest("[data-cancel]");
      if (!b || !window.confirm(t("removeAsk"))) return;
      store.set("vhc-appointments", store.get("vhc-appointments", []).filter((a) => a.ref !== b.dataset.cancel));
      renderMine();
      toast(t("removed"));
    });

    show();
    renderMine();
    renderers.push(() => { const err = errorBox.hidden ? "" : $("span", errorBox).textContent; show(); drawSuccess(); renderMine(); if (err) showError(err); });
  }

  function downloadIcs(a) {
    const start = parseKey(a.date);
    const [hh, mm] = a.time.split(":").map(Number);
    start.setHours(hh, mm);
    const end = new Date(start.getTime() + 15 * 60000);
    const fmt = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Varnika Speciality Hospital//Appointments//EN", "BEGIN:VEVENT",
      `UID:${a.ref}@${SITE.domain}`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${SITE.name} — ${SITE.doctor.name.en}`,
      `DESCRIPTION:Ref ${a.ref}. ${a.reason}. Please arrive 15 minutes early for vitals and tests; if late, you join the regular walk-in queue. Lab and X-ray open from ${fmtTime(SITE.labHours[0])}. Bring earlier X-rays and reports. Call ${SITE.phone} to change.`,
      `LOCATION:${SITE.address.en.replace(/,/g, "\\,")}`,
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
  function renderAll() {
    I.applyStatic();
    renderHeader();
    renderFooter();
    fillSiteData();
    renderOpenStatus();
    renderers.forEach((fn) => fn());
  }

  function boot() {
    injectSprite();
    I.applyStatic();
    renderHeader();
    renderFooter();
    fillSiteData();
    renderOpenStatus();
    initGlobal();
    initFacilities();
    initServices();
    initFaq();
    initMap();
    initContactForm();
    initBooking();
    initReveal();
    setInterval(renderOpenStatus, 60000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
