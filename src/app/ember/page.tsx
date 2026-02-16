import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ember Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Ember theme.",
};

export default function Page() {
  return <ThemePage />;
}
