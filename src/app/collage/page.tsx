import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collage Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Collage theme.",
};

export default function Page() {
  return <ThemePage />;
}
