# Varnika Speciality Hospital — website

Website for **Varnika Speciality Hospital**, Keeramangalam, Pudukottai — **varnikahospital.in**.
Dr. S. SIVABHARATHI, MBBS, MS (Ortho), Consultant Orthopaedic Surgeon (Reg. No. 114118).

The design uses a Windows Vista–style "Aero glass" theme: an aurora background, translucent blurred glass windows with title bars, glossy buttons and orb icons.

It is plain HTML, CSS and JavaScript with **no build step**. Open `index.html` in a browser, or upload the folder to any static host (GitHub Pages, Netlify, Vercel, cPanel and others).

## Pages

| Page | Contents |
| --- | --- |
| `index.html` | Clinic introduction, doctor card, clinic facilities (consultation, X-ray, ECG, lab), main services, how a visit works, timings and location, FAQs |
| `about.html` | Doctor profile with qualifications and registration number, about the clinic, what to bring, what to do outside clinic hours |
| `services.html` | Full list of orthopaedic services with search and category tabs. Each service shows whether it is done **at the clinic** or as **surgery at a nearby hospital** |
| `appointment.html` | Request an appointment in 4 steps: reason → date and time (5–9 PM, any day) → patient details → confirm. The request goes straight into the hospital's OPD software (see below); full times are shown as **Full**. The confirmation shows the "before you come" instructions in English and Tamil |
| `contact.html` | Address, timings with a live "open now" status, a WhatsApp message form, and a map |

## To do before publishing

1. **Doctor photo:** save the photo as `img/doctor.jpg`. It appears automatically. Until then, the initials "SS" are shown.
2. **Services list:** check `SERVICES` in `js/data.js` and add or remove items so it matches exactly what the clinic offers.

All clinic details (address, map link, timings, doctor and services) are in `js/data.js`.

## Online booking

Bookings go straight into the VHC OPD software (its Supabase database, update 21). Reception sees each request at once on every PC, with a popup, confirms it on WhatsApp and gives an OP number.

- `js/booking-api.js` calls three database functions: `website_booking_options`, `website_taken_slots` and `website_book_appointment`. The address and the **publishable** key are in `SITE.booking` in `js/data.js`. That key can only send a request and see which times are full; it cannot read any patient data. Never put a secret / service_role key on the website.
- If the booking service cannot be reached, or reception has switched online booking off in the OPD app, the page falls back to the old way: the patient sends the request on WhatsApp.
- Limits are set in the OPD app (default 2 per 15 minutes and 40 per day). A mobile number can have at most 3 open requests.

## Publishing on Cloudflare Pages (recommended, free)

1. Sign in at dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**, and choose this repository and branch.
2. Build command: *(leave empty)*. Build output directory: `varnika-health-care`. Click **Save and Deploy**.
3. In the project, open **Custom domains → Set up a domain**, and add `varnikahospital.in`, then `www.varnikahospital.in`. Cloudflare shows what to change at the domain registrar (usually its two nameservers). HTTPS is automatic.

Every push to the branch updates the site in about a minute. `_headers` sets the security headers (including the Content-Security-Policy that allows the booking service and the Google map); if you add a script or font from another site, add it there too. Pages are served without `.html` (`/about`, `/contact`), which matches the canonical links and `sitemap.xml`.

## Publishing on Oracle Cloud

See [`deploy/ORACLE-CLOUD.md`](deploy/ORACLE-CLOUD.md) for step-by-step instructions. You create a free VM, point your domain to it, and run one setup script, which installs nginx and free HTTPS.

## Run locally

```bash
cd varnika-health-care
python3 -m http.server 8000   # then open http://localhost:8000
```
