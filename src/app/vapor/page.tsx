import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vapor Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Vapor theme.",
};

export default function Page() {
  return <ThemePage />;
}
