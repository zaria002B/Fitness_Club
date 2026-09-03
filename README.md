# College Fitness Club — Attendance Tracker (Firebase, personal QR check-in)

A free, no-domain-needed website for tracking gym attendance. Each member
gets their own personal QR code — scan it, attendance logs automatically,
no typing.

- `index.html` — public homepage with live stats
- `checkin.html` — the page a member's personal QR code links to
- `admin.html` — password-protected dashboard: add members, generate/download their QR codes, view logs
- `firebase-config.js` — where you paste your Firebase project keys
- `firestore.rules` — database security rules
- `style.css` — shared design

---

## How check-in works now

1. An admin adds a member by name + roll number in `admin.html`.
2. The site generates a **random, unguessable code** for that member and shows a QR code on screen, downloadable as a PNG.
3. The admin prints/shares that QR code with the member — it's theirs, like a gym ID card.
4. At the gym, the member scans their own QR code with their phone camera. It opens `checkin.html?token=...`, which **automatically logs their attendance** — no form, no typing.
5. Scanning the same code again the same day shows "already checked in" instead of logging a duplicate.

Nobody can check in by guessing or typing a roll number anymore — the database is set up so the secret code can only be *used* (scan a real QR), never *listed or searched* by a visitor to the site.

**Worth knowing:** this stops guessing and typo-checking, but it can't stop someone deliberately sharing a photo of their own QR code with a friend — same as sharing a physical gym ID. If that becomes a real problem, the next upgrade is having staff scan members' codes at the door (so a person visually confirms who's checking in) instead of a fully self-serve scan.

---

## 1. Create your database (Firebase)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it (e.g. `fitness-club`) → **Create project**.
2. **Build → Firestore Database** → **Create database** → pick a nearby location → **production mode**.
3. Click the **Rules** tab → delete everything → paste in the entire contents of `firestore.rules` → **Publish**.
4. **Build → Authentication** → **Get started** → enable **Email/Password** sign-in.
5. **Authentication → Users** → **Add user** → this is your admin login for `admin.html`.

## 2. Get your web app config

1. Gear icon → **Project settings** → scroll to **Your apps** → click **</>** to register a web app.
2. Copy the `firebaseConfig` object it shows you.

## 3. Connect the site

Paste your real values into `firebase-config.js`, replacing the placeholders. Save.

## 4. Push to GitHub, deploy on Vercel

Same as before:
1. Create a GitHub repo, upload all the files.
2. On [vercel.com](https://vercel.com), import that repo, leave settings default, **Deploy**.
3. Copy your live link (e.g. `fitness-club-nitn.vercel.app`).
4. Back in Firebase → **Authentication → Settings → Authorized domains → Add domain** → paste your Vercel domain.

## 5. Register members and print their QR codes

1. Go to `your-link.vercel.app/admin.html`, log in.
2. Under **Add Member**, enter each member's name + roll number → **Add & generate QR**.
3. A QR code appears immediately — click **Download QR** and print it (or share the image with the member directly, e.g. via WhatsApp).
4. Need to reprint someone's code later? Find them in **All Members** → **View QR**.

## 6. Test it

1. Open a member's downloaded QR image on your phone, or print it.
2. Scan it with a phone camera — it should open the check-in page and show "Checked in" with their name, automatically.
3. Scan it again — it should say "already in" instead of logging twice.
4. Check the homepage — stats and recent check-ins update.

---

### How the security actually works

- `members/{rollNumber}` — public name + roll number only, no secrets. Anyone can view (needed for the homepage/admin list), only an admin can add/edit.
- `tokens/{token}` — the token (a random 128-bit ID) is the document's ID. Anyone can *fetch one exact token* (which is what scanning a QR does), but **nobody can list or browse this collection**, so tokens can't be discovered — only used.
- `admin_tokens/{rollNumber}` — fully private, admin-only. Lets an admin look up a member's token again later to reprint their QR.
- `attendance` — public to insert (so check-in works without login) and public to read (so the homepage can show stats).

### Free tier notes

Firebase's free "Spark" plan comfortably covers a college club's traffic and this app's usage.
