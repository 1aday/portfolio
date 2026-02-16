import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminal Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Terminal theme.",
};

export default function Page() {
  return <ThemePage />;
}
