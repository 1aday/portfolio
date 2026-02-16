import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patina Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Patina theme.",
};

export default function Page() {
  return <ThemePage />;
}
