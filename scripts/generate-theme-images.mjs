#!/usr/bin/env node
/**
 * Generate theme-specific project images for all 71 portfolio themes.
 * Composes prompts from THEME_AESTHETICS × PROJECT_CONCEPTS → 710 unique images.
 *
 * Usage:
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-theme-images.mjs --all
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-theme-images.mjs --theme aurora
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-theme-images.mjs --theme aurora --project watch-auth
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-theme-images.mjs --all --dry-run
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-theme-images.mjs --all --concurrency 5
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-theme-images.mjs --all --force
 */

import Replicate from "replicate";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_PROJECTS = path.join(__dirname, "..", "public", "projects");

// ─── Theme Aesthetics ───
// Each entry: { style, colors, mood } extracted from theme page.tsx
const THEME_AESTHETICS = {
  default: {
    style: "warm minimalist dark portfolio",
    colors: "dark charcoal background, warm orange (#FF8C42) accents, cream text",
    mood: "professional, modern, inviting warmth",
  },
  midnight: {
    style: "deep navy nocturnal elegance with gold accents",
    colors: "deep navy (#0A0F2E), gold (#D4AF37), cream (#F5F0E8)",
    mood: "luxurious night sky, starlit sophistication",
  },
  terminal: {
    style: "monochrome hacker CLI terminal interface",
    colors: "black (#0D0D0D) background, phosphor green (#00FF41) text",
    mood: "technical, command-line, matrix-style",
  },
  paper: {
    style: "retro Windows 95 desktop computing",
    colors: "beige (#D4D0C8), system gray, white windows",
    mood: "nostalgic computing, pixel-perfect retro UI",
  },
  earth: {
    style: "natural organic earth tones",
    colors: "warm browns, terracotta (#C37A67), sage green, sandy cream",
    mood: "grounded, organic, handcrafted warmth",
  },
  brutal: {
    style: "stark brutalist Swiss design",
    colors: "pure white (#FFFFFF), black (#000000), yellow accent (#FFD600)",
    mood: "raw concrete, bold typography, uncompromising",
  },
  vapor: {
    style: "synthwave vaporwave retro-futuristic neon",
    colors: "deep purple (#1A0B2E), hot pink (#FF6EC7), cyan (#00F5FF), orange (#FF8C00)",
    mood: "80s Miami, grid horizon, sunset chrome",
  },
  glass: {
    style: "glassmorphism frosted translucent UI",
    colors: "deep purple (#0F0720), violet (#7C3AED), cyan (#06B6D4)",
    mood: "refined depth, frosted glass panels, ethereal blur",
  },
  noir: {
    style: "black and white film noir cinematic",
    colors: "pure black (#000000), white highlights, gray (#666666)",
    mood: "dramatic shadows, Venetian blinds, 1940s detective",
  },
  neo: {
    style: "neo-brutalist playful primary colors",
    colors: "off-white (#F5F5F0), blue (#3B82F6), red (#DC2626), yellow (#FACC15), pink (#EC4899)",
    mood: "bold stickers, thick borders, Bauhaus meets digital",
  },
  aurora: {
    style: "cosmic northern lights ethereal glow",
    colors: "deep navy (#0B0E1A), emerald green (#4ADE80), purple (#A855F7), sky blue (#38BDF8)",
    mood: "aurora borealis, cosmic gaseous energy, dreamy",
  },
  editorial: {
    style: "high-contrast magazine editorial layout",
    colors: "white (#FFFFFF), black text (#111111), crimson red accent (#DC2626)",
    mood: "Swiss typography, clean grid, print magazine",
  },
  kinetic: {
    style: "motion design with molten gold on dark slate",
    colors: "dark slate (#1E293B), gold (#F59E0B), cream (#FEF3C7)",
    mood: "parallax scroll, chrome fluid, cinematic luxury",
  },
  ivory: {
    style: "vintage warm marble minimal luxury",
    colors: "warm cream (#FEFCF3), brown (#1C1917), burnt orange accent",
    mood: "antique paper, calacatta marble, whisper-quiet luxury",
  },
  mosaic: {
    style: "Mondrian geometric De Stijl primary colors",
    colors: "white (#FFFFFF), primary blue (#2563EB), red (#DC2626), yellow (#EAB308)",
    mood: "Bauhaus grid, mathematical precision, museum art",
  },
  flux: {
    style: "fluid diagonal energy warm tones",
    colors: "warm cream (#FFF7ED), coral (#FF6B6B), teal (#0891B2)",
    mood: "flowing water, diagonal motion, dynamic warmth",
  },
  studio: {
    style: "zen minimalist Japanese studio",
    colors: "light beige (#FAFAF8), black ink (#1A1A1A), red accent (#C41E3A)",
    mood: "contemplative space, ink on paper, wabi-sabi",
  },
  deco: {
    style: "Art Deco 1920s geometric glamour",
    colors: "deep teal (#0F4C5C), gold (#D4A574), cream (#F5F0E8)",
    mood: "Gatsby era, geometric ornament, jazz age luxury",
  },
  prism: {
    style: "rainbow light refraction spectrum",
    colors: "white (#FFFFFF), full rainbow spectrum — red, orange, yellow, green, cyan, blue, violet",
    mood: "optical prism, chromatic dispersion, color theory",
  },
  carbon: {
    style: "technical schematic dark engineering",
    colors: "near-black (#0C0C0C), cyan accent (#06B6D4), grid lines",
    mood: "carbon fiber, technical blueprint, precision engineering",
  },
  gazette: {
    style: "vintage newspaper broadsheet",
    colors: "newsprint off-white, black ink, red masthead (#CC0000)",
    mood: "old newspaper, columns, typewriter headlines",
  },
  terrain: {
    style: "topographic map survey cartography",
    colors: "beige (#F5F2EC), sage green (#5B7F5E), sand (#C2B280), charcoal (#2D2D2D)",
    mood: "contour lines, elevation survey, field notebook",
  },
  darkroom: {
    style: "analog photography darkroom chemical",
    colors: "deep brown-black (#1A0808), safelight orange (#D4763A), cream (#F0E6D3)",
    mood: "film development, chemical bath, amber safelight glow",
  },
  cosmos: {
    style: "deep space astronomical observation",
    colors: "space black (#050510), nebula purple (#6D28D9), stellar cyan (#22D3EE)",
    mood: "star field observatory, cosmic wonder, infinite depth",
  },
  collage: {
    style: "mixed media scrapbook cut paper",
    colors: "cream (#F8F4EF), navy (#1B2838), pink (#E8786F), mustard (#D4A843)",
    mood: "torn edges, washi tape, vintage ephemera",
  },
  blueprint: {
    style: "architectural blueprint cyanotype",
    colors: "dark blue (#0A1628), cyan lines (#4FC3F7), white text (#E8F0FE)",
    mood: "construction plans, technical drawing, engineering draft",
  },
  lumen: {
    style: "bioluminescent deep ocean glow",
    colors: "abyss black (#020B18), bio-cyan (#00E5CC), bio-magenta (#E040FB)",
    mood: "deep sea creatures, phosphorescent, underwater wonder",
  },
  manuscript: {
    style: "medieval illuminated manuscript codex",
    colors: "parchment (#F5ECD7), gold leaf (#B8860B), rubric red (#8B1A1A), ink (#2C1810)",
    mood: "hand lettering, gilded borders, monastic scriptoria",
  },
  signal: {
    style: "military control panel radar screen",
    colors: "dark panel (#0C0C0C), phosphor green (#39FF14), amber (#FFB300)",
    mood: "oscilloscope, radar sweep, military HUD",
  },
  origami: {
    style: "Japanese paper folding delicate creases",
    colors: "off-white paper (#FAF8F5), fold lines (#D4CFC7), crimson accent (#C62828)",
    mood: "paper crane, geometric folds, meditative craft",
  },
  circuit: {
    style: "printed circuit board electronic",
    colors: "PCB green, copper traces (#D4883A), solder points",
    mood: "electronic engineering, chip layout, soldered connections",
  },
  sketch: {
    style: "hand-drawn designer sketchbook",
    colors: "off-white paper (#FAFAF8), pencil gray (#2D2D2D), marker blue (#2563EB), highlight yellow (#FDE68A)",
    mood: "notebook doodles, marker rendering, ideation",
  },
  duotone: {
    style: "halftone duotone print",
    colors: "electric blue (#0050FF), hot coral, paper white",
    mood: "screen-printed, Ben Day dots, pop art",
  },
  liquid: {
    style: "liquid chrome flowing metal",
    colors: "dark bg, violet (#8B5CF6), silver chrome reflections",
    mood: "mercury droplets, fluid dynamics, morphing shapes",
  },
  stained: {
    style: "gothic cathedral stained glass",
    colors: "dark lead (#1A1A1A), ruby (#9B1B30), sapphire (#1E3A5F), emerald (#1B5E20), amber (#F9A825)",
    mood: "jewel tones, lead came lines, sacred light",
  },
  riso: {
    style: "risograph overprint texture",
    colors: "off-white, fluorescent pink (#FF0066), blue, green, misregistration",
    mood: "DIY zine print, grain, ink overlap",
  },
  zen: {
    style: "Japanese zen garden minimal",
    colors: "stone gray, sand white, red torii (#CC3333), black ink",
    mood: "raked sand, moss, meditation, ink wash",
  },
  topo: {
    style: "cartographic topographic field map",
    colors: "parchment (#F5F1EB), brown contour (#8B7355), lime accent (#84CC16)",
    mood: "elevation contours, hiking trail, compass rose",
  },
  neon: {
    style: "neon sign glowing tube lights",
    colors: "dark bg, hot pink (#FF1493), electric blue, green neon",
    mood: "buzzing neon tubes, night city, gas-filled glow",
  },
  terrazzo: {
    style: "Italian terrazzo speckled stone",
    colors: "cream base, terracotta chips (#C75B39), sage, charcoal, blush",
    mood: "polished aggregate, Italian craftsmanship, retro",
  },
  ceramic: {
    style: "Japanese kintsugi gold-mended pottery",
    colors: "warm beige (#F5F0E8), clay (#C4A882), gold (#D4A843), charcoal (#2C2420)",
    mood: "gold-mended cracks, wabi-sabi beauty, handmade vessels",
  },
  pulse: {
    style: "medical ECG vital signs monitor",
    colors: "dark bg (#0A0A0F), heart red (#EF4444), OK green (#22C55E)",
    mood: "heartbeat trace, hospital equipment, clinical data",
  },
  cipher: {
    style: "encrypted hexadecimal cryptography",
    colors: "dark green-black (#0B0F0D), emerald (#10B981), matrix green",
    mood: "hex dump, blockchain, encrypted data streams",
  },
  ember: {
    style: "volcanic molten lava glowing cracks",
    colors: "charcoal (#0C0A08), ember orange (#F97316), lava red (#DC2626), magma yellow (#FBBF24)",
    mood: "cooling lava, dying fire, incandescent heat",
  },
  frost: {
    style: "Arctic ice crystal frozen glass",
    colors: "ice blue bg (#F0F4F8), frost (#93C5FD), deep frost (#3B82F6), white",
    mood: "frozen window, snowflake geometry, winter stillness",
  },
  mycelium: {
    style: "fungal network bioluminescent forest",
    colors: "dark forest, green glow (#39FF85), organic tendrils",
    mood: "underground networks, mushroom spores, forest floor",
  },
  thermal: {
    style: "thermal infrared heat vision",
    colors: "dark bg, hot pink (#FF3366), heat gradient from blue to red",
    mood: "FLIR camera, heat signature, temperature map",
  },
  patina: {
    style: "aged bronze verdigris oxidation",
    colors: "dark bg (#1C1C20), verdigris (#43B3A0), copper (#C87941), bronze (#8B6F47)",
    mood: "weathered statue, oxidized metal, antique surface",
  },
  axiom: {
    style: "mathematical proof chalkboard geometric",
    colors: "chalk white (#FAFBFE), proof blue (#1848CC), golden ratio (#D4A843), graphite (#3C3C46)",
    mood: "theorem diagrams, compass constructions, formal logic",
  },
  darkfield: {
    style: "darkfield microscopy luminous specimens",
    colors: "pure black bg, blue highlight (#4D9EFF), specimen glow",
    mood: "microscope slide, illuminated particles, scientific",
  },
  liminal: {
    style: "uncanny empty backrooms spaces",
    colors: "drywall (#F2EDE8), pool tile (#8BBCC8), concrete (#4A4A52), fluorescent (#D4E8D0)",
    mood: "abandoned mall, liminal architecture, eerie calm",
  },
  herbarium: {
    style: "botanical specimen pressed plant collection",
    colors: "cream (#FAF5EC), pressed green (#2D5A3D), ink (#2A2420), burgundy (#7A2638)",
    mood: "dried flowers, specimen labels, scientific collection",
  },
  hologram: {
    style: "holographic foil prismatic trading card",
    colors: "dark bg (#08080E), magenta (#FF44AA), cyan (#44FFEE), gold (#FFD700), violet (#8844FF)",
    mood: "rainbow foil, card shine, iridescent surface",
  },
  sonar: {
    style: "submarine sonar ping radar",
    colors: "dark ocean, green sonar (#00FF88), grid overlay",
    mood: "underwater detection, ping rings, depth reading",
  },
  solarpunk: {
    style: "optimistic green-tech living architecture",
    colors: "bright cream (#F5FFF0), green (#1A8A4A), sage (#6A8A72), copper solar (#C87830), sky blue (#5CAFE0)",
    mood: "photosynthesis, vertical gardens, clean energy utopia",
  },
  vitrine: {
    style: "museum glass display case exhibition",
    colors: "museum white (#FAFAFA), gallery (#F5F3EF), institutional green (#1B4332), brass (#B8860B)",
    mood: "gallery spotlight, specimen case, curated collection",
  },
  redline: {
    style: "engineering design review markup",
    colors: "graph paper gray (#F0F0F0), markup red (#E53935), dim blue (#1565C0)",
    mood: "redlined drawings, correction marks, review annotations",
  },
  tessera: {
    style: "ancient Roman mosaic tile",
    colors: "dark bg, gold tessera (#D4A03C), stone, terracotta",
    mood: "tiny mosaic tiles, ancient Rome, opus tessellatum",
  },
  aperture: {
    style: "camera viewfinder DSLR mechanics",
    colors: "dark bg (#111111), amber focus (#F5A623), green OK (#4ADE80), red alert (#EF4444)",
    mood: "lens aperture blades, EXIF metadata, focus indicators",
  },
  marquee: {
    style: "TV broadcast news ticker",
    colors: "broadcast red (#CC0000), dark panel, white text",
    mood: "live broadcast, scrolling chyron, news desk",
  },
  diorama: {
    style: "paper craft layered shadow box",
    colors: "sky blue, orange (#FF6B35), green hills, paper white",
    mood: "parallax paper layers, craft scissors, pop-up book",
  },
  cassette: {
    style: "80s mixtape retro cassette deck",
    colors: "dark housing, red (#FF6B6B), coral, warm tape brown",
    mood: "tape reels, Walkman, hand-written labels, analog music",
  },
  stratum: {
    style: "geological cross-section rock layers",
    colors: "sky blue (#87CEEB), brown topsoil (#5C4033), sandstone (#E8DFD1), slate (#4A5568), obsidian (#1A1A2E)",
    mood: "fossil layers, earth science, sedimentary strata",
  },
  specimen: {
    style: "typography specimen sheet type foundry",
    colors: "paper white, black text, red accent (#E53935)",
    mood: "font catalog, letterpress, type specimen sheet",
  },
  sextant: {
    style: "maritime navigation brass instrument",
    colors: "dark ocean, teal (#2E8B8F), brass gold, aged parchment",
    mood: "celestial navigation, compass rose, old sea charts",
  },
  darktype: {
    style: "kinetic typography dark mode bold type",
    colors: "near-black bg, hot pink (#FF3366), white text",
    mood: "motion graphics, type animation, bold lettering",
  },
  propaganda: {
    style: "Soviet constructivist agitprop poster",
    colors: "cream paper (#F5E6C8), bold red (#CC2222), black (#1A1A1A)",
    mood: "propaganda poster, diagonal composition, red star",
  },
  billboard: {
    style: "urban outdoor advertising wheat-paste",
    colors: "concrete (#D3D0CB), yellow (#FFEB3B), hot pink (#FF1744), black",
    mood: "street billboard, peeling posters, urban signage",
  },
  ledger: {
    style: "accounting ledger bookkeeping",
    colors: "cream paper (#FAFAF0), ruled blue (#C8D8E8), green bar (#E8F5E9), red (#CC0000)",
    mood: "balance sheet, rubber stamps, financial records",
  },
  grain: {
    style: "super 8mm vintage film stock",
    colors: "dark film bg (#1A1510), warm film (#F5EDE0), amber (#E8A87C), magenta (#C94277)",
    mood: "Kodachrome, sprocket holes, film projector, 70s footage",
  },
  bazaar: {
    style: "exotic night market Moroccan bazaar",
    colors: "deep indigo (#1A1A3E), terracotta (#C4451C), gold (#DAA520), turquoise (#2EC4B6), saffron (#F5B041)",
    mood: "spice market, lantern light, ornate tiles, silk curtains",
  },
  almanac: {
    style: "seasonal botanical almanac illustrated calendar",
    colors: "warm cream (#FFFEF5), spring green (#4CAF50), cherry blossom pink (#FFB7C5), copper (#D4885C)",
    mood: "pressed flowers, seasonal cycles, nature journal, pastoral",
  },
};

