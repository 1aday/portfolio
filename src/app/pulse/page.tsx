import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulse Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Pulse theme.",
};

export default function Page() {
  return <ThemePage />;
}
