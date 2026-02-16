import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Tableau theme.",
};

export default function Page() {
  return <ThemePage />;
}
