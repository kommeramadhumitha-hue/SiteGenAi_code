# SiteGen AI — Build Smarter. Repair Faster.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **SiteGen AI** is an autonomous website creation, conversational refinement, and code repair studio. Turn one-sentence descriptions in English or Telugu into complete, accessible, multi-section web applications with visual section editing, real quality auditing, instant source code export, and 1-click edge deployment.

---

## 🚀 Key Features Implemented (Level 1 Complete)

### 1. 🌐 Public Landing Page
- **Hero & Branding:** High-impact hero headline (*"Build Smarter. Repair Faster."*), glowing glassmorphic background, and responsive browser mockup.
- **Natural Language Prompt Bar:** Preloaded with suggested starting points (SaaS analytics, artisanal coffee, UX portfolio, audiophile hardware) that carry directly into the generator.
- **Features & How-it-Works:** Interactive 4-step workflow (*Prompt &rarr; Section Synthesis &rarr; Conversational Refinement &rarr; Quality Audit & Deploy*).
- **Repair Demo Spotlight:** Highlights automated detection of broken viewports, dead links, and missing alt attributes.
- **Benefits Breakdown:** Specialized workflows for students, developers, freelancers, startups, and small businesses.
- **Multilingual Support:** Complete language toggle between **English (EN)** and **Telugu (TE / తెలుగు)** across navigation, cards, and tooltips.

### 2. ⚡ Website Generator Workspace
- **Prompt & Aesthetic Controls:** Select categories (*SaaS, Portfolio, Restaurant, Agency, Education, E-Commerce, Blog, Documentation, Custom*), styles (*Futuristic Dark, Modern Minimal, Vibrant Gradient, Glassmorphism, Corporate Clean, Warm Editorial*), and coordinated palettes.
- **Sandboxed Live Preview:** Safely rendered inside a strictly isolated `<iframe>` with `sandbox="allow-scripts allow-forms"` (isolated from parent origin storage, cookies, and tokens).
- **Responsive Device Switcher:** Instant live switching between **Desktop (100%)**, **Tablet (768px)**, and **Mobile (375px)** viewport frames.
- **16 Reusable Section Types:**
  - `navbar` (Header navigation with links and CTA)
  - `hero` (Banner with badges, headline, copy, and buttons)
  - `features` (Responsive grid of capability cards with icons)
  - `about` (Mission statement and company narrative)
  - `product` (Hardware & software showcases)
  - `pricing` (Tiered subscription cards with feature checklists)
  - `testimonials` (Quotes, star ratings, author avatars)
  - `statistics` (Performance metrics in 4-column responsive grid)
  - `gallery` (Visual image showcase)
  - `team` (Team roster cards)
  - `faq` (Clickable accordion questions and answers)
  - `blog` (Article cards with metadata)
  - `contact` (Interactive contact and reservation form)
  - `newsletter` (Waitlist email input with privacy assurance)
  - `cta` (High-energy conversion banner)
  - `footer` (Multi-column footer links and copyright)
- **Section Controls:** Add, remove, reorder (move up/down), toggle visibility (eye icon), and edit fields in real-time.
- **Conversational Copilot Assistant:** Interactive chat drawer for natural language updates (*e.g., "Add 20% launch discount badge", "Switch theme to Emerald Aurora", "Change button text"*).
- **Undo / Redo:** Full historical stack enabling rollback and redo at any time.

### 3. 🛠️ Automated Website Repair Studio
- **Realistic Broken Fixtures:** Preloaded sample broken sites (*Broken Italian Bistro, Broken Developer Portfolio, Broken SaaS Landing*).
- **Automatic Diagnostics:** Detects:
  - Missing `viewport` meta tags causing mobile distortion
  - Missing `alt` tags on `<img>` elements
  - Unlabelled `<input>` and form controls
  - Dead anchor links (`href="#"` or empty targets)
  - Insecure `target="_blank"` without `rel="noopener noreferrer"`
  - Rigid, non-fluid fixed pixel widths (`width: 1200px`)
  - Missing doctype and HTML lang declarations
