"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

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

const ITEM_SIZE = 44;
const ITEM_GAP = 8;
const ITEM_STEP = ITEM_SIZE + ITEM_GAP;
const AUTO_NAV_DELAY = 1200;

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

  /* ─── Mobile carousel state ─── */
  const stripRef = useRef<HTMLDivElement>(null);
  const [focusedIdx, setFocusedIdx] = useState(currentIndex >= 0 ? currentIndex : 0);
  const autoNavTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(0);
  const countdownAnimRef = useRef(0);
  const isScrolling = useRef(false);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to current theme when strip opens
  useEffect(() => {
    if (isOpen && isMobile && stripRef.current) {
      const idx = currentIndex >= 0 ? currentIndex : 0;
      const containerWidth = stripRef.current.clientWidth;
      const scrollTarget = idx * ITEM_STEP - containerWidth / 2 + ITEM_SIZE / 2;
      stripRef.current.scrollTo({ left: scrollTarget, behavior: "instant" });
      setFocusedIdx(idx);
    }
  }, [isOpen, isMobile, currentIndex]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (autoNavTimer.current) clearTimeout(autoNavTimer.current);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
      cancelAnimationFrame(countdownAnimRef.current);
    };
  }, []);

  // Cancel auto-nav countdown
  const cancelAutoNav = useCallback(() => {
    if (autoNavTimer.current) {
      clearTimeout(autoNavTimer.current);
      autoNavTimer.current = null;
    }
    cancelAnimationFrame(countdownAnimRef.current);
    countdownRef.current = 0;
    setCountdown(0);
  }, []);

  // Start auto-nav countdown for focused theme
  const startAutoNav = useCallback(
    (idx: number) => {
      cancelAutoNav();
      const theme = themes[idx];
      if (!theme || theme.path === current) return;

      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / AUTO_NAV_DELAY, 1);
        countdownRef.current = progress;
        setCountdown(progress);
        if (progress < 1) {
          countdownAnimRef.current = requestAnimationFrame(animate);
        }
      };
      countdownAnimRef.current = requestAnimationFrame(animate);

      autoNavTimer.current = setTimeout(() => {
        router.push(theme.path);
        setIsOpen(false);
        countdownRef.current = 0;
        setCountdown(0);
      }, AUTO_NAV_DELAY);
    },
    [cancelAutoNav, current, router]
  );

  // Handle scroll to determine focused item
  const handleStripScroll = useCallback(() => {
    if (!stripRef.current) return;
    isScrolling.current = true;
    cancelAutoNav();

    const scrollLeft = stripRef.current.scrollLeft;
    const containerWidth = stripRef.current.clientWidth;
    const centerScroll = scrollLeft + containerWidth / 2;
    const idx = Math.round((centerScroll - ITEM_SIZE / 2) / ITEM_STEP);
    const clampedIdx = Math.max(0, Math.min(idx, themes.length - 1));
    setFocusedIdx(clampedIdx);

    // Detect scroll end
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      isScrolling.current = false;
      // Snap to nearest item
      if (stripRef.current) {
        const snapTarget = clampedIdx * ITEM_STEP - containerWidth / 2 + ITEM_SIZE / 2;
        stripRef.current.scrollTo({ left: snapTarget, behavior: "smooth" });
      }
      startAutoNav(clampedIdx);
    }, 120);
  }, [cancelAutoNav, startAutoNav]);

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
      if (e.key === "Escape") {
        cancelAutoNav();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, cancelAutoNav]);

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

  // Lock body scroll when mobile strip is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  const toggle = useCallback(() => {
    cancelAutoNav();
    setIsOpen((o) => !o);
  }, [cancelAutoNav]);

  const focusedTheme = themes[focusedIdx] || themes[0];

  /* ─── Countdown ring SVG ─── */
  const CountdownRing = useMemo(() => {
    if (countdown <= 0) return null;
    const r = 24;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - countdown);
    return (
      <svg
        width="54"
        height="54"
        viewBox="0 0 54 54"
        style={{
          position: "absolute",
          top: -5,
          left: -5,
          pointerEvents: "none",
        }}
      >
        <circle
          cx="27"
          cy="27"
          r={r}
          fill="none"
          stroke={focusedTheme.color}
          strokeWidth="2.5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 27 27)"
          style={{ transition: "stroke 0.2s" }}
        />
      </svg>
    );
  }, [countdown, focusedTheme.color]);

  return (
    <div
      ref={panelRef}
      className={`ts-wrap ${light ? "ts-light" : ""} ${isMobile ? "ts-wrap-mobile" : ""}`}
    >
      {/* ─── Desktop panel ─── */}
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

      {/* ─── Mobile carousel strip ─── */}
      {isMobile && isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            animation: "mobileStripFadeIn 0.25s ease",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelAutoNav();
              setIsOpen(false);
            }
          }}
        >
          {/* Theme info */}
          <div
            style={{
              textAlign: "center",
              paddingBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: focusedTheme.color,
                transition: "color 0.2s ease",
                lineHeight: 1.2,
              }}
            >
              {focusedTheme.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {focusedIdx + 1} / {themes.length}
              {focusedTheme.path === current && (
                <span
                  style={{
                    marginLeft: 8,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.08)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  CURRENT
                </span>
              )}
            </div>
          </div>

          {/* Scrollable strip */}
          <div
            ref={stripRef}
            onScroll={handleStripScroll}
            style={{
              display: "flex",
              gap: ITEM_GAP,
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: 20,
              paddingTop: 12,
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              maskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            {/* Spacer for centering first item */}
            <div style={{ minWidth: "calc(50vw - 22px)", flexShrink: 0 }} />
            {themes.map((theme, i) => {
              const isFocused = i === focusedIdx;
              const isCurrent = theme.path === current;
              const dist = Math.abs(i - focusedIdx);
              const scale = isFocused ? 1 : Math.max(0.65, 1 - dist * 0.08);
              const opacity = isFocused ? 1 : Math.max(0.3, 1 - dist * 0.15);

              return (
                <div
                  key={theme.path}
                  style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    flexShrink: 0,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: `2px solid ${
                      isFocused
                        ? `${theme.color}cc`
                        : isCurrent
                          ? `${theme.color}66`
                          : "rgba(255,255,255,0.08)"
                    }`,
                    background: isFocused
                      ? `${theme.color}15`
                      : "rgba(15,15,15,0.9)",
                    transform: `scale(${scale})`,
                    opacity,
                    transition:
                      "transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                    boxShadow: isFocused
                      ? `0 0 20px ${theme.color}30, 0 0 40px ${theme.color}10`
                      : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    cancelAutoNav();
                    router.push(theme.path);
                    setIsOpen(false);
                  }}
                >
                  {isFocused && CountdownRing}
                  <span
                    style={{
                      fontSize: isFocused ? 20 : 16,
                      color: theme.color,
                      lineHeight: 1,
                      transition: "font-size 0.2s ease",
                    }}
                  >
                    {theme.icon}
                  </span>
                  {isCurrent && !isFocused && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: theme.color,
                      }}
                    />
                  )}
                </div>
              );
            })}
            {/* Spacer for centering last item */}
            <div style={{ minWidth: "calc(50vw - 22px)", flexShrink: 0 }} />
          </div>

          {/* Close hint */}
          <div
            style={{
              textAlign: "center",
              paddingBottom: 28,
              paddingTop: 4,
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.06em",
            }}
          >
            {focusedTheme.path !== current
              ? "auto-loading..."
              : "tap anywhere to close"}
          </div>
        </div>
      )}

      {/* ─── Trigger button ─── */}
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

      {/* Mobile strip animation */}
      <style>{`
        @keyframes mobileStripFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        [style*="scrollbar-width"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
