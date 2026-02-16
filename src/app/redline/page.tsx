import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redline Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Redline theme.",
};

export default function Page() {
  return <ThemePage />;
}
