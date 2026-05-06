# Taskly — To-Do App

Aplikasi To-Do List berbasis React + TypeScript dengan autentikasi Supabase dan database per-user.

---

## 🚀 Cara Setup

### 1. Install pnpm (jika belum ada)

```bash
npm install -g pnpm
```

Cek versi:
```bash
pnpm --version
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Supabase

#### A. Buat Project Supabase
1. Buka [https://supabase.com](https://supabase.com) → **New Project**
2. Catat **Project URL** dan **Anon Public Key** dari **Settings → API**

#### B. Jalankan SQL Migration
1. Buka **SQL Editor** di dashboard Supabase
2. Klik **New Query**
3. Copy-paste seluruh isi file `supabase-setup.sql`
4. Klik **Run** ✅

#### C. (Opsional) Matikan Konfirmasi Email
Untuk development: **Authentication → Settings → Email Auth** → matikan "Confirm email"

### 4. Konfigurasi Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxx...
```

### 5. Jalankan App

```bash
pnpm dev
```

Buka [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Struktur Project

```
todo-app/
├── .env.example             # Template environment variables
├── .npmrc                   # Konfigurasi pnpm
├── supabase-setup.sql       # Script SQL (jalankan di Supabase)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── hooks/
    │   ├── useAuth.tsx      # Auth context (register, login, logout)
    │   └── useTodos.ts      # CRUD todos (Supabase)
    ├── lib/
    │   └── supabase.ts      # Supabase client
    ├── pages/
    │   ├── AuthPage.tsx     # Halaman Register/Login
    │   └── DashboardPage.tsx # Dashboard Kanban
    ├── components/
    │   └── todo/
    │       ├── TodoCard.tsx  # Card todo dengan aksi
    │       └── TodoModal.tsx # Modal buat/edit todo
    ├── types/
    │   └── index.ts         # TypeScript types
    └── index.css            # Global styles
```

---

## ✨ Fitur

- 🔐 **Auth**: Register & Login dengan email/password via Supabase Auth
- 🛡️ **Row Level Security**: Data tiap user terisolasi 100% di database
- 📋 **Kanban Board**: 3 kolom — Todo → In Progress → Done
- 🎯 **Prioritas**: Rendah / Sedang / Tinggi
- 📅 **Due Date**: Tenggat waktu dengan indikator terlambat
- 🔍 **Filter & Pencarian**: Filter status, prioritas, sorting
- ⚡ **Advance Status**: Tombol cepat pindah status

---

## 🏗️ Build Production

```bash
pnpm build
```

Preview hasil build:
```bash
pnpm preview
```

Output di folder `dist/` siap deploy ke Vercel/Netlify/dsb.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Package Manager | pnpm |
| Routing | React Router v6 |
| Backend/DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | Pure CSS (Custom Design System) |
| Icons | Lucide React |
| Date | date-fns |
