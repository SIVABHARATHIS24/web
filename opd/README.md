# OPD Clinic

An installable app (PWA) for the out-patient clinic. It replaces the daily "copy the Template tab" Google Sheet with a live flow across five desks:

| Desk | What it does |
| --- | --- |
| **Reception** | Registers patients. A phone or name lookup finds returning patients, so OLD/NEW is set automatically. Records vitals (with warnings for out-of-range or mistyped values, e.g. SpO2 66), comorbidities and payment (PAID / GPAY / DR FREE / UNPAID), and issues a token. Can mark a patient "Not coming". |
| **Doctor** | A queue ordered by who needs attention next (results ready → waiting → …). Shows vitals with warnings and previous visits. Fields for provisional diagnosis, investigation orders (X-ray / Lab / ECG), final diagnosis, a prescription table and advice. **Verify** is the old `SIGN = VERIFIED`. |
| **Investigations** | Lists pending tests. Recording a result marks the test done, and once all of a patient's tests are done the patient goes back to the doctor as "Results ready". |
| **Pharmacy** | Shows verified prescriptions to dispense, with a printable prescription slip. |
| **Admin** | The same census as the sheet (Total OP, OLD/NEW, X-ray/Lab/ECG, Pending/Completed) plus payment counts, the one-line daily summary (copy, or share on WhatsApp), a CSV export in the old sheet's column layout, and staff role management. |

Visit flow:

```
Reception ──► Waiting for doctor ──► (Investigations ──► Results ready) ──► Doctor verifies ──► Pharmacy ──► Completed
     └──► Not coming
```

Every change is recorded in the visit's audit trail (who did what, when).

## Two modes

- **Single-device mode** (no configuration). Everything is saved in the browser, and you pick a desk when the app opens. Good for trying it out, or for a clinic that runs on one computer.
- **Clinic mode** (Firebase configured). Every desk uses its own phone, tablet or PC and sees the same data live. Staff sign in with email and password, and an admin assigns each person a desk. The data is cached offline, so every desk keeps its list and its edits through a short internet drop, and changes sync when the connection is back. Registering a new patient does need a connection, because the day's token number is assigned on the server.

## Development

```bash
cd opd
npm install
npm run dev      # start dev server
npm run build    # production build
npm run lint     # lint
```

To try clinic mode without a real Firebase project, run the local Firebase emulators (needs Java) and point the app at them:

```bash
npm run emulators               # terminal 1: Auth + Firestore on this computer, using firestore.rules
npx vite --mode emulator        # terminal 2: app with the settings in .env.emulator
```

Open the app in two browser windows (one normal, one private) to act as two desks. To make the first admin, follow step 6 below but edit the `staff` document in the emulator UI at http://127.0.0.1:4000/firestore instead of the Firebase console.

## Setting up clinic mode (Firebase)

1. Create a **new** Firebase project for the clinic and add a **Web app** ([console](https://console.firebase.google.com/)).
2. **Authentication → Sign-in method**: enable **Email/Password**.
3. **Firestore Database**: create a database. Choose the `asia-south1` (Mumbai) region to keep patient data in India.
4. Copy `.env.example` to `.env.local` and fill in the web app config values.
5. Deploy the security rules and the app (run this from `opd/`; `opd/firestore.rules` replaces whatever rules the project had, so don't point it at the main app's project):
   ```bash
   npm run build
   npx firebase-tools deploy --only firestore:rules,hosting
   ```
6. **The first admin:** open the app, choose "Create staff account", then in the Firebase console go to Firestore → `staff` → your document and set `role` to `"admin"`. From then on, new staff create their own accounts and the admin assigns their desk under Admin → Staff.

### Who can do what (`firestore.rules`)

- Only staff with an assigned desk can read patient data. New sign-ups can't see anything until an admin assigns them.
- Reception and admin register visits. Every desk can move a visit along its flow. Nothing can be deleted; use "Not coming" instead.
- Only an admin can change roles, and admins can't change their own role.

## Moving over from the Google Sheet

Admin → **Export for Google Sheet** downloads the day as a CSV with the sheet's columns (`S, PATIENT NAME, VISIT, PAID, … SIGN`). You can keep both running while staff get used to the app. To add a day to the existing sheet: File → Import → Upload → "Insert new sheet(s)", then rename the tab to the date (e.g. `27.09.2026`).
