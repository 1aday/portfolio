"use client";

import Link from "next/link";
import { motion } from "motion/react";

const themes = [
  { name: "Midnight", path: "/midnight", color: "#D4AF37", icon: "☽" },
  { name: "Terminal", path: "/terminal", color: "#00FF41", icon: "▸" },
  { name: "Paper", path: "/paper", color: "#E63946", icon: "◎" },
  { name: "Earth", path: "/earth", color: "#C37A67", icon: "◌" },
  { name: "Brutal", path: "/brutal", color: "#FFD600", icon: "▬" },
  { name: "Vapor", path: "/vapor", color: "#FF6EC7", icon: "◇" },
  { name: "Glass", path: "/glass", color: "#7C3AED", icon: "◈" },
  { name: "Noir", path: "/noir", color: "#FFFFFF", icon: "▣" },
  { name: "Neo", path: "/neo", color: "#3B82F6", icon: "⬡" },
  { name: "Aurora", path: "/aurora", color: "#4ADE80", icon: "∿" },
  { name: "Editorial", path: "/editorial", color: "#DC2626", icon: "¶" },
  { name: "Kinetic", path: "/kinetic", color: "#F59E0B", icon: "↗" },
  { name: "Ivory", path: "/ivory", color: "#B45309", icon: "❧" },
  { name: "Mosaic", path: "/mosaic", color: "#2563EB", icon: "▦" },
  { name: "Flux", path: "/flux", color: "#FF6B6B", icon: "∞" },
  { name: "Studio", path: "/studio", color: "#C41E3A", icon: "⊞" },
  { name: "Deco", path: "/deco", color: "#D4A574", icon: "❖" },
  { name: "Prism", path: "/prism", color: "#8B5CF6", icon: "△" },
  { name: "Carbon", path: "/carbon", color: "#06B6D4", icon: "⬢" },
  { name: "Gazette", path: "/gazette", color: "#CC0000", icon: "☰" },
  { name: "Terrain", path: "/terrain", color: "#5B7F5E", icon: "⌇" },
  { name: "Darkroom", path: "/darkroom", color: "#D4763A", icon: "◐" },
  { name: "Cosmos", path: "/cosmos", color: "#22D3EE", icon: "✦" },
  { name: "Collage", path: "/collage", color: "#E8786F", icon: "⊕" },
  { name: "Blueprint", path: "/blueprint", color: "#4FC3F7", icon: "⌘" },
  { name: "Lumen", path: "/lumen", color: "#00E5CC", icon: "◉" },
  { name: "Manuscript", path: "/manuscript", color: "#B8860B", icon: "✠" },
  { name: "Signal", path: "/signal", color: "#39FF14", icon: "〜" },
  { name: "Origami", path: "/origami", color: "#C62828", icon: "⋈" },
  { name: "Circuit", path: "/circuit", color: "#D4883A", icon: "⏚" },
  { name: "Sketch", path: "/sketch", color: "#2563EB", icon: "✎" },
  { name: "Duotone", path: "/duotone", color: "#0050FF", icon: "◑" },
  { name: "Liquid", path: "/liquid", color: "#8B5CF6", icon: "≋" },
  { name: "Stained", path: "/stained", color: "#F9A825", icon: "✧" },
  { name: "Riso", path: "/riso", color: "#FF0066", icon: "◔" },
  { name: "Zen", path: "/zen", color: "#CC3333", icon: "☯" },
  { name: "Topo", path: "/topo", color: "#84CC16", icon: "⊚" },
  { name: "Neon", path: "/neon", color: "#FF1493", icon: "⚡" },
  { name: "Terrazzo", path: "/terrazzo", color: "#C75B39", icon: "◈" },
  { name: "Ceramic", path: "/ceramic", color: "#C4A882", icon: "⏃" },
  { name: "Pulse", path: "/pulse", color: "#EF4444", icon: "♡" },
  { name: "Cipher", path: "/cipher", color: "#10B981", icon: "⌬" },
  { name: "Ember", path: "/ember", color: "#F97316", icon: "⚶" },
  { name: "Frost", path: "/frost", color: "#93C5FD", icon: "❊" },
  { name: "Mycelium", path: "/mycelium", color: "#39FF85", icon: "⌗" },
  { name: "Thermal", path: "/thermal", color: "#FF3366", icon: "◐" },
  { name: "Patina", path: "/patina", color: "#43B3A0", icon: "⬡" },
  { name: "Axiom", path: "/axiom", color: "#1848CC", icon: "∑" },
  { name: "Darkfield", path: "/darkfield", color: "#4D9EFF", icon: "◎" },
  { name: "Liminal", path: "/liminal", color: "#8BBCC8", icon: "▫" },
  { name: "Herbarium", path: "/herbarium", color: "#2D5A3D", icon: "✿" },
  { name: "Hologram", path: "/hologram", color: "#E8C8FF", icon: "⬙" },
  { name: "Sonar", path: "/sonar", color: "#00FF88", icon: "〰" },
  { name: "Solarpunk", path: "/solarpunk", color: "#1A8A4A", icon: "☀" },
  { name: "Vitrine", path: "/vitrine", color: "#1B4332", icon: "▢" },
  { name: "Redline", path: "/redline", color: "#E53935", icon: "✏" },
  { name: "Tessera", path: "/tessera", color: "#D4A03C", icon: "✦" },
  { name: "Aperture", path: "/aperture", color: "#F5A623", icon: "⌾" },
  { name: "Marquee", path: "/marquee", color: "#CC0000", icon: "▶" },
  { name: "Diorama", path: "/diorama", color: "#FF6B35", icon: "▧" },
  { name: "Cassette", path: "/cassette", color: "#FF6B6B", icon: "▮" },
  { name: "Stratum", path: "/stratum", color: "#D4A03C", icon: "▤" },
  { name: "Specimen", path: "/specimen", color: "#E53935", icon: "Aa" },
  { name: "Sextant", path: "/sextant", color: "#2E8B8F", icon: "⊹" },
  { name: "Darktype", path: "/darktype", color: "#FF3366", icon: "Ξ" },
  { name: "Propaganda", path: "/propaganda", color: "#CC2222", icon: "★" },
  { name: "Billboard", path: "/billboard", color: "#FFEB3B", icon: "▮" },
  { name: "Ledger", path: "/ledger", color: "#2E7D32", icon: "☰" },
  { name: "Grain", path: "/grain", color: "#E8A87C", icon: "◐" },
  { name: "Archive", path: "/archive", color: "#C0392B", icon: "⌸" },
  { name: "Telegraph", path: "/telegraph", color: "#C4963A", icon: "⏁" },
  { name: "Polaroid", path: "/polaroid", color: "#4A90D9", icon: "⬜" },
  { name: "Cartouche", path: "/cartouche", color: "#2D6B8A", icon: "☥" },
  { name: "Bazaar", path: "/bazaar", color: "#C4451C", icon: "⟡" },
  { name: "Corsair", path: "/corsair", color: "#C4963A", icon: "⚓" },
  { name: "Petroglyph", path: "/petroglyph", color: "#D4773A", icon: "☉" },
  { name: "Clockwork", path: "/clockwork", color: "#D4A844", icon: "⚙" },
  { name: "Filament", path: "/filament", color: "#FFB347", icon: "◍" },
  { name: "Furnace", path: "/furnace", color: "#FF4500", icon: "⚒" },
  { name: "Abacus", path: "/abacus", color: "#CC3333", icon: "⊟" },
  { name: "Wavelength", path: "/wavelength", color: "#00BFFF", icon: "≈" },
  { name: "Phenotype", path: "/phenotype", color: "#00CC88", icon: "⧬" },
  { name: "Mercury", path: "/mercury", color: "#C0C0C0", icon: "◉" },
  { name: "Tableau", path: "/tableau", color: "#6366F1", icon: "⊡" },
  { name: "Membrane", path: "/membrane", color: "#00D4AA", icon: "⬭" },
  { name: "Tintype", path: "/tintype", color: "#C0B8A8", icon: "◫" },
  { name: "Shibori", path: "/shibori", color: "#3A5A8A", icon: "⊜" },
  { name: "Aquifer", path: "/aquifer", color: "#2ECBE9", icon: "⏍" },
  { name: "Cathedral", path: "/cathedral", color: "#D4AF37", icon: "⌆" },
  { name: "Resin", path: "/resin", color: "#C8841A", icon: "⬟" },
  { name: "Distillery", path: "/distillery", color: "#C87533", icon: "⏢" },
  { name: "Almanac", path: "/almanac", color: "#CC6B2C", icon: "⌂" },
  { name: "Sediment", path: "/sediment", color: "#4A6FA5", icon: "▥" },
  { name: "Apothecary", path: "/apothecary", color: "#C8A96E", icon: "℞" },
  { name: "Depot", path: "/depot", color: "#F5C542", icon: "⟶" },
  { name: "Kiln", path: "/kiln", color: "#FF6B35", icon: "⏶" },
  { name: "Isotope", path: "/isotope", color: "#39FF14", icon: "⚛" },
  { name: "Tarot", path: "/tarot", color: "#D4AF37", icon: "☾" },
  { name: "Pavilion", path: "/pavilion", color: "#FF4500", icon: "⌖" },
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      {/* Hero */}
      <header
        style={{
          textAlign: "center",
          padding: "clamp(80px, 12vh, 140px) 24px clamp(40px, 6vh, 60px)",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Portfolio
            <br />
            <span style={{ color: "rgba(255,140,66,0.7)", fontStyle: "italic" }}>
              Themes
            </span>
          </h1>
          <p
            style={{
              marginTop: 20,
              fontSize: "clamp(14px, 2vw, 17px)",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Each theme reimagines the same AI product studio portfolio
            with a completely different visual identity.
          </p>
        </motion.div>
      </header>

      {/* Grid */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {themes.map((theme, i) => (
          <motion.div
            key={theme.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.02, 1) }}
          >
            <Link
              href={theme.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "28px 12px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                background: `linear-gradient(145deg, ${theme.color}0a, transparent)`,
                textDecoration: "none",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = `${theme.color}44`;
                el.style.boxShadow = `0 8px 30px ${theme.color}15, 0 0 0 1px ${theme.color}22 inset`;
                el.style.background = `linear-gradient(145deg, ${theme.color}18, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "";
                el.style.borderColor = "rgba(255,255,255,0.06)";
                el.style.boxShadow = "";
                el.style.background = `linear-gradient(145deg, ${theme.color}0a, transparent)`;
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  lineHeight: 1,
                  color: theme.color,
                  transition: "transform 0.25s ease",
                }}
              >
                {theme.icon}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.55)",
                  textAlign: "center",
                }}
              >
                {theme.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
