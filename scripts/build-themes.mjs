import { build } from "esbuild";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const THEMES_SRC = join(ROOT, "src", "themes");
const THEMES_OUT = join(ROOT, "src", "themes-compiled");

// Ensure output directory exists
if (!existsSync(THEMES_OUT)) mkdirSync(THEMES_OUT, { recursive: true });

const themes = readdirSync(THEMES_SRC).filter((d) => {
  return existsSync(join(THEMES_SRC, d, "ThemePage.tsx"));
});

console.log(`Building ${themes.length} themes with esbuild...`);
const start = Date.now();

await build({
  entryPoints: themes.map((t) => join(THEMES_SRC, t, "ThemePage.tsx")),
  outdir: THEMES_OUT,
  bundle: false,       // Don't bundle dependencies — let Next.js handle them
  format: "esm",
  platform: "browser",
  jsx: "automatic",
  target: "es2022",
  logLevel: "warning",
  // Preserve the directory structure: themes-compiled/abacus/ThemePage.js
  outbase: THEMES_SRC,
});

const elapsed = Date.now() - start;
console.log(`✓ ${themes.length} themes compiled in ${elapsed}ms`);
