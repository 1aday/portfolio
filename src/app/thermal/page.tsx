import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thermal Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Thermal theme.",
};

export default function Page() {
  return <ThemePage />;
}
