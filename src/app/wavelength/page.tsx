import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wavelength Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Wavelength theme.",
};

export default function Page() {
  return <ThemePage />;
}
