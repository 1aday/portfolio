import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terrazzo Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Terrazzo theme.",
};

export default function Page() {
  return <ThemePage />;
}
