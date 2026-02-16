import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Depot Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Depot theme.",
};

export default function Page() {
  return <ThemePage />;
}
