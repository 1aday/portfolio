import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abacus Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Abacus theme.",
};

export default function Page() {
  return <ThemePage />;
}