// ─── Project Concepts ───
// Derived from the 10 projects in src/app/data/projects.ts
const PROJECT_CONCEPTS = {
  "watch-auth": {
    subject: "luxury watch authentication",
    concept: "intricate mechanical watch gears, crystal glass, precision engineering",
    file: "watch-auth.webp",
  },
  "video-production": {
    subject: "AI video production studio",
    concept: "cinematic film frames, lens flare, anamorphic bokeh, film strips",
    file: "video-production.webp",
  },
  "leader-dossier": {
    subject: "leader intelligence dossier",
    concept: "wireframe human silhouette, data network nodes, neural pathways",
    file: "leader-dossier.webp",
  },
  "theme-generator": {
    subject: "design theme generator",
    concept: "flowing color gradient ribbons, prismatic light refraction, chromatic spectrum",
    file: "theme-generator.webp",
  },
  "rag-system": {
    subject: "knowledge retrieval RAG system",
    concept: "glowing nodes connected by luminous threads, knowledge graph topology",
    file: "rag-system.webp",
  },
  "interior-design": {
    subject: "AI interior design studio",
    concept: "architectural planes, volumetric window light, wood and concrete textures",
    file: "interior-design.webp",
  },
  "article-audio": {
    subject: "article to audio conversion",
    concept: "elegant audio waveforms, frequency spectrum, concentric sound ripples",
    file: "article-audio.webp",
  },
  "financial-analyst": {
    subject: "AI financial analysis",
    concept: "3D candlestick charts, data particle streams, market visualization",
    file: "financial-analyst.webp",
  },
  "analytics-dashboard": {
    subject: "analytics dashboard",
    concept: "hexagonal data tiles, holographic panels, futuristic HUD interface",
    file: "analytics-dashboard.webp",
  },
  "creative-platform": {
    subject: "creative generation platform",
    concept: "chrome liquid metal splashes, artistic burst of metallic droplets",
    file: "creative-platform.webp",
  },
};

