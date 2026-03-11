<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=30&duration=3000&pause=1000&color=10B981&center=true&vCenter=true&width=600&lines=🏋️+Fitness+Tracker+AI;Track.+Snap.+Improve." alt="Typing SVG" />

**An AI-powered fitness tracker that analyzes your food through photos and calculates your daily calorie intake — built with React, TypeScript, Strapi and Google Gemini.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-fitness--tracker--prototype.vercel.app-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://fitness-tracker-prototype.vercel.app)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Strapi](https://img.shields.io/badge/Strapi_5-4945FF?style=for-the-badge&logo=strapi&logoColor=white)](https://strapi.io)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack & Decisions](#-tech-stack--technical-decisions)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)

---

## 🧠 Overview

Fitness Tracker AI is a fullstack web application that helps users monitor their daily nutrition and physical activity. The standout feature is **AI Food Snap** — users can photograph any meal and the app automatically identifies the food and estimates its caloric content using **Google Gemini 2.5 Flash**, a state-of-the-art multimodal LLM.

The app handles authentication, personalized onboarding, daily calorie goals, activity logging, and visual progress tracking through a weekly chart — all in a clean, responsive UI with dark mode support.

---

## ✨ Key Features

- **🤖 AI Food Snap** — Upload a photo of your meal; Gemini analyzes it and auto-logs the food name and calories
- **🔐 Auth System** — Register, login and persistent JWT sessions via Strapi Users & Permissions plugin
- **📋 Onboarding Flow** — First-time users set their age, weight, height and fitness goal (lose / maintain / gain)
- **📊 Dashboard** — Real-time summary of calories consumed vs. goal, calories burned, active minutes, BMI and a weekly progress chart
- **🍽️ Food Log** — Manual food entry or AI-assisted snap, grouped by meal type (breakfast, lunch, dinner, snack)
- **🏃 Activity Log** — Log workouts with duration and calories burned
- **👤 Profile** — Update personal metrics and daily targets at any time
- **🌙 Dark Mode** — Full dark/light theme support via React Context
- **📱 Responsive** — Mobile-first layout with a bottom navigation bar on smaller screens

---

## 🛠️ Tech Stack & Technical Decisions

### Frontend

| Technology | Version | Why it was chosen |
|---|---|---|
| **React** | 19 | Component-based architecture for a dynamic, data-driven UI with multiple views and real-time state updates |
| **TypeScript** | 5.9 | Strict typing across all data models (User, FoodEntry, ActivityEntry) prevents runtime errors and improves maintainability |
| **Vite + SWC** | 7 | Extremely fast HMR during development and optimized production builds via SWC compiler (Rust-based, significantly faster than Babel) |
| **Tailwind CSS** | v4 | Utility-first styling enables rapid UI iteration without leaving JSX; v4's new engine offers better performance and a simpler config |
| **React Router v7** | 7 | Client-side routing with protected route logic baked into the component tree via `AppContext` guards |
| **Axios** | 1.13 | Chosen over `fetch` for its interceptor API — request interceptor auto-attaches the JWT token; response interceptor globally handles 401 errors and redirects to login |
| **Recharts** | 3 | Declarative chart library built on top of D3, used for the weekly calorie intake/burn bar chart |
| **React Hot Toast** | 2.6 | Lightweight toast notification library for user feedback on async actions (add, delete, AI analysis) |
| **Lucide React** | 0.563 | Consistent, tree-shakeable icon set that integrates cleanly with React |

### Backend

| Technology | Version | Why it was chosen |
|---|---|---|
| **Strapi** | 5 | Headless CMS that provides a production-ready REST API, admin panel, database ORM, user authentication plugin and file upload — all out of the box, drastically reducing backend boilerplate |
| **Google Gemini 2.5 Flash** | `@google/generative-ai` | Multimodal LLM with vision capabilities; the Flash variant balances speed, cost and accuracy — ideal for real-time food image analysis returning structured JSON |
| **SQLite (better-sqlite3)** | — | Lightweight embedded database suited for the prototype/demo stage; can be swapped for PostgreSQL/MySQL via Strapi's database config with zero code changes |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                   CLIENT                     │
│  React 19 + TypeScript + Vite               │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │AppContext│  │  Pages   │  │   UI     │  │
│  │(global   │  │Dashboard │  │Components│  │
│  │ state)   │  │FoodLog   │  │Card      │  │
│  │          │  │Activity  │  │Button    │  │
│  │user      │  │Profile   │  │Input...  │  │
│  │foodLogs  │  │Login     │  └──────────┘  │
│  │actLogs   │  │Onboarding│               │
│  └────┬─────┘  └──────────┘               │
│       │  Axios (JWT interceptors)           │
└───────┼─────────────────────────────────────┘
        │ HTTP REST
