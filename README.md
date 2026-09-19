# My Assistant

An installable AI companion app that remembers what matters to you and helps you track your growth over time — like a personal memory + growth journal, built together with an assistant.

## Features

- **Chat** — talk with your assistant. It picks up on things worth remembering ("I want to run a 5k", "Remember that I prefer mornings") and automatically saves them to your memory bank.
- **Memory bank** — browse, filter, pin, and manually add memories (facts, preferences, goals, reflections, wins).
- **Goals** — set goals with milestones and track progress.
- **Growth dashboard** — daily mood/energy check-ins, a trend chart, and a day streak to keep you coming back.

Everything is stored locally in your browser (`localStorage`) — no account or server required, and it's private to your device.

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

## Stack

React + TypeScript + Vite, Tailwind CSS v4, Zustand (persisted state), Recharts, `vite-plugin-pwa`.
