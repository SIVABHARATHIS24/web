# My Assistant

An installable AI companion app that remembers what matters to you and helps you track your growth over time — like a personal memory + growth journal, built together with an assistant.

## Features

- **Chat** — talk with your assistant. It picks up on things worth remembering ("I want to run a 5k", "Remember that I prefer mornings") and automatically saves them to your memory bank.
- **Memory bank** — browse, filter, pin, and manually add memories (facts, preferences, goals, reflections, wins).
- **Goals** — set goals with milestones and track progress.
- **Growth dashboard** — daily mood/energy check-ins, a trend chart, and a day streak to keep you coming back.

By default everything is stored locally in your browser (`localStorage`) — no account or server required. Connect a Firebase project (see below) and it syncs to the cloud instead, so your assistant follows you across devices.

## Install as an app

This is a Progressive Web App (PWA). Open it in a browser and use "Add to Home Screen" / "Install app" to get an app-like icon on your phone or desktop — no app store needed.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run lint      # lint
npm run preview   # preview the production build
```

## Cloud sync with Firebase (optional)

Firebase is entirely opt-in. With no configuration, the app works fully offline using `localStorage`. Add a Firebase project's web config and it automatically switches to Firestore + Auth, syncing memories, goals, check-ins, and chat history in real time.

### 1. Create a Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a project (or reuse one).
2. Add a **Web app** to it, and copy the `firebaseConfig` values it gives you.
3. Under **Build → Authentication → Sign-in method**, enable:
   - **Anonymous** (required — every device gets a private identity automatically, no login needed)
   - **Google** (optional — lets a user sign in to carry their data across devices)
4. Under **Build → Firestore Database**, create a database (production mode is fine — the rules below lock it down).

### 2. Configure the app

Copy `.env.example` to `.env.local` and fill in the values from step 1:

```bash
cp .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Restart `npm run dev` after editing `.env.local`.

### 3. Deploy Firestore security rules

`firestore.rules` (included in this repo) scopes every user to their own data — read/write is only allowed under `users/{their own uid}`. Deploy it with the [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # pick your project
firebase deploy --only firestore:rules
```

### How it behaves

- On first load with Firebase configured, the app signs in anonymously in the background — no login screen, sync starts immediately for that device.
- If there's existing local data on that device (from before Firebase was connected), it's migrated up to that anonymous account once, automatically.
- Tapping **"Sync across devices"** in the header signs in with Google and links it to the current session, so the same account (and its data) can be reached from any device by signing in with that Google account there too.
- Signing out starts a fresh anonymous session on that device; your Google-linked data is untouched and comes back the next time you sign in.

### Optional: host it on Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` is already set up to serve `dist/` as a single-page app.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, Zustand (local persisted state), Recharts, `vite-plugin-pwa`, and an optional Firebase (Auth + Firestore) sync layer.
