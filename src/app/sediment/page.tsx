import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sediment Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Sediment theme.",
};

export default function Page() {
  return <ThemePage />;
}
