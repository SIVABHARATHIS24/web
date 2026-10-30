/* ==========================================================================
   Varnika Speciality Hospital — online booking service
   Sends appointment requests straight to the hospital's OPD software
   (Supabase database functions). Reception sees each request at once, with a
   popup, and confirms it on WhatsApp. Settings are in SITE.booking (data.js).
   Every call either resolves with the service's JSON or throws; the booking
   page falls back to WhatsApp when it throws.
   ========================================================================== */
(function () {
  "use strict";

  const cfg = (window.SITE && window.SITE.booking) || {};

  async function rpc(name, body, timeoutMs) {
    if (!cfg.url || !cfg.key) throw new Error("Online booking is not set up");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs || 12000);
    try {
      const res = await fetch(`${cfg.url}/rest/v1/rpc/${name}`, {
        method: "POST",
        // A publishable key goes in the apikey header only (no Authorization header).
        headers: { apikey: cfg.key, "Content-Type": "application/json" },
        body: JSON.stringify(body || {}),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`Booking service ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  window.BookingAPI = {
    // { accepting, today, last_date, first_slot, last_slot, slot_minutes, timezone }
    options: () => rpc("website_booking_options", {}),
    // ["17:30", "18:00"]: times on that date that can no longer be booked.
    takenSlots: (date) => rpc("website_taken_slots", { booking_date: date }),
    // { ok: true, ref, status, duplicate, fee, payment_status } or { ok: false, error, message }
    book: (booking) => rpc("website_book_appointment", booking, 20000),
    // The patient paid the OPD fee by UPI: { ok: true, payment_status } or { ok: false, error, message }
    submitPayment: (ref, phone, utr) => rpc("website_submit_payment", { ref, phone, utr }, 20000),
    // The doctor's posts (update 23): [{ id, kind, title, title_ta, body, body_ta, photos, video_id, date, popup, pinned }]
    posts: (kind, limit) => rpc("website_posts", { p_kind: kind || null, p_limit: limit || 60 }),
    // Public address of a posted photo (bucket "website-media").
    mediaUrl: (path) => `${cfg.url}/storage/v1/object/public/website-media/${path}`,
  };
})();
