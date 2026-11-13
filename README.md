# Parola — Italian Flash Cards

A small Italian vocabulary practice app built with React, TypeScript, and Vite. Choose a 10-, 20-, or 50-word session, type Italian answers, and repeat missed words until they are correct. Session progress is kept in memory and is cleared when the app is refreshed.

## Requirements

- Node.js 22.12 or newer (Node.js 22 LTS is recommended)
- npm

## Setup

```sh
npm install
npm run dev
```

Open the local URL printed by Vite to use the app.

## Generate vocabulary decks

The source vocabulary is in `src/data/italian.json`. Run the deck generator after changing that source file:

```sh
npm run generate:decks
```

This runs `buildItalianDecks()` and writes `src/data/decks/a1.json`, `a2.json`, `b1.json`, `b2.json`, `c1.json`, and `c2.json`. Each card has an ID based on its CEFR level and Italian word, an English translation prompt, and the Italian word as its accepted answer. Entries not marked useful for flashcards, entries with missing required text, and levels outside A1–C2 are skipped. The app currently uses the generated A1 deck.

The conversion function is exported from `src/data/italian-decks.ts` and accepts the parsed source array, so it can also be reused without the file-writing script.

## Checks

```sh
npm test
npm run lint
npm run build
```

## Scripts

- `npm run dev` starts the local development server.
- `npm run generate:decks` regenerates the level-specific vocabulary files.
- `npm test` runs the quiz, session, and deck conversion tests.
- `npm run lint` checks the code with ESLint.
- `npm run build` type-checks and creates the production build in `dist/`.
- `npm run preview` serves the production build locally.
