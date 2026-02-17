import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const THEMES_DIR = join(ROOT, "src", "themes");
const OUT_DIR = join(ROOT, "src", "app", "data");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const themes = readdirSync(THEMES_DIR).filter(d =>
  existsSync(join(THEMES_DIR, d, "ThemePage.tsx"))
);

function extractColors(code) {
  const match = code.match(/const\s+C\s*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
  if (!match) return {};
  const colors = {};
  const re = /(\w+)\s*:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(match[1])) !== null) colors[m[1]] = m[2];
  return colors;
}

function extractFonts(code) {
  const fonts = new Set();
  const re = /var\(--font-([a-z-]+)\)/g;
  let m;
  while ((m = re.exec(code)) !== null) fonts.add(m[1]);
  return [...fonts];
}

function extractTypography(code) {
  const details = {
    heroFont: null,
    bodyFont: null,
    monoFont: null,
    heroSize: null,
    heroWeight: null,
    heroItalic: false,
    heroLetterSpacing: null,
    heroLineHeight: null,
    bodySize: null,
    labelSize: null,
    labelTracking: null,
    labelTransform: null,
    sectionLabelStyle: null,
  };

  // Hero heading — look for h1 or the largest clamp
  const h1Match = code.match(/fontSize:\s*["']?(clamp\([^)]+\))["']?/);
  if (h1Match) details.heroSize = h1Match[1];

  // Check if hero uses italic
  const heroBlock = code.match(/<(?:motion\.)?h1[^>]*>[\s\S]*?<\/(?:motion\.)?h1>/);
  if (heroBlock) {
    if (heroBlock[0].includes("italic") || heroBlock[0].includes("fontStyle")) {
      details.heroItalic = true;
    }
  }

  // Check for italic spans in hero
  if (code.includes('fontStyle: "italic"') || code.includes('fontStyle:"italic"') ||
      code.includes("italic") && code.includes("className")) {
    details.heroItalic = true;
  }

  // Font weights
  const weightMatch = code.match(/fontWeight:\s*(\d+|"[^"]+"|'[^']+')/);
  if (weightMatch) details.heroWeight = weightMatch[1].replace(/['"]/g, "");

  // Letter spacing patterns
  const trackingMatch = code.match(/tracking-\[([^\]]+)\]/);
  if (trackingMatch) details.labelTracking = trackingMatch[1];

  // Label styles — look for uppercase tracking patterns
  if (code.includes("uppercase")) details.labelTransform = "uppercase";
  if (code.includes("tracking-[0.25em]") || code.includes("tracking-[0.3em]")) {
    details.sectionLabelStyle = "uppercase with wide tracking (0.25-0.3em)";
  } else if (code.includes("tracking-[0.15em]") || code.includes("tracking-[0.2em]")) {
    details.sectionLabelStyle = "uppercase with moderate tracking (0.15-0.2em)";
  }

  // Line heights
  const lhMatch = code.match(/lineHeight:\s*["']?([^"',\s}]+)/);
  if (lhMatch) details.heroLineHeight = lhMatch[1];

  // Letter spacing on hero
  const lsMatch = code.match(/letterSpacing:\s*["']([^"']+)["']/);
  if (lsMatch) details.heroLetterSpacing = lsMatch[1];

  return details;
}

function extractLayout(code) {
  const layout = {
    gridCols: null,
    maxWidth: null,
    sectionPadding: null,
    hasGrain: code.includes("grain"),
    hasGridPattern: code.includes("backgroundImage") && code.includes("linear-gradient"),
    hasSvgDecorations: code.includes("<svg") || code.includes("SVG"),
    hasScrollAnimations: code.includes("useInView") || code.includes("whileInView"),
    hasParallax: code.includes("useScroll") || code.includes("useTransform"),
    hasHoverEffects: code.includes("whileHover") || code.includes("onMouseEnter"),
    navStyle: null,
    projectLayout: null,
  };

  // Grid columns
  const gridMatch = code.match(/grid-cols-(\d)/);
  if (gridMatch) layout.gridCols = parseInt(gridMatch[1]);

  // Max width
  const mwMatch = code.match(/maxWidth:\s*["']?(\d+)/);
  if (mwMatch) layout.maxWidth = parseInt(mwMatch[1]);

  // Nav detection
  if (code.includes("<nav") || code.includes("position: \"fixed\"") && code.includes("top:")) {
    layout.navStyle = "fixed top";
  }

  // Project card style
  if (code.includes("grid") && code.includes("project")) {
    layout.projectLayout = "grid cards";
  } else if (code.includes("flex") && code.includes("project")) {
    layout.projectLayout = "list rows";
  }

  return layout;
}

function extractEffects(code) {
  const effects = [];
  if (code.includes("backdrop-filter") || code.includes("backdropFilter")) effects.push("glassmorphism/backdrop blur");
  if (code.includes("linear-gradient") && code.includes("background")) effects.push("gradient backgrounds");
  if (code.includes("box-shadow") || code.includes("boxShadow")) effects.push("drop shadows");
  if (code.includes("border-radius") || code.includes("borderRadius")) effects.push("rounded corners");
  if (code.includes("text-shadow") || code.includes("textShadow")) effects.push("text shadows");
  if (code.includes("filter:") || code.includes("filter:")) effects.push("CSS filters");
  if (code.includes("clip-path") || code.includes("clipPath")) effects.push("clip paths");
  if (code.includes("mix-blend") || code.includes("mixBlend")) effects.push("blend modes");
  if (code.includes("opacity")) effects.push("opacity layers");
  if (code.includes("@keyframes")) effects.push("CSS keyframe animations");
  if (code.includes("motion.") || code.includes("animate=")) effects.push("scroll-triggered motion");
  return [...new Set(effects)];
}

function extractKeyframes(code) {
  const frames = [];
  const re = /@keyframes\s+([\w-]+)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    frames.push({ name: m[1], purpose: guessKeyframePurpose(m[1]) });
  }
  return frames;
}

function guessKeyframePurpose(name) {
  const n = name.toLowerCase();
  if (n.includes("shimmer") || n.includes("shine")) return "shimmer/shine effect";
  if (n.includes("float") || n.includes("bob")) return "floating/bobbing motion";
  if (n.includes("pulse") || n.includes("glow")) return "pulsing/glowing";
  if (n.includes("rotate") || n.includes("spin")) return "rotation";
  if (n.includes("flow") || n.includes("wave")) return "flowing/wave motion";
  if (n.includes("fade")) return "fade transition";
  if (n.includes("slide") || n.includes("reveal")) return "slide/reveal";
  if (n.includes("blink") || n.includes("cursor")) return "blinking cursor";
  if (n.includes("drip") || n.includes("drop")) return "drip/drop animation";
  if (n.includes("rise") || n.includes("fall")) return "rising/falling particles";
  if (n.includes("morph") || n.includes("blob")) return "shape morphing";
  if (n.includes("marquee") || n.includes("scroll")) return "scrolling marquee";
  return "decorative animation";
}

const FONT_MAP = {
  "dm-serif": "DM Serif Display (serif)",
  "display": "Cormorant Garamond (serif)",
  "inter": "Inter (sans-serif)",
  "jetbrains": "JetBrains Mono (monospace)",
  "orbitron": "Orbitron (display)",
  "manrope": "Manrope (sans-serif)",
  "sora": "Sora (sans-serif)",
  "instrument": "Instrument Serif (serif)",
  "space-grotesk": "Space Grotesk (sans-serif)",
  "playfair": "Playfair Display (serif)",
  "josefin": "Josefin Sans (sans-serif)",
  "jakarta": "Plus Jakarta Sans (sans-serif)",
  "body": "Outfit (sans-serif)",
};

// Generate comprehensive prompts
const allPrompts = {};

for (const name of themes) {
  const code = readFileSync(join(THEMES_DIR, name, "ThemePage.tsx"), "utf-8");
  const colors = extractColors(code);
  const fonts = extractFonts(code);
  const typo = extractTypography(code);
  const layout = extractLayout(code);
  const effects = extractEffects(code);
  const keyframes = extractKeyframes(code);

  // Get the theme description from comments
  const descMatch = code.match(/\/\*[\s\S]*?(?:—|──)\s*([^\n*]+)/);
  const desc = descMatch ? descMatch[1].trim() : `${name} portfolio theme`;

  // Separate solid colors from rgba
  const solidColors = {};
  const transparentColors = {};
  for (const [k, v] of Object.entries(colors)) {
    if (v.startsWith("rgba")) transparentColors[k] = v;
    else solidColors[k] = v;
  }

  // Determine heading vs body fonts
  const headingFont = fonts.find(f => ["dm-serif", "display", "playfair", "instrument", "orbitron", "josefin", "sora"].includes(f));
  const bodyFont = fonts.find(f => ["inter", "manrope", "jakarta", "body", "space-grotesk"].includes(f));
  const monoFont = fonts.find(f => ["jetbrains"].includes(f));

  // Build the prompt text
  let prompt = `# ${name.charAt(0).toUpperCase() + name.slice(1)} — Design System Prompt\n\n`;
  prompt += `## Identity\n`;
  prompt += `Theme: ${name.charAt(0).toUpperCase() + name.slice(1)}\n`;
  prompt += `Mood: ${layout.hasGrain ? "textured " : ""}${solidColors.bg && (solidColors.bg.startsWith("#0") || solidColors.bg.startsWith("#1")) ? "dark" : "light"}\n`;
  prompt += `Description: ${desc}\n\n`;

  prompt += `## Color Palette\n`;
  prompt += `Primary/Accent Colors:\n`;
  for (const [k, v] of Object.entries(solidColors)) {
    if (!k.includes("bg") && !k.includes("text") && !k.includes("muted") && !k.includes("border")) {
      prompt += `  ${k}: ${v}\n`;
    }
  }
  prompt += `\nBackground: ${solidColors.bg || solidColors.background || "#0a0a0a"}\n`;
  if (solidColors.text) prompt += `Text: ${solidColors.text}\n`;
  if (solidColors.card || solidColors.bgCard || solidColors.surface) {
    prompt += `Surface/Card: ${solidColors.card || solidColors.bgCard || solidColors.surface}\n`;
  }
  prompt += `Muted/Secondary: ${Object.entries(solidColors).filter(([k]) => k.includes("muted") || k.includes("Muted")).map(([,v]) => v).join(", ") || "50% opacity text"}\n`;
  prompt += `Borders: ${Object.entries(colors).filter(([k]) => k.includes("border") || k.includes("Border") || k.includes("rule")).map(([,v]) => v).join(", ") || "subtle white/black opacity"}\n\n`;

  prompt += `## Typography\n`;
  if (headingFont) prompt += `Heading Font: ${FONT_MAP[headingFont] || headingFont}\n`;
  if (bodyFont) prompt += `Body Font: ${FONT_MAP[bodyFont] || bodyFont}\n`;
  if (monoFont) prompt += `Mono/Code Font: ${FONT_MAP[monoFont] || monoFont}\n`;
  prompt += `\nHeading Style:\n`;
  prompt += `  Size: ${typo.heroSize || "responsive clamp()"}\n`;
  prompt += `  Weight: ${typo.heroWeight || "300-400 (light)"}\n`;
  prompt += `  Italic: ${typo.heroItalic ? "YES — headings use italic for emphasis" : "no"}\n`;
  if (typo.heroLetterSpacing) prompt += `  Letter Spacing: ${typo.heroLetterSpacing}\n`;
  if (typo.heroLineHeight) prompt += `  Line Height: ${typo.heroLineHeight}\n`;
  prompt += `\nLabels & Metadata:\n`;
  prompt += `  Transform: ${typo.labelTransform || "normal"}\n`;
  prompt += `  Style: ${typo.sectionLabelStyle || "standard"}\n`;
  prompt += `  Size: 9-11px\n\n`;

  prompt += `## Layout\n`;
  prompt += `Max Width: ${layout.maxWidth || 1200}px\n`;
  prompt += `Navigation: ${layout.navStyle || "fixed top, glass morphism"}\n`;
  prompt += `Projects: ${layout.projectLayout || "card grid or list"}\n`;
  prompt += `Sections: navigation → hero → projects → stats → expertise → tools → footer\n\n`;

  prompt += `## Visual Effects\n`;
  for (const e of effects) prompt += `- ${e}\n`;
  prompt += `\n`;

  if (keyframes.length > 0) {
    prompt += `## Animations\n`;
    for (const kf of keyframes) {
      prompt += `- ${kf.name}: ${kf.purpose}\n`;
    }
    prompt += `\n`;
  }

  prompt += `## Decorative Elements\n`;
  if (layout.hasGrain) prompt += `- Film grain texture overlay\n`;
  if (layout.hasGridPattern) prompt += `- Subtle background grid pattern\n`;
  if (layout.hasSvgDecorations) prompt += `- Custom SVG decorative illustrations\n`;
  if (layout.hasParallax) prompt += `- Parallax scroll effects\n`;
  if (layout.hasHoverEffects) prompt += `- Interactive hover state animations\n`;
  if (layout.hasScrollAnimations) prompt += `- Scroll-triggered reveal animations\n`;
  prompt += `\n`;

  prompt += `## Reproduction Instructions\n`;
  prompt += `To recreate this theme on another website:\n`;
  prompt += `1. Apply the color palette as CSS custom properties / design tokens\n`;
  prompt += `2. Load the specified Google Fonts: ${fonts.map(f => FONT_MAP[f] || f).join(", ")}\n`;
  prompt += `3. Use the heading font for all h1-h3, body font for paragraphs and UI text\n`;
  prompt += `4. Set labels/metadata to ${typo.sectionLabelStyle || "uppercase with wide letter-spacing"}\n`;
  prompt += `5. ${typo.heroItalic ? "Use italic style on key heading words for emphasis" : "Keep headings in regular style"}\n`;
  prompt += `6. Apply ${effects.slice(0, 3).join(", ")} for the signature visual feel\n`;
  prompt += `7. Dark backgrounds should use the exact hex values above, not approximations\n`;

  allPrompts[name] = prompt;
}

// Write TypeScript output
let output = `// Auto-generated by scripts/generate-style-prompts.mjs\n`;
output += `// Regenerate: node scripts/generate-style-prompts.mjs\n\n`;
output += `const prompts: Record<string, string> = ${JSON.stringify(allPrompts, null, 2)};\n\n`;
output += `export function getStylePromptText(theme: string): string {\n`;
output += `  return prompts[theme] || "";\n`;
output += `}\n`;

writeFileSync(join(OUT_DIR, "style-prompts.ts"), output);
console.log(`✓ Generated detailed style prompts for ${themes.length} themes`);
