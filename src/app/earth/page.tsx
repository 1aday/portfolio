import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earth Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Earth theme.",
};

export default function Page() {
  return <ThemePage />;
}
