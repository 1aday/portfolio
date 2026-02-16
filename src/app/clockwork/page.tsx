import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clockwork Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Clockwork theme.",
};

export default function Page() {
  return <ThemePage />;
}
