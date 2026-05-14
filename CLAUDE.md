# Strength Training PWA

React 19 + TypeScript + Vite 8 progressive web app for tracking strength training workouts.

## Sandbox vs Host Architecture Mismatch

The user runs `npm install` on the host machine (macOS), which installs native binaries compiled for darwin. The Claude Code sandbox runs linux-arm64. This means:

- **Do NOT run `npm install` in the sandbox** — it will overwrite host-compatible binaries with linux ones, breaking the host.
- **Do NOT try to `npm run build`, `npx tsc`, or `npx vite build` in the sandbox** — native modules (e.g. `@tailwindcss/oxide`, TypeScript's native bindings) will crash with `Illegal instruction` because they were compiled for darwin.
- **Do NOT spend time debugging `Illegal instruction` errors** — they are always this architecture mismatch, not a code problem.
- When you need to add dependencies, tell the user to run `npm install` on their host, or note the packages to install and move on.

## Stack

- React 19, TypeScript, Vite 8
- Tailwind CSS v4 + DaisyUI v5 (CSS-native config, no tailwind.config.js)
- PWA via vite-plugin-pwa

## Dev Commands (run on host, not in sandbox)

- `npm run dev` — start dev server
- `npm run build` — typecheck + production build
- `npm run lint` — ESLint