- **Before / After Diff Comparison:** Shows exact red/green code diffs for each flaw.
- **1-Click Repairs:** Apply individual fixes, "Apply All Fixes", or undo applied fixes.
- **Live Repaired Preview & Export:** Preview the cleaned site in real time and download repaired HTML.

### 4. 📊 Quality & Testing Lab
- **Objective Structural Checks:** Evaluates live DOM structure rather than invented dummy numbers.
- **Audit Categories:**
  - **Accessibility (a11y):** Screen reader labels, image alt text, single `<h1>` hierarchy.
  - **Responsiveness:** Viewport meta presence, flexible grid/flexbox usage.
  - **SEO:** Title tag length (10-70 characters), meta description, semantic landmarks.
  - **Links & Navigation:** Functional target anchors, absence of dead hashes.
  - **HTML Structure:** HTML5 doctype, lang attributes, semantic containers (`header`, `nav`, `section`, `footer`).
  - **Performance:** HTML byte weight budget check.
- **Estimated vs Measured Labels:** Clearly denotes measured in-browser checks vs headless Chrome telemetry (ready for Level 2).

### 5. 📦 Code & Full ZIP Export Workspace
- **Source File Tree Explorer:** View and inspect `index.html`, `styles.css`, `script.js`, `README.md`, and `App.tsx` (React + Tailwind component).
- **Copy Code & Download:** Copy with 1-click clipboard confirmation or download individual files.
- **Full ZIP Archive Download:** Generates real production `.zip` bundles using `JSZip` containing structured directories (`css/`, `js/`, `react-src/`, `README.md`, `index.html`).
- **Security Guarantee:** Secrets, tokens, and `.env` files are strictly excluded from all export archives.

### 6. 🚀 GitHub & Live Deployment Hub
- **GitHub Repository Publishing:** Configure repository name, target branch, and custom commit message. Shows commit hashes and public repository URLs.
- **Edge Hosting Providers:** Supports **Vercel Edge**, **Netlify**, **Cloudflare Pages**, and **GitHub Pages**.
- **Build Progress Simulator:** Real-time log worker visualizing container initialization, asset compilation, Edge CDN replication, and SSL issuance.
- **Deployment History Log:** Persists deployment records, timestamps, commit hashes, and live public URLs in `localStorage`.
- **Integrations Notice:** Clearly distinguishes configured OAuth credentials from Level 1 Sandbox demo mode.

### 7. ⚙️ Settings & Multilingual Engine
- **Appearance:** Theme choices (Dark Navy, Midnight OLED, Cyberpunk) and reduced motion support.
- **Language Switcher:** Native bilingual interface with translations in English and Telugu.
- **API Status:** Masked key display (`••••••••sk-9a7f`) for Gemini/OpenAI, MongoDB connection status, and GitHub token status.
- **Factory Reset:** 1-click button to reset local storage back to default templates.

---

## 📁 Repository Architecture

