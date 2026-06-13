<div align="center">

# ⚡ NeuralWire

### Breaking AI, Technology & Innovation News — a premium full-stack publishing platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**NeuralWire** is a modern, production-style technology news and blogging platform. It pairs an immersive, animated reading experience on the front end with a secure, RESTful Node/Express API and MongoDB on the back end.

The homepage is built as a scroll-driven "intelligence journey" — a neural zig‑zag timeline that guides readers through curated sections (Breaking News, Trending, AI Radar, Editor's Picks, Technology Domains, and a live Latest-Articles feed). Authenticated users get a full editorial studio dashboard to create, edit, and manage articles.

> Built to be clean, fast, and portfolio-ready.

---

## ✨ Features

- 🔐 **JWT authentication** — register, login, logout, password reset via email, and Google OAuth sign‑in
- 📝 **Full article CRUD** — create, edit, delete, and manage posts from an editorial dashboard
- 🧭 **Scroll-driven homepage** — animated neural journey timeline with progress rail and section nodes
- 🗞️ **Rich content sections** — Breaking News, Trending, AI Radar, Editor's Picks, Technology Domains, Latest feed
- 🔎 **Search & filtering** — full-text search, category filters, featured & editor's-pick flags
- 👤 **Author profiles** — popular authors, reading time, relative timestamps
- 💎 **Premium UI/UX** — glassmorphism navbar, Framer Motion animations, responsive layouts
- 🌱 **Seed tooling** — one-command demo data (24 realistic articles) with safe reset
- 🛡️ **Safe images** — graceful fallback for broken/blocked cover images
- ⌨️ **Command palette** — quick search (Ctrl/Cmd + K)

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Axios, Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Nodemailer, Google Auth Library |
| **Tooling** | Concurrently, Nodemon, ESLint, MongoDB Memory Server (dev) |

---

## 📁 Project Structure

```
neuralwire/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers (auth, blogs, ...)
│   ├── data/            # Sample articles & authors
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Idempotent demo seed
│   ├── seedReset.js     # Clean-slate demo reset
│   └── server.js        # Entry point
├── frontend/
│   └── src/
│       ├── app/         # Next.js pages (App Router)
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context
│       ├── lib/         # API client & utilities
│       └── types/       # TypeScript types
├── .gitignore
├── package.json         # Root scripts (dev, seed, ...)
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js 18+**
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (a dev in‑memory option is also supported)

### 1. Clone the repository

```bash
git clone https://github.com/dhwanitverse/neuralwire.git
cd neuralwire
```

### 2. Install dependencies

```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 3. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Then edit the files with your own values (see below).

---

## 🔑 Environment Variables

> ⚠️ **Never commit real secrets.** `.env` files are git‑ignored. Use the `.env.example` templates.

### `backend/.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `USE_MEMORY_DB` | `true` to use an in‑memory DB for development |
| `JWT_SECRET` | Secret used to sign JWTs (use a long random string) |
| `JWT_EXPIRE` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` / `FRONTEND_URL` | Frontend origin for CORS & links |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_SECURE` | SMTP server settings (password reset) |
| `EMAIL_USER` / `EMAIL_PASSWORD` | SMTP credentials |
| `EMAIL_FROM` | "From" address for outgoing mail |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI |

### `frontend/.env.local`

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base path (default `/api` via proxy) |
| `NEXT_PUBLIC_BACKEND_URL` | Absolute backend URL |

---

## ▶️ Run Instructions

### Quick start (both servers together)

```bash
npm run dev
```

This launches the backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) concurrently.

### Seed demo content

```bash
npm run seed         # Add demo articles (keeps existing users & posts)
npm run seed:reset   # Wipe articles and reload the full demo set
```

### Run servers individually

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

### Demo credentials

If you seed into a fresh database with no users, an admin account is created:

- **Email:** `admin@techblog.com`
- **Password:** `admin123`

---

## 🔌 Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/blogs` | No | List blogs (search, category, featured, editorsPick, limit) |
| GET | `/api/blogs/:id` | No | Single blog |
| GET | `/api/blogs/:id/related` | No | Related blogs |
| GET | `/api/blogs/user/my-blogs` | Yes | Current user's blogs |
| POST | `/api/blogs` | Yes | Create blog |
| PUT | `/api/blogs/:id` | Yes | Update blog |
| DELETE | `/api/blogs/:id` | Yes | Delete blog |

---

## 🖼️ Screenshots

> _Add screenshots/GIFs of the app here._

| Homepage (Neural Journey) | Editorial Dashboard |
|---------------------------|---------------------|
| _`docs/screenshots/home.png`_ | _`docs/screenshots/dashboard.png`_ |

| Article Page | Mobile View |
|--------------|-------------|
| _`docs/screenshots/article.png`_ | _`docs/screenshots/mobile.png`_ |

---

## 🗺️ Future Roadmap

- [ ] Comments & threaded discussions
- [ ] Bookmarks & reading lists
- [ ] Rich text / MDX editor for articles
- [ ] Tag system and per-author pages
- [ ] Newsletter delivery integration
- [ ] Personalized "For You" recommendations
- [ ] Analytics dashboard (views, engagement, trends)
- [ ] Dark/light theme toggle
- [ ] PWA & offline reading support
- [ ] Docker Compose & one-click deploy

---

## 📄 License

This project is released under the MIT License.

<div align="center">

**NeuralWire** — _Breaking AI, Technology & Innovation News_

</div>
