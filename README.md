# College Fitness Club — Attendance Tracker (Firebase version)

A free, no-domain-needed website for tracking gym attendance via QR check-in.

- `index.html` — public homepage with live stats
- `checkin.html` — the page your QR code points to
- `admin.html` — password-protected dashboard to add members & view logs
- `firebase-config.js` — where you paste your Firebase project keys
- `firestore.rules` — database security rules
- `style.css` — shared design

---

## 1. Create your database (Firebase)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → give it a name (e.g. `fitness-club`) → follow the prompts (you can skip Google Analytics) → **Create project**.
2. In the left sidebar, go to **Build → Firestore Database** → **Create database** → choose a location close to you → start in **production mode**.
3. Once created, click the **Rules** tab in Firestore. Delete everything there and paste in the entire contents of `firestore.rules` → **Publish**.
4. In the left sidebar, go to **Build → Authentication** → **Get started** → enable the **Email/Password** sign-in method.
5. Still in Authentication, go to the **Users** tab → **Add user** → enter an email + password for yourself. This is your admin login for `admin.html`.

## 2. Get your web app config

1. Click the gear icon next to **Project Overview** → **Project settings**.
2. Scroll to **Your apps** → click the **</>** (web) icon → give the app a nickname → **Register app**.
3. Firebase shows you a `firebaseConfig` object with your `apiKey`, `authDomain`, `projectId`, etc. Copy these values.

## 3. Connect the site to your database

Open `firebase-config.js` and replace the placeholder values with the ones you just copied:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "fitness-club-xxxxx.firebaseapp.com",
  projectId: "fitness-club-xxxxx",
  storageBucket: "fitness-club-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Save the file.

## 4. Put the code on GitHub

1. Go to [github.com](https://github.com) → sign up free (if you don't have an account).
2. Click **New repository**, name it e.g. `fitness-club`, keep it public, create it.
3. Upload all the files in this folder (`index.html`, `checkin.html`, `admin.html`, `firebase-config.js`, `style.css`, `firestore.rules`) using the **"uploading an existing file"** link on the repo page. Commit.

## 5. Deploy for free (Vercel)

1. Go to [vercel.com](https://vercel.com) → sign up using your GitHub account.
2. Click **Add New → Project**, select your `fitness-club` repo.
3. Leave all settings as default (no build step needed, it's plain HTML) → **Deploy**.
4. In under a minute you'll get a free public link like:
   `https://fitness-club-yourname.vercel.app`

That link is your website — anyone can visit it, no domain purchase needed.

**One extra Firebase step:** go back to Firebase Console → Authentication → **Settings** tab → **Authorized domains** → **Add domain** → paste in your Vercel domain (e.g. `fitness-club-yourname.vercel.app`). Without this, login on the live site will be blocked.

## 6. Add your first members

Go to `https://your-link.vercel.app/admin.html`, log in with the email/password you created in step 1.5, and add each gym member's name + roll number under **Add Member**.

## 7. Generate the QR code

Take your check-in link:
`https://your-link.vercel.app/checkin.html`

Paste it into any free QR generator (e.g. [qr-code-generator.com](https://www.qr-code-generator.com) or [qrcode-monkey.com](https://www.qrcode-monkey.com)), download the image, and print it out for the gym entrance.

## 8. Test it

1. Scan the QR code with your phone.
2. Enter a roll number you added in step 6.
3. Check the homepage — it should show up in "Recent check-ins" and the stats should update.

---

### How it works

- Each member's **roll number is the document ID** in the `members` collection in Firestore — this makes check-in fast (a single direct lookup, no search query needed).
- The **check-in page** looks up that roll number and, if it exists, adds a new document to the `attendance` collection with a server timestamp. No login needed — that's what makes it fast enough for people to use at the gym door.
- The **admin page** requires a Firebase Auth login, so only club admins can add/remove members.
- The **homepage** reads aggregate counts and a recent-activity feed — visible to everyone, no login.
- `firestore.rules` enforces all of this at the database level: anyone can read, anyone can check in (but only for a roll number that's actually registered), and only a logged-in admin can add/edit/delete members or attendance records.

### Known limitations (worth knowing as a club project, not production banking software)

- Anyone who knows a friend's roll number could check in for them — there's no identity verification. If this becomes a problem, the natural upgrade is a **personal QR code per student** (generated at signup, scanned by staff) instead of typing a roll number.
- Roll numbers and names in the `members` collection are publicly readable (needed for the check-in page to work) but not editable by anyone except an admin.
- Firebase's free "Spark" plan comfortably handles a college club's traffic at no cost.
