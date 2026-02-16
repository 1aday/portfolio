import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stratum Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Stratum theme.",
};

export default function Page() {
  return <ThemePage />;
}
