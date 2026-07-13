# counter.io — Word Counter & Writing Tools

A professional word counter web app with 20+ writing tools, real-time statistics, readability analysis, and SEO infrastructure.

## Stack

- **Frontend**: React 18 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI)
- **Routing**: Wouter
- **Animations**: Framer Motion
- **i18n**: i18next + react-i18next

## Project structure

```
pnpm-workspace.yaml          # workspace config
tsconfig.base.json           # shared TypeScript config
packages/
  word-counter/
    src/
      App.tsx                # router + global meta setup
      pages/                 # 20+ page components
      components/            # UI + section components
      hooks/                 # useUndoRedo, useWritingStreak, etc.
      context/               # TextContext, CommandPaletteContext
      config/                # site.ts, languages.ts, routes.ts
      data/                  # blog.ts, tools.ts, guides.ts
      locales/               # i18n JSON (en/)
    index.html
    vite.config.ts           # Vite config + sitemap/robots/feed plugin
    package.json
```

## Installation

> **Requires**: Node.js ≥ 18, pnpm ≥ 9

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install
```

### Prefer npm?

```bash
# npm workspaces also work
npm install
npm run dev
```

## Development

```bash
pnpm dev        # starts dev server at http://localhost:5173
```

## Production build

```bash
pnpm build      # outputs to packages/word-counter/dist/public/
pnpm preview    # serves the production build locally
```

## Type checking

```bash
pnpm typecheck
```

## Environment variables

Copy `.env.example` to `.env` (in the repo root or `packages/word-counter/`) and fill in the values:

```bash
cp .env.example packages/word-counter/.env
```

| Variable | Required | Description |
|---|---|---|
| `VITE_SITE_URL` | No | Public URL of the deployed site. Defaults to `https://counterio.vercel.app`. Used for canonical tags, Open Graph URLs, and sitemap. |
| `VITE_GOOGLE_SITE_VERIFICATION` | No | Google Search Console HTML-tag verification code. |
| `VITE_GA_ID` | No | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`). |
| `VITE_CLARITY_ID` | No | Microsoft Clarity project ID. |
| `PORT` | No | Dev server port. Defaults to `5173`. |
| `BASE_PATH` | No | Base path for subdirectory deployments. Defaults to `/`. |

## Static files generated at build time

The Vite plugin automatically emits these into `dist/public/`:

| File | Description |
|---|---|
| `sitemap.xml` | 96 URLs with hreflang alternates |
| `robots.txt` | Crawl rules + sitemap pointer |
| `feed.xml` | RSS 2.0 feed of all blog posts |

## VS Code setup

Recommended extensions (`.vscode/extensions.json` included):

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
- **TypeScript** — built-in

## Quick start (zero to running)

```bash
git clone <repo-url> counter-io
cd counter-io
pnpm install
cp .env.example packages/word-counter/.env
pnpm dev
# Open http://localhost:5173
```

## Deployment

Any static hosting works (Vercel, Netlify, Cloudflare Pages, GitHub Pages):

```bash
pnpm build
# Upload packages/word-counter/dist/public/ to your host
```

### Vercel

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "packages/word-counter/dist/public",
  "installCommand": "pnpm install"
}
```

### Netlify

```toml
[build]
  command = "pnpm build"
  publish = "packages/word-counter/dist/public"
```
