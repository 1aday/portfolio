import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specimen Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Specimen theme.",
};

export default function Page() {
  return <ThemePage />;
}
