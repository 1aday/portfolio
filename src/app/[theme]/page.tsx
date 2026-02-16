import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const themeRegistry: Record<string, { component: ReturnType<typeof dynamic>; title: string }> = {
  "abacus": {
    component: dynamic(() => import("../abacus/ThemePage")),
    title: "Abacus",
  },
  "almanac": {
    component: dynamic(() => import("../almanac/ThemePage")),
    title: "Almanac",
  },
  "aperture": {
    component: dynamic(() => import("../aperture/ThemePage")),
    title: "Aperture",
  },
  "apothecary": {
    component: dynamic(() => import("../apothecary/ThemePage")),
    title: "Apothecary",
  },
  "aquifer": {
    component: dynamic(() => import("../aquifer/ThemePage")),
    title: "Aquifer",
  },
  "archive": {
    component: dynamic(() => import("../archive/ThemePage")),
    title: "Archive",
  },
  "aurora": {
    component: dynamic(() => import("../aurora/ThemePage")),
    title: "Aurora",
  },
  "axiom": {
    component: dynamic(() => import("../axiom/ThemePage")),
    title: "Axiom",
  },
  "bazaar": {
    component: dynamic(() => import("../bazaar/ThemePage")),
    title: "Bazaar",
  },
  "billboard": {
    component: dynamic(() => import("../billboard/ThemePage")),
    title: "Billboard",
  },
  "blueprint": {
    component: dynamic(() => import("../blueprint/ThemePage")),
    title: "Blueprint",
  },
  "brutal": {
    component: dynamic(() => import("../brutal/ThemePage")),
    title: "Brutal",
  },
  "carbon": {
    component: dynamic(() => import("../carbon/ThemePage")),
    title: "Carbon",
  },
  "cartouche": {
    component: dynamic(() => import("../cartouche/ThemePage")),
    title: "Cartouche",
  },
  "cassette": {
    component: dynamic(() => import("../cassette/ThemePage")),
    title: "Cassette",
  },
  "cathedral": {
    component: dynamic(() => import("../cathedral/ThemePage")),
    title: "Cathedral",
  },
  "ceramic": {
    component: dynamic(() => import("../ceramic/ThemePage")),
    title: "Ceramic",
  },
  "cipher": {
    component: dynamic(() => import("../cipher/ThemePage")),
    title: "Cipher",
  },
  "circuit": {
    component: dynamic(() => import("../circuit/ThemePage")),
    title: "Circuit",
  },
  "clockwork": {
    component: dynamic(() => import("../clockwork/ThemePage")),
    title: "Clockwork",
  },
  "collage": {
    component: dynamic(() => import("../collage/ThemePage")),
    title: "Collage",
  },
  "corsair": {
    component: dynamic(() => import("../corsair/ThemePage")),
    title: "Corsair",
  },
  "cosmos": {
    component: dynamic(() => import("../cosmos/ThemePage")),
    title: "Cosmos",
  },
  "darkfield": {
    component: dynamic(() => import("../darkfield/ThemePage")),
    title: "Darkfield",
  },
  "darkroom": {
    component: dynamic(() => import("../darkroom/ThemePage")),
    title: "Darkroom",
  },
  "darktype": {
    component: dynamic(() => import("../darktype/ThemePage")),
    title: "Darktype",
  },
  "deco": {
    component: dynamic(() => import("../deco/ThemePage")),
    title: "Deco",
  },
  "depot": {
    component: dynamic(() => import("../depot/ThemePage")),
    title: "Depot",
  },
  "diorama": {
    component: dynamic(() => import("../diorama/ThemePage")),
    title: "Diorama",
  },
  "distillery": {
    component: dynamic(() => import("../distillery/ThemePage")),
    title: "Distillery",
  },
  "duotone": {
    component: dynamic(() => import("../duotone/ThemePage")),
    title: "Duotone",
  },
  "earth": {
    component: dynamic(() => import("../earth/ThemePage")),
    title: "Earth",
  },
  "editorial": {
    component: dynamic(() => import("../editorial/ThemePage")),
    title: "Editorial",
  },
  "ember": {
    component: dynamic(() => import("../ember/ThemePage")),
    title: "Ember",
  },
  "filament": {
    component: dynamic(() => import("../filament/ThemePage")),
    title: "Filament",
  },
  "flux": {
    component: dynamic(() => import("../flux/ThemePage")),
    title: "Flux",
  },
  "frost": {
    component: dynamic(() => import("../frost/ThemePage")),
    title: "Frost",
  },
  "furnace": {
    component: dynamic(() => import("../furnace/ThemePage")),
    title: "Furnace",
  },
  "gazette": {
    component: dynamic(() => import("../gazette/ThemePage")),
    title: "Gazette",
  },
  "glass": {
    component: dynamic(() => import("../glass/ThemePage")),
    title: "Glass",
  },
  "grain": {
    component: dynamic(() => import("../grain/ThemePage")),
    title: "Grain",
  },
  "herbarium": {
    component: dynamic(() => import("../herbarium/ThemePage")),
    title: "Herbarium",
  },
  "hologram": {
    component: dynamic(() => import("../hologram/ThemePage")),
    title: "Hologram",
  },
  "isotope": {
    component: dynamic(() => import("../isotope/ThemePage")),
    title: "Isotope",
  },
  "ivory": {
    component: dynamic(() => import("../ivory/ThemePage")),
    title: "Ivory",
  },
  "kiln": {
    component: dynamic(() => import("../kiln/ThemePage")),
    title: "Kiln",
  },
  "kinetic": {
    component: dynamic(() => import("../kinetic/ThemePage")),
    title: "Kinetic",
  },
  "ledger": {
    component: dynamic(() => import("../ledger/ThemePage")),
    title: "Ledger",
  },
  "liminal": {
    component: dynamic(() => import("../liminal/ThemePage")),
    title: "Liminal",
  },
  "liquid": {
    component: dynamic(() => import("../liquid/ThemePage")),
    title: "Liquid",
  },
  "lumen": {
    component: dynamic(() => import("../lumen/ThemePage")),
    title: "Lumen",
  },
  "manuscript": {
    component: dynamic(() => import("../manuscript/ThemePage")),
    title: "Manuscript",
  },
  "marquee": {
    component: dynamic(() => import("../marquee/ThemePage")),
    title: "Marquee",
  },
  "membrane": {
    component: dynamic(() => import("../membrane/ThemePage")),
    title: "Membrane",
  },
  "mercury": {
    component: dynamic(() => import("../mercury/ThemePage")),
    title: "Mercury",
  },
  "midnight": {
    component: dynamic(() => import("../midnight/ThemePage")),
    title: "Midnight",
  },
  "mosaic": {
    component: dynamic(() => import("../mosaic/ThemePage")),
    title: "Mosaic",
  },
  "mycelium": {
    component: dynamic(() => import("../mycelium/ThemePage")),
    title: "Mycelium",
  },
  "neo": {
    component: dynamic(() => import("../neo/ThemePage")),
    title: "Neo",
  },
  "neon": {
    component: dynamic(() => import("../neon/ThemePage")),
    title: "Neon",
  },
  "noir": {
    component: dynamic(() => import("../noir/ThemePage")),
    title: "Noir",
  },
  "origami": {
    component: dynamic(() => import("../origami/ThemePage")),
    title: "Origami",
  },
  "paper": {
    component: dynamic(() => import("../paper/ThemePage")),
    title: "Paper",
  },
  "patina": {
    component: dynamic(() => import("../patina/ThemePage")),
    title: "Patina",
  },
  "pavilion": {
    component: dynamic(() => import("../pavilion/ThemePage")),
    title: "Pavilion",
  },
  "petroglyph": {
    component: dynamic(() => import("../petroglyph/ThemePage")),
    title: "Petroglyph",
  },
  "phenotype": {
    component: dynamic(() => import("../phenotype/ThemePage")),
    title: "Phenotype",
  },
  "polaroid": {
    component: dynamic(() => import("../polaroid/ThemePage")),
    title: "Polaroid",
  },
  "prism": {
    component: dynamic(() => import("../prism/ThemePage")),
    title: "Prism",
  },
  "propaganda": {
    component: dynamic(() => import("../propaganda/ThemePage")),
    title: "Propaganda",
  },
  "pulse": {
    component: dynamic(() => import("../pulse/ThemePage")),
    title: "Pulse",
  },
  "redline": {
    component: dynamic(() => import("../redline/ThemePage")),
    title: "Redline",
  },
  "resin": {
    component: dynamic(() => import("../resin/ThemePage")),
    title: "Resin",
  },
  "riso": {
    component: dynamic(() => import("../riso/ThemePage")),
    title: "Riso",
  },
  "sediment": {
    component: dynamic(() => import("../sediment/ThemePage")),
    title: "Sediment",
  },
  "sextant": {
    component: dynamic(() => import("../sextant/ThemePage")),
    title: "Sextant",
  },
  "shibori": {
    component: dynamic(() => import("../shibori/ThemePage")),
    title: "Shibori",
  },
  "signal": {
    component: dynamic(() => import("../signal/ThemePage")),
    title: "Signal",
  },
  "sketch": {
    component: dynamic(() => import("../sketch/ThemePage")),
    title: "Sketch",
  },
  "solarpunk": {
    component: dynamic(() => import("../solarpunk/ThemePage")),
    title: "Solarpunk",
  },
  "sonar": {
    component: dynamic(() => import("../sonar/ThemePage")),
    title: "Sonar",
  },
  "specimen": {
    component: dynamic(() => import("../specimen/ThemePage")),
    title: "Specimen",
  },
  "stained": {
    component: dynamic(() => import("../stained/ThemePage")),
    title: "Stained",
  },
  "stratum": {
    component: dynamic(() => import("../stratum/ThemePage")),
    title: "Stratum",
  },
  "studio": {
    component: dynamic(() => import("../studio/ThemePage")),
    title: "Studio",
  },
  "tableau": {
    component: dynamic(() => import("../tableau/ThemePage")),
    title: "Tableau",
  },
  "tarot": {
    component: dynamic(() => import("../tarot/ThemePage")),
    title: "Tarot",
  },
  "telegraph": {
    component: dynamic(() => import("../telegraph/ThemePage")),
    title: "Telegraph",
  },
  "terminal": {
    component: dynamic(() => import("../terminal/ThemePage")),
    title: "Terminal",
  },
  "terrain": {
    component: dynamic(() => import("../terrain/ThemePage")),
    title: "Terrain",
  },
  "terrazzo": {
    component: dynamic(() => import("../terrazzo/ThemePage")),
    title: "Terrazzo",
  },
  "tessera": {
    component: dynamic(() => import("../tessera/ThemePage")),
    title: "Tessera",
  },
  "thermal": {
    component: dynamic(() => import("../thermal/ThemePage")),
    title: "Thermal",
  },
  "tintype": {
    component: dynamic(() => import("../tintype/ThemePage")),
    title: "Tintype",
  },
  "topo": {
    component: dynamic(() => import("../topo/ThemePage")),
    title: "Topo",
  },
  "vapor": {
    component: dynamic(() => import("../vapor/ThemePage")),
    title: "Vapor",
  },
  "vitrine": {
    component: dynamic(() => import("../vitrine/ThemePage")),
    title: "Vitrine",
  },
  "wavelength": {
    component: dynamic(() => import("../wavelength/ThemePage")),
    title: "Wavelength",
  },
  "zen": {
    component: dynamic(() => import("../zen/ThemePage")),
    title: "Zen",
  },
};

type Props = {
  params: Promise<{ theme: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme } = await params;
  const entry = themeRegistry[theme];
  if (!entry) {
    return {};
  }
  return {
    title: entry.title,
  };
}

export default async function ThemePage({ params }: Props) {
  const { theme } = await params;
  const entry = themeRegistry[theme];
  if (!entry) {
    notFound();
  }
  const Component = entry.component;
  return <Component />;
}
