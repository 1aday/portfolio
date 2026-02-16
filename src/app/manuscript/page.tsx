import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manuscript Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Manuscript theme.",
};

export default function Page() {
  return <ThemePage />;
}
