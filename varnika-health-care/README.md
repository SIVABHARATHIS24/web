# Varnika Healthcare — Orthopaedic Clinic website

Website for **Varnika Healthcare, Orthopaedic Clinic**, Kiramangalam, Pudukottai.
Dr. S. Shivabharathi, MBBS, MS (Ortho), Consultant Orthopaedic Surgeon (Reg. No. 114118).

The design uses a Windows Vista–style "Aero glass" theme: an aurora background, translucent blurred glass windows with title bars, glossy buttons and orb icons.

It is plain HTML, CSS and JavaScript with **no build step**. Open `index.html` in a browser, or upload the folder to any static host (GitHub Pages, Netlify, Vercel, cPanel and others).

## Pages

| Page | Contents |
| --- | --- |
| `index.html` | Clinic introduction, doctor card, clinic facilities (consultation, X-ray, ECG, lab), main services, how a visit works, timings and location, FAQs |
| `about.html` | Doctor profile with qualifications and registration number, about the clinic, what to bring, what to do outside clinic hours |
| `services.html` | Full list of orthopaedic services with search and category tabs. Each service shows whether it is done **at the clinic** or as **surgery at a nearby hospital** |
| `appointment.html` | Request an appointment in 4 steps: reason → date and time (5–9 PM, any day) → patient details → confirm. The request is sent to the clinic on WhatsApp |
| `contact.html` | Address, timings with a live "open now" status, a WhatsApp message form, and a map |

## To do before publishing

1. **Doctor photo:** save the photo as `img/doctor.jpg`. It appears automatically. Until then, the initials "SS" are shown.
2. **Services list:** check `SERVICES` in `js/data.js` and add or remove items so it matches exactly what the clinic offers.

All clinic details (address, map link, timings, doctor and services) are in `js/data.js`.

## Publishing on Oracle Cloud

See [`deploy/ORACLE-CLOUD.md`](deploy/ORACLE-CLOUD.md) for step-by-step instructions. You create a free VM, point your domain to it, and run one setup script, which installs nginx and free HTTPS.

## Run locally

```bash
cd varnika-health-care
python3 -m http.server 8000   # then open http://localhost:8000
```
