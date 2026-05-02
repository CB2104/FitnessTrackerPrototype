# FitnessTrackerPrototype

A fullstack AI-powered fitness tracking web app that lets users log meals, track physical activity, and monitor daily calorie balance — with an image analysis feature that auto-identifies food and estimates calories using Google Gemini.

---

## 📌 Project Overview

FitnessTrackerPrototype is a production-style fullstack application with a React/TypeScript frontend and a Strapi v5 backend. Users register, complete an onboarding flow to set their fitness goals, and then track daily food intake and physical activities through a dashboard with calorie charts and progress indicators. The food logging flow includes an AI shortcut: users can upload a photo of their meal and let Gemini 2.5 Flash identify the food and estimate calories automatically.

The project demonstrates real-world patterns — JWT auth, protected routes, global client state, per-user data scoping in a headless CMS, and third-party AI integration — rather than being a simple CRUD toy.

---

## 🧩 Problem

Most fitness tracker demos are either purely frontend (fake data, no persistence) or rely on naive per-component data fetching that causes redundant requests and stale UI state. There is also a gap between learning projects and production patterns around authentication flows — particularly onboarding gates, token persistence, and automatic session restoration on page reload.

---

## ✅ Solution

The app separates concerns clearly across layers: Strapi owns authentication, data persistence, and the REST API surface; the React client owns routing, session management, and UI state via a single global context. Token-based auth is handled with an Axios interceptor that injects the Bearer token on every request and redirects to `/login` on 401. The onboarding gate is enforced at the app shell level before any route is rendered, ensuring new users cannot skip goal setup. The Gemini integration lives entirely on the backend as a custom Strapi service and controller, avoiding key exposure on the client.

---

## ⚡ Key Features

- JWT authentication with automatic session restoration on page reload via `localStorage` token + `/api/users/me` fetch
- Onboarding gate that collects age, weight, height, and fitness goal before granting access to the main app
- Daily calorie dashboard with progress bars, net calorie calculation (intake minus burned), and a weekly calorie chart via Recharts
- Food log with manual entry form and AI-assisted image analysis (upload a photo → Gemini returns food name + calories)
- Activity log with duration and calorie tracking per workout
- Profile page for updating fitness goals and daily calorie targets
- Responsive layout with a sidebar on desktop and bottom navigation on mobile
- Dark/light theme toggle via React context
- Toast notifications for user-facing errors and confirmations

---

## 🛠 Tech Stack

### Frontend

- **React 19 + TypeScript** — Component model with full type safety across API responses, form state, and context shape
- **React Router v7** — Client-side routing with nested layout routes (`/`, `/food`, `/activity`, `/profile`)
- **Tailwind CSS v4** — Utility-first styling integrated via the `@tailwindcss/vite` plugin; no separate config file required at v4
- **Recharts** — Declarative chart library used for the weekly calorie bar chart on the dashboard
- **Lucide React** — Icon set consistent with Tailwind's design language
- **react-hot-toast** — Lightweight, non-blocking toast notification system

### State & Data Management

- **React Context + `useState`** — Global app state (user session, food logs, activity logs) is held in `AppContext` and distributed via a custom `useAppContext` hook. Chosen over TanStack Query or Redux because the data model is flat, mutations are simple, and cache invalidation is handled manually by updating context arrays on create/delete.

### Backend

- **Strapi v5** — Headless CMS chosen as the backend framework because it provides a production-grade auth system (`users-permissions` plugin with JWT), automatic REST API generation from content-type schemas, and an admin panel — eliminating the need to hand-roll controllers, middleware, and auth logic for a project of this scope.
- **SQLite (better-sqlite3)** — Default Strapi database for local development; zero config, file-based, no external service required. The `database.ts` config also supports MySQL and PostgreSQL for production.
- **Google Gemini 2.5 Flash (`@google/generative-ai`)** — Multimodal model used for food image analysis. The `gemini.ts` service reads the uploaded image from disk, encodes it as base64, and requests a structured JSON response with food name and calorie estimate.

