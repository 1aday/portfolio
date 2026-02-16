import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Origami Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Origami theme.",
};

export default function Page() {
  return <ThemePage />;
}
