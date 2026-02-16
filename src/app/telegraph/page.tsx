import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telegraph Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Telegraph theme.",
};

export default function Page() {
  return <ThemePage />;
}
