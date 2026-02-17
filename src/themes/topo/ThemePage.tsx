"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "@/app/data/projects";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { getProjectImage } from "@/lib/theme-images";

/* ═══════════════════════════════════════════════════════════════════ */
/*  TOPO THEME — Topographic / Cartographic Contour Map Aesthetic     */
/* ═══════════════════════════════════════════════════════════════════ */

/* ────────────── Color Palette ────────────── */
const C = {
  bg: "#F5F1EB",
  contour: "#8B7355",
  contourLight: "rgba(139, 115, 85, 0.08)",
  contourMed: "rgba(139, 115, 85, 0.15)",
  contourStrong: "rgba(139, 115, 85, 0.30)",
  accent: "#84CC16",
  accentDim: "rgba(132, 204, 22, 0.6)",
  accentFaint: "rgba(132, 204, 22, 0.10)",
  earth: "#3D3527",
  text: "#2D2A26",
  textMuted: "#6B6560",
  grid: "rgba(139, 115, 85, 0.08)",
  cardBg: "#FAF8F4",
  cardBorder: "rgba(139, 115, 85, 0.18)",
  parchmentDark: "#EDE8E0",
};

/* ────────────── Utility: Generate fake coordinates ────────────── */
function fakeCoord(index: number): string {
  const lat = (47.3 + index * 0.042).toFixed(3);
  const lng = (8.5 + index * 0.031).toFixed(3);
  return `${lat}°N ${lng}°E`;
}

/* ────────────── Utility: Elevation from index ────────────── */
function elevation(index: number): string {
  return `${(2000 + index * 312).toLocaleString()}m`;
}

