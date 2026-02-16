import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deco Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Deco theme.",
};

export default function Page() {
  return <ThemePage />;
}
