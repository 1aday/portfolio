import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sonar Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Sonar theme.",
};

export default function Page() {
  return <ThemePage />;
}
