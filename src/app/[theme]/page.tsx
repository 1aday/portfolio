import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const themeNames = [
  "abacus","brutal","cosmos","midnight","zen","almanac","aurora","earth",
  "glass","neon","paper","terminal","noir","prism","carbon",
  "aperture","apothecary",
] as const;
type ThemeName = (typeof themeNames)[number];

const themeComponents: Record<ThemeName, ReturnType<typeof dynamic>> = {
  abacus: dynamic(() => import("@/themes/abacus/ThemePage")),
  brutal: dynamic(() => import("@/themes/brutal/ThemePage")),
  cosmos: dynamic(() => import("@/themes/cosmos/ThemePage")),
  midnight: dynamic(() => import("@/themes/midnight/ThemePage")),
  zen: dynamic(() => import("@/themes/zen/ThemePage")),
  almanac: dynamic(() => import("@/themes/almanac/ThemePage")),
  aurora: dynamic(() => import("@/themes/aurora/ThemePage")),
  earth: dynamic(() => import("@/themes/earth/ThemePage")),
  glass: dynamic(() => import("@/themes/glass/ThemePage")),
  neon: dynamic(() => import("@/themes/neon/ThemePage")),
  paper: dynamic(() => import("@/themes/paper/ThemePage")),
  terminal: dynamic(() => import("@/themes/terminal/ThemePage")),
  noir: dynamic(() => import("@/themes/noir/ThemePage")),
  prism: dynamic(() => import("@/themes/prism/ThemePage")),
  carbon: dynamic(() => import("@/themes/carbon/ThemePage")),
  aperture: dynamic(() => import("@/themes/aperture/ThemePage")),
  apothecary: dynamic(() => import("@/themes/apothecary/ThemePage")),
};

export function generateStaticParams() {
  return themeNames.map((theme) => ({ theme }));
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const Component = themeComponents[theme as ThemeName];
  if (!Component) notFound();
  return <Component />;
}
