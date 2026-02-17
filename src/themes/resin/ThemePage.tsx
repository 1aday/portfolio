"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

/* ═══════════════════════════════════════════════════════════
   PALETTE
   ═══════════════════════════════════════════════════════════ */
const C = {
  bg: "#1A1005",
  amberGold: "#C8841A",
  honey: "#E8A833",
  lightAmber: "#F5D98A",
  darkInclusion: "#2A1A08",
  trappedAir: "rgba(255,255,255,0.125)",
  warmCream: "#FFF8E8",
  surface: "#231608",
  surfaceLight: "#30200C",
  border: "rgba(200,132,26,0.18)",
  borderHover: "rgba(200,132,26,0.35)",
  textPrimary: "#FFF8E8",
  textSecondary: "rgba(255,248,232,0.55)",
  textMuted: "rgba(255,248,232,0.3)",
  amberGlow: "rgba(200,132,26,0.25)",
  amberOverlay: "rgba(200,132,26,0.12)",
  deepAmber: "#A06A10",
  warmBlack: "#0F0A03",
};

/* ═══════════════════════════════════════════════════════════
   FONT HELPERS
   ═══════════════════════════════════════════════════════════ */
const playfair = `var(--font-playfair), "Georgia", serif`;
const inter = `var(--font-inter), system-ui, sans-serif`;
const jetbrains = `var(--font-jetbrains), "Courier New", monospace`;
const instrument = `var(--font-instrument), "Georgia", serif`;

/* ═══════════════════════════════════════════════════════════
   SPECIMEN ICONS — embedded silhouettes for each project
   ═══════════════════════════════════════════════════════════ */
