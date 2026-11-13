# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

````js
export default defineConfig([
  # Parola — Italian Flash Cards

  A small Italian vocabulary practice app built with React, TypeScript, and Vite. Choose a 10-, 20-, or 50-word session, type Italian answers, and repeat missed words until they are correct. Session progress is kept in memory and is cleared when the app is refreshed.

  ## Requirements

  - Node.js 22.12 or newer (Node.js 22 LTS is recommended)
  - npm

  ## Setup

  ```sh
  npm install
  npm run dev
````

Open the local URL printed by Vite to use the app.

## Checks

```sh
npm test
npm run lint
npm run build
```

## Scripts

- `npm run dev` starts the local development server.
- `npm test` runs the quiz and session logic tests.
- `npm run lint` checks the code with ESLint.
- `npm run build` type-checks and creates the production build in `dist/`.
- `npm run preview` serves the production build locally.
