import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aurora Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Aurora theme.",
};

export default function Page() {
  return <ThemePage />;
}
