import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sextant Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Sextant theme.",
};

export default function Page() {
  return <ThemePage />;
}
