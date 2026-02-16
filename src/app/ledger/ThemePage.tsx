"use client";

import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   LEDGER THEME — Financial Accounting / Bookkeeping Aesthetic
   ═══════════════════════════════════════════════════════════════ */

/* ─── Color constants ─── */
const C = {
  cream: "#FAFAF0",
  rule: "#C8D8E8",
  greenBar: "#E8F5E9",
  ink: "#1A1A1A",
  red: "#CC0000",
  green: "#2E7D32",
  stamp: "#4A148C",
  dateStamp: "#1565C0",
  paper: "#FFFFF5",
  marginRed: "#D4A0A0",
};

/* ─── Reference number generator ─── */
const refNum = (i: number) => `REF-${String(i + 1).padStart(3, "0")}`;

/* ─── Date entries for projects ─── */
const projectDates = [
  "Jan 2025",
  "Feb 2025",
  "Mar 2025",
  "Mar 2025",
  "Apr 2025",
  "May 2025",
  "Jun 2025",
  "Jul 2024",
  "Aug 2025",
  "Sep 2025",
];

/* ─── Rubber stamp data ─── */
const stamps = [
  { text: "APPROVED", color: C.stamp, rotation: -3 },
  { text: "PAID IN FULL", color: C.green, rotation: 4 },
  { text: "RECEIVED", color: C.dateStamp, rotation: -2 },
  { text: "VERIFIED \u2713", color: C.green, rotation: 5 },
];

/* ═══════════════════════════════════════════════════════════════
   FOUNTAIN PEN SVG COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function FountainPenStroke({
  width = 200,
  color = C.ink,
  className = "",
}: {
  width?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height="8"
      viewBox={`0 0 ${width} 8`}
      className={className}
      style={{ display: "block" }}
    >
      <path
        d={`M0 4 Q${width * 0.15} 1, ${width * 0.3} 3.5 Q${width * 0.5} 6, ${width * 0.7} 3 Q${width * 0.85} 1, ${width} 4`}
        stroke={color}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOUNTAIN PEN SIGNATURE
   ═══════════════════════════════════════════════════════════════ */
