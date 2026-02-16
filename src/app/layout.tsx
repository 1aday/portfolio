import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grox — AI Product Studio",
  description:
    "Portfolio of AI-powered products built by Grox. From computer vision to multi-model orchestration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: "smooth" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;700&family=Josefin+Sans:wght@300;400;500;600&family=Manrope:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: "'Outfit', sans-serif",
          ["--font-body" as string]: "'Outfit', sans-serif",
          ["--font-display" as string]: "'Cormorant Garamond', serif",
          ["--font-playfair" as string]: "'Playfair Display', serif",
          ["--font-inter" as string]: "'Inter', sans-serif",
          ["--font-space-grotesk" as string]: "'Space Grotesk', sans-serif",
          ["--font-jetbrains" as string]: "'JetBrains Mono', monospace",
          ["--font-instrument" as string]: "'Instrument Serif', serif",
          ["--font-manrope" as string]: "'Manrope', sans-serif",
          ["--font-dm-serif" as string]: "'DM Serif Display', serif",
          ["--font-josefin" as string]: "'Josefin Sans', sans-serif",
          ["--font-orbitron" as string]: "'Orbitron', sans-serif",
          ["--font-sora" as string]: "'Sora', sans-serif",
          ["--font-jakarta" as string]: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
