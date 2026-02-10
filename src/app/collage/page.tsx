"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects, stats, expertise, tools } from "../data/projects";
import ThemeSwitcher from "../components/ThemeSwitcher";

/* ─── Palette ─── */
const C = {
  cream: "#F8F4EF",
  navy: "#1B2838",
  pink: "#E8786F",
  mustard: "#D4A843",
  white: "#FFFFFF",
  navyLight: "rgba(27,40,56,0.06)",
  navyMuted: "rgba(27,40,56,0.55)",
  pinkLight: "rgba(232,120,111,0.45)",
  mustardLight: "rgba(212,168,67,0.40)",
  navyHalf: "rgba(27,40,56,0.50)",
};

/* ─── Helpers ─── */
function cardRotation(index: number): number {
  return (index % 5 - 2) * 1.5;
}

/* Card style variants */
type CardVariant = "bordered" | "shadow" | "torn" | "polaroid";

function getCardVariant(index: number): CardVariant {
  const variants: CardVariant[] = ["bordered", "shadow", "torn", "polaroid"];
  return variants[index % 4];
}

function getCardStyle(variant: CardVariant) {
  switch (variant) {
    case "bordered":
      return {
        border: `3px solid ${C.navy}`,
        boxShadow: "2px 2px 8px rgba(0,0,0,0.06)",
      };
    case "shadow":
      return {
        border: "none",
        boxShadow: "4px 6px 20px rgba(27,40,56,0.15), 0 2px 6px rgba(0,0,0,0.08)",
      };
    case "torn":
      return {
        border: "none",
        boxShadow: "2px 3px 12px rgba(0,0,0,0.08)",
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 4px), 98% 100%, 95% calc(100% - 2px), 90% 100%, 85% calc(100% - 3px), 80% 100%, 75% calc(100% - 1px), 70% 100%, 65% calc(100% - 4px), 60% 100%, 55% calc(100% - 2px), 50% 100%, 45% calc(100% - 3px), 40% 100%, 35% calc(100% - 1px), 30% 100%, 25% calc(100% - 4px), 20% 100%, 15% calc(100% - 2px), 10% 100%, 5% calc(100% - 3px), 0% 100%)",
      };
    case "polaroid":
      return {
        border: "none",
        boxShadow: "3px 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
        padding: "8px 8px 32px 8px",
      };
  }
}

/* ─── Paper Grain Overlay ─── */
function PaperGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}

