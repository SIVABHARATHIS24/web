# Varnika Health Care — Website

A modern, responsive, interactive website for **Varnika Health Care**, a multi-speciality hospital.
It is plain HTML, CSS and JavaScript, so there is **no build step**. Open `index.html` in a browser, or upload the folder to any static host (GitHub Pages, Netlify, Vercel, Firebase Hosting, cPanel and others).

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Home page with a hero section, quick actions, animated stats, departments, doctors, health packages, a BMI calculator, a testimonial carousel and FAQs |
| `about.html` | Story, mission, vision and values, a milestone timeline, and facilities |
| `departments.html` | Searchable, filterable list of 16 departments. Click one to see its services and specialists |
| `doctors.html` | Search doctors by name, speciality or language. Filter by department and day available |
| `appointment.html` | A 5-step booking form (department → doctor → date and time → details → confirm). Gives a reference number, sends the booking on WhatsApp, adds it to a calendar (.ics) and prints it. Upcoming visits are saved on the patient's device |
| `contact.html` | Contact cards, live "open now" status, OPD timings, an enquiry form (sends by WhatsApp or email) and a Google Map |

Every page also has:
- Dark mode
- A mobile menu
- Floating WhatsApp and emergency-call buttons
- Animations as you scroll
- Accessible keyboard navigation

## ⚠️ Before publishing: replace the sample details

The phone numbers, email, address, doctor names, prices and statistics are **placeholders**.

1. **`js/data.js`** is the main file to edit. Change these there and every page updates:
   - `SITE`: name, phone, emergency phone, WhatsApp number, email, address, map location and OPD hours
   - `DEPARTMENTS`, `DOCTORS`, `PACKAGES`, `TESTIMONIALS` and `FAQS`
2. The numbers written directly in the HTML text, such as "since 2008", "120 beds" and the stats counters in `index.html` and `about.html`, also need updating there.

## About the booking and contact forms

The site has no server, so bookings are not stored in a hospital database. Instead, the patient sends the finished booking or message to the hospital's **WhatsApp** (or by email) in one tap, using the number set in `SITE.whatsapp`. If you later want bookings saved automatically, the forms can be connected to a service such as Google Forms, Formspree or Firebase.

## Run locally

```bash
cd varnika-health-care
python3 -m http.server 8000   # then open http://localhost:8000
```
