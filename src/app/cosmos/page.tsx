import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmos Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Cosmos theme.",
};

export default function Page() {
  return <ThemePage />;
}
