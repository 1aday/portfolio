import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flux Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Flux theme.",
};

export default function Page() {
  return <ThemePage />;
}
