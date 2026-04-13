# the House 🏠

A warm, personal platform where every life has a home.
Each resident gets their own illustrated dollhouse with rooms linking to every part of their online life.

---

## Setup

1. Install Node.js (v18+) from nodejs.org
2. Open PowerShell and run:

```
cd C:\Users\Chantal\Documents\theHouse
npm install
npm run dev
```

3. Open http://localhost:3001

---

## First Steps After Launch

1. **Sign up** at /auth — use email: your real email, username: `gary`
2. Your house will appear in the neighbourhood
3. Go to **My House → The Kitchen** to manage your rooms
4. Go to **Admin** to manage all residents (you must be marked as admin in Supabase)

### To make yourself admin in Supabase:
1. Go to supabase.com → your project → Table Editor → profiles
2. Find your row, click edit, set `is_admin` to `true`

---

## Folder Structure

```
theHouse/
├── index.html
├── package.json
├── vite.config.js          ← runs on port 3001
└── src/
    ├── App.jsx             ← Router
    ├── main.jsx
    ├── styles/global.css   ← All CSS variables + shared styles
    ├── store/
    │   ├── authStore.js    ← Login/signup/session (Supabase Auth)
    │   └── houseStore.js   ← Houses, rooms, neighbourhood data
    ├── utils/
    │   └── supabase.js     ← Supabase client
    ├── pages/
    │   ├── NeighbourhoodPage  ← The street (home page)
    │   ├── AuthPage           ← Sign in / Sign up
    │   ├── HousePage          ← Visit someone's house /:username
    │   ├── MyHousePage        ← Your kitchen / admin area
    │   └── AdminPage          ← Platform admin (admin only)
    └── components/
        ├── shared/
        │   ├── NavBar
        │   ├── Toast
        │   └── LoadingScreen
        ├── neighbourhood/
        │   └── DollHouse      ← Illustrated house on the street
        └── house/
            ├── DollhouseView  ← Interior with clickable rooms
            └── RoomDoor       ← Renders each room type
```

---

## Room Types Available

| Type | Purpose |
|------|---------|
| story | Written book/story (like Gary Wild The Great) |
| video | YouTube / Vimeo embed |
| audio | SoundCloud / audio player |
| facebook | Facebook profile link |
| instagram | Instagram link |
| tiktok | TikTok link |
| youtube | YouTube channel link |
| gallery | Photo gallery |
| links | Collection of links |
| custom | Anything you like |

---

## Deploy to Vercel

```
npm run build
```

Then push to GitHub and import to vercel.com.
Build command: `npm run build`
Output directory: `dist`
