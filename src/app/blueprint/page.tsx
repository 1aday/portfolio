import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blueprint Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Blueprint theme.",
};

export default function Page() {
  return <ThemePage />;
}
