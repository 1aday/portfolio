import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mosaic Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Mosaic theme.",
};

export default function Page() {
  return <ThemePage />;
}
