import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Archive theme.",
};

export default function Page() {
  return <ThemePage />;
}
