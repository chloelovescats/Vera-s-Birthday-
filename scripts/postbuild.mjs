import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(".");
const dist = resolve(root, "dist");

const copies = [
  "app.jsx",
  "art.jsx",
  "scenes.jsx",
  "image-slot.js",
  "images"
];

if (!existsSync(dist)) {
  throw new Error("dist/ does not exist. Run vite build first.");
}

for (const entry of copies) {
  const from = resolve(root, entry);
  const to = resolve(dist, entry);
  mkdirSync(resolve(to, ".."), { recursive: true });
  cpSync(from, to, { recursive: true });
}
