import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercury Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Mercury theme.",
};

export default function Page() {
  return <ThemePage />;
}