const specimenIcons = [
  /* Dragonfly */ (
    <svg key="s0" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="12" rx="3" ry="4" fill="rgba(200,132,26,0.35)" />
      <line x1="24" y1="16" x2="24" y2="42" stroke="rgba(200,132,26,0.4)" strokeWidth="1.5" />
      <path d="M24 20 C16 14 8 16 6 22 C10 20 16 18 24 24" fill="rgba(200,132,26,0.15)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M24 20 C32 14 40 16 42 22 C38 20 32 18 24 24" fill="rgba(200,132,26,0.15)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M24 26 C18 22 10 24 8 28 C12 26 18 25 24 30" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <path d="M24 26 C30 22 38 24 40 28 C36 26 30 25 24 30" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
    </svg>
  ),
  /* Beetle */ (
    <svg key="s1" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="14" rx="5" ry="4" fill="rgba(200,132,26,0.25)" stroke="rgba(200,132,26,0.4)" strokeWidth="0.8" />
      <ellipse cx="24" cy="30" rx="10" ry="13" fill="rgba(200,132,26,0.2)" stroke="rgba(200,132,26,0.4)" strokeWidth="0.8" />
      <line x1="24" y1="18" x2="24" y2="43" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M18 22 C14 18 10 17 8 18" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M30 22 C34 18 38 17 40 18" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M16 28 C12 28 8 30 6 32" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M32 28 C36 28 40 30 42 32" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M17 34 C13 36 10 38 8 40" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M31 34 C35 36 38 38 40 40" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
    </svg>
  ),
  /* Fern leaf */ (
    <svg key="s2" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <path d="M24 4 C24 4 24 44 24 44" stroke="rgba(200,132,26,0.4)" strokeWidth="1.2" />
      <path d="M24 10 C20 8 14 9 12 12" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      <path d="M24 10 C28 8 34 9 36 12" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      <path d="M24 16 C19 14 12 15 10 19" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      <path d="M24 16 C29 14 36 15 38 19" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      <path d="M24 22 C18 20 11 22 9 26" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      <path d="M24 22 C30 20 37 22 39 26" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      <path d="M24 28 C19 27 13 28 11 32" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" fill="none" />
      <path d="M24 28 C29 27 35 28 37 32" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" fill="none" />
      <path d="M24 34 C21 33 16 34 14 37" stroke="rgba(200,132,26,0.2)" strokeWidth="0.6" fill="none" />
      <path d="M24 34 C27 33 32 34 34 37" stroke="rgba(200,132,26,0.2)" strokeWidth="0.6" fill="none" />
    </svg>
  ),
  /* Moth */ (
    <svg key="s3" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="24" rx="2.5" ry="8" fill="rgba(200,132,26,0.3)" />
      <path d="M24 18 C16 10 6 12 4 20 C8 18 16 16 24 22" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M24 18 C32 10 42 12 44 20 C40 18 32 16 24 22" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M24 28 C20 30 12 32 10 38 C14 36 20 32 24 30" fill="rgba(200,132,26,0.1)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <path d="M24 28 C28 30 36 32 38 38 C34 36 28 32 24 30" fill="rgba(200,132,26,0.1)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <circle cx="14" cy="16" r="2" fill="rgba(200,132,26,0.2)" />
      <circle cx="34" cy="16" r="2" fill="rgba(200,132,26,0.2)" />
      <line x1="22" y1="16" x2="18" y2="10" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
      <line x1="26" y1="16" x2="30" y2="10" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
    </svg>
  ),
  /* Seed pod */ (
    <svg key="s4" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="26" rx="8" ry="14" fill="rgba(200,132,26,0.18)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.8" />
      <path d="M20 18 C22 12 24 8 24 6 C24 8 26 12 28 18" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      <line x1="24" y1="14" x2="24" y2="40" stroke="rgba(200,132,26,0.2)" strokeWidth="0.5" />
      <path d="M20 22 C22 24 24 26 24 26" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <path d="M28 22 C26 24 24 26 24 26" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <path d="M19 28 C22 30 24 32 24 32" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <path d="M29 28 C26 30 24 32 24 32" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
    </svg>
  ),
  /* Ant */ (
    <svg key="s5" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="10" rx="4" ry="3.5" fill="rgba(200,132,26,0.25)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.6" />
      <ellipse cx="24" cy="20" rx="5" ry="5" fill="rgba(200,132,26,0.2)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.6" />
      <ellipse cx="24" cy="34" rx="6" ry="9" fill="rgba(200,132,26,0.18)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.6" />
      <line x1="20" y1="16" x2="12" y2="12" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <line x1="28" y1="16" x2="36" y2="12" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <line x1="19" y1="22" x2="10" y2="24" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <line x1="29" y1="22" x2="38" y2="24" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <line x1="19" y1="30" x2="10" y2="34" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <line x1="29" y1="30" x2="38" y2="34" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <line x1="21" y1="8" x2="16" y2="2" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
      <line x1="27" y1="8" x2="32" y2="2" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
    </svg>
  ),
  /* Flower */ (
    <svg key="s6" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <circle cx="24" cy="20" r="4" fill="rgba(200,132,26,0.25)" />
      <ellipse cx="24" cy="12" rx="3" ry="5" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <ellipse cx="31" cy="16" rx="3" ry="5" transform="rotate(60 31 16)" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <ellipse cx="31" cy="25" rx="3" ry="5" transform="rotate(120 31 25)" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <ellipse cx="24" cy="28" rx="3" ry="5" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <ellipse cx="17" cy="25" rx="3" ry="5" transform="rotate(-120 17 25)" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <ellipse cx="17" cy="16" rx="3" ry="5" transform="rotate(-60 17 16)" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <line x1="24" y1="30" x2="24" y2="44" stroke="rgba(200,132,26,0.3)" strokeWidth="1" />
      <path d="M24 36 C20 34 16 36 14 38" stroke="rgba(200,132,26,0.2)" strokeWidth="0.6" fill="none" />
    </svg>
  ),
  /* Scorpion */ (
    <svg key="s7" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="30" rx="7" ry="5" fill="rgba(200,132,26,0.2)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.6" />
      <ellipse cx="24" cy="36" rx="4" ry="3" fill="rgba(200,132,26,0.18)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
      <path d="M24 25 C24 20 22 14 18 10 C16 8 18 4 22 6" stroke="rgba(200,132,26,0.35)" strokeWidth="0.8" fill="none" />
      <circle cx="22" cy="6" r="1.5" fill="rgba(200,132,26,0.3)" />
      <path d="M18 28 C14 26 10 28 8 30" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <path d="M30 28 C34 26 38 28 40 30" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <path d="M18 32 C14 34 10 34 8 36" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <path d="M30 32 C34 34 38 34 40 36" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <path d="M20 36 C18 40 14 42 12 44" stroke="rgba(200,132,26,0.2)" strokeWidth="0.5" />
      <path d="M28 36 C30 40 34 42 36 44" stroke="rgba(200,132,26,0.2)" strokeWidth="0.5" />
    </svg>
  ),
  /* Spider */ (
    <svg key="s8" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="18" rx="5" ry="4" fill="rgba(200,132,26,0.25)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.6" />
      <ellipse cx="24" cy="28" rx="7" ry="8" fill="rgba(200,132,26,0.18)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.6" />
      <path d="M20 16 C16 10 10 6 6 4" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M28 16 C32 10 38 6 42 4" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M19 20 C14 18 8 16 4 16" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M29 20 C34 18 40 16 44 16" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M18 26 C12 28 6 32 4 36" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M30 26 C36 28 42 32 44 36" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M19 32 C14 36 10 42 8 46" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <path d="M29 32 C34 36 38 42 40 46" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
    </svg>
  ),
  /* Butterfly */ (
    <svg key="s9" viewBox="0 0 48 48" width="48" height="48" fill="none">
      <ellipse cx="24" cy="24" rx="2" ry="10" fill="rgba(200,132,26,0.3)" />
      <path d="M24 16 C16 8 4 10 4 20 C4 28 14 30 24 24" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M24 16 C32 8 44 10 44 20 C44 28 34 30 24 24" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" />
      <path d="M24 26 C18 30 10 34 8 40 C12 38 18 32 24 28" fill="rgba(200,132,26,0.1)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <path d="M24 26 C30 30 38 34 40 40 C36 38 30 32 24 28" fill="rgba(200,132,26,0.1)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <circle cx="12" cy="18" r="2.5" fill="rgba(200,132,26,0.15)" />
      <circle cx="36" cy="18" r="2.5" fill="rgba(200,132,26,0.15)" />
      <line x1="23" y1="14" x2="18" y2="8" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
      <line x1="25" y1="14" x2="30" y2="8" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
      <circle cx="18" cy="8" r="1" fill="rgba(200,132,26,0.25)" />
      <circle cx="30" cy="8" r="1" fill="rgba(200,132,26,0.25)" />
    </svg>
  ),
];