/* ────────────── Utility: Elevation color scale ────────────── */
function elevationColor(index: number): string {
  const colors = [
    "#6B8F3A", // lowland green
    "#7B9A3E",
    "#8BA542",
    "#9BAF48",
    "#A8AA50",
    "#B5A058",
    "#B89460",
    "#B08558",
    "#9F7550",
    "#8B6548", // alpine brown
  ];
  return colors[index % colors.length];
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SVG CONTOUR LINES BACKGROUND                                      */
/* ═══════════════════════════════════════════════════════════════════ */
function ContourBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Dense contour cluster 1: Center-right ── */}
      <motion.path
        d="M780 420 C820 370, 920 355, 960 420 C1000 485, 940 550, 870 560 C800 570, 720 530, 710 465 C700 400, 740 375, 780 420Z"
        stroke={C.contour}
        strokeOpacity="0.12"
        strokeWidth="1.2"
        animate={{
          d: [
            "M780 420 C820 370, 920 355, 960 420 C1000 485, 940 550, 870 560 C800 570, 720 530, 710 465 C700 400, 740 375, 780 420Z",
            "M785 418 C825 365, 925 350, 965 418 C1005 486, 942 555, 868 562 C794 569, 718 528, 708 462 C698 396, 745 372, 785 418Z",
            "M780 420 C820 370, 920 355, 960 420 C1000 485, 940 550, 870 560 C800 570, 720 530, 710 465 C700 400, 740 375, 780 420Z",
          ],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M780 420 C840 340, 970 320, 1020 420 C1070 520, 990 600, 890 615 C790 630, 680 570, 660 455 C640 340, 720 310, 780 420Z"
        stroke={C.contour}
        strokeOpacity="0.09"
        strokeWidth="1"
        animate={{
          d: [
            "M780 420 C840 340, 970 320, 1020 420 C1070 520, 990 600, 890 615 C790 630, 680 570, 660 455 C640 340, 720 310, 780 420Z",
            "M783 418 C843 336, 975 316, 1025 418 C1075 520, 993 605, 888 618 C783 631, 675 568, 655 452 C635 336, 723 306, 783 418Z",
            "M780 420 C840 340, 970 320, 1020 420 C1070 520, 990 600, 890 615 C790 630, 680 570, 660 455 C640 340, 720 310, 780 420Z",
          ],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M780 420 C860 300, 1030 275, 1090 420 C1150 565, 1040 660, 910 680 C780 700, 630 610, 600 445 C570 280, 700 250, 780 420Z"
        stroke={C.contour}
        strokeOpacity="0.06"
        strokeWidth="0.8"
        animate={{
          d: [
            "M780 420 C860 300, 1030 275, 1090 420 C1150 565, 1040 660, 910 680 C780 700, 630 610, 600 445 C570 280, 700 250, 780 420Z",
            "M784 417 C864 296, 1035 271, 1095 417 C1155 563, 1044 665, 908 683 C772 701, 625 608, 595 442 C565 276, 704 246, 784 417Z",
            "M780 420 C860 300, 1030 275, 1090 420 C1150 565, 1040 660, 910 680 C780 700, 630 610, 600 445 C570 280, 700 250, 780 420Z",
          ],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M780 420 C880 260, 1100 230, 1170 420 C1240 610, 1100 730, 930 750 C760 770, 570 650, 530 435 C490 220, 680 190, 780 420Z"
        stroke={C.contour}
        strokeOpacity="0.04"
        strokeWidth="0.6"
        animate={{
          d: [
            "M780 420 C880 260, 1100 230, 1170 420 C1240 610, 1100 730, 930 750 C760 770, 570 650, 530 435 C490 220, 680 190, 780 420Z",
            "M785 416 C885 256, 1106 226, 1176 416 C1246 606, 1106 736, 926 754 C756 772, 565 646, 525 430 C485 214, 685 186, 785 416Z",
            "M780 420 C880 260, 1100 230, 1170 420 C1240 610, 1100 730, 930 750 C760 770, 570 650, 530 435 C490 220, 680 190, 780 420Z",
          ],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Contour cluster 2: Top-left ── */}
      <motion.path
        d="M280 240 C320 200, 410 195, 440 240 C470 285, 420 330, 360 335 C300 340, 250 305, 245 265 C240 225, 260 210, 280 240Z"
        stroke={C.contour}
        strokeOpacity="0.10"
        strokeWidth="1"
        animate={{
          d: [
            "M280 240 C320 200, 410 195, 440 240 C470 285, 420 330, 360 335 C300 340, 250 305, 245 265 C240 225, 260 210, 280 240Z",
            "M283 238 C323 196, 414 191, 444 238 C474 285, 422 334, 358 338 C294 342, 248 303, 243 262 C238 221, 263 207, 283 238Z",
            "M280 240 C320 200, 410 195, 440 240 C470 285, 420 330, 360 335 C300 340, 250 305, 245 265 C240 225, 260 210, 280 240Z",
          ],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M280 240 C340 170, 470 160, 510 240 C550 320, 480 390, 390 400 C300 410, 210 360, 195 280 C180 200, 220 175, 280 240Z"
        stroke={C.contour}
        strokeOpacity="0.07"
        strokeWidth="0.8"
        animate={{
          d: [
            "M280 240 C340 170, 470 160, 510 240 C550 320, 480 390, 390 400 C300 410, 210 360, 195 280 C180 200, 220 175, 280 240Z",
            "M284 237 C344 166, 474 156, 514 237 C554 318, 484 394, 394 404 C304 414, 214 358, 199 277 C184 196, 224 171, 284 237Z",
            "M280 240 C340 170, 470 160, 510 240 C550 320, 480 390, 390 400 C300 410, 210 360, 195 280 C180 200, 220 175, 280 240Z",
          ],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M280 240 C360 140, 540 125, 590 240 C640 355, 550 450, 420 465 C290 480, 160 400, 140 290 C120 180, 200 145, 280 240Z"
        stroke={C.contour}
        strokeOpacity="0.04"
        strokeWidth="0.6"
        animate={{
          d: [
            "M280 240 C360 140, 540 125, 590 240 C640 355, 550 450, 420 465 C290 480, 160 400, 140 290 C120 180, 200 145, 280 240Z",
            "M284 236 C364 136, 544 121, 594 236 C644 351, 554 454, 424 469 C294 484, 164 396, 144 286 C124 176, 204 141, 284 236Z",
            "M280 240 C360 140, 540 125, 590 240 C640 355, 550 450, 420 465 C290 480, 160 400, 140 290 C120 180, 200 145, 280 240Z",
          ],
        }}
        transition={{ duration: 29, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Contour cluster 3: Bottom-left ── */}
      <motion.path
        d="M200 680 C240 650, 320 645, 340 680 C360 715, 320 745, 270 748 C220 751, 180 720, 178 695 C176 670, 185 660, 200 680Z"
        stroke={C.contour}
        strokeOpacity="0.08"
        strokeWidth="0.9"
        animate={{
          d: [
            "M200 680 C240 650, 320 645, 340 680 C360 715, 320 745, 270 748 C220 751, 180 720, 178 695 C176 670, 185 660, 200 680Z",
            "M203 678 C243 647, 323 642, 343 678 C363 714, 323 748, 273 751 C223 754, 183 718, 181 693 C179 668, 188 657, 203 678Z",
            "M200 680 C240 650, 320 645, 340 680 C360 715, 320 745, 270 748 C220 751, 180 720, 178 695 C176 670, 185 660, 200 680Z",
          ],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M200 680 C260 620, 380 610, 410 680 C440 750, 370 810, 290 820 C210 830, 140 780, 128 710 C116 640, 150 615, 200 680Z"
        stroke={C.contour}
        strokeOpacity="0.05"
        strokeWidth="0.7"
        animate={{
          d: [
            "M200 680 C260 620, 380 610, 410 680 C440 750, 370 810, 290 820 C210 830, 140 780, 128 710 C116 640, 150 615, 200 680Z",
            "M204 677 C264 616, 384 606, 414 677 C444 748, 374 814, 294 824 C214 834, 144 778, 132 707 C120 636, 154 611, 204 677Z",
            "M200 680 C260 620, 380 610, 410 680 C440 750, 370 810, 290 820 C210 830, 140 780, 128 710 C116 640, 150 615, 200 680Z",
          ],
        }}
        transition={{ duration: 27, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Small peak: Far right ── */}
      <motion.path
        d="M1200 320 C1220 300, 1270 298, 1280 320 C1290 342, 1265 360, 1240 362 C1215 364, 1195 345, 1194 330 C1193 315, 1198 308, 1200 320Z"
        stroke={C.contour}
        strokeOpacity="0.11"
        strokeWidth="1"
        animate={{
          d: [
            "M1200 320 C1220 300, 1270 298, 1280 320 C1290 342, 1265 360, 1240 362 C1215 364, 1195 345, 1194 330 C1193 315, 1198 308, 1200 320Z",
            "M1203 318 C1223 297, 1273 295, 1283 318 C1293 341, 1268 362, 1243 364 C1218 366, 1198 344, 1197 328 C1196 312, 1201 305, 1203 318Z",
            "M1200 320 C1220 300, 1270 298, 1280 320 C1290 342, 1265 360, 1240 362 C1215 364, 1195 345, 1194 330 C1193 315, 1198 308, 1200 320Z",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SECTION CONTOUR DIVIDER                                           */
/* ═══════════════════════════════════════════════════════════════════ */
function ContourDivider() {
  return (
    <div className="relative w-full h-12 my-4">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 24 C80 18, 160 30, 240 22 C320 14, 400 28, 480 20 C560 12, 640 32, 720 24 C800 16, 880 30, 960 22 C1040 14, 1120 26, 1200 24"
          stroke={C.contour}
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        <path
          d="M0 28 C100 22, 200 34, 300 26 C400 18, 500 32, 600 24 C700 16, 800 34, 900 26 C1000 18, 1100 30, 1200 28"
          stroke={C.contour}
          strokeOpacity="0.10"
          strokeWidth="0.8"
        />
        <path
          d="M0 20 C120 14, 240 28, 360 18 C480 8, 600 26, 720 20 C840 14, 960 28, 1080 18 C1140 14, 1170 22, 1200 20"
          stroke={C.contour}
          strokeOpacity="0.06"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  WAYPOINT MARKER SVG                                               */
/* ═══════════════════════════════════════════════════════════════════ */
function WaypointPin({
  size = 20,
  color = C.accent,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="12,2 6,14 18,14"
        fill={color}
        fillOpacity="0.85"
      />
      <circle cx="12" cy="16" r="3.5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="16" r="1.2" fill={color} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  TOPOGRAPHIC LEGEND (fixed top-right)                              */
/* ═══════════════════════════════════════════════════════════════════ */
function TopoLegend() {
  return (
    <motion.div
      className="fixed top-20 right-4 z-40 hidden lg:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <div
        className="p-3 font-[family-name:var(--font-jetbrains)]"
        style={{
          background: `${C.bg}F5`,
          border: `1px solid ${C.contour}30`,
          backdropFilter: "blur(8px)",
          minWidth: 160,
        }}
      >
        {/* Title */}
        <div
          className="text-[8px] tracking-[0.3em] uppercase font-bold mb-3 pb-2"
          style={{ color: C.contour, borderBottom: `1px solid ${C.contour}20` }}
        >
          MAP LEGEND
        </div>

        {/* Contour interval */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex flex-col gap-[2px]">
            <div className="w-5 h-[1px]" style={{ background: `${C.contour}60` }} />
            <div className="w-5 h-[1px]" style={{ background: `${C.contour}40` }} />
            <div className="w-5 h-[1px]" style={{ background: `${C.contour}20` }} />
          </div>
          <span className="text-[8px]" style={{ color: C.textMuted }}>
            Contour Int. 200m
          </span>
        </div>

        {/* Waypoint */}
        <div className="flex items-center gap-2 mb-2">
          <WaypointPin size={14} />
          <span className="text-[8px]" style={{ color: C.textMuted }}>
            Survey Waypoint
          </span>
        </div>

        {/* Peak marker */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-[14px] h-[14px] flex items-center justify-center"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: C.accent }}
            />
          </div>
          <span className="text-[8px]" style={{ color: C.textMuted }}>
            Elevation Peak
          </span>
        </div>

        {/* Grid reference */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-[14px] h-[14px] flex items-center justify-center">
            <div
              className="w-3 h-3"
              style={{
                backgroundImage: `linear-gradient(${C.contour}20 1px, transparent 1px), linear-gradient(90deg, ${C.contour}20 1px, transparent 1px)`,
                backgroundSize: "4px 4px",
              }}
            />
          </div>
          <span className="text-[8px]" style={{ color: C.textMuted }}>
            Grid Reference
          </span>
        </div>

        {/* Datum */}
        <div
          className="text-[7px] tracking-[0.2em] uppercase pt-2"
          style={{ color: `${C.contour}60`, borderTop: `1px solid ${C.contour}20` }}
        >
          DATUM: WGS-84
          <br />
          SCALE: 1:50,000
          <br />
          SHEET: GRX-01
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SCROLL REVEAL WRAPPER                                             */
/* ═══════════════════════════════════════════════════════════════════ */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  PROJECT CARD — Survey Point                                       */
/* ═══════════════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const elev = elevation(index);
  const coord = fakeCoord(index);
  const wpNum = String(index + 1).padStart(2, "0");
  const eColor = elevationColor(index);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      className="relative"
    >
      <motion.a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block relative rounded-lg overflow-hidden"
        style={{
          background: C.cardBg,
          border: `1px solid ${C.cardBorder}`,
          borderLeft: `3px solid ${eColor}`,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          boxShadow: hovered
            ? `0 8px 32px rgba(139,115,85,0.12), 0 2px 8px rgba(139,115,85,0.08)`
            : `0 1px 4px rgba(0,0,0,0.04)`,
        }}
      >
        {/* Hover contour decoration */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0 100 C100 80, 200 120, 300 90 C400 60, 500 110, 600 85 C700 60, 750 95, 800 100"
              stroke={C.accent}
              strokeOpacity="0.12"
              strokeWidth="1"
            />
            <path
              d="M0 110 C120 90, 240 130, 360 100 C480 70, 600 120, 720 95 C760 85, 780 105, 800 110"
              stroke={C.accent}
              strokeOpacity="0.08"
              strokeWidth="0.8"
            />
          </svg>
        </motion.div>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
            <img
              src={getProjectImage("topo", project.image)}
              alt={project.title.replace("\n", " ")}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
              style={{
                filter: "saturate(0.6) sepia(0.15) brightness(0.95)",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, rgba(245,241,235,0.15), rgba(139,115,85,0.08))`,
              }}
            />
            {/* Waypoint badge overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <motion.div
                animate={hovered ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.6, repeat: hovered ? Infinity : 0 }}
              >
                <WaypointPin size={18} color={C.accent} />
              </motion.div>
              <span
                className="text-[10px] font-bold tracking-[0.2em] font-[family-name:var(--font-jetbrains)] px-1.5 py-0.5 rounded-sm"
                style={{
                  background: "rgba(245,241,235,0.92)",
                  color: C.accent,
                  backdropFilter: "blur(4px)",
                }}
              >
                WP-{wpNum}
              </span>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 p-5 md:p-6">
            {/* Top metadata row */}
            <div className="flex items-start justify-between mb-3 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] tracking-[0.15em] uppercase font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: C.textMuted }}
                >
                  {project.client}
                </span>
                <span className="text-[10px]" style={{ color: C.contourMed }}>
                  |
                </span>
                <span
                  className="text-[10px] tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: C.textMuted }}
                >
                  {project.year}
                </span>
              </div>
              <div className="flex items-center gap-3 font-[family-name:var(--font-jetbrains)]">
                <span
                  className="text-[9px] tracking-[0.15em]"
                  style={{ color: C.accent }}
                >
                  EL. {elev}
                </span>
                <span
                  className="text-[8px] tracking-[0.1em] hidden sm:inline"
                  style={{ color: `${C.contour}60` }}
                >
                  {coord}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-lg md:text-xl font-bold leading-tight mb-2 font-[family-name:var(--font-space-grotesk)]"
              style={{ color: C.text, whiteSpace: "pre-line" }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-4 font-[family-name:var(--font-inter)]"
              style={{ color: C.textMuted }}
            >
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] tracking-wide font-[family-name:var(--font-inter)] px-2 py-0.5 rounded-sm"
                  style={{
                    color: C.contour,
                    background: C.contourLight,
                    border: `1px solid ${C.contour}15`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAP SCALE BAR                                                     */
/* ═══════════════════════════════════════════════════════════════════ */
function ScaleBar() {
  return (
    <div className="flex flex-col items-center gap-1 mt-2">
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-2"
            style={{
              width: 24,
              background: i % 2 === 0 ? C.contour : "transparent",
              opacity: 0.4,
              border: `1px solid ${C.contour}40`,
              borderRight: i < 4 ? "none" : `1px solid ${C.contour}40`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between font-[family-name:var(--font-jetbrains)]" style={{ width: 120 }}>
        <span className="text-[7px]" style={{ color: `${C.contour}60` }}>0</span>
        <span className="text-[7px]" style={{ color: `${C.contour}60` }}>1km</span>
        <span className="text-[7px]" style={{ color: `${C.contour}60` }}>2km</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SECTION HEADER COMPONENT                                          */
/* ═══════════════════════════════════════════════════════════════════ */
function SectionHeader({
  label,
  title,
  coord,
}: {
  label: string;
  title: string;
  coord: string;
}) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: C.contour }}
        >
          {label}
        </span>
        <span
          className="text-[8px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
          style={{ color: `${C.contour}60` }}
        >
          {coord}
        </span>
      </div>
      <h2
        className="text-2xl md:text-3xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]"
        style={{ color: C.text }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                               */
/* ═══════════════════════════════════════════════════════════════════ */
export default function TopoPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ═══════ COORDINATE GRID OVERLAY ═══════ */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              ${C.grid} 0px,
              ${C.grid} 1px,
              transparent 1px,
              transparent 80px
            ),
            repeating-linear-gradient(
              90deg,
              ${C.grid} 0px,
              ${C.grid} 1px,
              transparent 1px,
              transparent 80px
            )
          `,
        }}
      />

      {/* ═══════ TOPOGRAPHIC LEGEND (Fixed) ═══════ */}
      <TopoLegend />

      {/* ═══════ FIXED NAVIGATION ═══════ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
        style={{
          background: scrolled ? `${C.bg}F2` : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${C.contour}18`
            : "1px solid transparent",
          transition: "background 0.3s, border-bottom 0.3s, backdrop-filter 0.3s",
        }}
      >
        {/* Left: coordinate label */}
        <div
          className="text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: C.contour }}
        >
          47.3°N 8.5°E
        </div>

        {/* Center: nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "WAYPOINTS", href: "#projects" },
            { label: "ELEVATION", href: "#expertise" },
            { label: "INSTRUMENTS", href: "#tools" },
            { label: "TRANSMIT", href: "#footer" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-space-grotesk)] hover:opacity-100 transition-opacity"
              style={{ color: C.contour, opacity: 0.65 }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: survey label */}
        <div
          className="text-[10px] tracking-[0.15em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: C.accent }}
        >
          TOPO SURVEY
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════ */}
      {/*  HERO SECTION                               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* Contour lines background */}
        <ContourBackground />

        {/* Grid reference marks */}
        <div
          className="absolute top-20 left-6 text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: `${C.contour}40` }}
        >
          NW-01
        </div>
        <div
          className="absolute top-20 right-6 text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)] hidden lg:block"
          style={{ color: `${C.contour}40` }}
        >
          NE-02
        </div>
        <div
          className="absolute bottom-28 left-6 text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: `${C.contour}40` }}
        >
          SW-03
        </div>
        <div
          className="absolute bottom-28 right-6 text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
          style={{ color: `${C.contour}40` }}
        >
          SE-04
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Topographic label */}
          <motion.div
            className="text-[10px] tracking-[0.4em] uppercase mb-6 font-[family-name:var(--font-jetbrains)]"
            style={{ color: C.contour }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            TOPOGRAPHIC SURVEY — AI PRODUCT TERRAIN
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-8 font-[family-name:var(--font-space-grotesk)]"
            style={{ color: C.text }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            I turn AI models into{" "}
            <span
              className="relative inline-block"
              style={{ color: C.accent }}
            >
              products
              {/* Contour accent under the word */}
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
                style={{ height: 6 }}
              >
                <path
                  d="M0 4 C30 2, 60 6, 100 3 C140 0, 170 5, 200 4"
                  stroke={C.accent}
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 6 C40 4, 80 8, 120 5 C160 2, 180 7, 200 6"
                  stroke={C.accent}
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
              </svg>
            </span>{" "}
            people use
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12 font-[family-name:var(--font-inter)]"
            style={{ color: C.textMuted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Full-stack AI engineer. Surveying the terrain from model to deployment
            — charting multi-model systems, real-time pipelines, and
            production infrastructure.
          </motion.p>

          {/* Stats as survey readings data panel */}
          <motion.div
            className="inline-flex gap-0 rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${C.contour}25`,
              background: `${C.cardBg}E8`,
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            {/* Data panel label */}
            <div
              className="px-3 py-3 flex items-center"
              style={{
                background: C.contourLight,
                borderRight: `1px solid ${C.contour}15`,
              }}
            >
              <span
                className="text-[8px] tracking-[0.2em] uppercase font-bold font-[family-name:var(--font-jetbrains)] [writing-mode:vertical-rl] rotate-180"
                style={{ color: C.contour }}
              >
                READINGS
              </span>
            </div>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="px-5 sm:px-7 py-3 text-center"
                style={{
                  borderRight:
                    i < stats.length - 1
                      ? `1px solid ${C.contour}15`
                      : "none",
                }}
              >
                <div
                  className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: C.text }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[9px] tracking-[0.2em] uppercase mt-1 font-[family-name:var(--font-jetbrains)]"
                  style={{ color: C.contour }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span
            className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
            style={{ color: `${C.contour}60` }}
          >
            DESCEND
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M8 2 L8 16 M3 12 L8 17 L13 12"
                stroke={C.contour}
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  PROJECTS / WAYPOINTS                       */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="projects"
        className="relative px-6 sm:px-8 md:px-12 py-24 md:py-32 max-w-[1200px] mx-auto"
      >
        <Reveal>
          <SectionHeader
            label="FIELD SURVEY — SECTOR 47.3°N"
            title="WAYPOINTS"
            coord="10 SURVEY POINTS"
          />
          <ContourDivider />
        </Reveal>

        <div className="mt-10 space-y-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}

          {/* Trail end marker */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 pt-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: C.accent, opacity: 0.5 }}
              />
              <span
                className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
                style={{ color: `${C.contour}80` }}
              >
                END OF SURVEY — {projects.length} WAYPOINTS MAPPED — MAX ELEVATION {elevation(projects.length - 1)}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  EXPERTISE / ELEVATION ZONES                */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="expertise"
        className="relative px-6 sm:px-8 md:px-12 py-24 md:py-32 max-w-[1200px] mx-auto"
      >
        <Reveal>
          <SectionHeader
            label="ALTITUDE CLASSIFICATION"
            title="ELEVATION ZONES"
            coord="CONTOUR INT. 1200m"
          />
          <ContourDivider />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {expertise.map((item, i) => {
            const zoneElevation = (i + 1) * 1200;
            const gradientFrom = i === 0
              ? "rgba(132,204,22,0.06)"
              : i === 1
              ? "rgba(132,204,22,0.04)"
              : i === 2
              ? "rgba(139,115,85,0.05)"
              : "rgba(139,115,85,0.08)";
            const gradientTo = "transparent";
            const zoneName = ["LOWLAND", "MIDLAND", "HIGHLAND", "ALPINE"][i];

            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div
                  className="relative rounded-lg p-5 md:p-6 overflow-hidden h-full"
                  style={{
                    background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo}), ${C.cardBg}`,
                    border: `1px solid ${C.cardBorder}`,
                    borderLeft: `3px solid ${elevationColor(i * 2 + 1)}`,
                  }}
                >
                  {/* Zone header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[8px] tracking-[0.2em] uppercase font-bold font-[family-name:var(--font-jetbrains)] px-1.5 py-0.5 rounded-sm"
                          style={{
                            background: C.accentFaint,
                            color: C.accent,
                          }}
                        >
                          {zoneName}
                        </span>
                        <span
                          className="text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-jetbrains)]"
                          style={{ color: C.contour }}
                        >
                          ZONE {String(i + 1).padStart(2, "0")} — {zoneElevation}m
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold font-[family-name:var(--font-space-grotesk)]"
                        style={{ color: C.text }}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Mini contour rings */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 44 44"
                      fill="none"
                      style={{ opacity: 0.25, flexShrink: 0 }}
                    >
                      <path
                        d={`M22 22 C${26 + i * 2} ${18 - i}, ${34 + i * 2} ${18 - i}, ${36 + i * 2} 22 C${38 + i * 2} ${26 + i}, ${30 + i * 2} ${32 + i}, 22 ${32 + i} C${14 - i * 2} ${32 + i}, ${6 - i * 2} ${26 + i}, ${8 - i * 2} 22 C${10 - i * 2} ${18 - i}, ${18 - i * 2} ${18 - i}, 22 22Z`}
                        stroke={C.contour}
                        strokeWidth="0.8"
                      />
                      <path
                        d={`M22 22 C${24 + i} ${20 - i * 0.5}, ${28 + i} ${20 - i * 0.5}, ${29 + i} 22 C${30 + i} ${24 + i * 0.5}, ${26 + i} ${27 + i * 0.5}, 22 ${27 + i * 0.5} C${18 - i} ${27 + i * 0.5}, ${14 - i} ${24 + i * 0.5}, ${15 - i} 22 C${16 - i} ${20 - i * 0.5}, ${20 - i} ${20 - i * 0.5}, 22 22Z`}
                        stroke={C.contour}
                        strokeWidth="0.6"
                      />
                      <circle cx="22" cy="22" r={1.5} fill={C.accent} fillOpacity="0.6" />
                    </svg>
                  </div>

                  <p
                    className="text-sm leading-relaxed font-[family-name:var(--font-inter)]"
                    style={{ color: C.textMuted }}
                  >
                    {item.body}
                  </p>

                  {/* Decorative contour ring in background */}
                  <div
                    className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full pointer-events-none"
                    style={{
                      border: `1px solid ${C.contour}08`,
                    }}
                  />
                  <div
                    className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full pointer-events-none"
                    style={{
                      border: `1px solid ${C.contour}06`,
                    }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  TOOLS / SURVEY INSTRUMENTS                 */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="tools"
        className="relative px-6 sm:px-8 md:px-12 py-24 md:py-32 max-w-[1200px] mx-auto"
      >
        <Reveal>
          <SectionHeader
            label="CARTOGRAPHIC INDEX"
            title="SURVEY INSTRUMENTS"
            coord={`${tools.reduce((a, t) => a + t.items.length, 0)} TOOLS`}
          />
          <ContourDivider />
        </Reveal>

        <div className="mt-10">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((category, i) => (
                <Reveal
                  key={category.label}
                  delay={i * 0.06}
                  className="relative"
                >
                  <div
                    className="p-5 md:p-6 h-full"
                    style={{
                      borderBottom:
                        i < tools.length - 1
                          ? `1px solid ${C.contour}10`
                          : "none",
                      borderRight:
                        (i + 1) % 3 !== 0
                          ? `1px solid ${C.contour}10`
                          : "none",
                    }}
                  >
                    {/* Category header with instrument icon */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full flex items-center justify-center"
                        style={{
                          background: elevationColor(i * 2),
                          opacity: 0.7,
                        }}
                      />
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase font-bold font-[family-name:var(--font-space-grotesk)]"
                        style={{ color: C.contour }}
                      >
                        {category.label}
                      </span>
                      <span
                        className="text-[8px] font-[family-name:var(--font-jetbrains)] ml-auto"
                        style={{ color: `${C.contour}50` }}
                      >
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                    </div>

                    {/* Items as survey readings */}
                    <div className="space-y-1.5">
                      {category.items.map((item, j) => (
                        <div key={item} className="flex items-center gap-2">
                          <div
                            className="w-[5px] h-[1px]"
                            style={{ background: C.accent, opacity: 0.5 }}
                          />
                          <span
                            className="text-[12px] font-[family-name:var(--font-inter)]"
                            style={{ color: C.textMuted }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Tools footer */}
            <div
              className="px-5 md:px-6 py-3 flex items-center justify-between"
              style={{
                borderTop: `1px solid ${C.contour}12`,
                background: C.contourLight,
              }}
            >
              <span
                className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
                style={{ color: `${C.contour}80` }}
              >
                {tools.reduce((acc, t) => acc + t.items.length, 0)} INSTRUMENTS CATALOGUED
              </span>
              <span
                className="text-[8px] tracking-[0.3em] uppercase font-[family-name:var(--font-jetbrains)]"
                style={{ color: `${C.contour}60` }}
              >
                REV. 2025
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  FOOTER / CONTACT                           */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="footer"
        className="relative px-6 sm:px-8 md:px-12 py-24 md:py-32 max-w-[1200px] mx-auto"
      >
        <Reveal>
          <SectionHeader
            label="TRANSMISSION POINT"
            title="ESTABLISH CONTACT"
            coord="47.300°N 8.500°E"
          />
          <ContourDivider />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 text-center max-w-lg mx-auto mb-10">
            <p
              className="text-base leading-relaxed font-[family-name:var(--font-inter)]"
              style={{ color: C.textMuted }}
            >
              Charting new territory in AI product development. If you have a project
              that needs to go from model to production, let&apos;s map the route together.
            </p>
          </div>

          <div className="text-center mb-12">
            <a
              href="mailto:hello@grox.dev"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-300 font-[family-name:var(--font-space-grotesk)]"
              style={{
                background: C.accent,
                color: "#FFFFFF",
                boxShadow: `0 2px 12px rgba(132,204,22,0.25)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(132,204,22,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 12px rgba(132,204,22,0.25)";
              }}
            >
              <WaypointPin size={16} color="#FFFFFF" />
              Send Coordinates
            </a>
          </div>
        </Reveal>

        {/* Contact info */}
        <Reveal delay={0.2}>
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-6 rounded-lg"
            style={{
              background: C.contourLight,
              border: `1px solid ${C.contour}12`,
            }}
          >
            <div className="flex items-center gap-6 font-[family-name:var(--font-jetbrains)]">
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.2em]" style={{ color: C.contour }}>
                  EMAIL
                </span>
                <a
                  href="mailto:hello@grox.studio"
                  className="text-[11px] tracking-wider transition-colors duration-300"
                  style={{ color: C.text }}
                >
                  hello@grox.studio
                </a>
              </div>
              <div
                className="hidden md:block w-[1px] h-4"
                style={{ background: `${C.contour}25` }}
              />
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.2em]" style={{ color: C.contour }}>
                  GITHUB
                </span>
                <a
                  href="https://github.com/1aday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-wider transition-colors duration-300"
                  style={{ color: C.text }}
                >
                  github.com/1aday
                </a>
              </div>
            </div>
            <div
              className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: C.contour }}
            >
              REMOTE / WORLDWIDE
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/*  MAP FOOTER — Scale Bar & Credits           */}
      {/* ═══════════════════════════════════════════ */}
      <footer
        className="relative px-6 sm:px-8 md:px-12 py-12"
        style={{ borderTop: `1px solid ${C.contour}15` }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left — map info */}
            <div className="flex items-center gap-4">
              <WaypointPin size={16} color={C.contour} />
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-jetbrains)]"
                style={{ color: C.textMuted }}
              >
                47.3°N 8.5°E &bull; GROX TOPO SURVEY &bull; 2025
              </span>
            </div>

            {/* Center — Scale bar */}
            <ScaleBar />

            {/* Right — datum info */}
            <div
              className="text-[9px] tracking-[0.2em] uppercase font-[family-name:var(--font-jetbrains)]"
              style={{ color: `${C.contour}60` }}
            >
              DATUM: WGS-84 &bull; CONTOUR INT: 200m &bull; SHEET 01/01
            </div>
          </div>

          {/* Elevation ruler divider */}
          <div className="mt-8 mb-6">
            <div className="relative h-[1px]" style={{ background: `${C.contour}12` }}>
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((pct) => (
                <div
                  key={pct}
                  className="absolute top-0 w-[1px] h-2 -translate-y-1/2"
                  style={{
                    left: `${pct}%`,
                    background:
                      pct % 20 === 0 ? `${C.contour}40` : `${C.contour}20`,
                    height: pct % 20 === 0 ? 8 : 4,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span
                className="text-[7px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
                style={{ color: `${C.contour}40` }}
              >
                0m
              </span>
              <span
                className="text-[7px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
                style={{ color: `${C.contour}40` }}
              >
                {elevation(projects.length - 1)}
              </span>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center justify-between">
            <span
              className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: `${C.contour}50` }}
            >
              &copy; {new Date().getFullYear()} GROX AI
            </span>
            <span
              className="text-[9px] tracking-[0.2em] font-[family-name:var(--font-jetbrains)]"
              style={{ color: `${C.contour}50` }}
            >
              ALL RIGHTS RESERVED
            </span>
          </div>
        </div>
      </footer>

      {/* ═══════ THEME SWITCHER ═══════ */}
      <ThemeSwitcher current="/topo" variant="light" />

      {/* ═══════ GLOBAL STYLES ═══════ */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${C.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 115, 85, 0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 115, 85, 0.35);
        }
        ::selection {
          background: rgba(132, 204, 22, 0.2);
          color: ${C.text};
        }
      `}</style>
    </div>
  );
}
