# College Fitness Club — Attendance Tracker (Firebase, single shared QR)

A free, no-domain-needed website for tracking gym attendance. One QR code,
printed once and stuck at the door. Every member scans the *same* code —
first scan asks for a roll number, every scan after that is automatic.

- `index.html` — public homepage with live stats and **today's** check-ins
- `checkin.html` — the page the entrance QR code links to
- `admin.html` — password-protected dashboard: add/delete members, manage admins, view per-member calendars, view logs
- `firebase-config.js` — where you paste your Firebase project keys
- `firestore.rules` — database security rules
- `qrcode.min.js` — the QR-generation library, bundled locally
- `style.css` — shared design

---

## What's new in this version

1. **Multiple admins.** Any admin can add another admin from the dashboard.
2. **Delete members.** Each member row has a Delete button. Their past attendance stays on record, but they can no longer check in.
3. **Daily-reset homepage feed.** "Today's check-ins" on the homepage only ever shows today — it clears itself automatically at midnight (nothing to manually reset).
4. **Per-member calendar (admin view).** Click "History" next to any member to see a month calendar with every day they checked in highlighted, with month navigation.
5. **Check-in counts, sorted.** The members table shows a running "Days In" total for every member, sorted highest attendance to lowest.
6. **Gym-wide activity heatmap.** The admin dashboard's old raw log table is now a GitHub-style contribution heatmap — darker/brighter green squares mean more people checked in that day, hover any square for the exact count.
7. **My Progress page (member-facing).** `my-progress.html` — any member can see their own total check-ins, current streak, this week's count, a weekly bar chart, and their own personal year-long heatmap. It recognizes them the same way check-in does: whichever phone already checked in before is remembered automatically.
8. **Self-registration on first scan.** A member no longer has to be pre-added by an admin. The first time someone scans the entrance QR on their phone, if their roll number isn't registered yet, they just add their name right there and it registers automatically — practical once you've got 50+ members. Admins can still use **Add Member** to pre-register people if they want to (e.g. reserving official roll numbers ahead of time), but it's optional now.

### Important: admin security was tightened

Previously, *any* Firebase account could act as an admin — which is a problem, because Firebase account sign-up is open to the public by default. A technically-minded visitor could have created their own account from the browser console and gotten full admin access without ever touching your dashboard.

This version fixes that with a proper **admins list** in the database: an account only counts as an admin if its ID is explicitly added to that list — either by you (the very first time, done by hand — see below) or by an existing admin using the new "Add Admin" form.

**This means you must re-publish `firestore.rules` and do one manual one-time step to register your first admin**, even if you've already set this project up before.

---

## 1. Create your database (Firebase) — first time only

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → **Create project**.
2. **Build → Firestore Database** → **Create database** → nearby location → **production mode**.
3. **Rules** tab → replace everything with the contents of `firestore.rules` → **Publish**.
4. **Build → Authentication** → **Get started** → enable **Email/Password**.
5. **Authentication → Users** → **Add user** → note the email you use.

## 2. Register your first admin (manual, one time)

This is the step that used to be implicit and now has to be done explicitly:

1. In Firebase Console, go to **Authentication → Users**. Find the user you just created and copy their **User UID** (a long string of letters/numbers).
2. Go to **Firestore Database → Data** tab → **Start collection** → collection ID: `admins`.
3. For the **Document ID**, paste in that exact User UID (don't let it auto-generate one).
4. Add one field: `email` (type: string) → your admin email address.
5. Save.

Now that account can log into `admin.html` — and from there, can add further admins through the dashboard without ever touching Firebase Console again.

## 3. Get your web app config

Gear icon → **Project settings** → **Your apps** → **</>** to register a web app → copy the `firebaseConfig` values into `firebase-config.js`.

## 4. Push to GitHub, deploy on Vercel

1. Create a GitHub repo, upload **all** the files including `qrcode.min.js`.
2. On [vercel.com](https://vercel.com), import the repo, leave settings default, **Deploy**.
3. Copy your live link.
4. Firebase → **Authentication → Settings → Authorized domains → Add domain** → paste your Vercel domain.

## 5. Print your one QR code

Log into `admin.html` → **Gym Entrance QR Code** → **Download QR** → print it, stick it at the gym entrance. You never need to regenerate this.

## 6. Add members

Under **Add Member**, enter each person's name + roll number.

## 7. Add more admins (optional, any time)

Under **Add Admin**, enter their email and a temporary password, then share that password with them directly (e.g. in person or a private message) so they can log in and change it themselves if they want. Anyone you add here gets full dashboard access — treat it like handing over a set of keys.

## 8. Test it

1. Scan the entrance QR with your phone → enter a roll number once → it checks you in and remembers you.
2. Scan again → instant check-in, no form.
3. Homepage → today's check-in should appear under "Today's check-ins," and the stat counts update.
4. In admin.html, click **History** next to that member → today's date should be highlighted on the calendar, and "Days In" should show 1.
5. Try **Delete** on a test member → confirm they disappear from the list and can no longer check in (their old calendar/attendance data is untouched).

---

### How the security actually works

- `admins/{uid}` — the authoritative list of who's an admin. Only existing admins can read or write it.
- `members/{rollNumber}` — public name + roll number, no secrets. Anyone can read. Anyone can also *create* a member document, but only for a roll number that doesn't already exist — this is what lets self-registration work on first check-in, while still preventing anyone from overwriting an existing member's name. Only an admin can edit or delete an existing member.
- `attendance` — public to insert (so check-in works without login) and public to read (so the homepage can show stats). Only an admin can edit/delete a log entry.
- Check-in fraud protection lives in the browser: each phone remembers its own member identity in `localStorage`, with no in-page way to switch to a different member (that has to go through the phone's own browser settings — see `checkin.html`'s behavior).

### Free tier notes

Firebase's free "Spark" plan comfortably covers a college club's traffic and this app's usage, including the extra per-member count queries on the admin dashboard.
