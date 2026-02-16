import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lumen Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Lumen theme.",
};

export default function Page() {
  return <ThemePage />;
}
