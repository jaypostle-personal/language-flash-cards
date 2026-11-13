import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  buildItalianDecks,
  italianDeckLevels,
} from "../src/data/italian-decks.ts";

const sourcePath = fileURLToPath(
  new URL("../src/data/italian.json", import.meta.url),
);
const outputDirectory = fileURLToPath(
  new URL("../src/data/decks/", import.meta.url),
);

const sourceJson = JSON.parse(await readFile(sourcePath, "utf8"));

if (!Array.isArray(sourceJson)) {
  throw new TypeError(
    "The Italian source JSON must contain an array of entries.",
  );
}

const decks = buildItalianDecks(sourceJson);
await mkdir(outputDirectory, { recursive: true });

for (const level of italianDeckLevels) {
  const outputPath = `${outputDirectory}${level.toLowerCase()}.json`;
  await writeFile(outputPath, `${JSON.stringify(decks[level], null, 2)}\n`);
  console.log(`${level}: wrote ${decks[level].length} cards to ${outputPath}`);
}
