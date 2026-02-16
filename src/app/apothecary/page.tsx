import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apothecary Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Apothecary theme.",
};

export default function Page() {
  return <ThemePage />;
}
