import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membrane Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Membrane theme.",
};

export default function Page() {
  return <ThemePage />;
}
