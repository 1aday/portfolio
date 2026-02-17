import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const THEMES_DIR = join(ROOT, "src", "themes");
const OUT_DIR = join(ROOT, "src", "app", "data");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const themes = readdirSync(THEMES_DIR).filter(d =>
  existsSync(join(THEMES_DIR, d, "ThemePage.tsx"))
);

const FONT_MAP = {
  "dm-serif": "DM Serif Display", "display": "Cormorant Garamond",
  "inter": "Inter", "jetbrains": "JetBrains Mono",
  "orbitron": "Orbitron", "manrope": "Manrope", "sora": "Sora",
  "instrument": "Instrument Serif", "space-grotesk": "Space Grotesk",
  "playfair": "Playfair Display", "josefin": "Josefin Sans",
  "jakarta": "Plus Jakarta Sans", "body": "Outfit",
};

function extractAll(code) {
  // Colors from const C = {...}
  const cMatch = code.match(/const\s+C\s*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
  const colors = {};
  if (cMatch) {
    const re = /(\w+)\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(cMatch[1])) !== null) colors[m[1]] = m[2];
  }

  // Also extract colors from Tailwind classes: bg-[#xxx], text-[#xxx], border-[#xxx]
  if (Object.keys(colors).length < 3) {
    const twColors = new Map();
    const twRe = /(bg|text|border)-\[(#[0-9A-Fa-f]{3,8})\]/g;
    let tm;
    while ((tm = twRe.exec(code)) !== null) twColors.set(tm[2], tm[1]);
    // Classify by usage
    const bgColors = [...twColors.entries()].filter(([,t]) => t === "bg").map(([c]) => c);
    const textColors = [...twColors.entries()].filter(([,t]) => t === "text").map(([c]) => c);
    // Lightest bg = main background, darkest text = main text
    if (bgColors.length > 0 && !colors.bg) {
      const sorted = bgColors.sort((a, b) => parseInt(b.slice(1), 16) - parseInt(a.slice(1), 16));
      colors.bg = sorted[0]; // lightest
      if (sorted.length > 1) colors.card = sorted[1];
    }
    if (textColors.length > 0 && !colors.text) {
      // Find the most common text color, then darkest
      const counts = {};
      textColors.forEach(c => counts[c] = (counts[c] || 0) + 1);
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (sorted[0]) colors.text = sorted[0][0];
      // Find ALL saturated accent colors from text, bg, and border
      const allTwColors = [...new Set([...bgColors, ...textColors])];
      const accents = [];
      for (const c of allTwColors) {
        if (c === colors.bg || c === colors.text || c === colors.card) continue;
        if (c.length < 7) continue;
        const r = parseInt(c.slice(1,3), 16), g = parseInt(c.slice(3,5), 16), b = parseInt(c.slice(5,7), 16);
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const sat = max > 0 ? (max - min) / max : 0;
        if (sat > 0.25) accents.push(c);
      }
      if (accents.length > 0) colors.accent = accents[0];
      if (accents.length > 1) colors.accent2 = accents[1];
      // Also check hover/border colors for accents
      const borderRe = /(?:border|hover:border)-\[(#[0-9A-Fa-f]{6})\]/g;
      while ((tm = borderRe.exec(code)) !== null) {
        const c = tm[1];
        const r = parseInt(c.slice(1,3), 16), g = parseInt(c.slice(3,5), 16), b = parseInt(c.slice(5,7), 16);
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const sat = max > 0 ? (max - min) / max : 0;
        if (sat > 0.3 && !colors.accent) colors.accent = c;
      }
    }
    // Find muted text
    const mutedCandidates = textColors.filter(c => {
      const r = parseInt(c.slice(1,3), 16);
      return r > 80 && r < 180;
    });
    if (mutedCandidates[0] && !colors.muted) colors.muted = mutedCandidates[0];
  }

  // Fonts
  const fonts = new Set();
  let fm;
  const fre = /var\(--font-([a-z-]+)\)/g;
  while ((fm = fre.exec(code)) !== null) fonts.add(fm[1]);
  const fontList = [...fonts];

  // Find the LARGEST clamp — that's the hero heading
  const clamps = [];
  const cre = /fontSize:\s*["']?(clamp\(([^)]+)\))["']?/g;
  while ((fm = cre.exec(code)) !== null) {
    const parts = fm[2].split(",").map(s => s.trim());
    const max = parseFloat(parts[2]) || 0;
    clamps.push({ full: fm[1], max, line: code.substring(0, fm.index).split("\n").length });
  }
  clamps.sort((a, b) => b.max - a.max);
  const heroSize = clamps[0]?.full || null;
  const subSize = clamps[1]?.full || null;

  // Italic detection — check around h1/h2 tags
  const heroItalic = !!code.match(/<(?:motion\.)?h1[^>]*>[\s\S]{0,500}italic/);
  const hasItalicSpans = code.includes('fontStyle: "italic"') || code.includes("italic text-");

  // Font weight near hero
  const heroWeightMatch = code.match(/<(?:motion\.)?h1[\s\S]{0,300}fontWeight:\s*(\d+)/);
  const heroWeight = heroWeightMatch ? heroWeightMatch[1] : null;

  // Letter spacing
  const trackings = new Set();
  const tre = /tracking-\[([^\]]+)\]/g;
  while ((fm = tre.exec(code)) !== null) trackings.add(fm[1]);

  // Line height near hero
  const heroLhMatch = code.match(/<(?:motion\.)?h1[\s\S]{0,300}lineHeight:\s*["']?([^"',\s}]+)/);
  const heroLineHeight = heroLhMatch ? heroLhMatch[1] : null;

  // Layout
  const maxWidthMatch = code.match(/maxWidth:\s*["']?(\d{3,4})/);
  const maxWidth = maxWidthMatch ? parseInt(maxWidthMatch[1]) : 1200;

  // Keyframes
  const keyframes = [];
  const kre = /@keyframes\s+([\w-]+)/g;
  while ((fm = kre.exec(code)) !== null) keyframes.push(fm[1]);

  // Effects
  const effects = [];
  if (code.includes("backdropFilter") || code.includes("backdrop-filter")) effects.push("glassmorphism");
  if (code.includes("linear-gradient") && code.includes("background")) effects.push("gradients");
  if (code.includes("boxShadow") || code.includes("box-shadow")) effects.push("shadows");
  if (code.includes("grain")) effects.push("film grain texture");
  if (code.includes("backgroundImage") && code.includes("1px")) effects.push("grid pattern");
  if (code.includes("<svg")) effects.push("custom SVG illustrations");
  if (code.includes("useInView") || code.includes("whileInView")) effects.push("scroll-triggered reveals");
  if (code.includes("useScroll") || code.includes("useTransform")) effects.push("parallax scrolling");
  if (code.includes("whileHover") || code.includes("onMouseEnter")) effects.push("hover animations");
  if (keyframes.length > 0) effects.push("CSS keyframe animations");

  // Description from theme name + comment block
  const commentMatch = code.match(/\/\*[\s\S]*?((?:AQUIFER|ABACUS|[A-Z]{3,})\s*[—–-]\s*([^\n*]+))/);
  const commentDesc = commentMatch ? commentMatch[2]?.trim() : null;

  // Heading/body font classification
  const headingFonts = ["dm-serif", "display", "playfair", "instrument", "orbitron", "josefin", "sora"];
  const bodyFonts = ["inter", "manrope", "jakarta", "body", "space-grotesk"];
  const headingFont = fontList.find(f => headingFonts.includes(f));
  const bodyFont = fontList.find(f => bodyFonts.includes(f));
  const monoFont = fontList.find(f => f === "jetbrains");

  // Uppercase label detection
  const hasUppercaseLabels = code.includes("uppercase");
  const labelTracking = [...trackings].find(t => parseFloat(t) >= 0.15) || null;

  // Hover effects extraction
  const hoverEffects = [];
  if (code.includes("hover:border")) hoverEffects.push("border color change on hover");
  if (code.includes("hover:text-") || code.includes("hover:text-[")) hoverEffects.push("text color change on hover");
  if (code.includes("hover:bg-") || code.includes("hover:bg-[")) hoverEffects.push("background change on hover");
  if (code.includes("hover:scale") || code.includes("whileHover") && code.includes("scale")) hoverEffects.push("scale transform on hover");
  if (code.includes("hover:translate") || code.includes("group-hover:translate")) hoverEffects.push("translate shift on hover");
  if (code.includes("hover:opacity") || code.includes("group-hover:opacity")) hoverEffects.push("opacity change on hover");
  if (code.includes("hover:shadow") || code.includes("hover:boxShadow")) hoverEffects.push("shadow on hover");
  if (code.includes("transition-")) hoverEffects.push("CSS transitions");

  // Background mood
  const bg = colors.bg || colors.background || "";
  const isDark = bg ? (bg.startsWith("#0") || bg.startsWith("#1") || bg.startsWith("#2")) : true;

  return {
    colors, fontList, heroSize, subSize, heroItalic, hasItalicSpans,
    heroWeight, heroLineHeight, trackings: [...trackings], maxWidth,
    keyframes, effects, hoverEffects, commentDesc, headingFont, bodyFont, monoFont,
    hasUppercaseLabels, labelTracking, isDark,
  };
}

function buildPrompt(name, d) {
  const Name = name.charAt(0).toUpperCase() + name.slice(1);
  const solidColors = Object.entries(d.colors).filter(([, v]) => !v.startsWith("rgba") && v.startsWith("#"));
  const accentColors = solidColors.filter(([k]) => !["bg", "background", "text", "card", "bgCard", "surface"].includes(k));

  let p = "";
  p += `# ${Name} Theme — Complete Design System\n\n`;

  // Identity
  p += `## Mood & Character\n`;
  p += `${d.isDark ? "Dark" : "Light"} theme`;
  if (d.commentDesc) p += ` — ${d.commentDesc}`;
  p += `\n\n`;

  // Colors — clean format
  p += `## Color Palette\n`;
  p += `Background: ${d.colors.bg || d.colors.background || "#0a0a0a"}\n`;
  if (d.colors.card || d.colors.bgCard || d.colors.surface) {
    p += `Card/Surface: ${d.colors.card || d.colors.bgCard || d.colors.surface}\n`;
  }
  if (d.colors.text) p += `Text: ${d.colors.text}\n`;
  if (d.colors.muted) p += `Muted: ${d.colors.muted}\n`;
  p += `\nAccent Colors:\n`;
  for (const [k, v] of accentColors) {
    if (!k.includes("Glow") && !k.includes("Light") && !k.includes("Muted") && !k.includes("Dim") && !k.includes("Dark")) {
      p += `  ${k}: ${v}\n`;
    }
  }
  p += `\n`;

  // Typography
  p += `## Typography\n`;
  if (d.headingFont) p += `Heading: ${FONT_MAP[d.headingFont] || d.headingFont}\n`;
  if (d.bodyFont) p += `Body: ${FONT_MAP[d.bodyFont] || d.bodyFont}\n`;
  if (d.monoFont) p += `Mono: ${FONT_MAP[d.monoFont] || d.monoFont}\n`;
  if (!d.headingFont && !d.bodyFont) {
    p += `Fonts: ${d.fontList.map(f => FONT_MAP[f] || f).join(", ") || "system default"}\n`;
  }
  p += `\n`;

  // Hero heading specifics
  p += `Hero Heading:\n`;
  if (d.heroSize) p += `  Size: ${d.heroSize}\n`;
  p += `  Weight: ${d.heroWeight || "300 (light)"}\n`;
  if (d.heroItalic || d.hasItalicSpans) p += `  Style: italic on emphasis words\n`;
  if (d.heroLineHeight) p += `  Line-height: ${d.heroLineHeight}\n`;
  p += `\n`;

  if (d.subSize) {
    p += `Section Headings:\n`;
    p += `  Size: ${d.subSize}\n\n`;
  }

  // Labels
  p += `Labels & Metadata:\n`;
  p += `  Text-transform: ${d.hasUppercaseLabels ? "uppercase" : "none"}\n`;
  if (d.labelTracking) p += `  Letter-spacing: ${d.labelTracking}\n`;
  if (d.trackings.length > 0) p += `  All spacings used: ${d.trackings.join(", ")}\n`;
  p += `  Size: 9-11px\n\n`;

  // Layout
  p += `## Layout\n`;
  p += `Max-width: ${d.maxWidth}px\n`;
  p += `Structure: nav → hero → projects → stats → expertise → tools → footer\n\n`;

  // Effects
  if (d.effects.length > 0) {
    p += `## Visual Effects\n`;
    for (const e of d.effects) p += `• ${e}\n`;
    p += `\n`;
  }

  // Animations
  if (d.keyframes.length > 0) {
    p += `## Animations\n`;
    p += d.keyframes.join(", ") + `\n\n`;
  }

  // Hover/Interaction
  if (d.hoverEffects.length > 0) {
    p += `## Hover & Interaction\n`;
    for (const e of d.hoverEffects) p += `• ${e}\n`;
    p += `\n`;
  }

  // Reproduction
  p += `## How to Reproduce\n`;
  p += `1. Use exact hex colors above as CSS custom properties\n`;
  p += `2. Load fonts: ${d.fontList.map(f => FONT_MAP[f] || f).join(", ")}\n`;
  if (d.headingFont) p += `3. ${FONT_MAP[d.headingFont]} for headings, ${d.bodyFont ? FONT_MAP[d.bodyFont] : "system"} for body\n`;
  if (d.heroItalic || d.hasItalicSpans) p += `4. Apply italic to emphasis words in headings\n`;
  if (d.hasUppercaseLabels) p += `${d.heroItalic ? "5" : "4"}. All labels/metadata: uppercase, ${d.labelTracking || "0.2em"} letter-spacing, 10-11px\n`;
  p += `${d.heroItalic ? "6" : "5"}. Hero heading: ${d.heroWeight || "light weight"}, ${d.heroSize || "large responsive clamp"}\n`;

  return p;
}

const allPrompts = {};
for (const name of themes) {
  const code = readFileSync(join(THEMES_DIR, name, "ThemePage.tsx"), "utf-8");
  const data = extractAll(code);
  allPrompts[name] = buildPrompt(name, data);
}

let output = `// Auto-generated — node scripts/generate-style-prompts.mjs\n\n`;
output += `const prompts: Record<string, string> = ${JSON.stringify(allPrompts, null, 2)};\n\n`;
output += `export function getStylePromptText(theme: string): string {\n`;
output += `  return prompts[theme] || "";\n`;
output += `}\n`;

writeFileSync(join(OUT_DIR, "style-prompts.ts"), output);
console.log(`✓ Generated style prompts for ${themes.length} themes`);