/* ═══════════════════════════════════════════════════════════
   EXPERTISE SILHOUETTES — larger embedded artifacts
   ═══════════════════════════════════════════════════════════ */
const expertiseArtifacts = [
  /* Trilobite */ (
    <svg key="ea0" viewBox="0 0 80 80" width="80" height="80" fill="none">
      <ellipse cx="40" cy="18" rx="16" ry="10" fill="rgba(200,132,26,0.15)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.8" />
      <rect x="24" y="26" width="32" height="8" rx="2" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <rect x="26" y="36" width="28" height="7" rx="2" fill="rgba(200,132,26,0.1)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.6" />
      <rect x="28" y="45" width="24" height="7" rx="2" fill="rgba(200,132,26,0.08)" stroke="rgba(200,132,26,0.2)" strokeWidth="0.6" />
      <ellipse cx="40" cy="60" rx="10" ry="6" fill="rgba(200,132,26,0.08)" stroke="rgba(200,132,26,0.2)" strokeWidth="0.6" />
      <line x1="40" y1="8" x2="40" y2="66" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <circle cx="34" cy="16" r="2" fill="rgba(200,132,26,0.2)" />
      <circle cx="46" cy="16" r="2" fill="rgba(200,132,26,0.2)" />
    </svg>
  ),
  /* Ammonite spiral */ (
    <svg key="ea1" viewBox="0 0 80 80" width="80" height="80" fill="none">
      <path d="M40 40 C40 30 48 24 56 28 C64 32 64 44 56 48 C48 52 36 50 34 42 C32 34 38 26 48 24 C58 22 68 30 68 42 C68 54 56 64 44 64 C32 64 22 54 22 42 C22 28 34 18 48 18" stroke="rgba(200,132,26,0.3)" strokeWidth="1" fill="none" />
      <circle cx="40" cy="40" r="3" fill="rgba(200,132,26,0.2)" />
    </svg>
  ),
  /* Prehistoric plant */ (
    <svg key="ea2" viewBox="0 0 80 80" width="80" height="80" fill="none">
      <line x1="40" y1="72" x2="40" y2="12" stroke="rgba(200,132,26,0.3)" strokeWidth="1.2" />
      <path d="M40 16 C32 12 22 14 18 22" stroke="rgba(200,132,26,0.25)" strokeWidth="0.8" fill="none" />
      <path d="M40 16 C48 12 58 14 62 22" stroke="rgba(200,132,26,0.25)" strokeWidth="0.8" fill="none" />
      <path d="M40 26 C30 22 18 26 14 34" stroke="rgba(200,132,26,0.25)" strokeWidth="0.8" fill="none" />
      <path d="M40 26 C50 22 62 26 66 34" stroke="rgba(200,132,26,0.25)" strokeWidth="0.8" fill="none" />
      <path d="M40 36 C32 34 22 36 18 44" stroke="rgba(200,132,26,0.2)" strokeWidth="0.7" fill="none" />
      <path d="M40 36 C48 34 58 36 62 44" stroke="rgba(200,132,26,0.2)" strokeWidth="0.7" fill="none" />
      <path d="M40 46 C34 44 26 46 22 52" stroke="rgba(200,132,26,0.18)" strokeWidth="0.6" fill="none" />
      <path d="M40 46 C46 44 54 46 58 52" stroke="rgba(200,132,26,0.18)" strokeWidth="0.6" fill="none" />
      <path d="M40 56 C36 55 30 56 28 60" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" fill="none" />
      <path d="M40 56 C44 55 50 56 52 60" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" fill="none" />
    </svg>
  ),
  /* DNA helix */ (
    <svg key="ea3" viewBox="0 0 80 80" width="80" height="80" fill="none">
      <path d="M28 8 C28 16 52 24 52 32 C52 40 28 48 28 56 C28 64 52 72 52 72" stroke="rgba(200,132,26,0.3)" strokeWidth="0.9" fill="none" />
      <path d="M52 8 C52 16 28 24 28 32 C28 40 52 48 52 56 C52 64 28 72 28 72" stroke="rgba(200,132,26,0.3)" strokeWidth="0.9" fill="none" />
      <line x1="30" y1="12" x2="50" y2="12" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <line x1="34" y1="20" x2="46" y2="20" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <line x1="46" y1="28" x2="34" y2="28" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <line x1="50" y1="36" x2="30" y2="36" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <line x1="46" y1="44" x2="34" y2="44" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <line x1="34" y1="52" x2="46" y2="52" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <line x1="30" y1="60" x2="50" y2="60" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
      <line x1="34" y1="68" x2="46" y2="68" stroke="rgba(200,132,26,0.15)" strokeWidth="0.5" />
    </svg>
  ),
];

/* ═══════════════════════════════════════════════════════════
   INLINE SVG COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/** Amber specimen shape — organic rounded rectangle with translucent gradient */