function FountainPenSignature({ className = "" }: { className?: string }) {
  return (
    <svg
      width="180"
      height="50"
      viewBox="0 0 180 50"
      className={className}
      style={{ display: "block" }}
    >
      <path
        d="M10 35 Q20 10, 40 25 Q55 38, 70 20 Q80 8, 90 28 Q100 42, 115 18 Q125 5, 140 30 Q150 42, 170 15"
        stroke={C.ink}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M60 42 Q80 38, 120 40"
        stroke={C.ink}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BINDING HOLES COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function BindingHoles() {
  return (
    <div
      style={{
        position: "fixed",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "120px",
        zIndex: 5,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: `2px solid ${C.rule}`,
            background: "#e8e8dc",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RUBBER STAMP COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function RubberStamp({
  text,
  color,
  rotation,
  size = "md",
}: {
  text: string;
  color: string;
  rotation: number;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const sizes = {
    sm: { fontSize: "10px", padding: "3px 8px", borderWidth: "2px" },
    md: { fontSize: "13px", padding: "5px 14px", borderWidth: "2px" },
    lg: { fontSize: "16px", padding: "8px 20px", borderWidth: "3px" },
  };

  const s = sizes[size];

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 3, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 0.8 } : { scale: 3, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 15, duration: 0.3 }}
      style={{
        display: "inline-block",
        border: `${s.borderWidth} solid ${color}`,
        borderRadius: "3px",
        padding: s.padding,
        color: color,
        fontSize: s.fontSize,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        transform: `rotate(${rotation}deg)`,
        fontFamily: "var(--font-inter)",
        boxShadow: `inset 0 0 0 1px ${color}`,
        opacity: 0.8,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RUNNING BALANCE SIDEBAR
   ═══════════════════════════════════════════════════════════════ */
function RunningBalance() {
  const [projectCount, setProjectCount] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(scrollTop / docHeight, 1);
      setScrollPercent(pct);

      const projectsSection = document.getElementById("ledger-projects");
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const sectionHeight = projectsSection.offsetHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
        setProjectCount(Math.min(10, Math.round(progress * 10)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      <div
        style={{
          background: C.paper,
          border: `1px solid ${C.rule}`,
          borderRadius: "2px",
          padding: "12px 10px",
          fontFamily: "var(--font-jetbrains)",
          fontSize: "10px",
          color: C.ink,
          lineHeight: 1.8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <div style={{ color: C.dateStamp, fontWeight: 600, marginBottom: "4px" }}>
          BALANCE
        </div>
        <div>
          Projects:{" "}
          <span style={{ color: C.green, fontWeight: 600 }}>
            {projectCount}/10
          </span>
        </div>
        <div>
          Shipped:{" "}
          <span style={{ color: C.green, fontWeight: 600 }}>30+</span>
        </div>
        <div style={{ borderTop: `1px solid ${C.rule}`, marginTop: "4px", paddingTop: "4px" }}>
          Scroll:{" "}
          <span style={{ fontWeight: 600 }}>
            {Math.round(scrollPercent * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED LEDGER LINE
   ═══════════════════════════════════════════════════════════════ */
function AnimatedLedgerLine({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{
        height: "1px",
        background: C.rule,
        transformOrigin: "left",
        width: "100%",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLUMN ENTRY ANIMATION WRAPPER
   ═══════════════════════════════════════════════════════════════ */
function ColumnEntry({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -15 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   T-ACCOUNT COMPONENT (Double-Entry)
   ═══════════════════════════════════════════════════════════════ */
function TAccount({
  title,
  debits,
  credits,
}: {
  title: string;
  debits: { label: string; value: string }[];
  credits: { label: string; value: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      style={{
        background: C.paper,
        border: `1px solid ${C.rule}`,
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      {/* Account title */}
      <div
        style={{
          textAlign: "center",
          padding: "10px 16px",
          borderBottom: `2px solid ${C.ink}`,
          fontFamily: "var(--font-dm-serif)",
          fontSize: "16px",
          color: C.ink,
          background: C.cream,
        }}
      >
        {title}
      </div>
      {/* T-shape */}
      <div style={{ display: "flex", minHeight: "120px" }}>
        {/* Debit side */}
        <div
          style={{
            flex: 1,
            borderRight: `2px solid ${C.ink}`,
            padding: "8px 12px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: C.red,
              letterSpacing: "0.1em",
              marginBottom: "8px",
              fontFamily: "var(--font-inter)",
              textTransform: "uppercase",
            }}
          >
            Debit
          </div>
          {debits.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "3px 0",
                borderBottom: `1px solid ${C.rule}`,
                fontSize: "12px",
                fontFamily: "var(--font-jetbrains)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: C.ink }}>{d.label}</span>
              <span style={{ color: C.red }}>{d.value}</span>
            </div>
          ))}
        </div>
        {/* Credit side */}
        <div style={{ flex: 1, padding: "8px 12px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: C.green,
              letterSpacing: "0.1em",
              marginBottom: "8px",
              fontFamily: "var(--font-inter)",
              textTransform: "uppercase",
            }}
          >
            Credit
          </div>
          {credits.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "3px 0",
                borderBottom: `1px solid ${C.rule}`,
                fontSize: "12px",
                fontFamily: "var(--font-jetbrains)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: C.ink }}>{c.label}</span>
              <span style={{ color: C.green }}>{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEDGER RULED BACKGROUND
   ═══════════════════════════════════════════════════════════════ */
function LedgerBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Horizontal ruled lines every 32px */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern
            id="ledger-hlines"
            x="0"
            y="0"
            width="100%"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="31"
              x2="100%"
              y2="31"
              stroke={C.rule}
              strokeWidth="0.5"
              opacity="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#ledger-hlines)`} />
      </svg>

      {/* Red vertical margin line */}
      <div
        style={{
          position: "absolute",
          left: "60px",
          top: 0,
          bottom: 0,
          width: "1px",
          background: C.marginRed,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "64px",
          top: 0,
          bottom: 0,
          width: "1px",
          background: C.marginRed,
          opacity: 0.3,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEDGER COLUMN HEADER
   ═══════════════════════════════════════════════════════════════ */
function LedgerColumnHeader() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 70px 1fr 100px 100px 100px",
        gap: "0",
        borderBottom: `2px solid ${C.ink}`,
        padding: "8px 0",
        fontFamily: "var(--font-inter)",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: C.ink,
      }}
    >
      <div style={{ paddingLeft: "4px" }}>Date</div>
      <div>Ref#</div>
      <div>Description</div>
      <div style={{ textAlign: "right", color: C.red }}>Debit</div>
      <div style={{ textAlign: "right", color: C.green }}>Credit</div>
      <div style={{ textAlign: "right", paddingRight: "4px" }}>Balance</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEDGER COLUMN HEADER (MOBILE)
   ═══════════════════════════════════════════════════════════════ */
function LedgerColumnHeaderMobile() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 70px",
        gap: "0",
        borderBottom: `2px solid ${C.ink}`,
        padding: "8px 0",
        fontFamily: "var(--font-inter)",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: C.ink,
      }}
    >
      <div style={{ paddingLeft: "4px" }}>Ref#</div>
      <div>Description</div>
      <div style={{ textAlign: "right", paddingRight: "4px" }}>Status</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT LEDGER ROW (DESKTOP)
   ═══════════════════════════════════════════════════════════════ */
function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const isGreenBar = index % 2 === 1;
  const stamp = stamps[index % stamps.length];
  const runningBalance = (index + 1) * 3;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        background: isGreenBar ? C.greenBar : C.paper,
        borderBottom: `1px solid ${C.rule}`,
      }}
    >
      {/* Desktop row */}
      <div
        className="ledger-row-desktop"
        style={{
          display: "grid",
          gridTemplateColumns: "80px 70px 1fr 100px 100px 100px",
          gap: "0",
          padding: "12px 0",
          alignItems: "start",
        }}
      >
        {/* Date column */}
        <ColumnEntry delay={0} style={{ paddingLeft: "4px" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              color: C.dateStamp,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 500,
            }}
          >
            {projectDates[index] || project.year}
          </div>
        </ColumnEntry>

        {/* Ref# column */}
        <ColumnEntry delay={0.05}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "11px",
              color: C.ink,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            }}
          >
            {refNum(index)}
          </div>
        </ColumnEntry>

        {/* Description column */}
        <ColumnEntry delay={0.1} style={{ paddingRight: "16px" }}>
          <div
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "15px",
              color: C.ink,
              lineHeight: 1.3,
              marginBottom: "4px",
            }}
          >
            {project.title.replace("\n", " ")}
          </div>
          <div
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              color: "#555",
              lineHeight: 1.5,
              marginBottom: "6px",
            }}
          >
            {project.description}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              marginBottom: "6px",
            }}
          >
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "9px",
                  padding: "2px 6px",
                  border: `1px solid ${C.rule}`,
                  borderRadius: "1px",
                  color: C.ink,
                  background: C.cream,
                  letterSpacing: "0.05em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {/* Client as italic note */}
          <div
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "10px",
              color: "#888",
              fontStyle: "italic",
            }}
          >
            Client: {project.client}
          </div>
        </ColumnEntry>

        {/* Debit column */}
        <ColumnEntry delay={0.15} style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "12px",
              color: C.red,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 500,
            }}
          >
            ({project.tech.length})
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "9px",
              color: "#999",
              marginTop: "2px",
            }}
          >
            models
          </div>
        </ColumnEntry>

        {/* Credit column */}
        <ColumnEntry delay={0.2} style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "12px",
              color: C.green,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            }}
          >
            +1.00
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "9px",
              color: "#999",
              marginTop: "2px",
            }}
          >
            shipped
          </div>
        </ColumnEntry>

        {/* Balance column */}
        <ColumnEntry delay={0.25} style={{ textAlign: "right", paddingRight: "4px" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "12px",
              color: C.ink,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            }}
          >
            {runningBalance}.00
          </div>
          {index % 3 === 0 && (
            <div style={{ marginTop: "6px" }}>
              <RubberStamp
                text={stamp.text}
                color={stamp.color}
                rotation={stamp.rotation}
                size="sm"
              />
            </div>
          )}
        </ColumnEntry>
      </div>

      {/* GitHub link row */}
      {project.github && (
        <div
          style={{
            padding: "0 0 8px 154px",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "10px",
          }}
          className="ledger-github-desktop"
        >
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: C.dateStamp,
              textDecoration: "none",
              borderBottom: `1px dotted ${C.dateStamp}`,
            }}
          >
            {project.github}
          </a>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT LEDGER ROW (MOBILE)
   ═══════════════════════════════════════════════════════════════ */
function ProjectRowMobile({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const isGreenBar = index % 2 === 1;
  const stamp = stamps[index % stamps.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
      style={{
        background: isGreenBar ? C.greenBar : C.paper,
        borderBottom: `1px solid ${C.rule}`,
        padding: "12px 0",
      }}
    >
      {/* Top line: ref + date + stamp */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "10px",
              color: C.ink,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {refNum(index)}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "10px",
              color: C.dateStamp,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {projectDates[index] || project.year}
          </span>
        </div>
        {index % 3 === 0 && (
          <RubberStamp
            text={stamp.text}
            color={stamp.color}
            rotation={stamp.rotation}
            size="sm"
          />
        )}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "15px",
          color: C.ink,
          lineHeight: 1.3,
          marginBottom: "6px",
        }}
      >
        {project.title.replace("\n", " ")}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "12px",
          color: "#555",
          lineHeight: 1.5,
          marginBottom: "8px",
        }}
      >
        {project.description}
      </div>

      {/* Tech tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          marginBottom: "8px",
        }}
      >
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "9px",
              padding: "2px 6px",
              border: `1px solid ${C.rule}`,
              borderRadius: "1px",
              color: C.ink,
              background: C.cream,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Debit/Credit row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-jetbrains)",
          fontSize: "11px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: "#888", fontSize: "10px", fontStyle: "italic" }}>
          {project.client}
        </span>
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ color: C.red }}>({project.tech.length})</span>
          <span style={{ color: C.green }}>+1.00</span>
          <span style={{ color: C.ink, fontWeight: 600 }}>
            {(index + 1) * 3}.00
          </span>
        </div>
      </div>

      {/* GitHub link */}
      {project.github && (
        <div
          style={{
            marginTop: "6px",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "10px",
          }}
        >
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: C.dateStamp,
              textDecoration: "none",
              borderBottom: `1px dotted ${C.dateStamp}`,
            }}
          >
            View Source
          </a>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LEDGER PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function LedgerPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        background: C.cream,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Global ruled background */}
      <LedgerBackground />

      {/* Binding holes (desktop only) */}
      {!isMobile && <BindingHoles />}

      {/* Running balance sidebar (desktop only) */}
      {!isMobile && <RunningBalance />}

      {/* ─── MAIN CONTENT ─── */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ═══════════════════════════════════════════════════════
           HERO SECTION
           ═══════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            paddingTop: isMobile ? "60px" : "100px",
            paddingBottom: "60px",
            borderBottom: `2px solid ${C.ink}`,
          }}
        >
          {/* Ledger header line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "3px",
              background: C.ink,
              transformOrigin: "left",
              marginBottom: "32px",
            }}
          />

          {/* Title block */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "flex-end",
              flexDirection: isMobile ? "column" : "row",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.dateStamp,
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  General Ledger &mdash; Fiscal Year 2025
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: isMobile ? "36px" : "56px",
                    color: C.ink,
                    lineHeight: 1.1,
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  GROX
                </h1>
                <div
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: isMobile ? "18px" : "24px",
                    color: "#666",
                    fontStyle: "italic",
                    marginTop: "4px",
                  }}
                >
                  AI Product Studio
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{ marginTop: "16px" }}
              >
                <FountainPenStroke width={isMobile ? 180 : 280} />
              </motion.div>
            </div>

            {/* Stamp cluster on hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMobile ? "flex-start" : "flex-end",
                gap: "12px",
              }}
            >
              <RubberStamp
                text="APPROVED"
                color={C.stamp}
                rotation={-3}
                size="lg"
              />
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10px",
                  color: C.dateStamp,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                Date: Feb 10, 2026
              </div>
            </motion.div>
          </div>

          {/* ─── Stats as T-Account ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "16px",
                marginTop: "32px",
              }}
            >
              <TAccount
                title="Projects Account"
                debits={[
                  { label: "Hours Invested", value: "2,400" },
                  { label: "Models Used", value: "12+" },
                ]}
                credits={[
                  { label: "Projects Shipped", value: stats[0].value },
                  { label: "Clients Served", value: "8" },
                ]}
              />
              <TAccount
                title="Technology Account"
                debits={[
                  { label: "AI Models", value: stats[1].value },
                  { label: "Frameworks", value: "6" },
                ]}
                credits={[
                  { label: "Languages", value: "3" },
                  { label: "Platforms", value: "4" },
                ]}
              />
              <TAccount
                title="Industry Account"
                debits={[
                  { label: "Sectors", value: stats[2].value },
                  { label: "Verticals", value: "5" },
                ]}
                credits={[
                  { label: "Enterprises", value: "4" },
                  { label: "Startups", value: "6" },
                ]}
              />
            </div>
          </motion.div>

          {/* Double rule at bottom of hero */}
          <div style={{ marginTop: "32px" }}>
            <div style={{ height: "2px", background: C.ink }} />
            <div style={{ height: "2px" }} />
            <div style={{ height: "1px", background: C.ink }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           PROJECTS SECTION — THE LEDGER
           ═══════════════════════════════════════════════════════ */}
        <section
          id="ledger-projects"
          style={{
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "8px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.dateStamp,
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Section 1
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: isMobile ? "24px" : "32px",
                  color: C.ink,
                  margin: 0,
                }}
              >
                Journal of Entries
              </h2>
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: "#888",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              Page 1 of 1
            </div>
          </div>

          <FountainPenStroke width={isMobile ? 140 : 200} color={C.ink} />

          <div style={{ height: "16px" }} />

          {/* Column headers */}
          <div className="ledger-desktop-only">
            <LedgerColumnHeader />
          </div>
          <div className="ledger-mobile-only">
            <LedgerColumnHeaderMobile />
          </div>

          {/* Project entries */}
          {projects.map((project, i) => (
            <div key={i}>
              <div className="ledger-desktop-only">
                <ProjectRow project={project} index={i} />
              </div>
              <div className="ledger-mobile-only">
                <ProjectRowMobile project={project} index={i} />
              </div>
            </div>
          ))}

          {/* Totals row */}
          <div
            style={{
              borderTop: `2px solid ${C.ink}`,
              marginTop: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 4px",
                fontFamily: "var(--font-jetbrains)",
                fontSize: "13px",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: C.ink }}>TOTALS</span>
              <div style={{ display: "flex", gap: isMobile ? "12px" : "40px" }}>
                <span style={{ color: C.red }}>
                  ({projects.reduce((s, p) => s + p.tech.length, 0)})
                </span>
                <span style={{ color: C.green }}>+10.00</span>
                <span style={{ color: C.ink }}>30.00</span>
              </div>
            </div>
            {/* Double rule */}
            <div style={{ height: "2px", background: C.ink }} />
            <div style={{ height: "2px" }} />
            <div style={{ height: "1px", background: C.ink }} />
          </div>

          {/* "PAID IN FULL" stamp at bottom */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "24px",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <FountainPenSignature />
            <RubberStamp
              text="PAID IN FULL"
              color={C.green}
              rotation={-4}
              size="lg"
            />
          </div>
        </section>

        <AnimatedLedgerLine />

        {/* ═══════════════════════════════════════════════════════
           EXPERTISE SECTION — ASSET CATEGORIES
           ═══════════════════════════════════════════════════════ */}
        <section
          style={{
            paddingTop: "48px",
            paddingBottom: "48px",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "8px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.dateStamp,
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Section 2
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: isMobile ? "24px" : "32px",
                  color: C.ink,
                  margin: 0,
                }}
              >
                Asset Categories
              </h2>
            </div>
            <RubberStamp
              text="VERIFIED \u2713"
              color={C.green}
              rotation={3}
              size="md"
            />
          </div>

          <FountainPenStroke width={isMobile ? 120 : 180} />

          <div style={{ height: "24px" }} />

          {/* Expertise grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "0",
            }}
          >
            {expertise.map((exp, i) => {
              const isGreenBar = i % 2 === 1;

              return (
                <ExpertiseCard key={i} exp={exp} index={i} isGreenBar={isGreenBar} />
              );
            })}
          </div>

          {/* Expertise totals */}
          <div
            style={{
              borderTop: `2px solid ${C.ink}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              marginTop: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.ink,
              }}
            >
              Total Asset Categories: {expertise.length}
            </span>
            <RubberStamp
              text="RECEIVED"
              color={C.dateStamp}
              rotation={-2}
              size="sm"
            />
          </div>
          {/* Double rule */}
          <div style={{ height: "2px", background: C.ink }} />
          <div style={{ height: "2px" }} />
          <div style={{ height: "1px", background: C.ink }} />
        </section>

        <AnimatedLedgerLine />

        {/* ═══════════════════════════════════════════════════════
           TOOLS SECTION — CHART OF ACCOUNTS
           ═══════════════════════════════════════════════════════ */}
        <section
          style={{
            paddingTop: "48px",
            paddingBottom: "48px",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "8px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.dateStamp,
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Section 3
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: isMobile ? "24px" : "32px",
                  color: C.ink,
                  margin: 0,
                }}
              >
                Chart of Accounts
              </h2>
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: "#888",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              Schedule A
            </div>
          </div>

          <FountainPenStroke width={isMobile ? 100 : 160} />

          <div style={{ height: "24px" }} />

          {/* Chart of accounts table */}
          <div
            style={{
              border: `1px solid ${C.rule}`,
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "100px 1fr"
                  : "50px 140px 1fr 80px",
                borderBottom: `2px solid ${C.ink}`,
                padding: "8px 12px",
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.ink,
                background: C.cream,
              }}
            >
              {!isMobile && <div>Acct#</div>}
              <div>Category</div>
              <div>Items</div>
              {!isMobile && <div style={{ textAlign: "right" }}>Count</div>}
            </div>

            {/* Tool rows */}
            {tools.map((tool, i) => (
              <ToolRow key={i} tool={tool} index={i} isMobile={isMobile} />
            ))}

            {/* Footer total */}
            <div
              style={{
                borderTop: `2px solid ${C.ink}`,
                padding: "10px 12px",
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-jetbrains)",
                fontSize: "12px",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                background: C.cream,
              }}
            >
              <span style={{ color: C.ink }}>
                TOTAL ACCOUNTS: {tools.length}
              </span>
              <span style={{ color: C.green }}>
                {tools.reduce((s, t) => s + t.items.length, 0)} items
              </span>
            </div>
          </div>

          {/* Stamp row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <FountainPenSignature />
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <RubberStamp
                text="APPROVED"
                color={C.stamp}
                rotation={2}
                size="md"
              />
              <RubberStamp
                text="VERIFIED \u2713"
                color={C.green}
                rotation={-4}
                size="md"
              />
            </div>
          </div>
        </section>

        <AnimatedLedgerLine />

        {/* ═══════════════════════════════════════════════════════
           FOOTER — CLOSING STATEMENT
           ═══════════════════════════════════════════════════════ */}
        <footer
          style={{
            paddingTop: "48px",
            paddingBottom: "120px",
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.dateStamp,
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              Closing Statement
            </div>
            <h2
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: isMobile ? "24px" : "32px",
                color: C.ink,
                margin: 0,
              }}
            >
              End of Ledger
            </h2>
            <FountainPenStroke
              width={isMobile ? 100 : 140}
              className=""
            />
          </div>

          {/* Summary T-account */}
          <div
            style={{
              maxWidth: "500px",
              marginBottom: "40px",
            }}
          >
            <TAccount
              title="Final Reconciliation"
              debits={[
                { label: "Projects", value: "10" },
                { label: "Technologies", value: `${tools.reduce((s, t) => s + t.items.length, 0)}` },
                { label: "Asset Categories", value: `${expertise.length}` },
              ]}
              credits={[
                { label: "Shipped", value: "30+" },
                { label: "AI Models", value: "12+" },
                { label: "Industries", value: "8" },
              ]}
            />
          </div>

          {/* Closing notes */}
          <div
            style={{
              background: C.paper,
              border: `1px solid ${C.rule}`,
              borderRadius: "2px",
              padding: isMobile ? "20px" : "32px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "18px",
                color: C.ink,
                marginBottom: "16px",
              }}
            >
              Auditor&apos;s Note
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                color: "#555",
                lineHeight: 1.7,
                maxWidth: "600px",
              }}
            >
              This ledger certifies the professional portfolio of GROX &mdash; AI Product Studio.
              All entries have been verified, all projects have been shipped, and the balance
              reconciles. The undersigned attests to the completeness and accuracy of these records
              for the fiscal year ending December 2025.
            </div>

            <div style={{ marginTop: "24px", display: "flex", gap: "32px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    color: "#999",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Authorized Signature
                </div>
                <FountainPenSignature />
                <div
                  style={{
                    width: "180px",
                    height: "1px",
                    background: C.ink,
                    marginTop: "4px",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    color: "#999",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Date
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "13px",
                    color: C.dateStamp,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  02/10/2026
                </div>
                <div
                  style={{
                    width: "120px",
                    height: "1px",
                    background: C.ink,
                    marginTop: "4px",
                  }}
                />
              </div>

              <RubberStamp
                text="APPROVED"
                color={C.stamp}
                rotation={-5}
                size="lg"
              />
            </div>
          </div>

          {/* Final stamp row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            <RubberStamp
              text="PAID IN FULL"
              color={C.green}
              rotation={3}
              size="lg"
            />
            <RubberStamp
              text="RECEIVED"
              color={C.dateStamp}
              rotation={-2}
              size="lg"
            />
            <RubberStamp
              text="VERIFIED \u2713"
              color={C.green}
              rotation={4}
              size="lg"
            />
          </div>

          {/* Double rule */}
          <div style={{ height: "2px", background: C.ink }} />
          <div style={{ height: "2px" }} />
          <div style={{ height: "1px", background: C.ink }} />

          {/* Copyright */}
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontFamily: "var(--font-inter)",
              fontSize: "11px",
              color: "#999",
            }}
          >
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              &copy; 2025 GROX &mdash; AI Product Studio. All accounts balanced.
            </span>
          </div>
        </footer>
      </div>

      {/* ─── Responsive Styles ─── */}
      <style jsx global>{`
        .ledger-desktop-only {
          display: block;
        }
        .ledger-mobile-only {
          display: none;
        }
        .ledger-row-desktop {
          display: grid !important;
        }
        .ledger-github-desktop {
          display: block;
        }

        @media (max-width: 767px) {
          .ledger-desktop-only {
            display: none !important;
          }
          .ledger-mobile-only {
            display: block !important;
          }
          .ledger-row-desktop {
            display: none !important;
          }
          .ledger-github-desktop {
            display: none !important;
          }
        }

        /* Custom scrollbar for ledger feel */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${C.cream};
        }
        ::-webkit-scrollbar-thumb {
          background: ${C.rule};
          border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a0b8c8;
        }
      `}</style>

      <ThemeSwitcher current="/ledger" variant="light" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPERTISE CARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function ExpertiseCard({
  exp,
  index,
  isGreenBar,
}: {
  exp: (typeof expertise)[number];
  index: number;
  isGreenBar: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const acctNum = `A-${String((index + 1) * 100).padStart(4, "0")}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: isGreenBar ? C.greenBar : C.paper,
        borderBottom: `1px solid ${C.rule}`,
        borderRight: index % 2 === 0 ? `1px solid ${C.rule}` : "none",
        padding: "20px 16px",
      }}
    >
      {/* Account number */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "10px",
          color: C.dateStamp,
          fontVariantNumeric: "tabular-nums",
          fontWeight: 500,
          marginBottom: "6px",
        }}
      >
        {acctNum}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "17px",
          color: C.ink,
          marginBottom: "8px",
          lineHeight: 1.3,
        }}
      >
        {exp.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "12px",
          color: "#555",
          lineHeight: 1.6,
        }}
      >
        {exp.body}
      </div>

      {/* Asset value */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-jetbrains)",
          fontSize: "11px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: "#999" }}>Asset Value:</span>
        <span style={{ color: C.green, fontWeight: 600 }}>
          {((index + 1) * 2500).toLocaleString()}.00
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOL ROW COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function ToolRow({
  tool,
  index,
  isMobile,
}: {
  tool: (typeof tools)[number];
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const isGreenBar = index % 2 === 1;
  const acctNum = `${(index + 1) * 1000}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "100px 1fr"
          : "50px 140px 1fr 80px",
        padding: "10px 12px",
        borderBottom: `1px solid ${C.rule}`,
        background: isGreenBar ? C.greenBar : C.paper,
        alignItems: "center",
        gap: "0",
      }}
    >
      {/* Account number */}
      {!isMobile && (
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "11px",
            color: C.dateStamp,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {acctNum}
        </div>
      )}

      {/* Category */}
      <div
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "14px",
          color: C.ink,
          fontWeight: 400,
        }}
      >
        {tool.label}
      </div>

      {/* Items */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {tool.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "10px",
              padding: "2px 8px",
              border: `1px solid ${C.rule}`,
              borderRadius: "1px",
              color: C.ink,
              background: C.cream,
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Count */}
      {!isMobile && (
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "12px",
            color: C.green,
            fontWeight: 600,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {tool.items.length}
        </div>
      )}
    </motion.div>
  );
}
