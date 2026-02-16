import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resin Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Resin theme.",
};

export default function Page() {
  return <ThemePage />;
}
