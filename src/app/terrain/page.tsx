import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terrain Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Terrain theme.",
};

export default function Page() {
  return <ThemePage />;
}
