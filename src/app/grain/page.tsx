import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grain Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Grain theme.",
};

export default function Page() {
  return <ThemePage />;
}
