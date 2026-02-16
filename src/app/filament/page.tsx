import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Filament Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Filament theme.",
};

export default function Page() {
  return <ThemePage />;
}
