import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signal Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Signal theme.",
};

export default function Page() {
  return <ThemePage />;
}
