import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billboard Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Billboard theme.",
};

export default function Page() {
  return <ThemePage />;
}