function AmberSpecimen({
  width = 300,
  height = 400,
  children,
  className,
  style,
}: {
  width?: number;
  height?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const id = `amber-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={className} style={{ position: "relative", width, height, ...style }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="rgba(232,168,51,0.35)" />
            <stop offset="40%" stopColor="rgba(200,132,26,0.2)" />
            <stop offset="100%" stopColor="rgba(160,106,16,0.15)" />
          </linearGradient>
          <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="rgba(245,217,138,0.3)" />
            <stop offset="50%" stopColor="rgba(245,217,138,0)" />
            <stop offset="100%" stopColor="rgba(245,217,138,0.1)" />
          </linearGradient>
          <filter id={`${id}-glow`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>
        {/* Amber body */}
        <rect
          x="8"
          y="8"
          width={width - 16}
          height={height - 16}
          rx={Math.min(width, height) * 0.12}
          fill={`url(#${id}-grad)`}
          stroke="rgba(200,132,26,0.25)"
          strokeWidth="1.5"
        />
        {/* Top-left shine */}
        <rect
          x="8"
          y="8"
          width={width - 16}
          height={height - 16}
          rx={Math.min(width, height) * 0.12}
          fill={`url(#${id}-shine)`}
        />
        {/* Inner warm glow */}
        <rect
          x={width * 0.15}
          y={height * 0.15}
          width={width * 0.7}
          height={height * 0.7}
          rx={Math.min(width, height) * 0.08}
          fill="rgba(200,132,26,0.08)"
          filter={`url(#${id}-glow)`}
        />
      </svg>
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/** Floating air bubbles */
function AirBubbles({ count = 8, area = { w: 300, h: 400 } }: { count?: number; area?: { w: number; h: number } }) {
  const [bubbles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * area.w,
      y: Math.random() * area.h,
      r: 1.5 + Math.random() * 4,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 3,
    }))
  );
  return (
    <svg
      viewBox={`0 0 ${area.w} ${area.h}`}
      width={area.w}
      height={area.h}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {bubbles.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r={b.r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
          className="air-bubble"
          style={{
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
    </svg>
  );
}

/** Amber drip SVG */
function AmberDrip({ width = 60, height = 120 }: { width?: number; height?: number }) {
  return (
    <svg viewBox="0 0 60 120" width={width} height={height} fill="none">
      <defs>
        <linearGradient id="drip-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="rgba(200,132,26,0.5)" />
          <stop offset="60%" stopColor="rgba(200,132,26,0.3)" />
          <stop offset="100%" stopColor="rgba(200,132,26,0.15)" />
        </linearGradient>
      </defs>
      <path
        d="M15 0 C15 0 10 30 10 50 C10 60 8 75 12 88 C14 94 18 100 22 106 C26 112 28 116 30 120 C32 116 34 112 38 106 C42 100 46 94 48 88 C52 75 50 60 50 50 C50 30 45 0 45 0 Z"
        fill="url(#drip-grad)"
        stroke="rgba(200,132,26,0.35)"
        strokeWidth="0.8"
      />
      <ellipse cx="30" cy="50" rx="8" ry="4" fill="rgba(245,217,138,0.15)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION WRAPPER
   ═══════════════════════════════════════════════════════════ */
function Section({
  children,
  className = "",
  style,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════
   AMBER CARD — project card with translucent overlay
   ═══════════════════════════════════════════════════════════ */
function AmberCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const specimen = specimenIcons[index % specimenIcons.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: C.surface,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        boxShadow: hovered
          ? `0 0 40px rgba(200,132,26,0.15), inset 0 0 30px rgba(200,132,26,0.05)`
          : `0 4px 24px rgba(0,0,0,0.3)`,
        cursor: "pointer",
      }}
    >
      {/* Amber overlay that lifts on scroll/hover */}
      <motion.div
        animate={{
          opacity: hovered ? 0.03 : 0.18,
          y: hovered ? -8 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: `linear-gradient(135deg, rgba(200,132,26,0.25) 0%, rgba(232,168,51,0.15) 40%, rgba(160,106,16,0.2) 100%)`,
          borderRadius: 16,
          pointerEvents: "none",
        }}
      />

      {/* Air bubbles */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", overflow: "hidden" }}>
        <AirBubbles count={5} area={{ w: 400, h: 500 }} />
      </div>

      {/* Specimen silhouette watermark */}
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 1,
          opacity: hovered ? 0.6 : 0.25,
          transition: "opacity 0.4s ease",
          transform: "scale(1.2)",
        }}
      >
        {specimen}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "28px 24px 24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <span
            style={{
              fontFamily: jetbrains,
              fontSize: 10,
              letterSpacing: "0.12em",
              color: C.amberGold,
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            Specimen {String(index + 1).padStart(3, "0")}
          </span>
          <span
            style={{
              fontFamily: jetbrains,
              fontSize: 10,
              color: C.textMuted,
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: playfair,
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
            color: C.warmCream,
            whiteSpace: "pre-line",
            marginBottom: 6,
          }}
        >
          {project.title}
        </h3>

        {/* Client */}
        <p
          style={{
            fontFamily: inter,
            fontSize: 11,
            letterSpacing: "0.06em",
            color: C.honey,
            textTransform: "uppercase",
            marginBottom: 16,
            opacity: 0.7,
          }}
        >
          {project.client}
        </p>

        {/* Description */}
        <p
          style={{
            fontFamily: inter,
            fontSize: 13,
            lineHeight: 1.65,
            color: C.textSecondary,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>

        {/* Technical note */}
        <p
          style={{
            fontFamily: inter,
            fontSize: 12,
            lineHeight: 1.55,
            color: C.textMuted,
            marginBottom: 20,
            fontStyle: "italic",
          }}
        >
          {project.technical}
        </p>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.amberGold}40, transparent)`,
            marginBottom: 16,
          }}
        />

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: jetbrains,
                fontSize: 10,
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(200,132,26,0.1)",
                border: "1px solid rgba(200,132,26,0.2)",
                color: C.lightAmber,
                letterSpacing: "0.03em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* GitHub link */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: jetbrains,
            fontSize: 11,
            color: C.amberGold,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            opacity: 0.7,
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View Source
        </a>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERTISE SPECIMEN CARD
   ═══════════════════════════════════════════════════════════ */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const artifact = expertiseArtifacts[index % expertiseArtifacts.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        padding: "36px 28px 32px",
        background: `linear-gradient(145deg, ${C.surface} 0%, ${C.darkInclusion} 100%)`,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        transition: "border-color 0.4s, box-shadow 0.4s",
        boxShadow: hovered
          ? `0 0 50px rgba(200,132,26,0.12), inset 0 0 40px rgba(200,132,26,0.04)`
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Amber overlay */}
      <motion.div
        animate={{ opacity: hovered ? 0.04 : 0.14 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, rgba(200,132,26,0.22) 0%, rgba(160,106,16,0.12) 100%)`,
          pointerEvents: "none",
          borderRadius: 20,
        }}
      />

      {/* Artifact watermark */}
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          opacity: hovered ? 0.45 : 0.15,
          transition: "opacity 0.4s",
          transform: "scale(1.1)",
        }}
      >
        {artifact}
      </div>

      {/* Air bubbles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <AirBubbles count={4} area={{ w: 350, h: 300 }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <span
          style={{
            fontFamily: jetbrains,
            fontSize: 10,
            color: C.amberGold,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
            display: "block",
            opacity: 0.7,
          }}
        >
          Inclusion {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          style={{
            fontFamily: playfair,
            fontSize: 22,
            fontWeight: 700,
            color: C.warmCream,
            marginBottom: 14,
            lineHeight: 1.25,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: inter,
            fontSize: 13,
            lineHeight: 1.7,
            color: C.textSecondary,
          }}
        >
          {item.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOOL GEM COMPONENT
   ═══════════════════════════════════════════════════════════ */
function ToolGem({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);

  const gemColors = [
    "rgba(200,132,26,0.35)",
    "rgba(232,168,51,0.3)",
    "rgba(160,106,16,0.35)",
    "rgba(245,217,138,0.25)",
    "rgba(200,132,26,0.3)",
    "rgba(232,168,51,0.35)",
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 14,
        padding: "24px 20px 20px",
        background: `linear-gradient(155deg, ${C.surface} 0%, ${C.darkInclusion} 100%)`,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        transition: "all 0.35s ease",
        boxShadow: hovered
          ? `0 0 30px rgba(200,132,26,0.12)`
          : "0 2px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Velvet interior glow */}
      <div
        style={{
          position: "absolute",
          inset: 4,
          borderRadius: 10,
          background: `radial-gradient(ellipse at 50% 30%, ${gemColors[index]} 0%, transparent 70%)`,
          pointerEvents: "none",
          opacity: hovered ? 0.8 : 0.4,
          transition: "opacity 0.4s",
        }}
      />

      {/* Label */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          {/* Small gem icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1 L12 5 L7 13 L2 5 Z"
              fill={hovered ? C.amberGold : "rgba(200,132,26,0.4)"}
              stroke="rgba(200,132,26,0.5)"
              strokeWidth="0.5"
              style={{ transition: "fill 0.3s" }}
            />
            <line x1="2" y1="5" x2="12" y2="5" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5" />
            <line x1="7" y1="1" x2="7" y2="13" stroke="rgba(200,132,26,0.15)" strokeWidth="0.4" />
          </svg>
          <span
            style={{
              fontFamily: jetbrains,
              fontSize: 11,
              fontWeight: 600,
              color: C.amberGold,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {tool.label}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tool.items.map((item) => (
            <span
              key={item}
              style={{
                fontFamily: inter,
                fontSize: 12,
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(200,132,26,0.08)",
                border: "1px solid rgba(200,132,26,0.15)",
                color: C.lightAmber,
                transition: "all 0.3s",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO AMBER SPECIMEN SVG — large display piece
   ═══════════════════════════════════════════════════════════ */
function HeroAmberSpecimen() {
  return (
    <svg viewBox="0 0 420 520" width="420" height="520" fill="none" style={{ filter: "drop-shadow(0 0 40px rgba(200,132,26,0.2))" }}>
      <defs>
        <linearGradient id="hero-amber-grad" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="rgba(245,217,138,0.4)" />
          <stop offset="25%" stopColor="rgba(232,168,51,0.3)" />
          <stop offset="50%" stopColor="rgba(200,132,26,0.25)" />
          <stop offset="75%" stopColor="rgba(160,106,16,0.2)" />
          <stop offset="100%" stopColor="rgba(42,26,8,0.35)" />
        </linearGradient>
        <linearGradient id="hero-amber-shine" x1="0" y1="0" x2="0.8" y2="0.4">
          <stop offset="0%" stopColor="rgba(255,248,232,0.35)" />
          <stop offset="30%" stopColor="rgba(255,248,232,0.1)" />
          <stop offset="100%" stopColor="rgba(255,248,232,0)" />
        </linearGradient>
        <radialGradient id="hero-amber-inner" cx="0.45" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="rgba(232,168,51,0.15)" />
          <stop offset="100%" stopColor="rgba(200,132,26,0)" />
        </radialGradient>
        <filter id="hero-amber-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
        </filter>
      </defs>

      {/* Outer amber body */}
      <rect x="20" y="20" width="380" height="480" rx="55" fill="url(#hero-amber-grad)" stroke="rgba(200,132,26,0.3)" strokeWidth="2" />

      {/* Top-left shine highlight */}
      <rect x="20" y="20" width="380" height="480" rx="55" fill="url(#hero-amber-shine)" />

      {/* Inner warm glow */}
      <rect x="60" y="70" width="300" height="380" rx="35" fill="url(#hero-amber-inner)" filter="url(#hero-amber-glow)" />

      {/* Embedded dragonfly silhouette */}
      <g transform="translate(130, 140) scale(3.2)" opacity="0.35">
        <ellipse cx="24" cy="12" rx="3" ry="4" fill="rgba(200,132,26,0.4)" />
        <line x1="24" y1="16" x2="24" y2="42" stroke="rgba(200,132,26,0.5)" strokeWidth="1.5" />
        <path d="M24 20 C16 14 8 16 6 22 C10 20 16 18 24 24" fill="rgba(200,132,26,0.15)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.7" />
        <path d="M24 20 C32 14 40 16 42 22 C38 20 32 18 24 24" fill="rgba(200,132,26,0.15)" stroke="rgba(200,132,26,0.35)" strokeWidth="0.7" />
        <path d="M24 26 C18 22 10 24 8 28 C12 26 18 25 24 30" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
        <path d="M24 26 C30 22 38 24 40 28 C36 26 30 25 24 30" fill="rgba(200,132,26,0.12)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      </g>

      {/* Embedded leaf */}
      <g transform="translate(60, 320) scale(2) rotate(-25)" opacity="0.2">
        <path d="M24 4 C24 4 24 44 24 44" stroke="rgba(200,132,26,0.4)" strokeWidth="1.2" />
        <path d="M24 10 C20 8 14 9 12 12" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
        <path d="M24 10 C28 8 34 9 36 12" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
        <path d="M24 16 C19 14 12 15 10 19" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
        <path d="M24 16 C29 14 36 15 38 19" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
        <path d="M24 22 C18 20 11 22 9 26" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
        <path d="M24 22 C30 20 37 22 39 26" stroke="rgba(200,132,26,0.3)" strokeWidth="0.7" fill="none" />
      </g>

      {/* Trapped air bubbles */}
      <circle cx="90" cy="100" r="6" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" className="air-bubble" style={{ animationDelay: "0s" }} />
      <circle cx="310" cy="150" r="3.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" className="air-bubble" style={{ animationDelay: "1s" }} />
      <circle cx="140" cy="380" r="5" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.5" className="air-bubble" style={{ animationDelay: "2s" }} />
      <circle cx="280" cy="420" r="4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" className="air-bubble" style={{ animationDelay: "0.5s" }} />
      <circle cx="200" cy="80" r="2.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" className="air-bubble" style={{ animationDelay: "1.5s" }} />
      <circle cx="340" cy="300" r="3" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" className="air-bubble" style={{ animationDelay: "3s" }} />
      <circle cx="75" cy="260" r="4.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" className="air-bubble" style={{ animationDelay: "2.5s" }} />
      <circle cx="250" cy="220" r="2" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" className="air-bubble" style={{ animationDelay: "1.8s" }} />

      {/* Edge facet lines */}
      <path d="M40 60 Q50 40 80 30" stroke="rgba(245,217,138,0.15)" strokeWidth="0.5" fill="none" />
      <path d="M360 60 Q370 45 380 80" stroke="rgba(245,217,138,0.1)" strokeWidth="0.4" fill="none" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAGNIFYING LENS SVG — decorative element
   ═══════════════════════════════════════════════════════════ */
function MagnifyingLens() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" fill="none" style={{ opacity: 0.2 }}>
      <circle cx="50" cy="50" r="35" stroke="rgba(200,132,26,0.5)" strokeWidth="2" fill="rgba(200,132,26,0.05)" />
      <circle cx="50" cy="50" r="32" stroke="rgba(200,132,26,0.2)" strokeWidth="0.5" fill="none" />
      <line x1="75" y1="75" x2="110" y2="110" stroke="rgba(200,132,26,0.5)" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="40" cy="40" rx="12" ry="8" transform="rotate(-30 40 40)" fill="rgba(245,217,138,0.08)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ResinPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <style>{`
        @keyframes amber-glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(200,132,26,0.2));
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(200,132,26,0.35));
          }
        }

        @keyframes air-bubble-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-4px) translateX(2px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-2px) translateX(-1px);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-6px) translateX(1px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
        }

        @keyframes golden-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes amber-drip {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }

        @keyframes warm-breathe {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }

        @keyframes specimen-reveal {
          0% {
            clip-path: inset(0 0 100% 0);
          }
          100% {
            clip-path: inset(0 0 0% 0);
          }
        }

        @keyframes gentle-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .air-bubble {
          animation: air-bubble-float 4s ease-in-out infinite;
        }

        .amber-glow-anim {
          animation: amber-glow-pulse 4s ease-in-out infinite;
        }

        .golden-shimmer-text {
          background: linear-gradient(
            90deg,
            rgba(200,132,26,1) 0%,
            rgba(245,217,138,1) 40%,
            rgba(232,168,51,1) 60%,
            rgba(200,132,26,1) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: golden-shimmer 4s linear infinite;
        }

        .amber-drip-anim {
          animation: amber-drip 6s ease-in-out infinite;
        }

        .warm-breathe {
          animation: warm-breathe 5s ease-in-out infinite;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${C.warmBlack};
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(200,132,26,0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(200,132,26,0.5);
        }

        ::selection {
          background: rgba(200,132,26,0.3);
          color: ${C.warmCream};
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.textPrimary,
          fontFamily: inter,
          overflowX: "hidden",
          position: "relative",
        }}
      >
        {/* ═══ BACKGROUND TEXTURE ═══ */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: `
              radial-gradient(ellipse 800px 600px at 20% 10%, rgba(200,132,26,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 600px 800px at 80% 60%, rgba(160,106,16,0.04) 0%, transparent 60%),
              radial-gradient(ellipse 400px 400px at 50% 90%, rgba(200,132,26,0.03) 0%, transparent 50%)
            `,
          }}
        />

        {/* Subtle noise texture overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ═══════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px 60px",
            zIndex: 1,
          }}
        >
          {/* Museum header bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: "absolute",
              top: 32,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 48px",
            }}
          >
            <span
              style={{
                fontFamily: jetbrains,
                fontSize: 10,
                letterSpacing: "0.2em",
                color: C.textMuted,
                textTransform: "uppercase",
              }}
            >
              Grox Natural History Collection
            </span>
            <span
              style={{
                fontFamily: jetbrains,
                fontSize: 10,
                letterSpacing: "0.15em",
                color: C.textMuted,
                textTransform: "uppercase",
              }}
            >
              Est. 2024
            </span>
          </motion.div>

          {/* Main hero layout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 80,
              maxWidth: 1200,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {/* Left: Amber specimen */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="amber-glow-anim"
              style={{ flexShrink: 0 }}
            >
              <HeroAmberSpecimen />
            </motion.div>

            {/* Right: Text content */}
            <div style={{ flex: 1, minWidth: 320, maxWidth: 520 }}>
              {/* Catalog label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                style={{
                  fontFamily: jetbrains,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: C.amberGold,
                  textTransform: "uppercase",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ display: "inline-block", width: 32, height: 1, background: C.amberGold, opacity: 0.5 }} />
                Catalog No. GNH-2025-001
              </motion.div>

              {/* RESIN title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.6 }}
                className="golden-shimmer-text"
                style={{
                  fontFamily: playfair,
                  fontSize: "clamp(64px, 10vw, 110px)",
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  marginBottom: 24,
                }}
              >
                RESIN
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.8 }}
                style={{
                  fontFamily: instrument,
                  fontSize: 20,
                  lineHeight: 1.5,
                  color: C.honey,
                  marginBottom: 12,
                  fontStyle: "italic",
                }}
              >
                Amber Preservation Art
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.9 }}
                style={{
                  fontFamily: inter,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: C.textSecondary,
                  marginBottom: 40,
                  maxWidth: 440,
                }}
              >
                Each project preserved in ancient amber -- a living fossil of code,
                design, and innovation, trapped in translucent golden time.
              </motion.p>

              {/* Stats as specimen catalog numbers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 1.0 }}
                style={{ display: "flex", gap: 40 }}
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={mounted ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
                    style={{ textAlign: "left" }}
                  >
                    <div
                      style={{
                        fontFamily: playfair,
                        fontSize: 36,
                        fontWeight: 700,
                        color: C.amberGold,
                        lineHeight: 1,
                        marginBottom: 4,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: jetbrains,
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        color: C.textMuted,
                        textTransform: "uppercase",
                      }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 1.5 }}
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: jetbrains,
                fontSize: 9,
                letterSpacing: "0.2em",
                color: C.textMuted,
                textTransform: "uppercase",
              }}
            >
              Explore Collection
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <rect x="5" y="0" width="6" height="14" rx="3" stroke="rgba(200,132,26,0.3)" strokeWidth="1" />
                <circle cx="8" cy="6" r="1.5" fill="rgba(200,132,26,0.4)" />
                <path d="M4 18 L8 22 L12 18" stroke="rgba(200,132,26,0.3)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════
            PROJECTS SECTION
            ═══════════════════════════════════════════════════ */}
        <Section
          id="projects"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "100px 24px 120px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontFamily: jetbrains,
                fontSize: 11,
                letterSpacing: "0.25em",
                color: C.amberGold,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Preserved Specimens
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: playfair,
                fontSize: "clamp(36px, 5vw, 52px)",
                fontWeight: 700,
                color: C.warmCream,
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              The Collection
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                height: 1,
                maxWidth: 120,
                margin: "0 auto",
                background: `linear-gradient(90deg, transparent, ${C.amberGold}, transparent)`,
              }}
            />
          </div>

          {/* Project grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 28,
            }}
          >
            {projects.map((project, i) => (
              <AmberCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════
            EXPERTISE SECTION
            ═══════════════════════════════════════════════════ */}
        <Section
          id="expertise"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "100px 24px 120px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {/* Decorative magnifying lens */}
          <div style={{ position: "absolute", top: 60, right: 40, pointerEvents: "none" }}>
            <MagnifyingLens />
          </div>

          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontFamily: jetbrains,
                fontSize: 11,
                letterSpacing: "0.25em",
                color: C.amberGold,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Rare Inclusions
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: playfair,
                fontSize: "clamp(36px, 5vw, 48px)",
                fontWeight: 700,
                color: C.warmCream,
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              Expertise
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                height: 1,
                maxWidth: 100,
                margin: "0 auto",
                background: `linear-gradient(90deg, transparent, ${C.amberGold}, transparent)`,
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {expertise.map((item, i) => (
              <ExpertiseCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════
            TOOLS SECTION — Jeweler's display case
            ═══════════════════════════════════════════════════ */}
        <Section
          id="tools"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "100px 24px 120px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontFamily: jetbrains,
                fontSize: 11,
                letterSpacing: "0.25em",
                color: C.amberGold,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Specimen Analysis Tools
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: playfair,
                fontSize: "clamp(36px, 5vw, 48px)",
                fontWeight: 700,
                color: C.warmCream,
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              Toolkit
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                height: 1,
                maxWidth: 100,
                margin: "0 auto",
                background: `linear-gradient(90deg, transparent, ${C.amberGold}, transparent)`,
              }}
            />
          </div>

          {/* Velvet-lined display case container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              borderRadius: 24,
              padding: 4,
              background: `linear-gradient(135deg, rgba(200,132,26,0.2) 0%, rgba(160,106,16,0.1) 100%)`,
            }}
          >
            {/* Inner velvet */}
            <div
              style={{
                borderRadius: 20,
                padding: "36px 28px",
                background: `linear-gradient(180deg, ${C.darkInclusion} 0%, ${C.warmBlack} 100%)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Velvet texture line */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 48px,
                    rgba(200,132,26,0.03) 48px,
                    rgba(200,132,26,0.03) 49px
                  )`,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 20,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {tools.map((tool, i) => (
                  <ToolGem key={tool.label} tool={tool} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </Section>

        {/* ═══════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════ */}
        <footer
          style={{
            position: "relative",
            zIndex: 1,
            padding: "80px 24px 48px",
            textAlign: "center",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {/* Amber drip formation */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              marginBottom: 48,
              position: "relative",
              top: -40,
            }}
          >
            {[0.8, 1, 0.6, 0.9, 0.5].map((scale, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                style={{ transform: `scale(${scale})` }}
              >
                <AmberDrip width={Math.round(40 * scale)} height={Math.round(90 * scale)} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Preserved for eternity text */}
            <h3
              className="golden-shimmer-text"
              style={{
                fontFamily: playfair,
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 700,
                marginBottom: 20,
                letterSpacing: "0.08em",
              }}
            >
              PRESERVED FOR ETERNITY
            </h3>

            {/* Museum catalog info */}
            <div
              style={{
                fontFamily: jetbrains,
                fontSize: 10,
                letterSpacing: "0.15em",
                color: C.textMuted,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Catalog Reference GNH-2025-AMB-{String(projects.length).padStart(3, "0")}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 28,
              }}
            >
              <div style={{ width: 40, height: 1, background: `${C.amberGold}40` }} />
              <span
                style={{
                  fontFamily: instrument,
                  fontSize: 16,
                  color: C.honey,
                  fontStyle: "italic",
                }}
              >
                Grox Natural History
              </span>
              <div style={{ width: 40, height: 1, background: `${C.amberGold}40` }} />
            </div>

            {/* Pentagon icon */}
            <div style={{ marginBottom: 24 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 2 L29 11 L24 27 L8 27 L3 11 Z"
                  fill="none"
                  stroke={C.amberGold}
                  strokeWidth="1"
                  opacity="0.4"
                />
                <path
                  d="M16 8 L23 13 L20 23 L12 23 L9 13 Z"
                  fill="rgba(200,132,26,0.15)"
                  stroke={C.amberGold}
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Copyright */}
            <p
              style={{
                fontFamily: inter,
                fontSize: 12,
                color: C.textMuted,
                marginBottom: 8,
              }}
            >
              Amber Preservation Art Collection
            </p>
            <p
              style={{
                fontFamily: jetbrains,
                fontSize: 10,
                color: C.textMuted,
                opacity: 0.5,
              }}
            >
              {new Date().getFullYear()} -- All specimens carefully preserved
            </p>
          </motion.div>
        </footer>

        {/* ═══ THEME SWITCHER ═══ */}
        <ThemeSwitcher current="/resin" variant="dark" />
      </div>
    </>
  );
}
