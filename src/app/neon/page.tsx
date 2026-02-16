import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neon Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Neon theme.",
};

export default function Page() {
  return <ThemePage />;
}
