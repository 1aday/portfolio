"use client";

import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   MARQUEE THEME — TV Broadcast / Motion Graphics Aesthetic
   CNN meets Bloomberg Terminal meets Design Studio Portfolio
   ═══════════════════════════════════════════════════════════ */

const COLORS = {
  bg: "#0A1628",
  surface: "#111D33",
  red: "#CC0000",
  blue: "#0078D4",
  yellow: "#FFD700",
  text: "#E8ECF1",
  dim: "#7B8794",
  darkBlue: "#0A1628",
};

const SEGMENT_DURATIONS = [
  "04:32", "06:15", "03:48", "05:21", "07:03",
  "04:56", "03:17", "06:44", "05:09", "04:28",
];

/* ─── Utility: broadcast timestamp ─── */
function useBroadcastTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
      ];
      const day = days[now.getUTCDay()];
      const month = months[now.getUTCMonth()];
      const date = now.getUTCDate();
      const year = now.getUTCFullYear();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      setTime(`${day} ${month} ${date}, ${year} | ${hours}:${minutes} UTC`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

/* ─── Ticker data ─── */
const tickerItems = [
  "BREAKING: AI Watch Authentication ships with 99.2% accuracy",
  "Leader Dossier Generator processes 500+ profiles",
  "AI Video Production launches Season 2",
  "Theme Generator surpasses 10,000 generated themes",
  "Production RAG System handles 1M+ document chunks",
  "Interior Design Studio renders 50K+ room transformations",
  "Article to Audio Platform converts 100K+ articles",
  "Financial Analyst processes 500+ CSV datasets",
  "GA4 Dashboard tracks 2M+ analytics events",
  "Creative Platform generates 25K+ batch assets",
];

/* ─── SMPTE Color Bars ─── */
const SMPTE_COLORS = [
  "#C0C0C0", "#C0C000", "#00C0C0", "#00C000",
  "#C000C0", "#C00000", "#0000C0",
];

/* ═══════════════════════════════════════════════════
   COMPONENT: On-Air Bar
   ═══════════════════════════════════════════════════ */
function OnAirBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        background: COLORS.red,
        padding: "6px 0",
        textAlign: "center",
        position: "relative",
        zIndex: 100,
      }}
    >
      <motion.span
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        ON AIR
      </motion.span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Breaking News Ticker
   ═══════════════════════════════════════════════════ */
