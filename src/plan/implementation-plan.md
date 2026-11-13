# Language Flash Cards — Implementation Plan

A small-commit roadmap for the Italian vocabulary learning app. The workspace is a React, TypeScript, and Vite app; this plan adds Tailwind CSS and shadcn/ui and replaces the default starter screen.

## Product decisions

- Italian is the initial challenge language; prompts are in English.
- Deck sizes are 10, 20, or 50 unique words.
- Missed words return to the deck and are repeated until answered correctly.
- Answers ignore capitalization and minor accent differences, and may match listed alternatives.
- Show correctness and the expected answer before the learner continues.
- Session progress is in-memory only; no account or saved history in the first release.
- Use a warm, playful visual style, teach noun articles, and support typed answers only.
- Use a learner-focused Italian vocabulary dataset, checking its license and recording its source and attribution.

## Commit sequence

### 1. `chore: remove Vite starter screen` ✅

Remove demo content and starter styles, leaving a minimal app shell.

**Verify:** `npm run build` and `npm run lint` pass.

### 2. `build: add Tailwind CSS` ✅

Add Tailwind and its Vite-compatible configuration. Establish basic color, font, and layout tokens for the warm, playful visual direction.

**Verify:** Tailwind styles render in the app; build and lint pass.

### 3. `ui: initialize shadcn components` ✅

Set up shadcn/ui and add only the components needed initially: Button, Card, Input, Select, and Progress.

**Verify:** Render a small component preview and check keyboard focus styles.

### 4. `data: add sourced Italian vocabulary` ⏳

Use the supplied `data/italian.json` as a source candidate, not as the app's runtime format. It currently contains 16,887 entries (rather than 40,000), English glosses, CEFR labels, part of speech, frequency rank, and example sentences. Keep the downloaded source unchanged and create a separate curated app dataset of 1,000 beginner-focused entries, prioritizing A1/A2 and lower frequency rank. Convert each entry to a stable app schema with an ID, Italian lemma, English prompt/glosses, accepted Italian answer(s), CEFR level, part of speech, and optional example sentence.

Do not treat every semicolon-separated English gloss as a distinct answer, or `romanization` as pronunciation data; review ambiguous translations and examples. Add the correct Italian article/gender for curated nouns so the quiz can teach and check articles. Exclude or repair malformed entries and manually review the selected vocabulary for learner suitability.

Record the dataset URL, authors/contributors, retrieval date, transformation steps, and license in a data attribution file. The linked repository advertises an MIT license and an attribution file, but also describes frequency lists compiled from varied sources and LLM-assisted editing; verify that the license and upstream source terms cover the actual downloaded data before redistributing it.

**Verify:** Validate exactly 1,000 unique curated entries, required fields and allowed CEFR/POS values, non-empty prompts and answers, and noun article coverage. Confirm source attribution and redistribution terms before shipping the dataset.

### 5. `test: add quiz logic tests` ✅

Add a test runner and tests for answer normalization: case-insensitivity, accent handling, and accepted alternatives.

**Verify:** Tests pass for correct, incorrect, and alternate answers.

### 6. `feat: implement quiz session rules` ✅

Build the framework-independent session logic: select 10, 20, or 50 unique words; requeue missed words; finish once every selected word has been answered correctly. Keep session state in memory only.

**Verify:** Tests cover selection size, requeueing, completion, and progress counts.

### 7. `feat: add client-side routing` ✅

Add React Router for the distinct deck-selection, quiz, and completion screens. Keep session state in an in-memory provider above the routes, and provide a not-found route. Do not persist session data or encode it in URLs.

**Verify:** Navigation between screens works with links and browser back/forward; unknown paths show a not-found view; build, lint, and tests pass.

### 8. `feat: build deck selection screen`

Create the start screen with Italian as the challenge language and the 10/20/50 deck-size choices.

**Verify:** Each choice starts a session with the selected number of unique words.

### 9. `feat: add typed flashcard flow`

Show one English prompt at a time, accept a typed Italian answer, and show correctness plus the expected answer before the learner continues.

**Verify:** Enter submits; the Next action advances only after feedback.

### 10. `feat: add session completion and restart`

Show a completion screen with session results and an option to start another deck.

**Verify:** Restart begins a fresh session without carrying over old answers.

### 11. `polish: improve responsive and accessible UX`

Tune mobile layouts, loading/empty/error states, screen-reader labels, focus handling, and README setup instructions.

**Verify:** Build, lint, and tests pass; the main flow works on narrow and wide screens.

## Out of scope for the first release

Audio, accounts, and saved history are deferred to keep the initial app focused.
