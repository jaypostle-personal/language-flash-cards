# Language Flash Cards — Implementation Plan

A small-commit roadmap for the Italian vocabulary learning app. The workspace is a React, TypeScript, and Vite app; this plan adds Tailwind CSS and shadcn/ui and replaces the default starter screen.

## Product decisions

- Italian is the initial challenge language; prompts are in English.
- Deck sizes are 10, 20, or 50 unique words.
- Missed words return to the deck and are repeated until answered correctly.
- Answers ignore capitalization and minor accent differences, and may match listed alternatives.
- Show correctness and the expected answer before the learner continues.
- Session progress is in-memory only; no account or saved history in the first release. Local storage may remember the learner's CEFR level selection, but must not persist session progress.
- Sessions default to English → Italian. The learner may optionally switch the direction to Italian → English before starting a session.
- Learners may select one or more CEFR levels. Combined decks should allocate words evenly across selected levels and never repeat the same Italian word in one session.
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

Use the supplied `src/data/italian.json` as a source candidate, not as the app's final runtime format. It currently contains 16,887 entries (rather than 40,000), English glosses, CEFR labels, part of speech, frequency rank, and example sentences. Keep the downloaded source unchanged and create a separate curated app dataset of 1,000 beginner-focused entries, prioritizing A1/A2 and lower frequency rank. Convert each entry to a stable app schema with an ID, Italian lemma, English prompt/glosses, accepted Italian answer(s), CEFR level, part of speech, and optional example sentence.

Do not treat every semicolon-separated English gloss as a distinct answer, or `romanization` as pronunciation data; review ambiguous translations and examples. Add the correct Italian article/gender for curated nouns so the quiz can teach and check articles. Exclude or repair malformed entries and manually review the selected vocabulary for learner suitability.

**Reverse-mode source requirement:** The current source's English translations may contain semicolon-separated senses (for example, `am;are`) that are not always interchangeable answers. Find and verify a source or curated word set that supports reliable Italian → English grading, with clearly defined accepted English answers and enough context to disambiguate meanings. Do not enable reverse mode by blindly splitting the current gloss strings; record the source and licensing/attribution details for the replacement or supplemental data.

Record the dataset URL, authors/contributors, retrieval date, transformation steps, and license in a data attribution file. The linked repository advertises an MIT license and an attribution file, but also describes frequency lists compiled from varied sources and LLM-assisted editing; verify that the license and upstream source terms cover the actual downloaded data before redistributing it.

**Verify:** Validate exactly 1,000 unique curated entries, required fields and allowed CEFR/POS values, non-empty prompts and answers, and noun article coverage. Confirm that reverse-direction answer keys are unambiguous and reviewed. Confirm source attribution and redistribution terms before shipping the dataset.

### 5. `test: add quiz logic tests` ✅

Add a test runner and tests for answer normalization: case-insensitivity, accent handling, and accepted alternatives.

**Verify:** Tests pass for correct, incorrect, and alternate answers.

### 6. `feat: implement quiz session rules` ✅

Build the framework-independent session logic: select 10, 20, or 50 unique words; requeue missed words; finish once every selected word has been answered correctly. Keep session state in memory only.

**Verify:** Tests cover selection size, requeueing, completion, and progress counts.

### 7. `feat: add client-side routing` ✅

Add React Router for the distinct deck-selection, quiz, and completion screens. Keep session state in an in-memory provider above the routes, and provide a not-found route. Do not persist session data or encode it in URLs.

**Verify:** Navigation between screens works with links and browser back/forward; unknown paths show a not-found view; build, lint, and tests pass.

### 10. `feat: add session completion and restart` ✅

Show a completion screen with a word-by-word summary of first-try correct answers and words missed before being corrected, plus an option to start another deck.

**Verify:** Results include each word and expected answer, separate first-try answers from words missed then corrected, and include miss counts; restart begins a fresh session; tests, lint, and build pass.

### 11. `polish: improve responsive and accessible UX` ✅

Tune mobile layouts, loading/empty/error states, screen-reader labels, focus handling, and README setup instructions.

**Verify:** Semantic headings, route focus handling, accessible progress and feedback announcements, and mobile-friendly controls are in place. Build, lint, and tests pass.

### 12. `feat: select and remember CEFR levels` ✅

Add a multi-select level picker for A1, A2, B1, B2, C1, and C2. Default to A1 when there is no saved selection. Save only the selected level range in local storage and restore it on the next visit; do not persist quiz/session state. Build a combined deck from the selected levels, allocate the requested 10/20/50 cards as evenly as possible across those levels, and prevent duplicate Italian words within a session. Rebalance available slots if deduplication or a small level pool prevents an exact split.

**Verify:** Picker supports one or multiple levels, defaults to A1, restores the last selected levels, never restores session progress, allocates cards evenly (within one card where possible), and does not include duplicate Italian words. Unit tests, lint, production build, and browser checks pass.

### 13. `feat: add optional Italian-to-English practice`

Keep English → Italian as the default. Add a visually secondary direction control before session start so learners can optionally choose Italian → English for the whole session. Use reviewed English accepted-answer data from the source work in Step 4; keep the direction consistent for every card in the session.

**Verify:** Default direction remains English → Italian; the optional reverse direction presents Italian prompts and validates against reviewed English answers; feedback and completion results show the expected answer for the chosen direction. Tests cover each direction and ambiguous source glosses are not accepted without review.

### 14. `feat: show the CEFR level while testing a card` ✅

Store each card's CEFR level in the generated deck data and show it in a compact badge at the top-right of the quiz card header.

**Verify:** Generated cards retain their source CEFR level; the current quiz card shows its level; tests, lint, and build pass.

### 15. `feat: show what type of word it is e.g. adjective, noun, etc`

### 16. `feat: improve our source data`

1. If a verb is conjugated, we should include a sample of what tense it is.
   E.g. "to play" with "tu" and imperfetto

2. Include synonyms

## Out of scope for the first release

Audio, accounts, and saved history are deferred to keep the initial app focused.
