import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Distillery Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Distillery theme.",
};

export default function Page() {
  return <ThemePage />;
}
