import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartouche Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Cartouche theme.",
};

export default function Page() {
  return <ThemePage />;
}
