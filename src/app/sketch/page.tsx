import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sketch Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Sketch theme.",
};

export default function Page() {
  return <ThemePage />;
}
