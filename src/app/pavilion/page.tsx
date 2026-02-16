import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pavilion Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Pavilion theme.",
};

export default function Page() {
  return <ThemePage />;
}
