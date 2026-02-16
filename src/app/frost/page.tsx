import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frost Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Frost theme.",
};

export default function Page() {
  return <ThemePage />;
}
