import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glass Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Glass theme.",
};

export default function Page() {
  return <ThemePage />;
}
