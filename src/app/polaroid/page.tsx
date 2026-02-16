import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polaroid Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Polaroid theme.",
};

export default function Page() {
  return <ThemePage />;
}
