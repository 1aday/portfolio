import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almanac Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Almanac theme.",
};

export default function Page() {
  return <ThemePage />;
}
