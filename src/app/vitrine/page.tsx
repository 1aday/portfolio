import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vitrine Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Vitrine theme.",
};

export default function Page() {
  return <ThemePage />;
}