┌───────┼─────────────────────────────────────┐
│       ▼          SERVER (Strapi 5)          │
│  ┌──────────────────────────────────────┐   │
│  │  REST API                            │   │
│  │  /api/auth/local (login/register)    │   │
│  │  /api/users/me                       │   │
│  │  /api/food-logs                      │   │
│  │  /api/activity-logs                  │   │
│  │  /api/image-analysis  ─────────────┐ │   │
│  └─────────────────────────────────── │ ┘   │
│                                        │     │
│  ┌──────────────────────────────────┐  │     │
│  │  Strapi ORM → SQLite             │  │     │
│  │  Users, FoodLogs, ActivityLogs   │  │     │
│  └──────────────────────────────────┘  │     │
└────────────────────────────────────────┼─────┘
                                         │ Base64 image
                              ┌──────────▼──────────┐
                              │  Google Gemini API   │
                              │  gemini-2.5-flash    │
                              │  → { name, calories }│
                              └──────────────────────┘
```

### Auth & Session Flow

```
User opens app
     │
     ▼
localStorage has token?
     │
  Yes├──► fetchUser(token) ──► Strapi /api/users/me
  No └──► Show Login page
               │
        Login/Register ──► Strapi /api/auth/local
               │
        JWT saved to localStorage
               │
        user.age + weight + goal set?
        Yes ──► Dashboard
        No  ──► Onboarding
```

### AI Food Snap Flow

```
User clicks "AI Food Snap"
     │
     ▼
File input triggers → image selected
     │
     ▼
POST /api/image-analysis (multipart/form-data)
     │
     ▼
Strapi controller reads temp file path
     │
     ▼
Gemini 2.5 Flash analyzes image (base64)
Returns: { "name": "Grilled Chicken", "calories": 320 }
     │
     ▼
Controller auto-detects meal type by current hour
(0-12 → breakfast | 12-16 → lunch | 16-18 → snack | else → dinner)
     │
     ▼
POST /api/food-logs → entry saved to DB
     │
     ▼
UI updates toast + food list in real time
```

---

## 📁 Project Structure

```
FitnessTrackerPrototype/
│
├── client/                         # React frontend
│   ├── src/
│   │   ├── assets/
│   │   │   ├── assets.ts           # Static data: icons, meal types, quick-add options
│   │   │   └── mockApi.ts          # Mock data for development
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Slider.tsx
│   │   │   │   └── Tooltip.tsx
│   │   │   ├── BottomNav.tsx       # Mobile navigation bar
│   │   │   ├── CaloriesChart.tsx   # Weekly Recharts bar chart
│   │   │   ├── Loading.tsx         # Full-screen loading spinner
│   │   │   └── Sidebar.tsx         # Desktop sidebar navigation
│   │   ├── configs/
│   │   │   └── api.ts              # Axios instance + JWT + 401 interceptors
│   │   ├── context/
│   │   │   ├── AppContext.tsx      # Global state: user, food logs, activity logs, auth
│   │   │   └── ThemeContext.tsx    # Dark/light theme toggle
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # Home: calories, BMI, chart, summary
│   │   │   ├── FoodLog.tsx         # Manual + AI food entry and listing
│   │   │   ├── ActivityLog.tsx     # Workout logging
│   │   │   ├── Profile.tsx         # Edit personal metrics
│   │   │   ├── Login.tsx           # Login & register form
│   │   │   ├── Onboarding.tsx      # First-time user setup
│   │   │   └── Layout.tsx          # Shared layout (Sidebar + Outlet)
│   │   ├── types/
│   │   │   └── index.ts            # All TypeScript interfaces and types
│   │   ├── App.tsx                 # Route guards + route definitions
│   │   └── main.tsx
│   └── .env.template
│
└── server/                         # Strapi 5 backend
    ├── config/
    │   ├── database.ts             # SQLite config
    │   ├── server.ts               # Host + port
    │   └── middlewares.ts          # CORS, security, body parser
    └── src/
        ├── api/
        │   ├── food-log/           # CRUD: food entries (name, calories, mealType, user relation)
        │   ├── activity-log/       # CRUD: activities (name, duration, calories, user relation)
        │   └── image-analysis/
        │       ├── controllers/    # Handles multipart file, calls Gemini service
        │       ├── routes/         # POST /api/image-analysis
        │       └── services/
        │           └── gemini.ts   # Google Gemini 2.5 Flash integration
        └── extensions/
            └── users-permissions/  # Extended user schema (age, weight, height, goal, calorie targets)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20.x`
