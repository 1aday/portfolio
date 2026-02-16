import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zen Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Zen theme.",
};

export default function Page() {
  return <ThemePage />;
}
