import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prism Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Prism theme.",
};

export default function Page() {
  return <ThemePage />;
}