```text
SiteGenAi/
├── index.html                     # HTML5 entrypoint with Google Fonts (Inter, JetBrains Mono)
├── package.json                   # Dependencies & scripts
├── vite.config.ts                 # Vite bundler configuration
├── tailwind.config.js             # Tailwind CSS tokens & color extensions
├── postcss.config.js              # PostCSS plugins
├── tsconfig.json                  # Strict TypeScript configuration
│
├── src/
│   ├── main.tsx                   # React 19 root mounting
│   ├── App.tsx                    # Route definitions & top-level providers
│   ├── index.css                  # Global styles, glassmorphism, scrollbars
│   │
│   ├── types/
│   │   └── index.ts               # Complete TypeScript domain interfaces
│   │
│   ├── i18n/
│   │   └── translations.ts        # Comprehensive English & Telugu translation dictionaries
│   │
│   ├── context/
│   │   ├── ProjectContext.tsx     # Active project, undo/redo, section editing, persistence
│   │   └── SettingsContext.tsx    # Appearance, language, API credentials state
│   │
│   ├── services/
│   │   ├── aiService.ts           # Generative heuristics + Level 2 Gemini/OpenAI hooks
│   │   ├── htmlRenderer.ts        # Converts WebsiteProject into clean semantic HTML5 & CSS
│   │   ├── qualityService.ts      # Real DOM-based accessibility, SEO & responsiveness analyzer
│   │   ├── repairService.ts       # HTML/CSS defect detector with before/after diffs
│   │   ├── exportService.ts       # Single-file & JSZip full bundle exporter
│   │   └── deployService.ts       # GitHub publisher & Vercel/Netlify deployer
│   │
│   ├── data/
│   │   ├── templates.ts           # 8 production starter templates
│   │   └── sampleBrokenSites.ts   # 3 realistic broken site fixtures for Repair Studio
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Public navigation bar
│   │   │   ├── AppHeader.tsx      # In-app top bar with undo/redo & device switcher
│   │   │   ├── Sidebar.tsx        # Collapsible in-app navigation sidebar
│   │   │   └── AppLayout.tsx      # App shell wrapper
│   │   ├── preview/
│   │   │   └── SandboxedPreview.tsx # Safe iframe with Desktop/Tablet/Mobile frames
│   │   ├── generator/
│   │   │   ├── PromptBar.tsx      # NL prompt editor with category & style selectors
│   │   │   ├── SectionList.tsx    # Section outline with reordering & visibility controls
│   │   │   ├── SectionEditorModal.tsx # Field-by-field content editor
│   │   │   └── ChatAssistantDrawer.tsx # Conversational copilot chat
│   │   ├── repair/
│   │   │   └── RepairWorkspace.tsx # Issue list, side-by-side diffs, 1-click fixes
│   │   ├── quality/
│   │   │   └── QualityDashboard.tsx # Real measured audit checklist
│   │   ├── export/
│   │   │   └── CodeExplorer.tsx   # File explorer & download ZIP
│   │   ├── deploy/
│   │   │   └── DeployWorkspace.tsx # GitHub publish & edge deployer
│   │   └── common/
│   │       └── ErrorBoundary.tsx  # Graceful runtime error recovery
│   │
│   └── pages/
│       ├── LandingPage.tsx        # Public landing experience
│       ├── DashboardPage.tsx      # Projects manager & stats
│       ├── GeneratorPage.tsx      # Main AI generator workspace
│       ├── TemplatesPage.tsx      # 8 starter template blueprints
│       ├── RepairPage.tsx         # Automated repair suite
│       ├── QualityPage.tsx        # Real testing lab
│       ├── ExportPage.tsx         # Source code & ZIP download
│       ├── DeployPage.tsx         # GitHub & live deployment hub
│       ├── SettingsPage.tsx       # Configuration & API keys
│       ├── AuthPage.tsx           # Account-ready sandbox layout
│       └── NotFoundPage.tsx       # 404 handler
│
└── server/                        # Level 2 Node.js + Express Backend Layer
    ├── package.json               # Backend dependencies (express, cors, dotenv)
    ├── server.js                  # Express API endpoints (/api/generate, /api/repair, etc.)
    └── .env.example               # Environment variable templates
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended; v24.14 verified)
- npm (v9 or higher; v11.9 verified)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build Production Bundle
```bash
npm run build
```
Creates an optimized, minified production distribution in `dist/`.

---

## 🚀 Level 3 Release: Real Deployment, GitHub Publishing & MongoDB Atlas

SiteGen AI has advanced to **Level 3 Release Status**. All core pipelines are connected end-to-end with real REST API operations, secret scanning, deterministic error handling, and persistent data storage.

### 🌟 End-to-End Workflow Capabilities
1. **Natural Language Generation:** Multimodal synthesis using Google Gemini, OpenAI, or the fallback heuristic engine.
2. **Visual & Conversational Editing:** Real-time section reordering, visibility toggling, field editing, and AI conversational refinement.
3. **Automated Code Repair Studio:** 7+ diagnostic checks (viewport, accessibility, invalid links, security) with before/after visual diffs and 1-click patches.
4. **Quality & Compliance Lab:** Comprehensive scoring for Performance, Accessibility, SEO, and Best Practices.
5. **MongoDB Atlas Persistence:** Multi-version snapshots, prompt history logs, and deployment audit tracking.
6. **Real GitHub Publishing:**
   - Scans all files before commit to prohibit secrets (`.env`, `node_modules`, API keys).
   - Commits actual generated code directly using official GitHub REST API endpoints.
   - Saves publishing audit records in MongoDB Atlas.
   - Refuses to fake a successful push when credentials are unconfigured.
7. **Real Cloud Edge Deployment:**
   - Integrated with official Vercel (`api.vercel.com/v13/deployments`) and Netlify APIs.
   - Reports real deployment status, build logs, and confirmed production URLs.
   - Maintains full deployment history with direct "Visit Live Website" navigation.

---

## 🛠️ Quick Start & Local Execution

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
# or npm start
```
*The server starts on `http://localhost:5000`.*

