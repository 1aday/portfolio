import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liquid Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Liquid theme.",
};

export default function Page() {
  return <ThemePage />;
}