// ─── Prompt Composition ───
function composePrompt(themeSlug, projectSlug) {
  const theme = THEME_AESTHETICS[themeSlug];
  const project = PROJECT_CONCEPTS[projectSlug];
  if (!theme || !project) return null;

  return [
    `Abstract conceptual visualization of ${project.subject}:`,
    `${project.concept}.`,
    `Rendered in ${theme.style} aesthetic.`,
    `Color palette: ${theme.colors}.`,
    `Mood: ${theme.mood}.`,
    `16:9 cinematic composition, high-end digital art,`,
    `no text, no people, no UI elements, no letters, no words.`,
  ].join(" ");
}

// ─── Image Generation ───
async function generateImage(replicate, themeSlug, projectSlug, { force, dryRun }) {
  const project = PROJECT_CONCEPTS[projectSlug];
  const outDir = path.join(PUBLIC_PROJECTS, themeSlug);
  const outPath = path.join(outDir, project.file);
  const label = `${themeSlug}/${project.file}`;

  if (!force && fs.existsSync(outPath)) {
    console.log(`  [skip] ${label} already exists`);
    return "skip";
  }

  const prompt = composePrompt(themeSlug, projectSlug);
  if (!prompt) {
    console.error(`  [err]  ${label}: invalid theme or project slug`);
    return "error";
  }

  if (dryRun) {
    console.log(`  [dry]  ${label}`);
    console.log(`         ${prompt}\n`);
    return "dry";
  }

  fs.mkdirSync(outDir, { recursive: true });
  console.log(`  [gen]  ${label} ...`);

  try {
    const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
      input: {
        prompt,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90,
        safety_tolerance: 5,
        prompt_upsampling: true,
      },
    });

    let imageUrl = output;
    if (typeof output === "object" && output.url) {
      imageUrl = output.url();
    }

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outPath, buffer);
    console.log(`  [done] ${label} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return "done";
  } catch (err) {
    console.error(`  [err]  ${label}: ${err.message}`);
    return "error";
  }
}

// ─── Concurrency helper ───
async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((fn) => fn()));
    results.push(...batchResults);
  }
  return results;
}

// ─── CLI ───
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const all = args.includes("--all");
  const themeFilter = args.includes("--theme")
    ? args[args.indexOf("--theme") + 1]
    : null;
  const projectFilter = args.includes("--project")
    ? args[args.indexOf("--project") + 1]
    : null;
  const concurrency = args.includes("--concurrency")
    ? parseInt(args[args.indexOf("--concurrency") + 1], 10)
    : 3;

  if (!all && !themeFilter) {
    console.error("Usage: node scripts/generate-theme-images.mjs --all [options]");
    console.error("       node scripts/generate-theme-images.mjs --theme <slug> [options]");
    console.error("\nOptions:");
    console.error("  --all                Generate for all themes");
    console.error("  --theme <slug>       Generate for a single theme");
    console.error("  --project <slug>     Generate for a single project (with --theme)");
    console.error("  --dry-run            Print prompts without generating");
    console.error("  --force              Regenerate existing images");
    console.error("  --concurrency <n>    Parallel generations (default: 3)");
    process.exit(1);
  }

  if (!dryRun && !process.env.REPLICATE_API_TOKEN) {
    console.error("Error: REPLICATE_API_TOKEN env var required (or use --dry-run)");
    process.exit(1);
  }

  const replicate = dryRun
    ? null
    : new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  // Build task list
  const themeKeys = themeFilter ? [themeFilter] : Object.keys(THEME_AESTHETICS);
  const projectKeys = projectFilter ? [projectFilter] : Object.keys(PROJECT_CONCEPTS);

  // Validate slugs
  for (const t of themeKeys) {
    if (!THEME_AESTHETICS[t]) {
      console.error(`Unknown theme: ${t}`);
      console.error(`Available: ${Object.keys(THEME_AESTHETICS).join(", ")}`);
      process.exit(1);
    }
  }
  for (const p of projectKeys) {
    if (!PROJECT_CONCEPTS[p]) {
      console.error(`Unknown project: ${p}`);
      console.error(`Available: ${Object.keys(PROJECT_CONCEPTS).join(", ")}`);
      process.exit(1);
    }
  }

  const totalImages = themeKeys.length * projectKeys.length;
  console.log(
    `\n${dryRun ? "[DRY RUN] " : ""}Generating ${totalImages} images ` +
      `(${themeKeys.length} themes × ${projectKeys.length} projects) ` +
      `with concurrency ${concurrency}\n`
  );

  const tasks = [];
  for (const themeSlug of themeKeys) {
    for (const projectSlug of projectKeys) {
      tasks.push(() =>
        generateImage(replicate, themeSlug, projectSlug, { force, dryRun })
      );
    }
  }

  const results = await runWithConcurrency(tasks, concurrency);

  // Summary
  const done = results.filter((r) => r === "done").length;
  const skipped = results.filter((r) => r === "skip").length;
  const errors = results.filter((r) => r === "error").length;
  const dry = results.filter((r) => r === "dry").length;

  console.log(`\n─── Summary ───`);
  if (dry > 0) console.log(`  Dry run: ${dry} prompts printed`);
  if (done > 0) console.log(`  Generated: ${done}`);
  if (skipped > 0) console.log(`  Skipped (existing): ${skipped}`);
  if (errors > 0) console.log(`  Errors: ${errors}`);
  console.log(`  Total: ${results.length}\n`);
}

main();
