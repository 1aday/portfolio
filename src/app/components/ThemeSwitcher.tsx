"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";

/* ─── Theme registry ─── */
const themes = [
  { name: "Default", path: "/", color: "#FF8C42", icon: "◆" },
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
  const listRef = useRef<HTMLDivElement>(null);
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

  /* ─── Auto-nav state ─── */
  const autoNavTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [countdown, setCountdown] = useState(0);
  const countdownAnimRef = useRef(0);

  const cancelAutoNav = useCallback(() => {
    if (autoNavTimer.current) { clearTimeout(autoNavTimer.current); autoNavTimer.current = null; }
    cancelAnimationFrame(countdownAnimRef.current);
    setCountdown(0);
  }, []);

  const startAutoNav = useCallback((idx: number) => {
    cancelAutoNav();
    const theme = themes[idx];
    if (!theme || theme.path === current) return;
    setHighlightIdx(idx);

    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / 1200, 1);
      setCountdown(p);
      if (p < 1) countdownAnimRef.current = requestAnimationFrame(tick);
    };
    countdownAnimRef.current = requestAnimationFrame(tick);

    autoNavTimer.current = setTimeout(() => {
      router.push(theme.path);
      setIsOpen(false);
      setCountdown(0);
      setHighlightIdx(-1);
    }, 1200);
  }, [cancelAutoNav, current, router]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        cancelAutoNav();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, cancelAutoNav]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { cancelAutoNav(); setIsOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, cancelAutoNav]);

  // Scroll active into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>("[data-active]");
    if (active) requestAnimationFrame(() => active.scrollIntoView({ block: "center", behavior: "instant" }));
  }, [isOpen]);

  // Cleanup
  useEffect(() => () => {
    cancelAnimationFrame(countdownAnimRef.current);
    if (autoNavTimer.current) clearTimeout(autoNavTimer.current);
  }, []);

  const toggle = useCallback(() => { cancelAutoNav(); setIsOpen((o) => !o); }, [cancelAutoNav]);

  /* ─── Shared list content ─── */
  const themeList = (
    <div ref={listRef} style={{
      maxHeight: isMobile ? "50vh" : 380,
      overflowY: "auto",
      padding: "0 6px 6px",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(255,255,255,0.08) transparent",
    }}>
      {themes.map((theme, i) => {
        const isActive = theme.path === current;
        const isHighlighted = i === highlightIdx;
        const ringProgress = isHighlighted ? countdown : 0;

        return (
          <Link
            key={theme.path}
            href={theme.path}
            data-active={isActive ? "" : undefined}
            onClick={() => { cancelAutoNav(); setIsOpen(false); }}
            onPointerEnter={() => { if (!isActive) startAutoNav(i); }}
            onPointerLeave={() => { if (i === highlightIdx) cancelAutoNav(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 8px",
              borderRadius: 8,
              textDecoration: "none",
              background: isActive
                ? light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"
                : isHighlighted
                  ? light ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"
                  : "transparent",
              transition: "background 0.15s",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {/* Icon with countdown ring */}
            <span style={{
              position: "relative",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: theme.color,
              flexShrink: 0,
            }}>
              {ringProgress > 0 && (
                <svg width="22" height="22" viewBox="0 0 22 22"
                  style={{ position: "absolute", inset: 0 }}>
                  <circle cx="11" cy="11" r="9.5" fill="none"
                    stroke={theme.color} strokeWidth="1.5"
                    strokeDasharray={2 * Math.PI * 9.5}
                    strokeDashoffset={2 * Math.PI * 9.5 * (1 - ringProgress)}
                    strokeLinecap="round" transform="rotate(-90 11 11)"
                    opacity={0.6} />
                </svg>
              )}
              {theme.icon}
            </span>
            <span style={{
              flex: 1,
              fontSize: 11,
              fontWeight: isActive ? 600 : 500,
              letterSpacing: "0.04em",
              color: isActive
                ? light ? "#1a1a1a" : "#fff"
                : light ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.6)",
              transition: "color 0.15s",
            }}>
              {theme.name}
            </span>
            <span style={{
              fontSize: 9,
              fontVariantNumeric: "tabular-nums",
              color: light ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)",
              flexShrink: 0,
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div ref={panelRef} style={{
      position: "fixed",
      bottom: isMobile ? "1.25rem" : "1.5rem",
      right: isMobile ? "auto" : "1.5rem",
      left: isMobile ? "50%" : "auto",
      transform: isMobile ? "translateX(-50%)" : "none",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: isMobile ? "center" : "flex-end",
      gap: 8,
    }}>
      {/* Panel */}
      <div style={{
        background: light ? "rgba(255,255,255,0.96)" : "rgba(10,10,10,0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 14,
        width: isMobile ? "min(280px, 85vw)" : 220,
        boxShadow: light
          ? "0 20px 60px rgba(0,0,0,0.1)"
          : "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.2s ease, transform 0.25s cubic-bezier(0.23,1,0.32,1)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px 8px",
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: light ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.35)",
          }}>
            Themes
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 500,
            color: light ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
            background: light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
            padding: "2px 6px",
            borderRadius: 6,
            fontVariantNumeric: "tabular-nums",
          }}>
            {themes.length}
          </span>
        </div>
        {themeList}
      </div>

      {/* Trigger */}
      <button
        onClick={toggle}
        aria-label="Switch theme"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: isMobile ? "0" : "8px 14px 8px 10px",
          width: isMobile ? 48 : "auto",
          height: isMobile ? 48 : "auto",
          justifyContent: "center",
          borderRadius: isMobile ? "50%" : 12,
          border: `1px solid ${light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)"}`,
          background: light ? "rgba(255,255,255,0.9)" : "rgba(10,10,10,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: light ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.65)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.05em",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          transition: "all 0.25s ease",
        }}
      >
        <span style={{ fontSize: isMobile ? 18 : 14, lineHeight: 1, color: currentTheme.color }}>
          {currentTheme.icon}
        </span>
        {!isMobile && (
          <>
            <span style={{ lineHeight: 1 }}>{currentTheme.name}</span>
            <span style={{ fontSize: 9, opacity: 0.35, fontVariantNumeric: "tabular-nums" }}>
              {currentIndex + 1}/{themes.length}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ opacity: 0.4, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "none" }}>
              <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
