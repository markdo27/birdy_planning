# Birdy — Project Dashboard

Internal project tracking dashboard for the **Birdy** travel agency web-app.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Deploy](https://img.shields.io/badge/deploy-Vercel-black)

---

## Quick Start (Local)

Just open `index.html` in any browser. No build step required.

Without Firebase configured, data is saved to **localStorage** (browser only).

---

## Deploy to Vercel (with Cloud Sync)

### 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → name it `birdy-planning`
3. Skip Google Analytics → **Create Project**
4. In the left sidebar, click **Build → Firestore Database**
5. Click **Create database** → choose **Start in test mode** → pick a region → **Enable**
6. Go to **⚙ Project Settings → General** → scroll to **Your apps**
7. Click the **Web** icon (`</>`) → register app (any nickname)
8. Copy the `firebaseConfig` object — you'll need it next

### 2. Add Firebase Config to the Dashboard

Open `index.html` and find the section near the top of the `<script>`:

```js
const FIREBASE_ENABLED = false; // ← Change to true

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",          // ← Paste your values
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

Replace the placeholder strings with your Firebase config values, and set `FIREBASE_ENABLED = true`.

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Birdy project dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/birdy-planning.git
git push -u origin main
```

### 4. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework preset: **Other** (it's a static HTML file)
4. Click **Deploy**
5. Your dashboard is live at `https://birdy-planning.vercel.app` (or similar)

Every `git push` to `main` auto-deploys.

---

## How Data Sync Works

| Mode | Storage | When |
|------|---------|------|
| **Cloud (Firebase)** | Firestore `dashboards/birdy-main` | When `FIREBASE_ENABLED = true` and config is valid |
| **Local fallback** | Browser `localStorage` | When Firebase is disabled or offline |

- Changes sync to Firestore within ~400ms (debounced)
- Real-time listener (`onSnapshot`) pushes changes to all open tabs/devices
- Offline? Falls back to localStorage and shows `⚠ Offline` badge
- Header shows sync status: `☁ Synced` / `↻ Saving…` / `⚠ Offline` / `💾 Local`

---

## Firestore Security Rules

After initial setup, go to **Firestore → Rules** and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dashboards/{doc} {
      allow read, write: if true;
    }
  }
}
```

> This allows open read/write — fine for an internal dashboard on a private URL.
> For production, add Firebase Authentication and restrict to authenticated users.

---

## Tech Stack

- **Frontend**: Vanilla HTML / CSS / JS (single file, no build step)
- **Fonts**: [Outfit](https://fonts.google.com/specimen/Outfit) + [Inter](https://fonts.google.com/specimen/Inter)
- **Charts**: [Chart.js 4](https://www.chartjs.org/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (optional)
- **Hosting**: [Vercel](https://vercel.com)

---

## Project Structure

```
birdy-planning/
├── index.html      ← Complete self-contained dashboard
├── vercel.json     ← Vercel deployment config
├── .gitignore      ← Git ignore rules
└── README.md       ← This file
```

---

**Line Collective × Birdy Travel Agency**
