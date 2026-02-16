import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Darktype Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Darktype theme.",
};

export default function Page() {
  return <ThemePage />;
}