function BreakingTicker() {
  const tickerText = tickerItems.join("  ///  ");
  return (
    <div
      style={{
        background: COLORS.surface,
        borderTop: `2px solid ${COLORS.red}`,
        borderBottom: `2px solid ${COLORS.red}`,
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      {/* BREAKING label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          background: COLORS.red,
          color: "#fff",
          padding: "8px 16px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        BREAKING
      </div>
      <div
        style={{
          display: "inline-block",
          animation: "tickerScroll 45s linear infinite",
          paddingLeft: 120,
        }}
      >
        <span
          style={{
            color: COLORS.yellow,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
          className="font-[family-name:var(--font-jetbrains)]"
        >
          {tickerText}  ///  {tickerText}
        </span>
      </div>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: LIVE Indicator
   ═══════════════════════════════════════════════════ */
function LiveIndicator({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: COLORS.red,
          boxShadow: `0 0 8px ${COLORS.red}`,
        }}
      />
      <span
        style={{
          color: COLORS.red,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 3,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        LIVE
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Channel Bug (fixed bottom-left)
   ═══════════════════════════════════════════════════ */
function ChannelBug() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 1000,
        opacity: 0.35,
        display: "flex",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          border: `2px solid ${COLORS.text}`,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          fontWeight: 700,
          color: COLORS.text,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        G
      </div>
      <span
        style={{
          color: COLORS.text,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 3,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        GROX
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Commercial Break Divider
   ═══════════════════════════════════════════════════ */
function CommercialBreak({ label = "COMMERCIAL BREAK" }: { label?: string }) {
  return (
    <div
      style={{
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* SMPTE color bars */}
      <div style={{ display: "flex", width: "100%", height: 6, overflow: "hidden" }}>
        {SMPTE_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: color,
            }}
          />
        ))}
      </div>
      <span
        style={{
          color: COLORS.dim,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 4,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        {label}
      </span>
      <div style={{ display: "flex", width: "100%", height: 6, overflow: "hidden" }}>
        {SMPTE_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Lower Third Graphic
   ═══════════════════════════════════════════════════ */
function LowerThird({
  title,
  subtitle,
  tag,
}: {
  title: string;
  subtitle: string;
  tag?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden" }}>
      {/* L-shape vertical bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: COLORS.blue,
          transformOrigin: "top",
        }}
      />
      {/* Main bar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        style={{
          background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.darkBlue})`,
          padding: "12px 20px 12px 20px",
          marginLeft: 4,
          display: "flex",
          alignItems: "center",
          gap: 16,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
            className="font-[family-name:var(--font-sora)]"
          >
            {title}
          </span>
          <div
            style={{
              width: 1,
              height: 16,
              background: "rgba(255,255,255,0.3)",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              fontWeight: 400,
            }}
            className="font-[family-name:var(--font-inter)]"
          >
            {subtitle}
          </span>
        </div>
        {tag && (
          <span
            style={{
              color: COLORS.yellow,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              padding: "3px 10px",
              border: `1px solid ${COLORS.yellow}`,
              borderRadius: 2,
            }}
            className="font-[family-name:var(--font-jetbrains)]"
          >
            {tag}
          </span>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Project Segment Card
   ═══════════════════════════════════════════════════ */
function ProjectSegment({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  const segNum = String(index + 1).padStart(2, "0");
  const duration = SEGMENT_DURATIONS[index];
  const titleOneLine = project.title.replace("\n", " ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: COLORS.surface,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        transition: "border-color 0.3s",
        borderColor: hovered ? COLORS.blue : "rgba(255,255,255,0.06)",
      }}
    >
      {/* Lower Third Header Bar */}
      <div
        style={{
          background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.darkBlue})`,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              color: COLORS.yellow,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
            }}
            className="font-[family-name:var(--font-jetbrains)]"
          >
            SEG-{segNum}
          </span>
          <div
            style={{
              width: 1,
              height: 14,
              background: "rgba(255,255,255,0.25)",
            }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
            className="font-[family-name:var(--font-sora)]"
          >
            {titleOneLine}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              color: COLORS.dim,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 1,
            }}
            className="font-[family-name:var(--font-jetbrains)]"
          >
            {duration}
          </span>
          {/* LIVE badge on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              hovered
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.2 }}
            style={{
              background: COLORS.red,
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              padding: "2px 8px",
              borderRadius: 2,
            }}
            className="font-[family-name:var(--font-sora)]"
          >
            LIVE
          </motion.div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "20px 20px 16px" }}>
        {/* Category pill + client + year */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: `${COLORS.blue}22`,
              color: COLORS.blue,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.5,
              padding: "4px 10px",
              borderRadius: 2,
              border: `1px solid ${COLORS.blue}44`,
              textTransform: "uppercase",
            }}
            className="font-[family-name:var(--font-sora)]"
          >
            {project.client}
          </span>
          <span
            style={{
              color: COLORS.dim,
              fontSize: 11,
            }}
            className="font-[family-name:var(--font-jetbrains)]"
          >
            {project.year}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            color: COLORS.text,
            fontSize: 14,
            lineHeight: 1.7,
            marginBottom: 16,
            opacity: 0.85,
          }}
          className="font-[family-name:var(--font-inter)]"
        >
          {project.description}
        </p>

        {/* Technical details */}
        <p
          style={{
            color: COLORS.dim,
            fontSize: 12,
            lineHeight: 1.6,
            marginBottom: 16,
            borderLeft: `2px solid ${COLORS.blue}40`,
            paddingLeft: 12,
          }}
          className="font-[family-name:var(--font-inter)]"
        >
          {project.technical}
        </p>

        {/* Tech tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                background: `${COLORS.yellow}12`,
                color: COLORS.yellow,
                fontSize: 10,
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 2,
                letterSpacing: 0.5,
                border: `1px solid ${COLORS.yellow}25`,
              }}
              className="font-[family-name:var(--font-jetbrains)]"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Bottom bar: GitHub link + segment number */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid rgba(255,255,255,0.06)`,
            paddingTop: 12,
          }}
        >
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: COLORS.blue,
              fontSize: 11,
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            className="font-[family-name:var(--font-jetbrains)]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View Source
          </a>
          <span
            style={{
              color: COLORS.dim,
              fontSize: 10,
              letterSpacing: 2,
              opacity: 0.5,
            }}
            className="font-[family-name:var(--font-jetbrains)]"
          >
            SEGMENT {segNum}/{String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Stat Display (Bloomberg-style)
   ═══════════════════════════════════════════════════ */
function StatBlock({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      style={{
        background: `${COLORS.surface}`,
        border: `1px solid ${COLORS.blue}30`,
        padding: "16px 24px",
        textAlign: "center",
        position: "relative",
        minWidth: 140,
      }}
    >
      {/* Data readout styling */}
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 8,
          fontSize: 8,
          color: COLORS.blue,
          letterSpacing: 2,
          fontWeight: 700,
        }}
        className="font-[family-name:var(--font-jetbrains)]"
      >
        DATA
      </div>
      <div
        style={{
          color: COLORS.yellow,
          fontSize: 32,
          fontWeight: 700,
          lineHeight: 1,
          marginBottom: 4,
          marginTop: 8,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        {value}
      </div>
      <div
        style={{
          color: COLORS.dim,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
        className="font-[family-name:var(--font-jetbrains)]"
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Expertise Card (Broadcast Segment Info)
   ═══════════════════════════════════════════════════ */
function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertise)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: COLORS.surface,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `3px solid ${COLORS.blue}`,
        padding: "20px 24px",
        position: "relative",
      }}
    >
      {/* Segment label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            color: COLORS.yellow,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
          }}
          className="font-[family-name:var(--font-jetbrains)]"
        >
          SPEC-{String(index + 1).padStart(2, "0")}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>
      <h3
        style={{
          color: COLORS.text,
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 8,
          letterSpacing: 0.5,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        {item.title}
      </h3>
      <p
        style={{
          color: COLORS.dim,
          fontSize: 13,
          lineHeight: 1.7,
        }}
        className="font-[family-name:var(--font-inter)]"
      >
        {item.body}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Program Guide Grid (Tools)
   ═══════════════════════════════════════════════════ */
function ProgramGuide() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const timeSlots = [
    "06:00", "08:00", "10:00", "12:00",
    "14:00", "16:00", "18:00", "20:00",
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(6, 1fr)",
          border: `1px solid ${COLORS.blue}30`,
          minWidth: 700,
        }}
      >
        {/* Header Row */}
        <div
          style={{
            background: `${COLORS.blue}15`,
            padding: "10px 12px",
            borderBottom: `1px solid ${COLORS.blue}30`,
            borderRight: `1px solid ${COLORS.blue}20`,
          }}
        >
          <span
            style={{
              color: COLORS.dim,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
            }}
            className="font-[family-name:var(--font-jetbrains)]"
          >
            TIME
          </span>
        </div>
        {tools.map((category) => (
          <div
            key={category.label}
            style={{
              background: `${COLORS.blue}15`,
              padding: "10px 12px",
              borderBottom: `1px solid ${COLORS.blue}30`,
              borderRight: `1px solid ${COLORS.blue}10`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: COLORS.blue,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
              className="font-[family-name:var(--font-sora)]"
            >
              {category.label}
            </span>
          </div>
        ))}

        {/* Grid Rows — time slots vs tool items */}
        {(() => {
          const maxItems = Math.max(...tools.map((t) => t.items.length));
          const rows = [];
          for (let row = 0; row < maxItems; row++) {
            rows.push(
              <div
                key={`time-${row}`}
                style={{
                  background: COLORS.bg,
                  padding: "10px 12px",
                  borderBottom: `1px solid ${COLORS.blue}10`,
                  borderRight: `1px solid ${COLORS.blue}20`,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: COLORS.dim,
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                  className="font-[family-name:var(--font-jetbrains)]"
                >
                  {timeSlots[row] || "22:00"}
                </span>
              </div>
            );
            tools.forEach((category) => {
              const item = category.items[row];
              rows.push(
                <div
                  key={`${category.label}-${row}`}
                  style={{
                    background: item
                      ? `${COLORS.surface}`
                      : `${COLORS.bg}`,
                    padding: "10px 12px",
                    borderBottom: `1px solid ${COLORS.blue}10`,
                    borderRight: `1px solid ${COLORS.blue}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                >
                  {item ? (
                    <span
                      style={{
                        color: COLORS.text,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                      className="font-[family-name:var(--font-inter)]"
                    >
                      {item}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: `${COLORS.dim}40`,
                        fontSize: 10,
                      }}
                      className="font-[family-name:var(--font-jetbrains)]"
                    >
                      --
                    </span>
                  )}
                </div>
              );
            });
          }
          return (
            <div
              style={{
                display: "contents",
              }}
            >
              {rows}
            </div>
          );
        })()}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT: Section Header (Broadcast style)
   ═══════════════════════════════════════════════════ */
function SectionHeader({
  title,
  code,
}: {
  title: string;
  code: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 32,
      }}
    >
      <div
        style={{
          background: COLORS.red,
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          padding: "6px 12px",
          borderRadius: 2,
        }}
        className="font-[family-name:var(--font-jetbrains)]"
      >
        {code}
      </div>
      <h2
        style={{
          color: COLORS.text,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 1,
          margin: 0,
        }}
        className="font-[family-name:var(--font-sora)]"
      >
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.blue}60, transparent)`,
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════ */
export default function MarqueePage() {
  const broadcastTime = useBroadcastTime();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* ─── Global Styles ─── */}
      <style>{`
        .marquee-page * {
          box-sizing: border-box;
        }
        .marquee-page a {
          text-decoration: none;
        }
        .marquee-page ::selection {
          background: ${COLORS.blue};
          color: #fff;
        }
        @keyframes onAirPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <div className="marquee-page">
        {/* ═══ ON AIR BAR ═══ */}
        <OnAirBar />

        {/* ═══ HEADER BAR ═══ */}
        <div
          style={{
            background: COLORS.surface,
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
            padding: "10px 0",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: COLORS.red,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff",
                }}
                className="font-[family-name:var(--font-sora)]"
              >
                G
              </div>
              <span
                style={{
                  color: COLORS.text,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 3,
                }}
                className="font-[family-name:var(--font-sora)]"
              >
                GROX BROADCAST
              </span>
            </div>

            {/* Timestamp */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span
                style={{
                  color: COLORS.dim,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: 1.5,
                }}
                className="font-[family-name:var(--font-jetbrains)]"
              >
                {broadcastTime}
              </span>
              <LiveIndicator />
            </div>
          </div>
        </div>

        {/* ═══ BREAKING TICKER ═══ */}
        <BreakingTicker />

        {/* ═══ HERO SECTION ═══ */}
        <section
          ref={heroRef}
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 24px 60px",
            position: "relative",
          }}
        >
          {/* Scanline overlay (subtle) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Show title card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* "PROGRAM" label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    background: `${COLORS.blue}20`,
                    color: COLORS.blue,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 3,
                    padding: "5px 14px",
                    border: `1px solid ${COLORS.blue}40`,
                    borderRadius: 2,
                  }}
                  className="font-[family-name:var(--font-jetbrains)]"
                >
                  PROGRAM
                </span>
                <span
                  style={{
                    color: COLORS.dim,
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                  className="font-[family-name:var(--font-jetbrains)]"
                >
                  SEASON 2025 — EPISODE 01
                </span>
              </div>

              {/* Main title */}
              <h1
                style={{
                  fontSize: "clamp(40px, 7vw, 80px)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  color: COLORS.text,
                  marginBottom: 16,
                  letterSpacing: -1,
                }}
                className="font-[family-name:var(--font-sora)]"
              >
                AI Product
                <br />
                <span style={{ color: COLORS.blue }}>Studio</span>{" "}
                <span style={{ color: COLORS.yellow }}>Portfolio</span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  color: COLORS.dim,
                  fontSize: 16,
                  lineHeight: 1.7,
                  maxWidth: 600,
                  marginBottom: 40,
                }}
                className="font-[family-name:var(--font-inter)]"
              >
                Building production AI systems that ship. Multi-model orchestration,
                computer vision, generative media, and full-stack product development
                from concept to deployment.
              </p>
            </motion.div>

            {/* Stats row — Bloomberg terminal style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              style={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {stats.map((stat, i) => (
                <StatBlock
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  delay={0.4 + i * 0.1}
                />
              ))}
            </motion.div>

            {/* Lower Third for hero */}
            <LowerThird
              title="GROX — AI Product Studio"
              subtitle="Full-Stack AI Engineering & Design"
              tag="FEATURED"
            />
          </div>
        </section>

        {/* ═══ COMMERCIAL BREAK ═══ */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <CommercialBreak />
        </div>

        {/* ═══ PROJECTS SECTION ═══ */}
        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 24px 60px",
          }}
        >
          <SectionHeader title="Project Segments" code="SEG" />

          {/* Projects grid — single column broadcast segments */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 16,
            }}
          >
            {projects.map((project, i) => (
              <ProjectSegment key={project.title} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ COMMERCIAL BREAK ═══ */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <CommercialBreak label="PLEASE STAND BY" />
        </div>

        {/* ═══ EXPERTISE SECTION ═══ */}
        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 24px 60px",
          }}
        >
          <SectionHeader title="Specialization" code="SPEC" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {expertise.map((item, i) => (
              <ExpertiseCard key={item.title} item={item} index={i} />
            ))}
          </div>

          {/* Lower Third for expertise */}
          <div style={{ marginTop: 32 }}>
            <LowerThird
              title="Core Capabilities"
              subtitle="Multi-model AI, Computer Vision, Full-Stack Product Dev"
              tag="ANALYSIS"
            />
          </div>
        </section>

        {/* ═══ COMMERCIAL BREAK ═══ */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <CommercialBreak />
        </div>

        {/* ═══ TOOLS SECTION (Program Guide) ═══ */}
        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 24px 60px",
          }}
        >
          <SectionHeader title="Program Guide" code="GUIDE" />

          {/* Program guide intro */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                color: COLORS.dim,
                fontSize: 11,
                letterSpacing: 1,
              }}
              className="font-[family-name:var(--font-jetbrains)]"
            >
              TECHNOLOGY STACK — DAILY SCHEDULE
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: `rgba(255,255,255,0.06)`,
              }}
            />
            <span
              style={{
                color: COLORS.blue,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
              }}
              className="font-[family-name:var(--font-sora)]"
            >
              ALL CHANNELS
            </span>
          </div>

          <ProgramGuide />

          {/* Lower Third for tools */}
          <div style={{ marginTop: 32 }}>
            <LowerThird
              title="Technology Stack"
              subtitle="6 Categories — 22 Core Technologies"
              tag="REFERENCE"
            />
          </div>
        </section>

        {/* ═══ COMMERCIAL BREAK ═══ */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <CommercialBreak label="END OF BROADCAST" />
        </div>

        {/* ═══ FOOTER ═══ */}
        <footer
          style={{
            background: COLORS.surface,
            borderTop: `2px solid ${COLORS.blue}30`,
          }}
        >
          {/* Credits ticker */}
          <div
            style={{
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
              padding: "10px 0",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                display: "inline-block",
                animation: "tickerScroll 60s linear infinite",
              }}
            >
              <span
                style={{
                  color: COLORS.dim,
                  fontSize: 11,
                  letterSpacing: 1,
                }}
                className="font-[family-name:var(--font-jetbrains)]"
              >
                GROX AI PRODUCT STUDIO ///  TypeScript /// Next.js /// React /// Swift /// OpenAI /// Claude /// Replicate /// ElevenLabs /// Supabase /// PostgreSQL /// Vercel ///  GROX AI PRODUCT STUDIO ///  TypeScript /// Next.js /// React /// Swift /// OpenAI /// Claude /// Replicate /// ElevenLabs /// Supabase /// PostgreSQL /// Vercel ///
              </span>
            </div>
          </div>

          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "40px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
              }}
            >
              {/* Footer top */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        background: COLORS.red,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#fff",
                      }}
                      className="font-[family-name:var(--font-sora)]"
                    >
                      G
                    </div>
                    <span
                      style={{
                        color: COLORS.text,
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: 4,
                      }}
                      className="font-[family-name:var(--font-sora)]"
                    >
                      GROX
                    </span>
                  </div>
                  <p
                    style={{
                      color: COLORS.dim,
                      fontSize: 12,
                      lineHeight: 1.6,
                      maxWidth: 380,
                    }}
                    className="font-[family-name:var(--font-inter)]"
                  >
                    AI Product Studio. Building production AI systems that ship.
                    From multi-model orchestration to pixel-perfect interfaces.
                  </p>
                </div>

                {/* Broadcast details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      color: COLORS.dim,
                      fontSize: 10,
                      letterSpacing: 2,
                    }}
                    className="font-[family-name:var(--font-jetbrains)]"
                  >
                    BROADCAST ID: GRX-2025-001
                  </span>
                  <span
                    style={{
                      color: COLORS.dim,
                      fontSize: 10,
                      letterSpacing: 2,
                    }}
                    className="font-[family-name:var(--font-jetbrains)]"
                  >
                    FEED: PORTFOLIO-MAIN
                  </span>
                  <span
                    style={{
                      color: COLORS.dim,
                      fontSize: 10,
                      letterSpacing: 2,
                    }}
                    className="font-[family-name:var(--font-jetbrains)]"
                  >
                    RESOLUTION: 1920x1080 HD
                  </span>
                  <LiveIndicator style={{ marginTop: 4 }} />
                </div>
              </div>

              {/* Horizontal rule */}
              <div
                style={{
                  height: 1,
                  background: `linear-gradient(90deg, ${COLORS.blue}40, transparent)`,
                }}
              />

              {/* Footer bottom */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    color: COLORS.dim,
                    fontSize: 11,
                  }}
                  className="font-[family-name:var(--font-inter)]"
                >
                  &copy; {new Date().getFullYear()} Grox. All rights reserved.
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <a
                    href="https://github.com/1aday"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: COLORS.dim,
                      fontSize: 11,
                      transition: "color 0.2s",
                    }}
                    className="font-[family-name:var(--font-inter)]"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = COLORS.text)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = COLORS.dim)
                    }
                  >
                    GitHub
                  </a>
                  <span style={{ color: COLORS.dim, fontSize: 8 }}>|</span>
                  <span
                    style={{
                      color: COLORS.dim,
                      fontSize: 11,
                    }}
                    className="font-[family-name:var(--font-jetbrains)]"
                  >
                    Signal: STRONG
                  </span>
                  <span style={{ color: COLORS.dim, fontSize: 8 }}>|</span>
                  <span
                    style={{
                      color: COLORS.dim,
                      fontSize: 11,
                    }}
                    className="font-[family-name:var(--font-jetbrains)]"
                  >
                    Uplink: ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SMPTE bars at very bottom */}
          <div style={{ display: "flex", width: "100%", height: 4 }}>
            {SMPTE_COLORS.map((color, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: color,
                }}
              />
            ))}
          </div>
        </footer>

        {/* ═══ CHANNEL BUG (fixed) ═══ */}
        <ChannelBug />

        {/* ═══ THEME SWITCHER ═══ */}
        <ThemeSwitcher current="/marquee" />
      </div>
    </div>
  );
}