### Infrastructure & Tooling

- **Vite 7 + `@vitejs/plugin-react-swc`** — Fast dev server and build tool using SWC for TypeScript/JSX compilation instead of Babel; measurably faster HMR on large component trees
- **ESLint 9 with `typescript-eslint` + `eslint-plugin-react-hooks`** — Flat config format, enforces hook rules and TypeScript best practices
- **Vercel** — Client deployment target (`vercel.json` present in `client/`)

---

## 🔍 Technical Decisions

| Technology                        | Decision Rationale                                                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strapi v5                         | Provides JWT auth, user management, content-type REST APIs, and an admin panel out of the box — avoiding hand-rolling auth middleware and CRUD controllers for a prototype scope                        |
| React Context over TanStack Query | The app has a small number of global entities (user, food logs, activity logs); using context with manual array updates avoids the overhead and learning curve of a server-state library for this scope |
| Gemini 2.5 Flash                  | Multimodal capability with JSON mode (`responseMimeType: "application/json"`) makes food image analysis reliable and easy to parse without post-processing                                              |
| SQLite for local dev              | Zero external dependencies; the Strapi `database.ts` config already supports Postgres/MySQL for production swap without code changes                                                                    |
| Vite + SWC plugin                 | Significantly faster than `@vitejs/plugin-react` (Babel) for TypeScript projects; hot reload is near-instant even on large files                                                                        |

---

## 🏗 Architecture

```
React Client (Vite + TypeScript)
  ├── AppContext (global state: user, foodLogs, activityLogs)
  ├── ThemeContext (dark/light mode)
  ├── Axios instance (base URL + JWT interceptor + 401 redirect)
  └── Pages / Components
        ↓ HTTP (REST)
Strapi v5 (Node.js)
  ├── users-permissions plugin  →  /api/auth/local, /api/users/me
  ├── food-log content type     →  /api/food-logs (CRUD)
  ├── activity-log content type →  /api/activity-logs (CRUD)
  └── image-analysis custom API →  /api/image-analysis
        ↓
  Gemini 2.5 Flash (Google AI)   ←  base64 image + prompt
        ↓
  SQLite (local) / Postgres (prod)
```

**Data flow:**

A typical food log create: the user fills the form in `FoodLog.tsx` → `handleSubmit` calls `api.post("/api/food-logs", { data: formData })` → the Axios interceptor injects the stored JWT → Strapi validates the token, associates the entry with the authenticated user via the `users_permissions_user` relation, and persists to SQLite → the response is appended directly to `allFoodLogs` in `AppContext`, re-rendering the dashboard and food list without a refetch.

For AI-assisted entry: the user uploads a photo in the food log form → the client `POST`s the image to `/api/image-analysis` → the Strapi controller saves the file, calls `analyzeImage()` in `gemini.ts` → Gemini returns `{ name, calories }` as JSON → the controller returns that to the client, which pre-fills the food entry form.

---

## 📁 Project Structure

