#!/usr/bin/env node
/**
 * Generate AI visual assets for portfolio themes using Replicate FLUX 1.1 Pro.
 *
 * Usage:
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-assets.mjs
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-assets.mjs --theme aurora
 *   REPLICATE_API_TOKEN=r8_xxx node scripts/generate-assets.mjs --projects
 */

import Replicate from "replicate";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public", "themes");
const PUBLIC_PROJECTS = path.join(__dirname, "..", "public", "projects");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ─── Image definitions ───
// Each theme's images share a consistent visual language:
// - Same color palette referenced in every prompt
// - Same artistic style/mood keywords
// - Same rendering technique descriptors
const IMAGES = [
  // Aurora: Cosmic deep-space palette — navy, green, purple, blue, ethereal glow
  {
    theme: "aurora",
    file: "nebula-hero.webp",
    prompt:
      "Abstract cosmic nebula with aurora borealis, deep navy-black background (#0B0E1A). Flowing bands of emerald green (#4ADE80), soft purple (#A855F7), and sky blue (#38BDF8) light streaming across the frame. Smooth gradients, no stars, ethereal gaseous energy, soft glow, pure abstract cosmic art. Ultra-wide 16:9 cinematic composition. Painterly, dreamy, high-end digital art.",
    aspect_ratio: "16:9",
  },
  {
    theme: "aurora",
    file: "nebula-secondary.webp",
    prompt:
      "Dark deep space texture, mostly deep navy-black (#0B0E1A). Very subtle, faint wisps of purple (#A855F7) and blue (#38BDF8) nebula clouds in the background, barely visible. Ambient, atmospheric, ethereal. No stars, no bright elements. Smooth dark gradient texture suitable as a subtle page background. Painterly, dreamy, high-end digital art.",
    aspect_ratio: "16:9",
  },

  // Editorial: High-contrast B&W with single crimson accent — architectural, geometric, dramatic shadows
  {
    theme: "editorial",
    file: "editorial-art.webp",
    prompt:
      "Abstract high-contrast black and white artistic composition. Dramatic shadows, architectural geometry — sharp diagonal lines, overlapping rectangular planes, deep perspective. A single thin crimson red (#DC2626) accent line cutting diagonally across the composition. Stark minimalist editorial photography aesthetic. Museum-quality fine art print. No text, no people. Monochrome with one red line.",
    aspect_ratio: "16:9",
  },

  // Kinetic: Molten gold on dark slate — chrome, fluid, cinematic 3D render
  {
    theme: "kinetic",
    file: "fluid-texture.webp",
    prompt:
      "Abstract fluid chrome and liquid gold metallic texture on dark slate background (#1E293B). Flowing streams of molten warm gold (#F59E0B) with chrome silver highlights. High-end 3D render, cinematic lighting, dramatic reflections. Viscous liquid metal flowing and pooling. Luxurious, premium, motion-frozen. Dark moody atmosphere with warm gold focal point. Octane render quality.",
    aspect_ratio: "16:9",
  },

  // Ivory: Barely-there warm marble — almost white, whisper-quiet luxury
  {
    theme: "ivory",
    file: "marble-texture.webp",
    prompt:
      "Extremely subtle warm ivory marble texture, almost white background (#FEFCF3). Very faint warm gray and cream-colored veining, barely perceptible. Luxurious natural calacatta stone. Seamless, quiet, understated luxury. The texture should be so subtle it almost looks like a plain warm white surface with the faintest hint of natural stone character. Soft, warm, sophisticated. High-resolution macro photograph.",
    aspect_ratio: "16:9",
  },

  // Mosaic: Bauhaus primary colors — geometric precision, blue/red/yellow on white
  {
    theme: "mosaic",
    file: "geometric-comp.webp",
    prompt:
      "Abstract geometric Bauhaus composition on pure white background. Primary blue (#2563EB), red (#DC2626), and yellow (#EAB308) shapes — perfect circles, rectangles, and thin black structural lines. Clean vector precision, museum-quality graphic art. Inspired by Mondrian and Kandinsky. Balanced asymmetric composition. No text, no gradients, flat colors only. Swiss design poster aesthetic. Sharp edges, mathematical harmony.",
    aspect_ratio: "1:1",
  },
];

