# GCAF Cohort Scoreboard

A client-side-only live progress dashboard for facilitators running the Google Cloud
Arcade Facilitator (GCAF) program. Upload a CSV export of your cohort and get an
instant scoreboard: KPIs, milestone progress, a leaderboard, a searchable roster,
issue flags, and a reminder queue with ready-to-send email templates.

No backend, no database, no login — everything runs in your browser. Re-upload a
fresh CSV export each day to keep the dashboard current, and re-upload the *same
file name* again later to unlock trend and ETA panels.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL, then click **Upload CSV** and select your GCAF
participant export (`.csv`). You can upload multiple cohort CSVs and switch
between them with the dropdown that appears once 2+ are loaded.

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy to GitHub Pages

1. Open `package.json` and replace the `homepage` field with your actual GitHub
   Pages URL, e.g. `https://<your-username>.github.io/gcaf-cohort-scoreboard`.
2. Push this project to a GitHub repo.
3. Run:
   ```bash
   npm run deploy
   ```
   This builds the app and publishes `dist/` to the `gh-pages` branch via the
   `gh-pages` package. Enable GitHub Pages on that branch in your repo settings
   if it isn't already active.

## Email settings

Click the gear icon (top right) to fill in the shared placeholders used across
every email template — program link, referral code, chat link, office hours link,
syllabus link, and deadline text. These are filled in once and reused every time
you compose a reminder. Facilitator names default to **Aniket Shaha & Atharv
Ekavire**; change them in the same panel if needed.

## Expected CSV columns

The uploader accepts any CSV export with these headers (order-independent, extra
columns are ignored):

`User Name`, `User Email`, `Access Code Redemption Status`,
`GEAR Digital Badges Earned`, `# of Skill Badges Completed`,
`# of Arcade Games Completed`, `Google Skills Profile URL Status`,
`Google Developer Profile URL Status`, `AI Agent Verification Status`,
`General Milestone Earned`, `Bonus Milestone Earned`

Your sample export also included the actual profile URLs and the names of
completed badges/games — the app reads those too, when present, for the profile
links in the person detail modal.

## Notes on data & privacy

- Nothing is uploaded anywhere — CSV parsing happens entirely in your browser.
- There's no persistence: refreshing the page clears loaded cohorts, contact log,
  and settings. This matches the intended workflow of re-uploading a fresh export
  each day.
- The reminder "contacted" log and email settings live only in memory for the
  current session.