/* ─── Washi Tape Strip ─── */
function WashiTape({
  color,
  rotation = 8,
  top = -10,
  left,
  right,
  width = 60,
}: {
  color: string;
  rotation?: number;
  top?: number;
  left?: number;
  right?: number;
  width?: number;
}) {
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        width: `${width}px`,
        height: "20px",
        background: color,
        transform: `rotate(${rotation}deg)`,
        top: `${top}px`,
        left: left !== undefined ? `${left}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        borderRadius: "1px",
        opacity: 0.7,
      }}
    />
  );
}

/* ─── Pushpin ─── */
function Pushpin({ top = -6, left, right }: { top?: number; left?: number; right?: number }) {
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, #E74C3C, #8B1A1A)`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
        top: `${top}px`,
        left: left !== undefined ? `${left}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
      }}
    />
  );
}

/* ─── Section Header with Washi Accent ─── */
function SectionHeader({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative inline-block mb-12"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute -top-2 -left-3 z-0"
        style={{
          width: "80px",
          height: "18px",
          background: C.mustardLight,
          transform: "rotate(-3deg)",
          borderRadius: "1px",
        }}
      />
      <h2
        className="relative z-[1] text-3xl md:text-4xl tracking-tight font-[family-name:var(--font-dm-serif)]"
        style={{ color: C.navy }}
      >
        {children}
      </h2>
    </motion.div>
  );
}

/* ─── Animated Card Wrapper ─── */
function AnimatedCard({
  children,
  index,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const rot = cardRotation(index);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 + (index % 3) * 15, rotate: rot + (index % 2 === 0 ? -3 : 3) }}
      animate={
        inView
          ? { opacity: 1, y: 0, rotate: rot }
          : {}
      }
      whileHover={{
        rotate: 0,
        scale: 1.03,
        boxShadow: "6px 10px 30px rgba(27,40,56,0.18)",
        zIndex: 20,
      }}
      transition={{ duration: 0.4, ease: "easeOut", delay: (index % 5) * 0.08 }}
      style={{
        transformOrigin: "center center",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Navigation ─── */
function Navigation() {
  const links = [
    { label: "WORK", href: "#work", color: C.pink },
    { label: "NOTES", href: "#notes", color: C.mustard },
    { label: "MATERIALS", href: "#materials", color: C.navy },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ background: "rgba(248,244,239,0.92)", borderBottom: `1px solid ${C.navyLight}` }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-2xl tracking-wide font-[family-name:var(--font-dm-serif)]"
          style={{ color: C.navy }}
        >
          GROX
        </a>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 text-xs tracking-[0.2em] font-[family-name:var(--font-josefin)] transition-colors duration-300 hover:opacity-70"
              style={{ color: C.navy }}
            >
              <span
                className="inline-block w-[6px] h-[6px] rounded-full"
                style={{ background: link.color }}
              />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: C.cream }}
    >
      {/* Decorative washi strips at edges */}
      <WashiTape color={C.pinkLight} rotation={12} top={80} left={30} width={90} />
      <WashiTape color={C.mustardLight} rotation={-5} top={120} right={60} width={70} />
      <WashiTape color={C.pinkLight} rotation={-8} top={200} left={100} width={50} />

      <div className="relative z-[2] max-w-4xl text-center">
        {/* Subtle angled subtitle */}
        <motion.p
          className="text-sm tracking-[0.3em] uppercase mb-8 font-[family-name:var(--font-josefin)]"
          style={{ color: C.navyMuted, transform: "rotate(1deg)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          AI Product Engineer
        </motion.p>

        {/* Main title at slight angle */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-12 font-[family-name:var(--font-dm-serif)]"
          style={{ color: C.navy, transform: "rotate(-1deg)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          I turn AI models into
          <br />
          <span style={{ color: C.pink }}>products people use</span>
        </motion.h1>

        {/* Stats on overlapping "index cards" */}
        <motion.div
          className="flex justify-center items-start gap-0 mt-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {stats.map((stat, i) => {
            const rotations = [-4, 1.5, -2];
            const offsets = [0, -12, -8];
            const accents = [C.pink, C.mustard, C.navy];
            return (
              <motion.div
                key={stat.label}
                className="relative bg-white px-8 py-6 w-[150px]"
                style={{
                  transform: `rotate(${rotations[i]}deg)`,
                  marginTop: `${offsets[i]}px`,
                  marginLeft: i > 0 ? "-16px" : "0",
                  boxShadow: "3px 4px 14px rgba(27,40,56,0.1), 0 1px 3px rgba(0,0,0,0.05)",
                  zIndex: 3 - i,
                }}
                whileHover={{
                  rotate: 0,
                  scale: 1.06,
                  zIndex: 10,
                  boxShadow: "5px 8px 24px rgba(27,40,56,0.16)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Small colored accent line at top */}
                <div
                  className="absolute top-0 left-[50%] -translate-x-1/2 h-[3px] w-[40px] rounded-full"
                  style={{ background: accents[i] }}
                />
                <div
                  className="text-3xl font-[family-name:var(--font-dm-serif)]"
                  style={{ color: C.navy }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase mt-1 font-[family-name:var(--font-josefin)]"
                  style={{ color: C.navyMuted }}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom washi strips */}
      <WashiTape color={C.mustardLight} rotation={6} top={-60} right={80} width={80} />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-josefin)]"
          style={{ color: C.navyMuted }}
        >
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-6"
          style={{ background: C.navyMuted }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const variant = getCardVariant(index);
  const style = getCardStyle(variant);
  const hasWashi = index % 3 === 0;
  const hasPin = index % 3 === 1;
  const washiColors = [C.pinkLight, C.mustardLight, C.navyHalf];

  return (
    <AnimatedCard
      index={index}
      className="relative"
      style={{ zIndex: projects.length - index }}
    >
      <div
        className="relative bg-white overflow-hidden"
        style={{
          borderRadius: variant === "torn" ? "0" : "2px",
          ...style,
          ...(variant === "polaroid"
            ? { padding: "8px 8px 32px 8px" }
            : { padding: 0 }),
        }}
      >
        {/* Washi tape accent */}
        {hasWashi && (
          <WashiTape
            color={washiColors[index % washiColors.length]}
            rotation={5 + (index % 3) * 4}
            top={-8}
            left={12 + (index % 4) * 10}
            width={55 + (index % 3) * 10}
          />
        )}

        {/* Pushpin */}
        {hasPin && <Pushpin top={-5} right={16 + (index % 3) * 8} />}

        {/* Image area */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "16/10",
            ...(variant === "polaroid" ? {} : { padding: 0 }),
          }}
        >
          <img
            src={project.image}
            alt={project.title.replace("\n", " ")}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {/* Year badge */}
          <div
            className="absolute top-3 right-3 px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase font-[family-name:var(--font-josefin)]"
            style={{
              background: C.navy,
              color: C.cream,
            }}
          >
            {project.year}
          </div>
        </div>

        {/* Content */}
        <div className={variant === "polaroid" ? "pt-3 px-1 pb-0" : "p-5"}>
          <h3
            className="text-lg leading-tight mb-2 font-[family-name:var(--font-dm-serif)]"
            style={{ color: C.navy }}
          >
            {project.title.replace("\n", " ")}
          </h3>
          <p
            className="text-xs leading-relaxed mb-3 font-[family-name:var(--font-josefin)]"
            style={{ color: C.navyMuted }}
          >
            {project.description}
          </p>
          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] tracking-[0.1em] px-2 py-0.5 font-[family-name:var(--font-josefin)]"
                style={{
                  background: C.navyLight,
                  color: C.navy,
                  border: `1px solid ${C.navyLight}`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}

/* ─── Projects Section ─── */
function ProjectsSection() {
  return (
    <section id="work" className="relative py-24 px-6" style={{ background: C.cream }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader>SELECTED WORK</SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {projects.map((project, i) => (
            <div
              key={project.title}
              style={{
                marginTop: i % 3 === 1 ? "28px" : i % 3 === 2 ? "14px" : "0",
              }}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative edge washi */}
      <WashiTape color={C.pinkLight} rotation={-6} top={40} right={20} width={70} />
      <WashiTape color={C.mustardLight} rotation={10} top={80} left={15} width={55} />
    </section>
  );
}

/* ─── Expertise Section ─── */
function ExpertiseSection() {
  return (
    <section id="notes" className="relative py-24 px-6" style={{ background: C.cream }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader>NOTES &amp; CLIPPINGS</SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {expertise.map((item, i) => {
            const rotations = [-2, 1.5, -1, 2.5];
            const rot = rotations[i % rotations.length];

            return (
              <AnimatedCard
                key={item.title}
                index={i}
                className="relative"
                style={{ zIndex: expertise.length - i }}
              >
                <div
                  className="relative bg-white p-6"
                  style={{
                    transform: `rotate(${rot}deg)`,
                    boxShadow: "2px 3px 12px rgba(27,40,56,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                    borderLeft: i % 2 === 0
                      ? `3px solid ${C.pink}`
                      : `3px solid ${C.mustard}`,
                  }}
                >
                  {/* Pushpin at top center */}
                  <Pushpin top={-6} left={24} />

                  <h3
                    className="text-lg mb-3 font-[family-name:var(--font-dm-serif)]"
                    style={{ color: C.navy }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed font-[family-name:var(--font-josefin)]"
                    style={{ color: C.navyMuted }}
                  >
                    {item.body}
                  </p>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* Decorative washi */}
      <WashiTape color={C.navyHalf} rotation={-4} top={60} left={40} width={60} />
    </section>
  );
}

/* ─── Tools Section ─── */
function ToolsSection() {
  const edgeColors = [C.pink, C.mustard, C.navy, C.pink, C.mustard, C.navy];

  return (
    <section id="materials" className="relative py-24 px-6" style={{ background: C.cream }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader>MATERIAL SWATCHES</SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
          {tools.map((category, i) => {
            const rot = (i % 5 - 2) * 1.2;

            return (
              <AnimatedCard
                key={category.label}
                index={i}
                className="relative"
                style={{
                  zIndex: tools.length - i,
                  marginTop: i % 3 === 1 ? "12px" : i % 3 === 2 ? "6px" : "0",
                }}
              >
                <div
                  className="relative bg-white p-5"
                  style={{
                    transform: `rotate(${rot}deg)`,
                    boxShadow: "2px 3px 10px rgba(27,40,56,0.08)",
                    borderLeft: `4px solid ${edgeColors[i % edgeColors.length]}`,
                  }}
                >
                  {/* Small washi at top for some cards */}
                  {i % 2 === 0 && (
                    <WashiTape
                      color={i % 4 === 0 ? C.pinkLight : C.mustardLight}
                      rotation={7}
                      top={-8}
                      right={10}
                      width={45}
                    />
                  )}

                  <h4
                    className="text-xs tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-josefin)]"
                    style={{ color: C.navyMuted }}
                  >
                    {category.label}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="text-[11px] px-2.5 py-1 font-[family-name:var(--font-josefin)]"
                        style={{
                          color: C.navy,
                          background: C.cream,
                          border: `1px solid rgba(27,40,56,0.12)`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* Decorative washi */}
      <WashiTape color={C.mustardLight} rotation={8} top={30} right={50} width={65} />
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="relative py-20 px-6" style={{ background: C.cream }}>
      {/* Divider line */}
      <div
        className="max-w-5xl mx-auto mb-16 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${C.navyLight}, ${C.navy}20, ${C.navyLight}, transparent)`,
        }}
      />

      <div className="flex justify-center">
        <motion.div
          className="relative bg-white px-10 py-6 text-center"
          style={{
            transform: "rotate(-1.5deg)",
            boxShadow: "3px 4px 14px rgba(27,40,56,0.1)",
          }}
          initial={{ opacity: 0, y: 20, rotate: -5 }}
          animate={inView ? { opacity: 1, y: 0, rotate: -1.5 } : {}}
          transition={{ duration: 0.5 }}
          whileHover={{ rotate: 0, scale: 1.03 }}
        >
          <Pushpin top={-6} left={20} />
          <p
            className="text-sm tracking-[0.2em] uppercase font-[family-name:var(--font-josefin)]"
            style={{ color: C.navyMuted }}
          >
            Curated by{" "}
            <span className="font-[family-name:var(--font-dm-serif)] normal-case text-base" style={{ color: C.navy }}>
              GROX
            </span>{" "}
            &bull; 2025
          </p>
        </motion.div>
      </div>

      <div className="mt-16">
        <ThemeSwitcher current="/collage" variant="light" />
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function CollagePage() {
  return (
    <main
      className="relative min-h-screen font-[family-name:var(--font-josefin)]"
      style={{ background: C.cream, color: C.navy }}
    >
      <PaperGrain />
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <ExpertiseSection />
      <ToolsSection />
      <Footer />
    </main>
  );
}
