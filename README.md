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
- 🔐 **License Key System** - Pro feature validation with SHA256 hashing

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

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