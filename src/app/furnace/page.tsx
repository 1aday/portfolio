import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Furnace Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Furnace theme.",
};

export default function Page() {
  return <ThemePage />;
}
