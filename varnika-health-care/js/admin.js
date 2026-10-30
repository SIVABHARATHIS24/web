/* ==========================================================================
   Varnika Speciality Hospital — the doctor's posting page (admin.html)
   Signs in with the doctor's OPD login (Supabase Auth, email + password), then
   posts news / exercises / advice / achievements through the update-23
   functions. Photos are shrunk on the phone (max 1600 px, WebP or JPEG, under
   2 MB) and uploaded to the public "website-media" bucket. Only the doctor
   login can post or upload; the database checks that, not this page.
   ========================================================================== */
(function () {
  "use strict";

  const cfg = (window.SITE && window.SITE.booking) || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MAX_PHOTOS = 8;
  const MAX_BYTES = 1.9 * 1024 * 1024;
  const BUCKET = "website-media";
  const KIND = {
    event: { emoji: "🎉", name: "Hospital news", hint: "Shows under “Hospital news” on the front page — and as a popup until the day you choose." },
    exercise: { emoji: "🏃", name: "Exercise", hint: "Shows on the Health tips page. Add a YouTube link and / or photos of each step." },
    advice: { emoji: "💡", name: "Health advice", hint: "Shows on the Health tips page." },
    achievement: { emoji: "🏆", name: "Achievement", hint: "Shows on the Doctor page under “Achievements & recognition”." },
  };

  /* ---------------------------------------------------------------- Dates */
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dateKey(d); };
  const pretty = (k) => { if (!k) return ""; const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };

  /* ---------------------------------------------------------------- Session (Supabase Auth) */
  const RT_KEY = "vhc-admin-rt";
  let session = null; // { access, refresh, until }
  const saved = {
    get() { try { return localStorage.getItem(RT_KEY) || sessionStorage.getItem(RT_KEY); } catch { return null; } },
    set(rt, remember) {
      try {
        localStorage.removeItem(RT_KEY); sessionStorage.removeItem(RT_KEY);
        if (rt) (remember ? localStorage : sessionStorage).setItem(RT_KEY, rt);
      } catch { /* not remembered */ }
    },
    remembered() { try { return !!localStorage.getItem(RT_KEY); } catch { return false; } },
  };

  async function readError(res) {
    const data = await res.json().catch(() => ({}));
    return data.error_description || data.msg || data.message || data.error || `Error ${res.status}`;
  }

  async function grant(type, body, remember) {
    const res = await fetch(`${cfg.url}/auth/v1/token?grant_type=${type}`, {
      method: "POST",
      headers: { apikey: cfg.key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await readError(res));
    const d = await res.json();
    session = { access: d.access_token, refresh: d.refresh_token, until: Date.now() + (d.expires_in || 3600) * 1000 };
    saved.set(d.refresh_token, remember);
  }

  async function accessToken() {
    if (!session) throw new Error("Please sign in again.");
    if (Date.now() > session.until - 60000) await grant("refresh_token", { refresh_token: session.refresh }, saved.remembered());
    return session.access;
  }

  async function api(path, { method = "GET", json, body, headers = {} } = {}) {
    const send = async () => fetch(cfg.url + path, {
      method,
      headers: { apikey: cfg.key, Authorization: `Bearer ${await accessToken()}`, ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : body,
    });
    let res = await send();
    if (res.status === 401 && session) { session.until = 0; res = await send(); }
    if (!res.ok) throw new Error(await readError(res));
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
  const rpc = (name, args) => api(`/rest/v1/rpc/${name}`, { method: "POST", json: args || {} });

  /* ---------------------------------------------------------------- Photos */
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));
  const mediaUrl = (path) => `${cfg.url}/storage/v1/object/public/${BUCKET}/${path}`;

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This photo could not be opened. Please choose a JPG or PNG photo.")); };
      img.src = url;
    });
  }
  const toBlob = (canvas, type, q) => new Promise((resolve) => canvas.toBlob(resolve, type, q));

  // A phone photo (5-10 MB) becomes a ~200-400 KB WebP (JPEG where WebP is not supported).
  async function shrink(file) {
    let src;
    try { src = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { src = await loadImage(file); }
    const w0 = src.width, h0 = src.height;
    for (const [max, q] of [[1600, 0.82], [1280, 0.75], [1024, 0.7]]) {
      const k = Math.min(1, max / Math.max(w0, h0));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w0 * k);
      canvas.height = Math.round(h0 * k);
      canvas.getContext("2d").drawImage(src, 0, 0, canvas.width, canvas.height);
      let blob = await toBlob(canvas, "image/webp", q);
      if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", q);
      if (blob && blob.size <= MAX_BYTES) return blob;
    }
    throw new Error("This photo is too large even after shrinking.");
  }

  async function upload(blob) {
    const path = `posts/${uuid()}.${blob.type === "image/webp" ? "webp" : "jpg"}`;
    await api(`/storage/v1/object/${BUCKET}/${path}`, { method: "POST", body: blob, headers: { "Content-Type": blob.type, "cache-control": "max-age=31536000", "x-upsert": "false" } });
    return path;
  }
  async function removeFiles(paths) {
    if (!paths.length) return;
    try { await api(`/storage/v1/object/${BUCKET}`, { method: "DELETE", json: { prefixes: paths } }); } catch { /* a leftover file is harmless */ }
  }

  /* ---------------------------------------------------------------- YouTube */
  // Video id from a YouTube link (watch, youtu.be, shorts, live, embed) or a bare id.
  // null = empty, undefined = not a YouTube link.
  function youTubeId(text) {
    const s = text.trim();
    if (!s) return null;
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    const m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/|v\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : undefined;
  }

  /* ---------------------------------------------------------------- UI helpers */
  let toastTimer;
  function toast(msg) {
    const el = $(".toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }
  function friendly(err) {
    const m = String((err && err.message) || err);
    if (/invalid login credentials/i.test(m)) return "Wrong email or password.";
    if (/only the doctor/i.test(m)) return "Only the doctor login can post on the website.";
    if (/could not find the (function|table)|does not exist/i.test(m)) return "The website posts are not set up yet: run update 23 (23_update_website_posts.sql) in Supabase first.";
    if (/failed to fetch|network/i.test(m)) return "No internet connection. Please try again.";
    if (/row-level security|unauthorized|403/i.test(m)) return "Only the doctor login can upload photos.";
    return m;
  }
  const msg = (id, text, ok) => { const el = $(id); el.textContent = text || ""; el.classList.toggle("ok", !!ok); };

  /* ---------------------------------------------------------------- Sign in / out */
  async function enter() {
    const isDoctor = await rpc("is_opd_doctor");
    if (isDoctor !== true) {
      signOut();
      msg("#sign-in-msg", "This login is not the doctor's. Only the doctor can post on the website.");
      return;
    }
    $("#sign-in").hidden = true;
    $("#workspace").hidden = false;
    $("#sign-out").hidden = false;
    resetForm();
    loadPosts();
    loadDays();
    loadClosed();
  }

  function signOut() {
    if (session) fetch(`${cfg.url}/auth/v1/logout`, { method: "POST", headers: { apikey: cfg.key, Authorization: `Bearer ${session.access}` } }).catch(() => {});
    session = null;
    saved.set(null);
    $("#workspace").hidden = true;
    $("#sign-out").hidden = true;
    $("#sign-in").hidden = false;
  }

  $("#sign-in").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#email").value.trim(), password = $("#password").value;
    if (!email || !password) { msg("#sign-in-msg", "Enter the email and password."); return; }
    const btn = $("#sign-in-btn");
    btn.disabled = true;
    msg("#sign-in-msg", "Signing in…", true);
    try {
      await grant("password", { email, password }, $("#remember").checked);
      $("#password").value = "";
      msg("#sign-in-msg", "");
      await enter();
    } catch (err) {
      msg("#sign-in-msg", friendly(err));
    } finally {
      btn.disabled = false;
    }
  });
  $("#sign-out").addEventListener("click", signOut);

  /* ---------------------------------------------------------------- The post form */
  let editing = null; // the post being changed (null = new)
  let photos = [];    // { path } already uploaded, or { blob, preview } new
  let removed = [];   // uploaded paths taken off this post (deleted after saving)

  const kind = () => $("input[name=kind]:checked").value;

  function syncKind() {
    const k = kind();
    $("#kind-hint").textContent = KIND[k].hint;
    $("#date-field").hidden = !(k === "event" || k === "achievement");
    $("#popup-box").hidden = k !== "event";
    $("#popup-until-field").hidden = !$("#popup").checked;
  }

  function drawPhotos() {
    $("#photo-grid").innerHTML = photos.map((p, i) => `
      <div class="photo-item">
        <img src="${p.preview || mediaUrl(p.path)}" alt="">
        <button type="button" class="photo-x" data-remove="${i}" aria-label="Remove photo ${i + 1}">✖</button>
        ${i === 0 ? '<span class="photo-main">Main</span>' : ""}
      </div>`).join("");
    $("#photo-add").hidden = photos.length >= MAX_PHOTOS;
  }

  function drawVideoHint() {
    const id = youTubeId($("#video").value);
    const hint = $("#video-hint");
    hint.classList.toggle("bad", id === undefined);
    hint.innerHTML = id === undefined ? "That is not a YouTube link. Open the video in YouTube → Share → Copy link, and paste it here."
      : id ? `<img src="https://i.ytimg.com/vi/${id}/default.jpg" alt=""> ✔ YouTube video found`
      : "On YouTube: upload the video (it can be “Unlisted”), then Share → Copy link.";
  }

  function resetForm() {
    editing = null;
    photos.forEach((p) => p.preview && URL.revokeObjectURL(p.preview));
    photos = [];
    removed = [];
    $("#post-form").reset();
    $("#date").value = dateKey(new Date());
    $("#popup-until").value = addDays(7);
    $("#tamil-box").open = false;
    $("#form-title").textContent = "📢 New post";
    $("#save-btn").textContent = "📢 Post now";
    $("#cancel-edit").hidden = true;
    msg("#form-msg", "");
    drawPhotos();
    drawVideoHint();
    syncKind();
  }

  function editPost(p) {
    resetForm();
    editing = p;
    $(`input[name=kind][value=${p.kind}]`).checked = true;
    $("#title").value = p.title;
    $("#body").value = p.body || "";
    $("#title-ta").value = p.title_ta || "";
    $("#body-ta").value = p.body_ta || "";
    $("#tamil-box").open = !!(p.title_ta || p.body_ta);
    photos = p.photos.map((path) => ({ path }));
    $("#video").value = p.video_id ? `https://youtu.be/${p.video_id}` : "";
    $("#date").value = p.event_date || "";
    $("#popup").checked = !!p.popup_until;
    $("#popup-until").value = p.popup_until || addDays(7);
    $("#pinned").checked = p.pinned;
    $("#published").checked = p.published;
    $("#form-title").textContent = "✏️ Change post";
    $("#save-btn").textContent = "💾 Save changes";
    $("#cancel-edit").hidden = false;
    drawPhotos();
    drawVideoHint();
    syncKind();
    $("#post-form").scrollIntoView({ behavior: "smooth" });
  }

  $$("input[name=kind]").forEach((r) => r.addEventListener("change", syncKind));
  $("#popup").addEventListener("change", syncKind);
  $("#video").addEventListener("input", drawVideoHint);
  $("#cancel-edit").addEventListener("click", resetForm);

  $("#photo-input").addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    const room = MAX_PHOTOS - photos.length;
    files.slice(0, room).forEach((file) => photos.push({ file, preview: URL.createObjectURL(file) }));
    if (files.length > room) toast(`Only ${MAX_PHOTOS} photos per post.`);
    e.target.value = "";
    drawPhotos();
  });
  $("#photo-grid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-remove]");
    if (!b) return;
    const [p] = photos.splice(Number(b.dataset.remove), 1);
    if (p.path) removed.push(p.path);
    if (p.preview) URL.revokeObjectURL(p.preview);
    drawPhotos();
  });

  function formArgs(paths) {
    const k = kind();
    return {
      p_id: editing ? editing.id : null,
      p_kind: k,
      p_title: $("#title").value.trim(),
      p_title_ta: $("#title-ta").value.trim() || null,
      p_body: $("#body").value.trim() || null,
      p_body_ta: $("#body-ta").value.trim() || null,
      p_photos: paths,
      p_video_id: youTubeId($("#video").value) || null,
      p_event_date: (k === "event" || k === "achievement") && $("#date").value ? $("#date").value : null,
      p_popup_until: k === "event" && $("#popup").checked ? ($("#popup-until").value || addDays(7)) : null,
      p_published: $("#published").checked,
      p_pinned: $("#pinned").checked,
    };
  }

  $("#post-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!$("#title").value.trim()) { msg("#form-msg", "Please type a title."); $("#title").focus(); return; }
    if (youTubeId($("#video").value) === undefined) { msg("#form-msg", "The video link is not a YouTube link."); $("#video").focus(); return; }
    const btn = $("#save-btn");
    btn.disabled = true;
    const uploaded = [];
    try {
      const paths = [];
      const fresh = photos.filter((p) => !p.path).length;
      let n = 0;
      for (const p of photos) {
        if (p.path) { paths.push(p.path); continue; }
        n++;
        msg("#form-msg", `Uploading photo ${n} of ${fresh}…`, true);
        const path = await upload(await shrink(p.file));
        uploaded.push(path);
        paths.push(path);
      }
      msg("#form-msg", "Saving…", true);
      await rpc("website_post_save", formArgs(paths));
      await removeFiles(removed);
      const wasEditing = !!editing;
      resetForm();
      toast(wasEditing ? "✔ Saved — the website shows it now." : "✔ Posted — it is on the website now.");
      loadPosts();
    } catch (err) {
      await removeFiles(uploaded);
      msg("#form-msg", friendly(err));
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------------------------------------------------------------- Posts so far */
  let posts = [];
  let show = "all";

  async function loadPosts() {
    const list = $("#post-list");
    list.innerHTML = '<li class="admin-empty"><span class="spinner"></span> Loading…</li>';
    try {
      posts = await api("/rest/v1/website_posts?select=*&order=created_at.desc");
      drawList();
    } catch (err) {
      list.innerHTML = `<li class="admin-empty bad">${escapeHtml(friendly(err))}</li>`;
    }
  }

  function drawList() {
    const today = dateKey(new Date());
    const list = posts.filter((p) => show === "all" || p.kind === show);
    $("#post-list").innerHTML = list.length ? list.map((p) => {
      const k = KIND[p.kind];
      const thumb = p.photos[0] ? mediaUrl(p.photos[0]) : p.video_id ? `https://i.ytimg.com/vi/${p.video_id}/default.jpg` : "";
      const chips = [
        !p.published && '<span class="chip off">Hidden</span>',
        p.popup_until && p.popup_until >= today && `<span class="chip pop">🔔 Popup till ${pretty(p.popup_until)}</span>`,
        p.pinned && '<span class="chip pin">📌 Pinned</span>',
        p.video_id && '<span class="chip vid">▶ Video</span>',
        p.photos.length > 1 && `<span class="chip">${p.photos.length} photos</span>`,
      ].filter(Boolean).join("");
      return `<li class="admin-item${p.published ? "" : " hidden-post"}">
        <div class="admin-thumb">${thumb ? `<img src="${thumb}" alt="" loading="lazy">` : `<span>${k.emoji}</span>`}</div>
        <div class="admin-info">
          <strong>${escapeHtml(p.title)}</strong>
          <span class="muted">${k.emoji} ${k.name} · ${pretty(p.event_date || p.created_at.slice(0, 10))}</span>
          ${chips ? `<div class="admin-chips">${chips}</div>` : ""}
          <div class="admin-actions">
            <button type="button" class="btn btn-light btn-sm" data-edit="${p.id}">✏️ Edit</button>
            <button type="button" class="btn btn-light btn-sm" data-toggle="${p.id}">${p.published ? "🙈 Hide" : "👁 Show"}</button>
            <button type="button" class="btn btn-light btn-sm danger" data-delete="${p.id}">🗑 Delete</button>
          </div>
        </div>
      </li>`;
    }).join("") : '<li class="admin-empty">Nothing posted here yet.</li>';
  }

  $("#list-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-show]");
    if (!b) return;
    show = b.dataset.show;
    $$(".tab", $("#list-tabs")).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    drawList();
  });

  $("#post-list").addEventListener("click", async (e) => {
    const find = (id) => posts.find((p) => p.id === id);
    const ed = e.target.closest("[data-edit]");
    if (ed) { editPost(find(ed.dataset.edit)); return; }
    const tg = e.target.closest("[data-toggle]");
    const del = e.target.closest("[data-delete]");
    const btn = tg || del;
    if (!btn) return;
    const p = find(btn.dataset.toggle || btn.dataset.delete);
    if (del && !confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    btn.disabled = true;
    try {
      if (tg) {
        await rpc("website_post_save", {
          p_id: p.id, p_kind: p.kind, p_title: p.title, p_title_ta: p.title_ta, p_body: p.body, p_body_ta: p.body_ta,
          p_photos: p.photos, p_video_id: p.video_id, p_event_date: p.event_date, p_popup_until: p.popup_until,
          p_published: !p.published, p_pinned: p.pinned,
        });
        toast(p.published ? "Hidden from the website." : "Shown on the website again.");
      } else {
        const files = await rpc("website_post_delete", { p_id: p.id });
        await removeFiles(files || []);
        if (editing && editing.id === p.id) resetForm();
        toast("Deleted.");
      }
      loadPosts();
    } catch (err) {
      btn.disabled = false;
      toast(friendly(err));
    }
  });

  /* ---------------------------------------------------------------- Coming on a day off (update 25) */
  const DAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DAY_TA = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
  const fmt = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return `${h % 12 || 12}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`; };
  const DOCTOR_HOURS = (window.SITE && window.SITE.hours) ? `${fmt(window.SITE.hours[0])} – ${fmt(window.SITE.hours[1])}` : "5 PM – 9 PM";
  const toDate = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  let offDays = [];
  let extraDays = [];
  const picked = new Set();

  // The next 8 days off (up to 120 days ahead), plus any opened day further on.
  function offDates() {
    const out = [];
    for (let i = 0; i <= 120 && out.length < 8; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      if (offDays.includes(d.getDay())) out.push(dateKey(d));
    }
    extraDays.forEach((k) => { if (!out.includes(k)) out.push(k); });
    return out.sort();
  }

  function drawDays() {
    const list = offDates();
    $("#days-lead").textContent = offDays.length
      ? `Days off: ${offDays.map((d) => DAY_EN[d]).join(", ")}. Tick the ones you will see patients (${DOCTOR_HOURS}); online booking opens for them.`
      : "There are no days off: the doctor is in every day.";
    $("#day-pick").innerHTML = list.map((k) => {
      const d = toDate(k), on = picked.has(k);
      return `<button type="button" class="day-chip${on ? " on" : ""}" data-day="${k}" aria-pressed="${on}">
        <small>${DAY_EN[d.getDay()].slice(0, 3)}</small><strong>${d.getDate()}</strong><small>${d.toLocaleDateString("en-GB", { month: "short" })}</small>
        <span>${on ? "✔ Coming" : "Off"}</span></button>`;
    }).join("");
  }

  async function loadDays() {
    msg("#days-msg", "");
    try {
      const o = await rpc("website_booking_options");
      if (!Array.isArray(o.off_days) || !Array.isArray(o.extra_days)) {
        $("#days-save").disabled = true;
        msg("#days-msg", "Run updates 24 and 25 (24_update_doctor_days.sql, 25_update_doctor_extra_days.sql) in Supabase first.");
        return;
      }
      offDays = o.off_days;
      extraDays = o.extra_days;
      picked.clear();
      extraDays.forEach((k) => picked.add(k));
      $("#days-save").disabled = false;
      drawDays();
    } catch (err) {
      msg("#days-msg", friendly(err));
    }
  }

  $("#day-pick").addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]");
    if (!b) return;
    const k = b.dataset.day;
    if (picked.has(k)) picked.delete(k); else picked.add(k);
    drawDays();
  });

  // A short news post with a front-page popup until that day.
  function dayNews(k) {
    const d = toDate(k);
    const when = `${DAY_EN[d.getDay()]}, ${pretty(k)}`;
    const whenTa = `${pretty(k)} (${DAY_TA[d.getDay()]})`;
    return {
      p_id: null, p_kind: "event",
      p_title: `Doctor available on ${when}`,
      p_title_ta: `${whenTa} அன்று மருத்துவர் வருவார்`,
      p_body: `The doctor will see patients on ${when}, ${DOCTOR_HOURS}. Book online or walk in. Lab, X-ray and ECG are open from 8 AM as usual.`,
      p_body_ta: `${whenTa} அன்று ${DOCTOR_HOURS} மருத்துவர் நோயாளிகளைப் பார்ப்பார். ஆன்லைனில் முன்பதிவு செய்யலாம் அல்லது நேரடியாக வரலாம்.`,
      p_photos: [], p_video_id: null, p_event_date: k, p_popup_until: k, p_published: true, p_pinned: false,
    };
  }

  $("#days-save").addEventListener("click", async () => {
    const btn = $("#days-save");
    btn.disabled = true;
    msg("#days-msg", "Saving…", true);
    try {
      const before = new Set(extraDays);
      const kept = await rpc("website_doctor_days_save", { p_days: [...picked] });
      extraDays = kept || [];
      picked.clear();
      extraDays.forEach((k) => picked.add(k));
      drawDays();
      const added = extraDays.filter((k) => !before.has(k));
      let posted = 0;
      if (added.length && $("#day-popup").checked) {
        for (const k of added) {
          try { await rpc("website_post_save", dayNews(k)); posted++; } catch { /* the day is open even without the news post */ }
        }
        if (posted) loadPosts();
      }
      msg("#days-msg", "");
      toast(added.length ? `✔ Saved — patients can book ${added.map(pretty).join(", ")}${posted ? " (popup posted)" : ""}.` : "✔ Saved.");
    } catch (err) {
      msg("#days-msg", friendly(err));
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------------------------------------------------------------- Stop online booking for a day (update 26) */
  let closedDays = [];
  const closedPicked = new Set();
  let bookingDays = 13;

  // The doctor's days from today to the last bookable day.
  function bookableDates() {
    const out = [];
    for (let i = 0; i <= bookingDays; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const k = dateKey(d);
      if (!offDays.includes(d.getDay()) || extraDays.includes(k) || closedDays.includes(k)) out.push(k);
    }
    return out;
  }

  function drawClosed() {
    const today = dateKey(new Date());
    $("#closed-pick").innerHTML = bookableDates().map((k) => {
      const d = toDate(k), off = closedPicked.has(k);
      return `<button type="button" class="day-chip stop${off ? " on" : ""}" data-closed="${k}" aria-pressed="${off}">
        <small>${k === today ? "Today" : DAY_EN[d.getDay()].slice(0, 3)}</small><strong>${d.getDate()}</strong><small>${d.toLocaleDateString("en-GB", { month: "short" })}</small>
        <span>${off ? "⛔ Stopped" : "Open"}</span></button>`;
    }).join("");
  }

  async function loadClosed() {
    msg("#closed-msg", "");
    try {
      const o = await rpc("website_booking_options");
      if (!Array.isArray(o.closed_days)) {
        $("#closed-save").disabled = true;
        $("#closed-pick").innerHTML = "";
        msg("#closed-msg", "Run update 26 (26_update_walkin_queue.sql) in Supabase first.");
        return;
      }
      if (Array.isArray(o.off_days)) offDays = o.off_days;
      if (Array.isArray(o.extra_days)) extraDays = o.extra_days;
      if (o.today && o.last_date) bookingDays = Math.round((toDate(o.last_date) - toDate(o.today)) / 86400000);
      closedDays = o.closed_days;
      closedPicked.clear();
      closedDays.forEach((k) => closedPicked.add(k));
      $("#closed-save").disabled = false;
      drawClosed();
    } catch (err) {
      msg("#closed-msg", friendly(err));
    }
  }

  $("#closed-pick").addEventListener("click", (e) => {
    const b = e.target.closest("[data-closed]");
    if (!b) return;
    const k = b.dataset.closed;
    if (closedPicked.has(k)) closedPicked.delete(k); else closedPicked.add(k);
    drawClosed();
  });

  $("#closed-save").addEventListener("click", async () => {
    const btn = $("#closed-save");
    btn.disabled = true;
    msg("#closed-msg", "Saving…", true);
    try {
      closedDays = (await rpc("website_closed_days_save", { p_days: [...closedPicked] })) || [];
      closedPicked.clear();
      closedDays.forEach((k) => closedPicked.add(k));
      drawClosed();
      msg("#closed-msg", "");
      toast(closedDays.length ? `✔ Saved — online booking stopped for ${closedDays.map(pretty).join(", ")}.` : "✔ Saved — online booking is open on every day.");
    } catch (err) {
      msg("#closed-msg", friendly(err));
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------------------------------------------------------------- Start */
  resetForm();
  const rt = saved.get();
  if (rt) {
    grant("refresh_token", { refresh_token: rt }, saved.remembered()).then(enter).catch(() => { saved.set(null); });
  }
})();
