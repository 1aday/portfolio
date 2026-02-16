import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Darkroom Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Darkroom theme.",
};

export default function Page() {
  return <ThemePage />;
}
