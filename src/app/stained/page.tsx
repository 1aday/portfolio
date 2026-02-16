import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stained Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Stained theme.",
};

export default function Page() {
  return <ThemePage />;
}
