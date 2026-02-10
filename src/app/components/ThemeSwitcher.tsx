"use client";

import Link from "next/link";
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
];

export default function ThemeSwitcher({
  current,
  variant = "dark",
}: {
  current: string;
  variant?: "dark" | "light";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const light = variant === "light";

  const currentTheme = themes.find((t) => t.path === current) || themes[0];
  const currentIndex = themes.findIndex((t) => t.path === current);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Scroll active theme into view when panel opens
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>("[data-active]");
    if (active) {
      requestAnimationFrame(() => {
        active.scrollIntoView({ block: "center", behavior: "instant" });
      });
    }
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((o) => !o), []);

  return (
    <div ref={panelRef} className={`ts-wrap ${light ? "ts-light" : ""}`}>
      {/* Expanded panel */}
      <div className={`ts-panel ${isOpen ? "ts-panel-open" : ""}`}>
        {/* Header */}
        <div className="ts-panel-header">
          <span className="ts-panel-title">Themes</span>
          <span className="ts-panel-count">{themes.length}</span>
        </div>

        {/* Scrollable theme list */}
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
                <span
                  className="ts-item-icon"
                  style={{ color: theme.color }}
                >
                  {theme.icon}
                </span>
                <span className="ts-item-name">{theme.name}</span>
                <span className="ts-item-num">{String(i + 1).padStart(2, "0")}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trigger button */}
      <button className="ts-trigger" onClick={toggle} aria-label="Switch theme">
        <span className="ts-trigger-icon-char" style={{ color: currentTheme.color }}>
          {currentTheme.icon}
        </span>
        <span className="ts-trigger-name">{currentTheme.name}</span>
        <span className="ts-trigger-badge">{currentIndex + 1}/{themes.length}</span>
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