### 2. Start Frontend Application
In a separate terminal:
```bash
npm install
npm run dev
```
*The Vite frontend starts on `http://localhost:5173`.*

### 3. Run Build & Automated Tests
- **Frontend Production Build:**
  ```bash
  npm run build
  ```
- **Backend Test Suite (17 Integration Tests):**
  ```bash
  cd server
  npm test
  ```

---

## 🔑 Environment Configuration (`server/.env`)

Configure `server/.env` with your real service credentials:

```ini
# Network & Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Generative AI (Google Gemini or OpenAI)
AI_PROVIDER=gemini
AI_MODEL=gemini-1.5-flash
GEMINI_API_KEY=your_gemini_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sitegen_ai?retryWrites=true&w=majority

# GitHub Integration
GITHUB_TOKEN=ghp_your_personal_access_token_with_repo_scope

# Hosting & Edge Deployment
VERCEL_TOKEN=your_vercel_token_here
# NETLIFY_AUTH_TOKEN=your_netlify_token_here
```

> **Note on Missing Credentials:** If any external service credential is omitted, SiteGen AI displays the exact integration as **Not Connected** and provides setup instructions. The app never fabricates URLs or claims external services succeeded without confirmed API responses.

---

## 📚 Backend REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health, version (`3.0.0-level3-release`), and integration status |
| `POST` | `/api/generate` | Synthesizes complete multi-section website from natural language prompt |
| `POST` | `/api/chat-edit` | Conversational section editing and theme modification |
| `POST` | `/api/repair/diagnose` | Deterministic flaw diagnosis of HTML/CSS code |
| `POST` | `/api/repair/apply` | Applies verified patches to source code |
| `POST` | `/api/quality/audit` | WCAG accessibility, SEO, and responsive audit |
| `GET` | `/api/projects` | Lists projects with search and category filters |
| `POST` | `/api/projects` | Saves or updates project with version tracking |
| `GET` | `/api/projects/:id` | Fetches single project |
| `DELETE`| `/api/projects/:id` | Deletes project |
| `GET` | `/api/github/status` | Inspects GitHub integration connectivity |
| `GET` | `/api/github/repos` | Fetches accessible repositories for authenticated user |
| `POST` | `/api/github/scan-security`| Scans files for credentials & prohibited paths before publishing |
| `POST` | `/api/github/publish` | Publishes actual source files to GitHub repository |
| `GET` | `/api/github/history` | Lists recent GitHub publishing audit records |
| `GET` | `/api/deploy/status` | Checks live deployment provider configuration (Vercel, Netlify) |
| `POST` | `/api/deploy` | Deploys generated website to production edge host |
| `GET` | `/api/deploy/:id/health`| Retrieves provider deployment status and ready URL |
| `GET` | `/api/deploy/history` | Lists production deployment history from MongoDB Atlas |

---

## 🛡️ Safe Project & Secret Handling

1. **Strict Secret Scanning:** All files undergo regex inspection for Google, OpenAI, GitHub, and private keys before any publishing or deployment.
2. **Blocked Path Enforcement:** Prohibited files (`.env`, `node_modules`, `.git`, `.pem`, `.key`) are strictly blocked from being pushed.
3. **Auto-Generated `.gitignore`:** Every published repository automatically includes a production `.gitignore`.
4. **Sandboxed Live Preview:** Rendered inside `<iframe sandbox="allow-scripts allow-forms">` to isolate parent cookies and origin storage.
5. **Masked Credentials:** Tokens stored in settings or environment files are never leaked to client logs or source exports.
