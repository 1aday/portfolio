import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cassette Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Cassette theme.",
};

export default function Page() {
  return <ThemePage />;
}