// ─── Project image definitions ───
// Abstract/conceptual images for each of the 10 portfolio projects.
// Dark backgrounds, no text, no people, cinematic lighting, 16:9.
const PROJECT_IMAGES = [
  {
    slug: "watch-auth",
    file: "watch-auth.webp",
    prompt:
      "Luxury watch mechanism macro photography, intricate golden gears and springs visible through crystal glass, dark black background. Amber rim lighting revealing precision engineering. Swiss watchmaking, mechanical beauty, cinematic lighting, no text, no people. 16:9 composition, high-end product photography aesthetic.",
    aspect_ratio: "16:9",
  },
  {
    slug: "video-production",
    file: "video-production.webp",
    prompt:
      "Overlapping cinematic film frames floating in dark void, subtle lens flare, anamorphic bokeh circles in warm orange and cool blue. Film strip fragments with abstract light leaks, moody atmospheric, dark background. Professional video production aesthetic, no text, no people. 16:9 composition, cinematic photography.",
    aspect_ratio: "16:9",
  },
  {
    slug: "leader-dossier",
    file: "leader-dossier.webp",
    prompt:
      "Abstract geometric wireframe silhouette of a human head composed of connected data points and luminous network lines, cool blue (#38BDF8) and white glow on dark navy-black background. Digital neural pathways, intelligence visualization, data constellation. No text, no face details, pure geometric abstraction. 16:9 cinematic composition.",
    aspect_ratio: "16:9",
  },
  {
    slug: "theme-generator",
    file: "theme-generator.webp",
    prompt:
      "Flowing color gradient ribbons and streams of light in rainbow spectrum, prismatic glass refraction creating caustic light patterns on dark background. Chromatic dispersion, color theory visualization, smooth silk-like bands of red, orange, yellow, green, blue, purple flowing through space. Abstract, no text, no people. 16:9 cinematic composition.",
    aspect_ratio: "16:9",
  },
  {
    slug: "rag-system",
    file: "rag-system.webp",
    prompt:
      "Abstract network visualization — glowing nodes connected by luminous threads forming a knowledge graph structure, amber and white warm glow on dark background. Interconnected data points, semantic web, neural network topology. Floating particles of light, depth of field. No text, no people. 16:9 cinematic composition.",
    aspect_ratio: "16:9",
  },
  {
    slug: "interior-design",
    file: "interior-design.webp",
    prompt:
      "Architectural interior planes and surfaces, volumetric window light streaming through geometric openings, warm wood grain and cool concrete textures. Minimalist space with dramatic light and shadow play, cinematic mood. Japanese wabi-sabi aesthetic meets modern architecture. No text, no people, no furniture. 16:9 composition, high-end architectural photography.",
    aspect_ratio: "16:9",
  },
  {
    slug: "article-audio",
    file: "article-audio.webp",
    prompt:
      "Abstract sound visualization — elegant audio waveforms and frequency spectrum bars, concentric ripples emanating from center point, amber and white tones on dark background. Musical energy, sound waves frozen in motion, equalizer aesthetic. Smooth gradients, no text, no people. 16:9 cinematic composition.",
    aspect_ratio: "16:9",
  },
  {
    slug: "financial-analyst",
    file: "financial-analyst.webp",
    prompt:
      "Abstract 3D financial chart shapes floating in dark space — candlestick patterns, ascending bar charts, flowing data particle streams. Gold and blue accent lighting, depth of field. Elegant data visualization art, market analysis aesthetic. No text, no numbers, no people. 16:9 cinematic composition, Octane render quality.",
    aspect_ratio: "16:9",
  },
  {
    slug: "analytics-dashboard",
    file: "analytics-dashboard.webp",
    prompt:
      "Hexagonal data tiles and holographic translucent panels floating in dark space, blue-white primary glow with small green indicator lights. Dashboard interface abstracted into pure geometry, data visualization art. Futuristic HUD aesthetic, clean geometric shapes. No text, no numbers, no people. 16:9 cinematic composition.",
    aspect_ratio: "16:9",
  },
  {
    slug: "creative-platform",
    file: "creative-platform.webp",
    prompt:
      "Chrome liquid metal splashes frozen mid-motion against dark background, artistic burst of gold and silver metallic droplets. Abstract creative energy, mercury-like fluid dynamics captured in time. Premium 3D render, dramatic lighting, luxurious metallic sheen. No text, no people. 16:9 cinematic composition, Octane render quality.",
    aspect_ratio: "16:9",
  },
];

async function generateImage(config) {
  const isProject = !!config.slug;
  const outDir = isProject ? PUBLIC_PROJECTS : path.join(PUBLIC, config.theme);
  const outPath = path.join(outDir, config.file);
  const label = isProject ? `projects/${config.file}` : `${config.theme}/${config.file}`;

  if (fs.existsSync(outPath)) {
    console.log(`  [skip] ${label} already exists`);
    return;
  }

  console.log(`  [gen]  ${label} ...`);

  try {
    const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
      input: {
        prompt: config.prompt,
        aspect_ratio: config.aspect_ratio || "16:9",
        output_format: "webp",
        output_quality: 90,
        safety_tolerance: 5,
        prompt_upsampling: true,
      },
    });

    // output is a URL string or ReadableStream
    let imageUrl = output;
    if (typeof output === "object" && output.url) {
      imageUrl = output.url();
    }

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outPath, buffer);
    console.log(`  [done] ${label} (${(buffer.length / 1024).toFixed(0)}KB)`);
  } catch (err) {
    console.error(`  [err]  ${label}: ${err.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const projectsOnly = args.includes("--projects");
  const themeFilter = args.includes("--theme")
    ? args[args.indexOf("--theme") + 1]
    : null;

  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("Error: REPLICATE_API_TOKEN env var is required");
    console.error(
      "Usage: REPLICATE_API_TOKEN=r8_xxx node scripts/generate-assets.mjs [--projects | --theme <name>]"
    );
    process.exit(1);
  }

  // Ensure output directories exist
  fs.mkdirSync(PUBLIC_PROJECTS, { recursive: true });

  let images;
  if (projectsOnly) {
    images = PROJECT_IMAGES;
    console.log(`Generating ${images.length} project images via FLUX 1.1 Pro...\n`);
  } else if (themeFilter) {
    images = IMAGES.filter((i) => i.theme === themeFilter);
    console.log(`Generating ${images.length} theme images via FLUX 1.1 Pro...\n`);
  } else {
    images = IMAGES;
    console.log(`Generating ${images.length} theme images via FLUX 1.1 Pro...\n`);
  }

  // Generate 2 at a time to avoid rate limits
  for (let i = 0; i < images.length; i += 2) {
    const batch = images.slice(i, i + 2);
    await Promise.all(batch.map(generateImage));
  }

  console.log("\nDone!");
}

main();
