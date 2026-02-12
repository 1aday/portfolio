"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";

/* ─── Theme registry with icons ─── */
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

  /* ─── Rolodex arc state ─── */
  const [scrollPos, setScrollPos] = useState(0);
  const scrollRef = useRef(0);
  const touchRef = useRef({ startX: 0, startY: 0, startTime: 0, lastX: 0, lastY: 0 });
  const velocityRef = useRef(0);
  const lastMoveRef = useRef(0);
  const animRef = useRef(0);

  // Init scroll to current theme when opening
  useEffect(() => {
    if (isOpen && isMobile) {
      const idx = themes.findIndex((t) => t.path === current);
      const pos = idx >= 0 ? idx : 0;
      scrollRef.current = pos;
      setScrollPos(pos);
      velocityRef.current = 0;
    }
  }, [isOpen, isMobile, current]);

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Close on outside click (desktop only)
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, isMobile]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Scroll active theme into view when desktop panel opens
  useEffect(() => {
    if (!isOpen || !listRef.current || isMobile) return;
    const active = listRef.current.querySelector<HTMLElement>("[data-active]");
    if (active) {
      requestAnimationFrame(() => {
        active.scrollIntoView({ block: "center", behavior: "instant" });
      });
    }
  }, [isOpen, isMobile]);

  /* ─── Snap animation with cubic ease-out ─── */
  const snapTo = useCallback((target: number) => {
    cancelAnimationFrame(animRef.current);
    const start = scrollRef.current;
    const startTime = performance.now();
    const duration = 400;
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = start + (target - start) * eased;
      scrollRef.current = val;
      setScrollPos(val);
      if (t < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  }, []);

  /* ─── Touch handlers for rolodex arc ─── */
  const ANGLE_STEP = 26;
  const DRAG_SENSITIVITY = 0.35;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    cancelAnimationFrame(animRef.current);
    const t = e.touches[0];
    touchRef.current = {
      startX: t.clientX, startY: t.clientY,
      startTime: Date.now(),
      lastX: t.clientX, lastY: t.clientY,
    };
    velocityRef.current = 0;
    lastMoveRef.current = performance.now();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.lastX;
    const now = performance.now();
    const dt = now - lastMoveRef.current;
    if (dt > 0) {
      const delta = -dx * DRAG_SENSITIVITY / ANGLE_STEP;
      velocityRef.current = (delta / dt) * 1000;
      scrollRef.current += delta;
      setScrollPos(scrollRef.current);
    }
    lastMoveRef.current = now;
    touchRef.current.lastX = t.clientX;
    touchRef.current.lastY = t.clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const totalDx = touchRef.current.lastX - touchRef.current.startX;
    const totalDy = touchRef.current.lastY - touchRef.current.startY;
    const elapsed = Date.now() - touchRef.current.startTime;

    // Swipe up → navigate to focused theme
    if (totalDy < -60 && Math.abs(totalDx) < Math.abs(totalDy) * 0.7) {
      const N = themes.length;
      const idx = ((Math.round(scrollRef.current) % N) + N) % N;
      router.push(themes[idx].path);
      setIsOpen(false);
      return;
    }

    // Short tap → navigate to focused theme
    if (Math.abs(totalDx) < 10 && Math.abs(totalDy) < 10 && elapsed < 300) {
      const N = themes.length;
      const idx = ((Math.round(scrollRef.current) % N) + N) % N;
      router.push(themes[idx].path);
      setIsOpen(false);
      return;
    }

    // Momentum snap
    const velocity = velocityRef.current;
    const projected = scrollRef.current + velocity * 0.25;
    snapTo(Math.round(projected));
  }, [router, snapTo]);

  const toggle = useCallback(() => setIsOpen((o) => !o), []);

  return (
    <div ref={panelRef} className={`ts-wrap ${light ? "ts-light" : ""} ${isMobile ? "ts-wrap-mobile" : ""}`}>
      {/* Desktop panel — hidden on mobile */}
      <div
        className={`ts-panel ${isOpen && !isMobile ? "ts-panel-open" : ""}`}
      >
        <div className="ts-panel-header">
          <span className="ts-panel-title">Themes</span>
          <span className="ts-panel-count">{themes.length}</span>
        </div>
        <div ref={listRef} className="ts-list">
          {themes.map((theme, i) => {
            const isActive = theme.path === current;
            return (
              <Link
                key={theme.path}
                href={theme.path}
                className={`ts-item ${isActive ? "ts-item-active" : ""}`}
                data-active={isActive ? "" : undefined}
                onClick={() => setIsOpen(false)}
              >
                <span className="ts-item-icon" style={{ color: theme.color }}>
                  {theme.icon}
                </span>
                <span className="ts-item-name">{theme.name}</span>
                <span className="ts-item-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile rolodex overlay */}
      {isMobile && (() => {
        const ARC_RADIUS = 140;
        const VISIBLE_HALF = 4;
        const N = themes.length;
        const centerIdx = Math.round(scrollPos);
        const fractional = scrollPos - centerIdx;
        const focusedThemeIdx = ((centerIdx % N) + N) % N;
        const focusedTheme = themes[focusedThemeIdx];

        const arcCards: { key: string; theme: typeof themes[0]; x: number; y: number; scale: number; opacity: number; rot: number; z: number; focused: boolean; isCurrent: boolean }[] = [];
        for (let i = -VISIBLE_HALF; i <= VISIBLE_HALF; i++) {
          const rawIdx = centerIdx + i;
          const themeIdx = ((rawIdx % N) + N) % N;
          const theme = themes[themeIdx];
          const arcOffset = i - fractional;
          const angleDeg = arcOffset * ANGLE_STEP;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = ARC_RADIUS * Math.sin(angleRad);
          const y = -ARC_RADIUS * Math.cos(angleRad);
          const dist = Math.min(Math.abs(arcOffset) / VISIBLE_HALF, 1);
          arcCards.push({
            key: `${rawIdx}`,
            theme,
            x,
            y,
            scale: 1 - dist * 0.45,
            opacity: Math.max(1 - dist * 0.8, 0),
            rot: angleDeg * 0.3,
            z: VISIBLE_HALF + 1 - Math.round(Math.abs(arcOffset)),
            focused: Math.abs(arcOffset) < 0.4,
            isCurrent: theme.path === current,
          });
        }

        return (
          <div
            className={`ts-rolodex-overlay ${isOpen ? "ts-rolodex-open" : ""}`}
          >
            {/* Close */}
            <button
              className="ts-rolodex-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Theme info above arc */}
            <div className="ts-rolodex-info">
              <span className="ts-rolodex-name" style={{ color: focusedTheme.color }}>
                {focusedTheme.name}
              </span>
              <span className="ts-rolodex-num">
                {focusedThemeIdx + 1} / {N}
              </span>
              {focusedTheme.path === current && (
                <span className="ts-rolodex-badge">CURRENT</span>
              )}
            </div>

            {/* Touch area + arc */}
            <div
              className="ts-rolodex-touch"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="ts-rolodex-arc">
                {arcCards.map((card) => (
                  <div
                    key={card.key}
                    className={`ts-rolodex-card ${card.focused ? "ts-rolodex-card-focused" : ""}`}
                    style={{
                      transform: `translate(${card.x}px, ${card.y}px) translate(-50%, -50%) scale(${card.scale}) rotate(${card.rot}deg)`,
                      opacity: card.opacity,
                      zIndex: card.z,
                    }}
                  >
                    <div
                      className="ts-rolodex-icon"
                      style={{
                        borderColor: `${card.theme.color}${card.focused ? "bb" : "33"}`,
                        boxShadow: card.focused
                          ? `0 0 30px ${card.theme.color}40, 0 0 60px ${card.theme.color}18`
                          : "none",
                      }}
                    >
                      <span style={{ color: card.theme.color }}>{card.theme.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Swipe hint */}
            <div className="ts-rolodex-hint">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Swipe up to visit</span>
            </div>
          </div>
        );
      })()}

      {/* Trigger button */}
      <button className="ts-trigger" onClick={toggle} aria-label="Switch theme">
        <span
          className="ts-trigger-icon-char"
          style={{ color: currentTheme.color }}
        >
          {currentTheme.icon}
        </span>
        <span className="ts-trigger-name">{currentTheme.name}</span>
        <span className="ts-trigger-badge">
          {currentIndex + 1}/{themes.length}
        </span>
        <svg
          className={`ts-trigger-chevron ${isOpen ? "ts-chevron-open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M2 6.5L5 3.5L8 6.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
