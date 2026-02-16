import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarot Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Tarot theme.",
};

export default function Page() {
  return <ThemePage />;
}