```
FitnessTrackerPrototype-main/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   │   ├── assets.ts          # Static data: meal icons, motivational messages, quick-add lists
│   │   │   └── mockApi.ts         # Offline mock data (used during development)
│   │   ├── components/
│   │   │   ├── ui/                # Primitive UI components: Button, Card, Input, Select, Slider, ProgressBar, Tooltip
│   │   │   ├── BottomNav.tsx      # Mobile navigation bar
│   │   │   ├── CaloriesChart.tsx  # Recharts weekly calorie bar chart
│   │   │   └── Sidebar.tsx        # Desktop navigation sidebar
│   │   ├── configs/
│   │   │   └── api.ts             # Axios instance with JWT interceptor and 401 handler
│   │   ├── context/
│   │   │   ├── AppContext.tsx      # Global state: auth, food logs, activity logs
│   │   │   └── ThemeContext.tsx    # Dark/light theme toggle
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # Today's calorie summary, progress bars, weekly chart
│   │   │   ├── FoodLog.tsx         # Manual and AI-assisted meal entry, delete
│   │   │   ├── ActivityLog.tsx     # Workout entry and delete
│   │   │   ├── Profile.tsx         # Update user fitness profile
│   │   │   ├── Onboarding.tsx      # First-time goal setup gate
│   │   │   ├── Login.tsx           # Login / register form
│   │   │   └── Layout.tsx          # Root layout with sidebar + bottom nav
│   │   └── types/
│   │       └── index.ts            # All shared TypeScript types and interfaces
│   └── vercel.json                 # Vercel deployment config (rewrites for SPA routing)
│
└── server/                         # Strapi v5 backend
    ├── config/
    │   ├── database.ts             # SQLite / MySQL / Postgres config based on env
    │   ├── middlewares.ts          # CORS and other middleware config
    │   └── plugins.ts              # Plugin configuration
    ├── src/
    │   ├── api/
    │   │   ├── food-log/           # FoodLog collection type: schema, controller, route, service
    │   │   ├── activity-log/       # ActivityLog collection type: schema, controller, route, service
    │   │   └── image-analysis/     # Custom API: image upload + Gemini analysis
    │   │       ├── controllers/image-analysis.ts
    │   │       ├── routes/image-analysis.ts
    │   │       └── services/gemini.ts   # Google Generative AI integration
    │   └── extensions/
    │       └── users-permissions/  # Extended User schema with fitness profile fields
    └── types/generated/            # Auto-generated TypeScript types from Strapi content types
```

The client uses a flat pages-and-components structure rather than feature-based folders, which is appropriate at this scale. The server follows Strapi's conventional `api/<content-type>/{controllers,routes,services,content-types}` layout, with one custom API module (`image-analysis`) that steps outside the generated pattern to integrate a third-party service.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>=20.0.0 <=24.x.x`
- npm `>=6.0.0`
- A Google Gemini API key (for image analysis)

### Clone the repository

```bash
git clone https://github.com/CB2104/FitnessTrackerPrototype
cd FitnessTrackerPrototype
```

### Start the backend

```bash
cd server
cp .env.example .env
# Fill in APP_KEYS, JWT secrets, and GEMINI_API_KEY in .env
npm install
npm run dev
```

Strapi starts on `http://localhost:1337`. On first run it will auto-migrate the SQLite database. Visit `http://localhost:1337/admin` to create the admin user and configure content-type permissions (grant `find`, `findOne`, `create`, `delete` on `food-log` and `activity-log` to the Authenticated role).

### Start the frontend

```bash
cd client
cp .env.template .env
# VITE_STRAPI_API_URL is already set to http://localhost:1337
npm install
npm run dev
```

The client starts on `http://localhost:5173`.

---

## 🔐 Environment Variables

### Client (`client/.env`)

```env
VITE_STRAPI_API_URL=http://localhost:1337
```

| Variable              | Description                                                | Required |
| --------------------- | ---------------------------------------------------------- | -------- |
| `VITE_STRAPI_API_URL` | Base URL of the Strapi backend, used by the Axios instance | ✅       |

