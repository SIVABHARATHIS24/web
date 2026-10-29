/* ==========================================================================
   Varnika Healthcare — site behaviour
   Shared header/footer, icons, and the interactive widgets. Content lives
   in data.js.
   ========================================================================== */
(function () {
  "use strict";

  const SITE = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
  const isOpenNow = () => {
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    return m >= toMin(SITE.hours[0]) && m < toMin(SITE.hours[1]);
  };

  /* ---------------------------------------------------------------- Layout */
  const NAV = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "about.html", label: "Doctor & Clinic", page: "about" },
    { href: "services.html", label: "Services", page: "services" },
    { href: "appointment.html", label: "Appointment", page: "appointment" },
    { href: "contact.html", label: "Contact", page: "contact" },
  ];

  function brandHtml() {
    return `<a class="brand" href="index.html" aria-label="${SITE.name} home">
      <img src="img/logo.svg" alt="" width="46" height="46">
      <span class="brand-name">${SITE.name}<small>${SITE.type}</small></span>
    </a>`;
  }

  function renderHeader() {
    const slot = $("[data-include='header']");
    if (!slot) return;
    const page = document.body.dataset.page;
    slot.outerHTML = `
      <div class="strip">
        <div class="container">
          <span>${icon("clock")} Open daily ${HOURS_TEXT} · Sundays &amp; holidays too</span>
          <span>${icon("pin")} ${SITE.addressShort}</span>
        </div>
      </div>
      <header class="site-header">
        <div class="container">
          ${brandHtml()}
          <nav class="nav" id="nav" aria-label="Main">
            ${NAV.map((n) => `<a href="${n.href}"${n.page === page ? ' class="active" aria-current="page"' : ""}>${n.label}</a>`).join("")}
            <a class="btn btn-green" href="${telHref(SITE.phone)}">${icon("phone")} Call ${SITE.phone}</a>
          </nav>
          <div class="header-actions">
            <a class="btn btn-green btn-sm" href="${telHref(SITE.phone)}">${icon("phone")} ${SITE.phone}</a>
            <button class="btn btn-glass menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav">${icon("menu")}</button>
          </div>
        </div>
      </header>`;
  }

  function renderFooter() {
    const slot = $("[data-include='footer']");
    if (!slot) return;
    const d = SITE.doctor;
    slot.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              ${brandHtml()}
              <p>${d.name}, ${d.quals}<br>${d.title}<br>Reg. No. ${d.reg}</p>
            </div>
            <div>
              <h4>Pages</h4>
              <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul>
            </div>
            <div>
              <h4>Visit us</h4>
              <ul class="footer-contact">
                <li>${icon("pin")}<span>${SITE.address}<br><a href="${SITE.mapLink}" target="_blank" rel="noopener">Open in Google Maps →</a></span></li>
                <li>${icon("clock")}<span>Every day ${HOURS_TEXT}, including Sundays &amp; holidays</span></li>
                <li>${icon("phone")}<a href="${telHref(SITE.phone)}">${SITE.phone}</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} ${SITE.name} — ${SITE.type}</span>
            <span>Not a 24-hour emergency service. In an emergency, call 108.</span>
          </div>
        </div>
      </footer>
      <div class="fab-wrap">
        <button class="fab top" type="button" aria-label="Back to top">${icon("arrow-up")}</button>
        <a class="fab wa" href="${waHref("Hello Varnika Healthcare, I have a query.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("chat")}</a>
        <a class="fab call" href="${telHref(SITE.phone)}" aria-label="Call the clinic">${icon("phone")}</a>
      </div>
      <div class="toast glass" role="status" aria-live="polite"></div>`;
  }

  // Fill [data-site="key"] / [data-doctor="key"] elements from SITE so details live in one place.
  function fillSiteData() {
    $$("[data-site]").forEach((el) => {
      const v = SITE[el.dataset.site];
      if (v == null) return;
      el.textContent = v;
      if (el.tagName === "A" && el.dataset.site === "phone") el.href = telHref(v);
    });
    $$("[data-doctor]").forEach((el) => { el.textContent = SITE.doctor[el.dataset.doctor]; });
    $$("[data-hours]").forEach((el) => { el.textContent = HOURS_TEXT; });
    $$("[data-wa]").forEach((el) => { el.href = waHref(el.dataset.wa); });
    $$("[data-tel]").forEach((el) => { el.href = telHref(SITE.phone); });
    $$("[data-directions]").forEach((a) => { a.href = SITE.mapLink; });
    // Doctor photo: show initials until img/doctor.jpg exists.
    $$("[data-photo]").forEach((el) => {
      el.textContent = SITE.doctor.initials;
      const img = new Image();
      img.alt = SITE.doctor.name;
      img.onload = () => el.appendChild(img);
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
  function initHeader() {
    const nav = $("#nav");
    const toggle = $(".menu-toggle");
    const topBtn = $(".fab.top");
    const onScroll = () => topBtn && topBtn.classList.toggle("show", window.scrollY > 600);
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
  }

  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    els.forEach((el) => io.observe(el));
  }

  function initOpenStatus() {
    $$("[data-open-status]").forEach((el) => {
      const open = isOpenNow();
      el.classList.toggle("closed", !open);
      el.innerHTML = `<span class="dot"></span> ${open ? `Open now · until ${fmtTime(SITE.hours[1])}` : `Closed now · opens ${fmtTime(SITE.hours[0])}`}`;
    });
    const table = $("#hours-table");
    if (table) {
      const today = new Date().getDay();
      const order = [1, 2, 3, 4, 5, 6, 0];
      const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      table.innerHTML = order.map((d) => `<tr class="${d === today ? "today" : ""}"><th>${names[d]}${d === today ? " (today)" : ""}</th><td>${HOURS_TEXT}</td></tr>`).join("")
        + `<tr><th>Public holidays</th><td>${HOURS_TEXT}</td></tr>`;
    }
  }

  /* ---------------------------------------------------------------- Facilities & services */
  function initFacilities() {
    const wrap = $("#facility-grid");
    if (!wrap) return;
    wrap.innerHTML = window.FACILITIES.map((f) => `
      <div class="glass tile reveal">
        <span class="orb green">${icon(f.icon)}</span>
        <h3>${f.title}</h3>
        <p>${f.text}</p>
      </div>`).join("");
  }

  const WHERE = {
    clinic: `<span class="chip-tag clinic">${icon("clinic")} At the clinic</span>`,
    hospital: `<span class="chip-tag hospital">${icon("hospital")} Surgery at nearby hospital</span>`,
  };
  function serviceCard(s) {
    return `<article class="glass win svc reveal">
      <div class="win-title">${icon(s.icon)}<span>${window.SERVICE_GROUPS.find((g) => g.id === s.group).name}</span></div>
      <div class="pane">
        <div class="svc-head"><span class="orb sm">${icon(s.icon)}</span><h3>${s.title}</h3></div>
        <p>${s.text}</p>
        <ul class="ticks">${s.items.map((i) => `<li>${icon("check")}<span>${i}</span></li>`).join("")}</ul>
        <div class="where">${s.where.map((w) => WHERE[w]).join("")}</div>
      </div>
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

    const render = () => {
      const q = search ? search.value.trim().toLowerCase() : "";
      let list = window.SERVICES.filter((s) => (group === "all" || s.group === group)
        && (!q || [s.title, s.text, ...s.items].join(" ").toLowerCase().includes(q)));
      if (limit) list = list.slice(0, limit);
      grid.innerHTML = list.length ? list.map(serviceCard).join("")
        : `<div class="empty">No matching service found for “${escapeHtml(q)}”. Please <a href="contact.html">contact us</a> — we treat all bone and joint problems.</div>`;
      $$(".reveal", grid).forEach((el) => el.classList.add("in"));
    };
    if (tabs) {
      tabs.innerHTML = window.SERVICE_GROUPS.map((g) => `<button class="tab" type="button" data-group="${g.id}" aria-pressed="${g.id === group}">${g.name}</button>`).join("");
      tabs.addEventListener("click", (e) => {
        const b = e.target.closest("[data-group]");
        if (!b) return;
        group = b.dataset.group;
        $$(".tab", tabs).forEach((t) => t.setAttribute("aria-pressed", String(t === b)));
        render();
      });
    }
    search && search.addEventListener("input", render);
    render();
  }

  function initFaq() {
    const root = $("#faq-list");
    if (!root) return;
    root.innerHTML = window.FAQS.map((f, i) => `
      <details class="glass reveal"${i === 0 ? " open" : ""}>
        <summary>${f.q}${icon("chevron-down")}</summary>
        <div class="pane">${f.a}</div>
      </details>`).join("");
    root.addEventListener("toggle", (e) => {
      if (e.target.open) $$("details", root).forEach((d) => { if (d !== e.target) d.open = false; });
    }, true);
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
    phone: (v) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
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
      toast("Opening WhatsApp to send your message…");
    });
  }

  /* ---------------------------------------------------------------- Appointment */
  const REASONS = [
    { id: "injury", icon: "bandage", label: "Fracture or injury", hint: "Fall, accident, sprain" },
    { id: "joint", icon: "bone", label: "Joint pain", hint: "Knee, hip, shoulder…" },
    { id: "spine", icon: "spine", label: "Back or neck pain", hint: "Including sciatica" },
    { id: "child", icon: "baby", label: "Child's bone problem", hint: "Clubfoot, bow legs, limp…" },
    { id: "sports", icon: "dumbbell", label: "Sports injury", hint: "Ligament, meniscus" },
    { id: "hand-foot", icon: "hand", label: "Hand, wrist or foot", hint: "Numbness, heel pain…" },
    { id: "followup", icon: "calendar", label: "Follow-up / plaster check", hint: "Review after treatment" },
    { id: "tests", icon: "scan", label: "X-ray, ECG or lab test", hint: "Investigations only" },
    { id: "other", icon: "stethoscope", label: "Other", hint: "Describe in the next step" },
  ];
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const prettyDate = (k) => { const d = parseKey(k); return `${DAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
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
    liveClear(form);
    const reasonLabel = () => (REASONS.find((r) => r.id === state.reason) || {}).label;

    function renderReasons() {
      $("#pick-reason").innerHTML = REASONS.map((r) => `
        <button type="button" class="pick" data-id="${r.id}" aria-pressed="${state.reason === r.id}">
          <span class="orb sm">${icon(r.icon)}</span><span><strong>${r.label}</strong><small>${r.hint}</small></span>
        </button>`).join("");
    }
    function renderDates() {
      const today = new Date();
      const chips = [];
      for (let i = 0; i < 14; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        const k = dateKey(d);
        chips.push(`<button type="button" class="date-chip ${state.date === k ? "selected" : ""}" data-date="${k}" aria-pressed="${state.date === k}">
          <small>${i === 0 ? "Today" : DAY_SHORT[d.getDay()]}</small><strong>${d.getDate()}</strong><small>${MONTHS[d.getMonth()]}</small></button>`);
      }
      $("#date-strip").innerHTML = chips.join("");
      renderSlots();
    }
    function renderSlots() {
      const wrap = $("#slot-wrap");
      if (!state.date) { wrap.innerHTML = `<p class="muted">Pick a date to see times.</p>`; return; }
      const now = new Date();
      const isToday = dateKey(now) === state.date;
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const times = slotTimes();
      const html = times.map((t) => {
        const past = isToday && toMin(t) <= nowMin;
        return `<button type="button" class="slot ${state.time === t ? "selected" : ""}" data-time="${t}" ${past ? "disabled" : ""} aria-pressed="${state.time === t}">${fmtTime(t)}</button>`;
      }).join("");
      const allPast = isToday && times.every((t) => toMin(t) <= nowMin);
      wrap.innerHTML = allPast ? `<p class="muted">Today's clinic hours are over. Please choose another day.</p>` : `<div class="slots">${html}</div>`;
    }
    function renderSummary() {
      const rows = { "sum-reason": reasonLabel(), "sum-date": state.date && prettyDate(state.date), "sum-time": state.time && fmtTime(state.time) };
      Object.entries(rows).forEach(([id, v]) => {
        const el = $("#" + id);
        el.textContent = v || "Not selected";
        el.classList.toggle("empty-val", !v);
      });
    }
    function renderReview() {
      const data = Object.fromEntries(new FormData(form));
      const rows = [
        ["Reason", reasonLabel()],
        ["Doctor", `${SITE.doctor.name} (${SITE.doctor.title})`],
        ["Date", prettyDate(state.date)],
        ["Time", fmtTime(state.time)],
        ["Patient", `${data.name}, ${data.age} yrs, ${data.gender}`],
        ["Mobile", data.phone],
        ...(data.notes ? [["Details", data.notes]] : []),
      ];
      $("#review").innerHTML = `<tbody>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${escapeHtml(v)}</td></tr>`).join("")}</tbody>`;
    }
    const canNext = () => [!!state.reason, !!(state.date && state.time), true, true][state.step];

    function show() {
      panels.forEach((p, i) => p.classList.toggle("active", i === state.step));
      prog.forEach((li, i) => { li.classList.toggle("done", i < state.step); li.classList.toggle("current", i === state.step); });
      back.style.visibility = state.step === 0 ? "hidden" : "visible";
      next.innerHTML = state.step === 3 ? `${icon("check")} Confirm` : `Next ${icon("arrow")}`;
      next.className = state.step === 3 ? "btn btn-green" : "btn btn-primary";
      next.disabled = !canNext();
      nav.hidden = state.step === 4;
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
      const reason = e.target.closest("#pick-reason .pick");
      const chip = e.target.closest(".date-chip");
      const slot = e.target.closest(".slot");
      if (reason) {
        state.reason = reason.dataset.id;
        renderReasons();
        renderSummary();
        setTimeout(() => { state.step = 1; show(); scrollToTop(); }, 200);
      } else if (chip) {
        state.date = chip.dataset.date;
        state.time = null;
        $$(".date-chip", root).forEach((c) => { c.classList.toggle("selected", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
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
    back.addEventListener("click", () => { state.step = Math.max(0, state.step - 1); show(); scrollToTop(); });
    next.addEventListener("click", () => {
      if (state.step === 2 && !validateFields($$("[data-validate]", form))) return;
      if (state.step === 3) { confirm(); return; }
      state.step += 1;
      show();
      scrollToTop();
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); next.click(); });

    function confirm() {
      const data = Object.fromEntries(new FormData(form));
      const ref = "VHC-" + Date.now().toString(36).toUpperCase().slice(-6);
      const appt = { ref, reason: reasonLabel(), date: state.date, time: state.time, name: data.name };
      const all = store.get("vhc-appointments", []);
      all.push(appt);
      store.set("vhc-appointments", all);
      const msg = `Hello ${SITE.name}, I would like an appointment.\n\nRef: ${ref}\nPatient: ${data.name} (${data.age} yrs, ${data.gender})\nMobile: ${data.phone}\nReason: ${appt.reason}\nPreferred: ${prettyDate(state.date)} at ${fmtTime(state.time)}${data.notes ? "\nDetails: " + data.notes : ""}`;
      $("#success-ref").textContent = ref;
      $("#success-when").textContent = `${prettyDate(state.date)} at ${fmtTime(state.time)} · ${SITE.doctor.name}`;
      $("#success-wa").href = waHref(msg);
      $("#success-ics").onclick = () => downloadIcs(appt);
      state.step = 4;
      show();
      scrollToTop();
      renderMine();
    }
    $("#book-another").addEventListener("click", () => {
      Object.assign(state, { step: 0, reason: null, date: null, time: null });
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
      wrap.innerHTML = list.map((a) => `<div class="appt-row">
        <div class="info"><strong>${prettyDate(a.date)} · ${fmtTime(a.time)}</strong><small>${escapeHtml(a.name)} · ${escapeHtml(a.reason)} · ${a.ref}</small></div>
        <button class="btn icon-btn" type="button" data-cancel="${a.ref}" aria-label="Remove ${a.ref}">${icon("trash")}</button>
      </div>`).join("");
    }
    $("#my-appts").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cancel]");
      if (!b || !window.confirm("Remove this request from this device? Please also call the clinic to cancel.")) return;
      store.set("vhc-appointments", store.get("vhc-appointments", []).filter((a) => a.ref !== b.dataset.cancel));
      renderMine();
      toast("Removed from this device.");
    });

    show();
    renderMine();
  }

  function downloadIcs(a) {
    const start = parseKey(a.date);
    const [hh, mm] = a.time.split(":").map(Number);
    start.setHours(hh, mm);
    const end = new Date(start.getTime() + 15 * 60000);
    const fmt = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Varnika Healthcare//Appointments//EN", "BEGIN:VEVENT",
      `UID:${a.ref}@varnikahealthcare`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${SITE.name} — ${SITE.doctor.name}`,
      `DESCRIPTION:Ref ${a.ref}. ${a.reason}. Bring earlier X-rays and reports. Call ${SITE.phone} to change.`,
      `LOCATION:${SITE.address.replace(/,/g, "\\,")}`,
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
    initHeader();
    initOpenStatus();
    initFacilities();
    initServices();
    initFaq();
    initMap();
    initContactForm();
    initBooking();
    initReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
