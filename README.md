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

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
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

### Enabling Pro locally

Set an environment flag to unlock Pro screens during local development:

```bash
echo "VITE_PRO_ENABLED=true" > .env.local
npm run dev
```

When `VITE_PRO_ENABLED` is not set to `true`, navigating to Pro routes (`churn-calculator`, `mrr-simulator`, `retention-calculator`) shows an upsell page.

Note: Real license enforcement must happen server-side (e.g., account checks, license keys, feature flags). The client flag is only a UX gate for demos/local dev.

---

Made with 💚 for indie hackers and solopreneurs. If you find this project helpful, consider supporting it:

<a href="https://www.buymeacoffee.com/breakeven" target="_blank" rel="noopener noreferrer">
  <img
    alt="Support BreakEven on Buy Me a Coffee"
    src="https://img.buymeacoffee.com/button-api/?text=Support%20BreakEven&emoji=%F0%9F%9A%80&slug=breakeven&button_colour=10b77f&font_colour=ffffff&font_family=Inter&outline_colour=ffffff&coffee_colour=FFDD00"
  />
 </a>