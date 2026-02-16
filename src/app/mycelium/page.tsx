import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mycelium Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Mycelium theme.",
};

export default function Page() {
  return <ThemePage />;
}