- npm `>= 6.x`
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/CB2104/FitnessTrackerPrototype.git
cd FitnessTrackerPrototype
```

### 2. Setup the Server (Strapi)

```bash
cd server
npm install
cp .env.example .env
```

Fill in your `.env` (see [Environment Variables](#-environment-variables) below), then:

```bash
npm run dev
```

Strapi will start at `http://localhost:1337`. On first run it will auto-generate the SQLite database.

> **Important:** After first run, go to `http://localhost:1337/admin`, create your admin account and ensure the `food-logs`, `activity-logs` and `image-analysis` endpoints have the correct permissions set for authenticated users in **Settings → Users & Permissions → Roles → Authenticated**.

### 3. Setup the Client (React)

```bash
cd ../client
npm install
cp .env.template .env
```

Update `.env`:

```env
VITE_STRAPI_API_URL=http://localhost:1337
```

Then start the dev server:

```bash
npm run dev
```

App will be available at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `HOST` | Server host (default: `0.0.0.0`) |
| `PORT` | Server port (default: `1337`) |
| `APP_KEYS` | Comma-separated secret keys for Strapi sessions |
| `API_TOKEN_SALT` | Salt for API token generation |
| `ADMIN_JWT_SECRET` | Secret for admin panel JWT |
| `JWT_SECRET` | Secret for user-facing JWT tokens (auth) |
| `TRANSFER_TOKEN_SALT` | Salt for data transfer tokens |
| `ENCRYPTION_KEY` | Key for encrypting sensitive data |
| `GEMINI_API_KEY` | **Your Google Gemini API key** — required for AI food analysis |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_STRAPI_API_URL` | Full URL of the Strapi backend (e.g. `http://localhost:1337`) |

---

## 📡 API Reference

All endpoints require a `Bearer <JWT>` header unless marked as public.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/local/register` | Public | Register a new user |
| `POST` | `/api/auth/local` | Public | Login, returns JWT |
| `GET` | `/api/users/me` | Required | Get current user profile |
| `PUT` | `/api/users/:id` | Required | Update user profile (weight, goal, etc.) |
| `GET` | `/api/food-logs` | Required | Get all food logs for the authenticated user |
| `POST` | `/api/food-logs` | Required | Create a new food log entry |
| `DELETE` | `/api/food-logs/:documentId` | Required | Delete a food log entry |
| `GET` | `/api/activity-logs` | Required | Get all activity logs for the authenticated user |
| `POST` | `/api/activity-logs` | Required | Create a new activity log entry |
| `DELETE` | `/api/activity-logs/:documentId` | Required | Delete an activity log entry |
| `POST` | `/api/image-analysis` | Required | Upload a food image (`multipart/form-data`, field: `image`). Returns `{ data: { name, calories } }` |

---

## 🗄️ Data Models

### User (extended Strapi schema)

```typescript
{
  id: string;
  email: string;
  username: string;
  age?: number;
  weight?: number;        // in kg
  height?: number;        // in cm
  goal?: "lose" | "maintain" | "gain";
  dailyCalorieIntake?: number;   // user's calorie consumption goal
  dailyCalorieBurn?: number;     // user's calorie burn goal
}
```

### FoodLog

```typescript
{
  id: number;
  documentId: string;
  name: string;
  calories: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  createdAt: string;       // ISO date string, used to filter entries by day
  users_permissions_user: User;
}
```

### ActivityLog

```typescript
{
  id: number;
  documentId: string;
  name: string;
  duration: number;        // in minutes
  calories: number;        // calories burned
  createdAt: string;
  users_permissions_user: User;
}
```

---

<div align="center">

Built by [CB2104](https://github.com/CB2104) · [Live Demo](https://fitness-tracker-prototype.vercel.app) · [Portfolio](https://personal-folio-nu.vercel.app)

</div>