### Server (`server/.env`)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2
API_TOKEN_SALT=your_salt
ADMIN_JWT_SECRET=your_secret
TRANSFER_TOKEN_SALT=your_salt
JWT_SECRET=your_secret
ENCRYPTION_KEY=your_key
GEMINI_API_KEY=your_gemini_api_key
```

| Variable              | Description                                                   | Required |
| --------------------- | ------------------------------------------------------------- | -------- |
| `HOST`                | Server bind host                                              | ✅       |
| `PORT`                | Server port (default: 1337)                                   | ✅       |
| `APP_KEYS`            | Comma-separated random keys used by Strapi session management | ✅       |
| `API_TOKEN_SALT`      | Salt for API token generation                                 | ✅       |
| `ADMIN_JWT_SECRET`    | JWT secret for admin panel                                    | ✅       |
| `TRANSFER_TOKEN_SALT` | Salt for data transfer tokens                                 | ✅       |
| `JWT_SECRET`          | JWT secret for user-facing auth tokens                        | ✅       |
| `ENCRYPTION_KEY`      | Encryption key for sensitive config values                    | ✅       |
| `GEMINI_API_KEY`      | Google Gemini API key for food image analysis                 | ✅       |

---

## 📡 API Reference

### Base URL

```
http://localhost:1337
```

### Endpoints

| Method   | Endpoint                         | Description                                                   | Auth       |
| -------- | -------------------------------- | ------------------------------------------------------------- | ---------- |
| `POST`   | `/api/auth/local/register`       | Register a new user                                           | None       |
| `POST`   | `/api/auth/local`                | Login and receive JWT                                         | None       |
| `GET`    | `/api/users/me`                  | Get authenticated user profile                                | Bearer JWT |
| `PUT`    | `/api/users/:id`                 | Update user profile (onboarding, fitness goals)               | Bearer JWT |
| `GET`    | `/api/food-logs`                 | List authenticated user's food log entries                    | Bearer JWT |
| `POST`   | `/api/food-logs`                 | Create a food log entry                                       | Bearer JWT |
| `DELETE` | `/api/food-logs/:documentId`     | Delete a food log entry                                       | Bearer JWT |
| `GET`    | `/api/activity-logs`             | List authenticated user's activity log entries                | Bearer JWT |
| `POST`   | `/api/activity-logs`             | Create an activity log entry                                  | Bearer JWT |
| `DELETE` | `/api/activity-logs/:documentId` | Delete an activity log entry                                  | Bearer JWT |
| `POST`   | `/api/image-analysis`            | Upload a food image, receive `{ name, calories }` from Gemini | None       |

### Authentication

Strapi's `users-permissions` plugin issues a JWT on login and registration. The client stores this token in `localStorage` and injects it via an Axios request interceptor as `Authorization: Bearer <token>`. On 401 responses the interceptor clears the token and redirects to `/login`. The image analysis endpoint is intentionally unauthenticated (`config: { auth: false }`) to simplify the upload flow.

---

## 📐 Data Models

```ts
interface User {
  id: string;
  documentId?: string;
  email: string;
  username: string;
  token: string;
  age?: number;
  weight?: number; // decimal
  height?: number; // decimal
  goal?: "lose" | "maintain" | "gain";
  dailyCalorieIntake?: number;
  dailyCalorieBurn?: number;
  createdAt?: string;
}

interface FoodEntry {
  id: number | string;
  documentId?: string;
  name: string;
  calories: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  createdAt?: string;
}

interface ActivityEntry {
  id: number;
  documentId: string;
  name: string;
  duration: number; // minutes
  calories: number;
  date: string;
  createdAt?: string;
}

// Gemini image analysis response
interface ImageAnalysisResult {
  name: string;
  calories: number;
}
```

---

## 🧪 Testing

No automated tests are present in the current codebase. The project is structured in a way that would support unit testing of the context logic and integration testing of the Axios API actions, but no test files or testing framework configuration exist at this time.

**Coverage includes:**

- None currently — manual testing only

---

## 📚 Technical Learnings

- Implementing a full JWT auth flow in a React SPA: token persistence, session restoration on reload via a bootstrap fetch, and interceptor-based 401 handling
- Using Strapi v5 as a backend-as-a-service layer: extending the built-in User content type, configuring per-role API permissions, and writing custom controllers outside the generated pattern
- Integrating a multimodal AI model (Gemini 2.5 Flash) with JSON mode to extract structured data from unstructured image input
- Managing flat global client state with React Context for a multi-entity domain without introducing a heavy state management library
- Enforcing an onboarding gate at the app shell level using conditional rendering before the router is mounted

---

## 👤 Author

**Cesar Bastidas** — [@CB2104](https://github.com/CB2104)
