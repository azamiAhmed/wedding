# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (flat config, eslint.config.mjs)
```

## Architecture

- **Framework**: Next.js 16 with App Router, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 via `@tailwindcss/postcss` — uses `@import "tailwindcss"` and `@theme inline` syntax (not the v3 `@tailwind` directives)
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`
- **Path alias**: `@/*` maps to the project root
- **Package manager**: npm (uses `package-lock.json`)

## Project Structure

- `app/` — Next.js App Router pages and layouts. Single root layout with global CSS.
- `public/` — Static assets (SVGs)
- `_bmad/` — BMAD planning toolkit (workflows, agents, templates). Not part of the runtime app — used for project planning via `/bmad-help` and related slash commands.
- `_bmad-output/` — Output directory for BMAD planning/implementation artifacts.