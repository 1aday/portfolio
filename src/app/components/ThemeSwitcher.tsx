"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { getStylePromptText } from "@/app/data/style-prompts";

/* ─── Theme registry ─── */
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

const VISITED_KEY = "portfolio-visited-themes";

export default function ThemeSwitcher({
  current,
  variant = "dark",
}: {
  current: string;
  variant?: "dark" | "light";
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const light = variant === "light";

  const currentTheme = themes.find((t) => t.path === current) || themes[0];
  const currentIndex = themes.findIndex((t) => t.path === current);

  /* ─── Mobile detection ─── */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ─── Visited themes tracking ─── */
  const [visited, setVisited] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VISITED_KEY);
      if (stored) setVisited(new Set(JSON.parse(stored)));
    } catch {}
  }, []);
  useEffect(() => {
    if (!current) return;
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(current);
      try { localStorage.setItem(VISITED_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [current]);

  /* ─── Prev/Next navigation ─── */
  const goNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % themes.length;
    router.push(themes[nextIdx].path);
  }, [currentIndex, router]);
  const goPrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + themes.length) % themes.length;
    router.push(themes[prevIdx].path);
  }, [currentIndex, router]);

  /* ─── Swipe on trigger ─── */
  const swipeRef = useRef({ startX: 0, startTime: 0 });
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    swipeRef.current = { startX: e.touches[0].clientX, startTime: Date.now() };
  }, []);
  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - swipeRef.current.startX;
    const elapsed = Date.now() - swipeRef.current.startTime;
    if (elapsed < 500 && Math.abs(dx) > 40) {
      if (dx < 0) goNext(); else goPrev();
    }
  }, [goNext, goPrev]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Lock scroll when drawer open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen, isMobile]);

  const toggle = useCallback(() => setIsOpen((o) => !o), []);
  const [copied, setCopied] = useState(false);
  const copyStyle = useCallback(() => {
    const themeName = current.replace("/", "") || "default";
    const text = getStylePromptText(themeName);
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [current]);

  const visitedCount = visited.size;

  return (
    <div ref={panelRef} style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      pointerEvents: "none",
    }}>
      {/* ─── Drawer ─── */}
      <div style={{
        position: "absolute",
        bottom: isMobile ? 76 : 72,
        left: isMobile ? 8 : "50%",
        right: isMobile ? 8 : "auto",
        maxWidth: isMobile ? "none" : 860,
        width: isMobile ? "auto" : "92vw",
        maxHeight: isOpen ? "70vh" : 0,
        opacity: isOpen ? 1 : 0,
        transform: isMobile
          ? (isOpen ? "translateY(0)" : "translateY(16px)")
          : (isOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(16px)"),
        transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
        overflow: "hidden",
        borderRadius: 16,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
        pointerEvents: isOpen ? "auto" : "none",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px 8px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
            }}>Themes</span>
            <span style={{
              fontSize: 9, color: "rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              padding: "2px 6px", borderRadius: 4,
            }}>{themes.length}</span>
          </div>
          {visitedCount > 0 && (
            <span style={{
              fontSize: 9, color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
            }}>
              {visitedCount} visited
            </span>
          )}
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(64px, 1fr))" : "repeat(auto-fill, minmax(88px, 1fr))",
          gap: 8,
          padding: "12px 14px 16px",
          overflowY: "auto",
          maxHeight: "calc(70vh - 50px)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.08) transparent",
        }}>
          {themes.map((theme) => {
            const isActive = theme.path === current;
            const isVisited = visited.has(theme.path);

            return (
              <Link key={theme.path} href={theme.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 4,
                  padding: isMobile ? "10px 4px 8px" : "14px 6px 10px",
                  borderRadius: 10,
                  border: isActive
                    ? `1.5px solid ${theme.color}88`
                    : "1px solid rgba(255,255,255,0.04)",
                  background: isActive
                    ? `${theme.color}15`
                    : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}>
                <span style={{
                  fontSize: isMobile ? 20 : 24, lineHeight: 1,
                  color: isVisited && !isActive ? "rgba(255,255,255,0.25)" : theme.color,
                  filter: isVisited && !isActive ? "grayscale(1)" : "none",
                  opacity: isActive ? 1 : 0.85,
                  transition: "opacity 0.2s",
                }}>
                  {theme.icon}
                </span>
                <span style={{
                  fontSize: isMobile ? 8 : 10, fontWeight: 500, letterSpacing: "0.03em",
                  color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
                  textAlign: "center", lineHeight: 1.2,
                  overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", maxWidth: "100%",
                }}>
                  {theme.name}
                </span>
                {/* Visited dot */}
                {isVisited && !isActive && (
                  <div style={{
                    position: "absolute", top: 4, right: 4,
                    width: 4, height: 4, borderRadius: "50%",
                    background: theme.color, opacity: 0.4,
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "8px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" onClick={() => setIsOpen(false)} style={{
            fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", textDecoration: "none",
          }}>
            ← All Themes
          </Link>
          <button onClick={copyStyle} style={{
            fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
            color: copied ? "#4ADE80" : `${currentTheme.color}aa`,
            background: "none", border: "none", cursor: "pointer",
            padding: "4px 0",
          }}>
            {copied ? "✓ Copied" : "Copy Style Prompt"}
          </button>
        </div>
      </div>

      {/* ─── Copy Style CTA (visible when drawer closed) ─── */}
      {!isOpen && (
        <div style={{
          display: "flex", justifyContent: "center",
          padding: "0 0 8px",
          pointerEvents: "auto",
        }}>
          <button onClick={copyStyle} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px",
            borderRadius: 20,
            border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`,
            background: copied ? "rgba(74,222,128,0.08)" : "rgba(10,10,10,0.7)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: copied ? "#4ADE80" : "rgba(255,255,255,0.4)",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            {copied ? "Copied!" : "Copy Style"}
          </button>
        </div>
      )}

      {/* ─── Bottom bar ─── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? 6 : 0,
        padding: isMobile ? "0 0 20px" : "0 0 20px",
        pointerEvents: "auto",
      }}>
        {/* Mobile: prev/next + center trigger */}
        {isMobile ? (
          <>
            <button onClick={goPrev} aria-label="Previous" style={{
              width: 42, height: 42, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(10,10,10,0.6)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.35)",
            }}>
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2.5L4.5 6L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button onClick={toggle} onTouchStart={handleSwipeStart} onTouchEnd={handleSwipeEnd}
              aria-label="Browse themes" style={{
              width: 56, height: 56, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(10,10,10,0.85)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              touchAction: "pan-y",
            }}>
              <span style={{ fontSize: 22, lineHeight: 1, color: currentTheme.color }}>
                {currentTheme.icon}
              </span>
            </button>

            <button onClick={goNext} aria-label="Next" style={{
              width: 42, height: 42, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(10,10,10,0.6)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.35)",
            }}>
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        ) : (
          /* Desktop: pill trigger */
          <button onClick={toggle} aria-label="Browse themes" style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px 8px 10px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            color: "rgba(255,255,255,0.65)",
            fontSize: 11, fontWeight: 500, letterSpacing: "0.05em",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            margin: "0 auto",
          }}>
            <span style={{ fontSize: 14, lineHeight: 1, color: currentTheme.color }}>
              {currentTheme.icon}
            </span>
            <span style={{ lineHeight: 1 }}>{currentTheme.name}</span>
            <span style={{ fontSize: 9, opacity: 0.35, fontVariantNumeric: "tabular-nums" }}>
              {currentIndex + 1}/{themes.length}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ opacity: 0.4, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "none" }}>
              <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
