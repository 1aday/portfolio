import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Petroglyph Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Petroglyph theme.",
};

export default function Page() {
  return <ThemePage />;
}
