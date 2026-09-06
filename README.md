# College Fitness Club — Attendance Tracker (Firebase, single shared QR)

A free, no-domain-needed website for tracking gym attendance. One QR code,
printed once and stuck at the door. Every member scans the *same* code —
first scan asks for a roll number, every scan after that is automatic.

- `index.html` — public homepage with live stats
- `checkin.html` — the page the entrance QR code links to
- `admin.html` — password-protected dashboard: add members, download the entrance QR, view logs
- `firebase-config.js` — where you paste your Firebase project keys
- `firestore.rules` — database security rules
- `qrcode.min.js` — the QR-generation library, bundled locally so no ad-blocker can interfere with it
- `style.css` — shared design

---

## How check-in works

1. An admin adds each member by name + roll number in `admin.html`.
2. The admin downloads **one QR code** from the dashboard (it just links to `checkin.html`) and prints it at the gym entrance.
3. The first time a member's *phone* scans that code, `checkin.html` asks for their roll number once, checks it against the member list, and saves it in that phone's local storage.
4. Every time after that, scanning the same entrance QR code on that same phone logs their attendance immediately — no typing, no per-member code to carry.
5. Scanning it twice in the same day shows "already checked in" instead of logging a duplicate.
6. If someone lends their phone to a friend, there's a **"Not you? Switch member"** link on the check-in page to reset it for a different person.

**Worth knowing:** this ties a check-in to a specific phone rather than a typed number, which stops casual friend requests like "just type my roll number for me." It doesn't stop someone handing over an unlocked, already-set-up phone — no free system fully solves that, the same as sharing a physical gym card. If it ever becomes a real problem, the next step up is having staff visually check members in instead of full self-serve scanning.

---

## 1. Create your database (Firebase)

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it → **Create project**.
2. **Build → Firestore Database** → **Create database** → nearby location → **production mode**.
3. **Rules** tab → replace everything with the contents of `firestore.rules` → **Publish**.
4. **Build → Authentication** → **Get started** → enable **Email/Password**.
5. **Authentication → Users** → **Add user** → this is your admin login.

## 2. Get your web app config

Gear icon → **Project settings** → **Your apps** → **</>** to register a web app → copy the `firebaseConfig` values into `firebase-config.js`.

## 3. Push to GitHub, deploy on Vercel

1. Create a GitHub repo, upload **all** the files including `qrcode.min.js`.
2. On [vercel.com](https://vercel.com), import the repo, leave settings default, **Deploy**.
3. Copy your live link.
4. Firebase → **Authentication → Settings → Authorized domains → Add domain** → paste your Vercel domain.

## 4. Print your one QR code

1. Go to `your-link.vercel.app/admin.html`, log in.
2. Under **Gym Entrance QR Code**, click **Download QR**.
3. Print it, laminate it if you can, and stick it up at the gym entrance. This is the only QR code you'll ever need — you don't regenerate it per member.

## 5. Add your members

Under **Add Member**, enter each person's name + roll number. No QR code is generated per member anymore — they'll register themselves automatically the first time they scan the entrance code.

## 6. Test it

1. Scan the printed (or on-screen) entrance QR with your own phone.
2. It should ask for your roll number once — enter one you registered in step 5.
3. It checks you in immediately and remembers you.
4. Scan the same QR code again — it should check you in instantly with no form this time.
5. Scan it a third time same day — it should say "already checked in."
6. Check the homepage — stats and recent check-ins update.

---

### How the security actually works

- `members/{rollNumber}` — public name + roll number, no secrets. Anyone can read (needed to verify a roll number during first-time setup), only a logged-in admin can add/edit/delete.
- `attendance` — public to insert (so check-in works without login) and public to read (so the homepage can show stats). Only an admin can edit/delete a log entry.
- The actual anti-fraud layer lives in the browser, not the database: each phone remembers its own member identity in `localStorage`, so the *same* entrance QR code behaves differently depending on whose phone scans it.

### Free tier notes

Firebase's free "Spark" plan comfortably covers a college club's traffic and this app's usage.
