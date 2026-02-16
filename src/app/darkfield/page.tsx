import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Darkfield Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Darkfield theme.",
};

export default function Page() {
  return <ThemePage />;
}
