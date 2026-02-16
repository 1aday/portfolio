import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ceramic Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Ceramic theme.",
};

export default function Page() {
  return <ThemePage />;
}
