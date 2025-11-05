# <img src="assets/BreakEven-logo.png" alt="BreakEven Logo" width="36" height="36" /> BreakEven

Free financial calculators to help indie hackers and solopreneurs make smarter decisions about pricing, growth, and profitability.

[![BreakEven Hero](public/og-image.png)](https://breakeven.dev)

## What is BreakEven?

BreakEven is a collection of five powerful calculators designed specifically for side project creators. Whether you're validating an idea, optimizing pricing, or planning for growth, these tools give you the clarity you need to make data-driven decisions.

## Features

- **ROI Calculator** (Core) - Estimate when your side project breaks even based on costs, pricing, and growth projections
- **Pricing Calculator** (Core) - Experiment with different price points and conversion rates to optimize revenue
- **Churn Calculator** (Pro) - Understand the impact of customer churn on your recurring revenue over time
- **MRR Growth Simulator** (Pro) - Visualize monthly recurring revenue growth with adjustable inputs and projections
- **Retention Impact** (Pro) - See how retention improvements affect customer lifetime value and overall profitability

Each calculator includes:
- Interactive charts and visualizations
- Shareable URLs to save and share your calculations
- Export to PDF and PNG formats
- Dark mode support

## Tech Stack

Built with modern web technologies:

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 18** - UI library
- 📘 **TypeScript** - Type safety
- 🎨 **shadcn/ui** - Beautiful component library
- 🎭 **Tailwind CSS** - Utility-first styling
- 📊 **Recharts** - Data visualization
- 🛣️ **React Router** - Client-side routing
- 🔄 **TanStack Query** - Data fetching and state management
- 📄 **React Helmet Async** - SEO and meta tag management
- 🌍 **i18next + react-i18next** - Internationalization
- 🧭 **i18next-browser-languagedetector** - Language detection (navigator/localStorage)
- 🔐 **License Key System** - Pro feature validation with SHA256 hashing

## Project Structure

```
/
├─ src/
│  ├─ components/        # Reusable UI and app components (shadcn-based)
│  ├─ hooks/             # Custom React hooks
│  ├─ lib/               # Utilities (i18n, licensing, sharing, exports)
│  ├─ locales/           # Translation JSON files
│  ├─ pages/             # Route-level pages (calculators, Pro, etc.)
│  ├─ App.tsx            # App shell and routing
│  └─ main.tsx           # App entry (Vite)
├─ public/               # Static assets (favicons, manifest, valid-keys.json)
├─ assets/               # Project images and logos
├─ index.html            # Vite HTML template
└─ README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/chomelc/BreakEven.git
cd BreakEven
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The `dist` folder will contain the production-ready build.

### Preview Production Build

```bash
npm run preview
```

## Internationalization (i18n)

BreakEven supports multiple languages using `i18next`, `react-i18next`, and `i18next-browser-languagedetector`.

- **Translation files**: `src/locales/*.json` (e.g., `en.json`, `fr.json`, `de.json`, `es.json`, `nl.json`)
- **Initialization**: `src/lib/i18n.ts` registers resources and sets `fallbackLng: 'en'`
- **Detection**: language is detected via `localStorage` and the browser (`navigator`), cached in `localStorage`
- **Manual switching**: use the in-app language toggle

### Add a new language
1. Create `src/locales/<lang>.json`
2. Import and register it in `src/lib/i18n.ts` under `resources`
3. (Optional) Expose it in the language toggle UI if needed

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Releasing

Simple manual flow:

1. Bump version in `package.json`
2. Build locally
   ```bash
   npm run build
   ```
3. Test the preview build
   ```bash
   npm run preview
   ```
4. Commit, tag, and push
   ```bash
   git add .
   git commit -m "chore: release vX.Y.Z"
   git tag vX.Y.Z
   git push && git push --tags
   ```

Deploy according to your hosting setup (e.g., upload `dist/` or use CI).

## Deployment (GitHub Pages)

Vite apps on GitHub Pages need the correct `base` path when the site is served from a subpath (e.g., `username.github.io/REPO`).

1) Set Vite base (only when deploying to a project page)

- Edit `vite.config.ts` and set:
  ```ts
  export default defineConfig({
    base: '/BreakEven/', // replace with your REPO name
    // ...
  })
  ```
  Skip this if deploying to a user/org page root (`username.github.io`).

2) Build
```bash
npm run build
```

3) Publish `dist/` to `gh-pages` branch

- Manual (subtree):
  ```bash
  git add -f dist
  git commit -m "chore: publish"
  git subtree push --prefix dist origin gh-pages
  ```
  If the branch doesn't exist, create it first:
  ```bash
  git push origin `git subtree split --prefix dist main`:gh-pages --force
  ```

4) Configure Pages

- In GitHub → Settings → Pages:
  - Source: `Deploy from a branch`
  - Branch: `gh-pages` / root

Optional: GitHub Actions

- Add a workflow that builds and deploys `dist/` to `gh-pages` on push to `main`.

## Code Style

- TypeScript-first; avoid `any` and unsafe casts
- Prefer small, focused components and descriptive names
- Keep control flow flat with early returns where possible
- Match existing formatting; run `npm run lint` before commit
- Keep comments for non-obvious rationale, not restating code

## Contributing

Thanks for your interest in contributing! To get started:

1. Fork the repo and create a feature branch
   ```bash
   git checkout -b feat/your-feature
   ```
2. Install deps and run the dev server
   ```bash
   npm install
   npm run dev
   ```
3. Keep code clean and typed
   - Run `npm run lint` and fix issues
   - Prefer clear variable names and small components
4. Add tests or examples where useful (screenshots/gifs in PRs help)
5. For translations
   - Add `src/locales/<lang>.json`
   - Register it in `src/lib/i18n.ts`
6. Open a Pull Request with a clear description and scope

By contributing, you agree to the licensing terms below.

## Licensing

- Core: Licensed under Apache-2.0. See `LICENSE`.
- Pro: Commercial license. See `EULA.md`.

### Enabling Pro Features

Pro features are protected by a license key system. To enable Pro features locally:

1. **Using License Keys**: The application validates license keys by comparing SHA256 hashes against a list of valid keys stored in `/public/valid-keys.json`. Enter a valid license key in the Pro section to unlock Pro calculators.

2. **Development Mode** (Optional): For local development, you can set an environment flag to bypass license checks:
   ```bash
   echo "VITE_PRO_ENABLED=true" > .env.local
   npm run dev
   ```

When Pro features are not enabled, navigating to Pro routes (`/churn-calculator`, `/mrr-simulator`, `/retention-calculator`) shows an upsell page.

**Note**: In production, license validation should be enforced server-side. The client-side validation is for UX purposes and should be complemented with server-side checks.

---

Made with 💚 for indie hackers and solopreneurs. If you find this project helpful, consider supporting it:

<a href="https://www.buymeacoffee.com/breakeven" target="_blank" rel="noopener noreferrer">
  <img
    alt="Support BreakEven on Buy Me a Coffee"
    src="https://img.buymeacoffee.com/button-api/?text=Support%20BreakEven&emoji=%F0%9F%9A%80&slug=breakeven&button_colour=10b77f&font_colour=ffffff&font_family=Inter&outline_colour=ffffff&coffee_colour=FFDD00"
  />
 </a>