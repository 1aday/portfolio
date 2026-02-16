import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aperture Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Aperture theme.",
};

export default function Page() {
  return <ThemePage />;
}
