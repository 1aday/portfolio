import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topo Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Topo theme.",
};

export default function Page() {
  return <ThemePage />;
}
