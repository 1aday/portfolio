"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Constants ─── */
const COLORS = {
  cream: "#F5EFE6",
  tape: "#2D2D2D",
  coral: "#FF6B6B",
  teal: "#4ECDC4",
  yellow: "#FFE66D",
  text: "#1A1A1A",
  hub: "#6B6B6B",
  magnetic: "#3D2B1F",
  creamDark: "#E8E0D4",
  labelBg: "#FFF5F5",
};

const TRACK_DURATIONS = [
  "3:42", "4:15", "2:58", "5:01", "3:27",
  "4:33", "3:08", "5:22", "2:47", "4:09",
];

const ANNOTATIONS = [
  "favorite!",
  "\u2605\u2605\u2605",
  "so good \u2192",
  "replay!!",
  "classic",
  "\u2764",
  "fire",
  "best one",
  "wow",
  "chef's kiss",
];

/* ─── Helper: track label ─── */
function trackLabel(i: number) {
  return i < 5 ? `A${i + 1}` : `B${i - 4}`;
}

/* ─── Equalizer Bars Component ─── */
function EqualizerBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-4 ml-2">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm"
          style={{
            backgroundColor: COLORS.coral,
            height: active ? undefined : "3px",
            animation: active
              ? `eqBounce ${0.3 + i * 0.1}s ease-in-out infinite alternate`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Tape Counter Component ─── */
function TapeCounter({ value }: { value: number }) {
  const display = String(value).padStart(4, "0");
  return (
    <div className="flex gap-[2px]">
      {display.split("").map((digit, i) => (
        <div
          key={i}
          className="w-6 h-8 flex items-center justify-center rounded-sm"
          style={{
            backgroundColor: COLORS.tape,
            color: "#EEEEEE",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.02em",
            border: "1px solid #444",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          {digit}
        </div>
      ))}
    </div>
  );
}

/* ─── Play Controls Component ─── */
function PlayControls({
  playing,
  onToggle,
}: {
  playing: boolean;
  onToggle: () => void;
}) {
  const buttons = [
    { label: "\u23EA", title: "Rewind" },
    { label: "\u25C0\u25C0", title: "Fast Rewind" },
    { label: playing ? "\u275A\u275A" : "\u25B6", title: "Play/Pause", main: true },
    { label: "\u25B6\u25B6", title: "Fast Forward" },
    { label: "\u23E9", title: "Forward" },
    { label: "\u23CF", title: "Eject" },
  ];

  return (
    <div className="flex items-center gap-2">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={btn.main ? onToggle : undefined}
          title={btn.title}
          className="transition-all duration-150 active:scale-95 select-none"
          style={{
            width: btn.main ? 48 : 36,
            height: btn.main ? 48 : 36,
            borderRadius: btn.main ? "50%" : "6px",
            backgroundColor: btn.main ? COLORS.coral : COLORS.tape,
            color: btn.main ? "#FFF" : "#BBB",
            border: btn.main
              ? `2px solid ${COLORS.yellow}`
              : "1px solid #444",
            fontSize: btn.main ? "18px" : "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: btn.main ? "pointer" : "default",
            boxShadow: btn.main
              ? "0 2px 8px rgba(255,107,107,0.4)"
              : "inset 0 1px 2px rgba(0,0,0,0.4)",
            animation: btn.main && playing
              ? "playPulse 2s ease-in-out infinite"
              : "none",
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Cassette SVG Component ─── */
function CassetteSVG({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="0 0 440 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[440px]"
      aria-label="Cassette tape illustration"
    >
      {/* Body */}
      <rect
        x="10"
        y="10"
        width="420"
        height="260"
        rx="12"
        fill={COLORS.tape}
        stroke="#444"
        strokeWidth="2"
      />
      {/* Inner bezel */}
      <rect
        x="20"
        y="20"
        width="400"
        height="240"
        rx="8"
        fill="none"
        stroke="#3A3A3A"
        strokeWidth="1"
      />

      {/* Screw holes */}
      {[
        [30, 30],
        [410, 30],
        [30, 250],
        [410, 250],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="6" fill="#1A1A1A" stroke="#555" strokeWidth="1" />
          <line
            x1={cx - 3}
            y1={cy}
            x2={cx + 3}
            y2={cy}
            stroke="#555"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Label area */}
      <rect
        x="60"
        y="40"
        width="320"
        height="120"
        rx="4"
        fill={COLORS.coral}
        stroke="#E05555"
        strokeWidth="1"
      />
      {/* Label lines */}
      {[65, 80, 95, 110, 125, 140].map((y) => (
        <line
          key={y}
          x1="80"
          y1={y}
          x2="360"
          y2={y}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.5"
        />
      ))}
      {/* Label text */}
      <text
        x="220"
        y="78"
        textAnchor="middle"
        fill="#FFF"
        fontSize="18"
        fontWeight="700"
        fontFamily="var(--font-space-grotesk)"
      >
        GROX MIXTAPE VOL.1
      </text>
      <text
        x="220"
        y="100"
        textAnchor="middle"
        fill="rgba(255,255,255,0.8)"
        fontSize="11"
        fontFamily="var(--font-inter)"
      >
        AI PRODUCT STUDIO \u2014 2024-2025
      </text>
      <text
        x="220"
        y="118"
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize="9"
        fontFamily="var(--font-inter)"
        transform="rotate(-1, 220, 118)"
      >
        10 TRACKS \u2022 CURATED WITH LOVE
      </text>
      <text
        x="220"
        y="148"
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="8"
        fontFamily="var(--font-jetbrains)"
      >
        NR \u2022 DOLBY B \u2022 CrO2 \u2022 HIGH BIAS
      </text>

      {/* Tape window */}
      <rect
        x="120"
        y="170"
        width="200"
        height="60"
        rx="6"
        fill="#1A1A1A"
        stroke="#333"
        strokeWidth="1.5"
      />
      {/* Window inner bevel */}
      <rect
        x="126"
        y="176"
        width="188"
        height="48"
        rx="4"
        fill="none"
        stroke="#2A2A2A"
        strokeWidth="1"
      />

      {/* Tape between reels */}
      <path
        d="M170 200 Q220 190 270 200"
        stroke={COLORS.magnetic}
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M170 200 Q220 194 270 200"
        stroke="#4A3828"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Left reel */}
      <g style={{ transformOrigin: "170px 200px" }}>
        <circle cx="170" cy="200" r="22" fill={COLORS.hub} stroke="#555" strokeWidth="1" />
        <circle cx="170" cy="200" r="18" fill="#555" stroke="#666" strokeWidth="0.5" />
        <circle cx="170" cy="200" r="5" fill="#333" />
        {/* Spokes */}
        <g
          style={{
            transformOrigin: "170px 200px",
            animation: playing
              ? "reelSpin 8s linear infinite"
              : "none",
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={angle}
              x1="170"
              y1="200"
              x2={170 + 16 * Math.cos((angle * Math.PI) / 180)}
              y2={200 + 16 * Math.sin((angle * Math.PI) / 180)}
              stroke="#777"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>

      {/* Right reel */}
      <g style={{ transformOrigin: "270px 200px" }}>
        <circle cx="270" cy="200" r="22" fill={COLORS.hub} stroke="#555" strokeWidth="1" />
        <circle cx="270" cy="200" r="18" fill="#555" stroke="#666" strokeWidth="0.5" />
        <circle cx="270" cy="200" r="5" fill="#333" />
        {/* Spokes */}
        <g
          style={{
            transformOrigin: "270px 200px",
            animation: playing
              ? "reelSpin 8s linear infinite"
              : "none",
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={angle}
              x1="270"
              y1="200"
              x2={270 + 16 * Math.cos((angle * Math.PI) / 180)}
              y2={200 + 16 * Math.sin((angle * Math.PI) / 180)}
              stroke="#777"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>

      {/* Guide rollers */}
      <circle cx="145" cy="200" r="3" fill="#444" />
      <circle cx="295" cy="200" r="3" fill="#444" />

      {/* Bottom teeth (head alignment) */}
      <rect x="150" y="242" width="140" height="18" rx="2" fill="#1A1A1A" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect
          key={i}
          x={155 + i * 6.5}
          y="248"
          width="3"
          height="10"
          rx="0.5"
          fill="#333"
        />
      ))}

      {/* Bottom label strip */}
      <rect x="60" y="245" width="80" height="14" rx="2" fill={COLORS.yellow} opacity="0.9" />
      <text
        x="100"
        y="255"
        textAnchor="middle"
        fill={COLORS.text}
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-jetbrains)"
      >
        TYPE II CrO2
      </text>
      <rect x="300" y="245" width="80" height="14" rx="2" fill={COLORS.teal} opacity="0.9" />
      <text
        x="340"
        y="255"
        textAnchor="middle"
        fill="#FFF"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-jetbrains)"
      >
        60 MIN
      </text>
    </svg>
  );
}

/* ─── Pencil Rewind SVG ─── */
function PencilRewindSVG() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-20"
      aria-label="Pencil rewind trick"
    >
      {/* Tape reel outline */}
      <circle cx="60" cy="60" r="35" stroke={COLORS.hub} strokeWidth="2" fill="none" />
      <circle cx="60" cy="60" r="28" stroke={COLORS.hub} strokeWidth="1" fill="none" opacity="0.5" />
      {/* Hub center */}
      <circle cx="60" cy="60" r="8" fill={COLORS.hub} opacity="0.4" />
      {/* Hexagonal hub cutout */}
      <polygon
        points="60,53 66,56.5 66,63.5 60,67 54,63.5 54,56.5"
        fill="none"
        stroke={COLORS.hub}
        strokeWidth="1.5"
      />
      {/* Pencil body */}
      <rect
        x="56"
        y="20"
        width="8"
        height="80"
        rx="1"
        fill={COLORS.yellow}
        stroke="#D4A017"
        strokeWidth="0.5"
        transform="rotate(15, 60, 60)"
      />
      {/* Pencil metal band */}
      <rect
        x="56"
        y="84"
        width="8"
        height="6"
        fill="#C0C0C0"
        transform="rotate(15, 60, 60)"
      />
      {/* Pencil eraser */}
      <rect
        x="56"
        y="90"
        width="8"
        height="5"
        rx="1"
        fill={COLORS.coral}
        transform="rotate(15, 60, 60)"
      />
      {/* Pencil tip */}
      <polygon
        points="56,20 64,20 60,12"
        fill="#F5EFE6"
        stroke="#D4A017"
        strokeWidth="0.5"
        transform="rotate(15, 60, 60)"
      />
      <polygon
        points="58.5,16 61.5,16 60,12"
        fill="#333"
        transform="rotate(15, 60, 60)"
      />
    </svg>
  );
}

/* ─── Handwritten Annotation ─── */
function HandwrittenNote({
  children,
  color = COLORS.coral,
  rotate = -2,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block font-[family-name:var(--font-inter)] text-sm font-medium select-none ${className}`}
      style={{
        color,
        transform: `rotate(${rotate}deg)`,
        fontStyle: "italic",
      }}
    >
      {children}
    </span>
  );
}

/* ─── Track Entry Component ─── */
function TrackEntry({
  project,
  index,
  playingIndex,
  onPlay,
}: {
  project: (typeof projects)[number];
  index: number;
  playingIndex: number;
  onPlay: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const isPlaying = playingIndex === index;
  const label = trackLabel(index);
  const duration = TRACK_DURATIONS[index];
  const annotation = ANNOTATIONS[index];
  const title = project.title.replace("\n", " ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.5, delay: 0.05 * (index % 5) }}
      onClick={() => onPlay(index)}
      className="group cursor-pointer"
      style={{
        padding: "16px 20px",
        borderBottom: `1px dashed ${COLORS.creamDark}`,
        backgroundColor: isPlaying ? "rgba(255,107,107,0.06)" : "transparent",
        transition: "background-color 0.3s",
      }}
    >
      {/* Track header row */}
      <div className="flex items-center gap-3 mb-2">
        {/* Track number */}
        <div
          className="shrink-0 w-10 h-10 rounded flex items-center justify-center font-[family-name:var(--font-jetbrains)] text-sm font-bold"
          style={{
            backgroundColor: isPlaying ? COLORS.coral : COLORS.tape,
            color: isPlaying ? "#FFF" : COLORS.yellow,
            border: `1px solid ${isPlaying ? COLORS.coral : "#444"}`,
          }}
        >
          {label}
        </div>

        {/* Playing indicator + Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span style={{ color: COLORS.coral, fontSize: "12px" }}>
                {"\u25B6"}
              </span>
            )}
            <h3
              className="font-[family-name:var(--font-space-grotesk)] text-base md:text-lg font-bold truncate"
              style={{ color: COLORS.text }}
            >
              {title}
            </h3>
            {isPlaying && <EqualizerBars active={true} />}
          </div>
          <p
            className="font-[family-name:var(--font-inter)] text-xs mt-0.5"
            style={{ color: COLORS.hub }}
          >
            {project.client} \u2022 {project.year}
          </p>
        </div>

        {/* Duration */}
        <div
          className="shrink-0 font-[family-name:var(--font-jetbrains)] text-sm"
          style={{ color: COLORS.hub }}
        >
          {duration}
        </div>

        {/* Annotation */}
        <div className="hidden sm:block shrink-0">
          <HandwrittenNote
            rotate={-3 + Math.random() * 6 - 3}
            color={index % 3 === 0 ? COLORS.coral : index % 3 === 1 ? COLORS.teal : COLORS.text}
          >
            {annotation}
          </HandwrittenNote>
        </div>
      </div>

      {/* Description (liner notes) */}
      <p
        className="font-[family-name:var(--font-inter)] text-sm leading-relaxed pl-[52px] mb-2"
        style={{ color: "#555" }}
      >
        {project.description}
      </p>

      {/* Tech tags as "featuring:" */}
      <div className="pl-[52px] flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className="font-[family-name:var(--font-inter)] text-xs italic"
          style={{ color: COLORS.hub }}
        >
          ft.
        </span>
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-[family-name:var(--font-jetbrains)] text-[10px] px-2 py-0.5 rounded"
            style={{
              backgroundColor: COLORS.creamDark,
              color: COLORS.text,
              border: `1px solid ${COLORS.creamDark}`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="ml-[52px] h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: COLORS.creamDark }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isPlaying ? COLORS.coral : COLORS.hub }}
          initial={{ width: "0%" }}
          animate={{
            width: isPlaying ? "65%" : `${20 + index * 8}%`,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Side Divider ─── */
function SideDivider({
  side,
  active,
  onFlip,
}: {
  side: "A" | "B";
  active: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      className="flex items-center justify-center gap-4 py-6 cursor-pointer select-none"
      onClick={onFlip}
    >
      <div className="flex-1 h-px" style={{ backgroundColor: COLORS.creamDark }} />
      <motion.div
        className="flex items-center gap-3 px-5 py-2 rounded-full"
        style={{
          backgroundColor: active ? COLORS.tape : COLORS.creamDark,
          color: active ? COLORS.yellow : COLORS.hub,
          border: `2px solid ${active ? COLORS.yellow : COLORS.creamDark}`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-wider"
          animate={{ rotateY: active ? 0 : 180 }}
          transition={{ duration: 0.5 }}
        >
          SIDE {side}
        </motion.span>
        <span className="text-xs opacity-60">
          {side === "A" ? "TRACKS 1\u20135" : "TRACKS 6\u201310"}
        </span>
      </motion.div>
      <div className="flex-1 h-px" style={{ backgroundColor: COLORS.creamDark }} />
    </div>
  );
}

/* ─── Expertise Card ─── */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-5 rounded-lg"
      style={{
        backgroundColor: "#FFF",
        border: `1px solid ${COLORS.creamDark}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start gap-3 mb-2">
        <div
          className="w-8 h-8 rounded flex items-center justify-center shrink-0 font-[family-name:var(--font-jetbrains)] text-xs font-bold"
          style={{
            backgroundColor: COLORS.tape,
            color: COLORS.yellow,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3
          className="font-[family-name:var(--font-space-grotesk)] text-base font-bold"
          style={{ color: COLORS.text }}
        >
          {item.title}
        </h3>
      </div>
      <p
        className="font-[family-name:var(--font-inter)] text-sm leading-relaxed pl-11"
        style={{ color: "#666" }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PAGE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function CassettePage() {
  const [playing, setPlaying] = useState(true);
  const [playingTrack, setPlayingTrack] = useState(0);
  const [activeSide, setActiveSide] = useState<"A" | "B">("A");
  const [counter, setCounter] = useState(0);

  /* Scroll-based tape counter */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setCounter(Math.floor(scrollPct * 9999));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePlayTrack = useCallback((i: number) => {
    setPlayingTrack(i);
    setPlaying(true);
    setActiveSide(i < 5 ? "A" : "B");
  }, []);

  const handleFlipToA = useCallback(() => {
    setActiveSide("A");
    setPlayingTrack(0);
  }, []);

  const handleFlipToB = useCallback(() => {
    setActiveSide("B");
    setPlayingTrack(5);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const expertiseRef = useRef<HTMLDivElement>(null);
  const expertiseInView = useInView(expertiseRef, { once: true });

  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsInView = useInView(toolsRef, { once: true });

  const footerRef = useRef<HTMLDivElement>(null);
  const footerInView = useInView(footerRef, { once: true });

  return (
    <>
      {/* ─── Global keyframe styles ─── */}
      <style jsx global>{`
        @keyframes reelSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes eqBounce {
          0% {
            height: 3px;
          }
          100% {
            height: 16px;
          }
        }
        @keyframes playPulse {
          0%,
          100% {
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
          }
          50% {
            box-shadow: 0 2px 20px rgba(255, 107, 107, 0.7);
          }
        }
        @keyframes tapeShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes foldLine {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }

        /* Scrollbar styling for cassette theme */
        .cassette-page::-webkit-scrollbar {
          width: 6px;
        }
        .cassette-page::-webkit-scrollbar-track {
          background: ${COLORS.cream};
        }
        .cassette-page::-webkit-scrollbar-thumb {
          background: ${COLORS.hub};
          border-radius: 3px;
        }
      `}</style>

      <div
        className="cassette-page min-h-screen"
        style={{ backgroundColor: COLORS.cream }}
      >
        {/* ─── J-Card Insert Wrapper ─── */}
        <div className="relative max-w-[900px] mx-auto min-h-screen">
          {/* Fold lines (left and right) */}
          <div
            className="hidden md:block fixed top-0 bottom-0 pointer-events-none"
            style={{
              left: "calc(50% - 450px - 1px)",
              width: "2px",
              background: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 8px,
                ${COLORS.creamDark} 8px,
                ${COLORS.creamDark} 16px
              )`,
              opacity: 0.3,
              animation: "foldLine 4s ease-in-out infinite",
            }}
          />
          <div
            className="hidden md:block fixed top-0 bottom-0 pointer-events-none"
            style={{
              left: "calc(50% + 450px - 1px)",
              width: "2px",
              background: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 8px,
                ${COLORS.creamDark} 8px,
                ${COLORS.creamDark} 16px
              )`,
              opacity: 0.3,
              animation: "foldLine 4s ease-in-out infinite",
            }}
          />

          {/* Main content area with padding */}
          <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12">
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                HERO SECTION
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.section
              ref={heroRef}
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              {/* Top bar: brand + annotation */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <HandwrittenNote rotate={-3} color={COLORS.coral}>
                    DO NOT RECORD OVER!
                  </HandwrittenNote>
                </div>
                <div className="flex items-center gap-3">
                  <TapeCounter value={counter} />
                </div>
              </div>

              {/* Cassette tape */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={heroInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <CassetteSVG playing={playing} />
                </motion.div>
              </div>

              {/* Title block */}
              <div className="text-center mb-6">
                <motion.h1
                  className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3"
                  style={{ color: COLORS.text }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={heroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  GROX MIXTAPE
                </motion.h1>
                <motion.p
                  className="font-[family-name:var(--font-inter)] text-base md:text-lg"
                  style={{ color: COLORS.hub }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={heroInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  10 tracks of AI-powered products, curated &amp; mixed with care
                </motion.p>

                {/* Handwritten subtitle */}
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <HandwrittenNote rotate={-2} color={COLORS.teal}>
                    BEST MIX EVER &mdash; 2024/2025 season
                  </HandwrittenNote>
                </motion.div>
              </div>

              {/* Play controls */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ y: 15, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : { y: 15, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <PlayControls
                  playing={playing}
                  onToggle={() => setPlaying((p) => !p)}
                />
              </motion.div>

              {/* Stats row */}
              <motion.div
                className="flex items-center justify-center gap-6 md:gap-10"
                initial={{ y: 10, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-bold"
                      style={{ color: COLORS.coral }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="font-[family-name:var(--font-inter)] text-xs uppercase tracking-wider mt-1"
                      style={{ color: COLORS.hub }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Tape shimmer divider */}
              <div
                className="mt-8 h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${COLORS.magnetic}, ${COLORS.hub}, ${COLORS.magnetic}, transparent)`,
                  backgroundSize: "200% 100%",
                  animation: "tapeShimmer 3s linear infinite",
                }}
              />
            </motion.section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                PROJECTS / TRACK LISTING
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section className="mb-12">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-wide"
                  style={{ color: COLORS.text }}
                >
                  Track Listing
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className="font-[family-name:var(--font-jetbrains)] text-xs"
                    style={{ color: COLORS.hub }}
                  >
                    {projects.length} TRACKS
                  </span>
                  <span style={{ color: COLORS.coral }}>{"\u266B"}</span>
                </div>
              </div>

              {/* Track list container */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#FFF",
                  border: `1px solid ${COLORS.creamDark}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* SIDE A */}
                <SideDivider
                  side="A"
                  active={activeSide === "A"}
                  onFlip={handleFlipToA}
                />

                {/* A-side tracks (first 5) */}
                {projects.slice(0, 5).map((project, i) => (
                  <TrackEntry
                    key={i}
                    project={project}
                    index={i}
                    playingIndex={playingTrack}
                    onPlay={handlePlayTrack}
                  />
                ))}

                {/* Handwritten note between sides */}
                <div className="flex justify-center py-3">
                  <HandwrittenNote rotate={-1} color={COLORS.teal}>
                    \u2193 flip the tape \u2193
                  </HandwrittenNote>
                </div>

                {/* SIDE B */}
                <SideDivider
                  side="B"
                  active={activeSide === "B"}
                  onFlip={handleFlipToB}
                />

                {/* B-side tracks (last 5) */}
                {projects.slice(5, 10).map((project, i) => (
                  <TrackEntry
                    key={i + 5}
                    project={project}
                    index={i + 5}
                    playingIndex={playingTrack}
                    onPlay={handlePlayTrack}
                  />
                ))}
              </div>

              {/* Post-tracklist annotations */}
              <div className="flex items-center justify-between mt-4 px-2">
                <HandwrittenNote rotate={2} color={COLORS.coral}>
                  for: the future of AI
                </HandwrittenNote>
                <div className="flex items-center gap-3">
                  <PencilRewindSVG />
                  <HandwrittenNote rotate={-3} color={COLORS.hub}>
                    rewind with a pencil \u2192
                  </HandwrittenNote>
                </div>
              </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                EXPERTISE (LINER NOTES)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.section
              ref={expertiseRef}
              initial={{ opacity: 0 }}
              animate={expertiseInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: COLORS.magnetic }}
                />
                <h2
                  className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-wide"
                  style={{ color: COLORS.text }}
                >
                  Liner Notes
                </h2>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: COLORS.magnetic }}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <HandwrittenNote rotate={-2} color={COLORS.teal}>
                  what makes this mix special
                </HandwrittenNote>
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-xs"
                  style={{ color: COLORS.hub }}
                >
                  EXPERTISE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expertise.map((item, i) => (
                  <ExpertiseCard key={i} item={item} index={i} />
                ))}
              </div>
            </motion.section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TOOLS (EQUIPMENT LIST)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.section
              ref={toolsRef}
              initial={{ opacity: 0 }}
              animate={toolsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: COLORS.magnetic }}
                />
                <h2
                  className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-wide"
                  style={{ color: COLORS.text }}
                >
                  Equipment
                </h2>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: COLORS.magnetic }}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <HandwrittenNote rotate={-1} color={COLORS.coral}>
                  recorded using:
                </HandwrittenNote>
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-xs"
                  style={{ color: COLORS.hub }}
                >
                  TECH STACK
                </span>
              </div>

              {/* Tools grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tools.map((group, gi) => (
                  <motion.div
                    key={gi}
                    initial={{ opacity: 0, y: 15 }}
                    animate={
                      toolsInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 15 }
                    }
                    transition={{ duration: 0.5, delay: gi * 0.08 }}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: "#FFF",
                      border: `1px solid ${COLORS.creamDark}`,
                    }}
                  >
                    {/* Category label */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            gi % 3 === 0
                              ? COLORS.coral
                              : gi % 3 === 1
                              ? COLORS.teal
                              : COLORS.yellow,
                        }}
                      />
                      <span
                        className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-wide"
                        style={{ color: COLORS.text }}
                      >
                        {group.label}
                      </span>
                    </div>
                    {/* Items */}
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="font-[family-name:var(--font-jetbrains)] text-[11px] px-2 py-1 rounded"
                          style={{
                            backgroundColor: COLORS.cream,
                            color: COLORS.text,
                            border: `1px solid ${COLORS.creamDark}`,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FOOTER
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.footer
              ref={footerRef}
              initial={{ opacity: 0 }}
              animate={footerInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-8 pb-24"
            >
              {/* Top divider */}
              <div
                className="h-1 rounded-full mb-8"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.coral}, ${COLORS.teal}, ${COLORS.yellow})`,
                }}
              />

              {/* Footer cassette mini illustration */}
              <div className="flex justify-center mb-6">
                <svg
                  viewBox="0 0 200 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-48"
                >
                  <rect
                    x="0"
                    y="0"
                    width="200"
                    height="40"
                    rx="6"
                    fill={COLORS.tape}
                    stroke="#444"
                    strokeWidth="1"
                  />
                  {/* Mini reels */}
                  <circle cx="55" cy="20" r="10" fill={COLORS.hub} stroke="#555" strokeWidth="0.5" />
                  <circle cx="55" cy="20" r="3" fill="#333" />
                  <circle cx="145" cy="20" r="10" fill={COLORS.hub} stroke="#555" strokeWidth="0.5" />
                  <circle cx="145" cy="20" r="3" fill="#333" />
                  {/* Mini tape */}
                  <path
                    d="M65 20 Q100 15 135 20"
                    stroke={COLORS.magnetic}
                    strokeWidth="4"
                    fill="none"
                  />
                  {/* Mini label */}
                  <rect x="70" y="5" width="60" height="14" rx="2" fill={COLORS.coral} />
                  <text
                    x="100"
                    y="14"
                    textAnchor="middle"
                    fill="#FFF"
                    fontSize="6"
                    fontWeight="700"
                    fontFamily="var(--font-space-grotesk)"
                  >
                    GROX
                  </text>
                </svg>
              </div>

              {/* Footer text */}
              <div className="text-center space-y-3">
                <p
                  className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold"
                  style={{ color: COLORS.text }}
                >
                  GROX \u2014 AI Product Studio
                </p>
                <p
                  className="font-[family-name:var(--font-inter)] text-sm"
                  style={{ color: COLORS.hub }}
                >
                  This mixtape was recorded, mixed, and mastered with modern AI tools.
                </p>
                <p
                  className="font-[family-name:var(--font-inter)] text-sm"
                  style={{ color: COLORS.hub }}
                >
                  Home taping is killing the music industry... or is it?
                </p>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <HandwrittenNote rotate={-2} color={COLORS.coral}>
                    Made with {"\u2764"} and lots of AI
                  </HandwrittenNote>
                </div>

                {/* Legal style text like cassette inserts have */}
                <div className="pt-4">
                  <p
                    className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest leading-relaxed"
                    style={{ color: COLORS.hub }}
                  >
                    {"\u00A9"} 2024-2025 GROX. ALL RIGHTS RESERVED. UNAUTHORIZED
                    DUPLICATION IS A VIOLATION OF APPLICABLE LAWS. MANUFACTURED BY
                    GROX AI PRODUCT STUDIO. DISTRIBUTED DIGITALLY.
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                      style={{ color: COLORS.hub }}
                    >
                      DOLBY B NR
                    </span>
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                      style={{ color: COLORS.hub }}
                    >
                      {"\u2022"}
                    </span>
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                      style={{ color: COLORS.hub }}
                    >
                      TYPE II CrO2
                    </span>
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                      style={{ color: COLORS.hub }}
                    >
                      {"\u2022"}
                    </span>
                    <span
                      className="font-[family-name:var(--font-jetbrains)] text-[10px]"
                      style={{ color: COLORS.hub }}
                    >
                      HIGH BIAS
                    </span>
                  </div>
                </div>

                {/* Barcode-style decoration */}
                <div className="flex items-center justify-center gap-[1px] pt-4">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{
                        width: i % 3 === 0 ? "2px" : "1px",
                        height: `${14 + (i % 4) * 4}px`,
                        backgroundColor: COLORS.text,
                        opacity: 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.footer>
          </div>
        </div>

        {/* ─── Theme Switcher ─── */}
        <ThemeSwitcher current="/cassette" variant="light" />
      </div>
    </>
  );
}
