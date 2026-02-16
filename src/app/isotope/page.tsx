import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isotope Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Isotope theme.",
};

export default function Page() {
  return <ThemePage />;
}
