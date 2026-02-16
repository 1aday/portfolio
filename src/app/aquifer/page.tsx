import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aquifer Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Aquifer theme.",
};

export default function Page() {
  return <ThemePage />;
}
