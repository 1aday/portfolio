import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hologram Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Hologram theme.",
};

export default function Page() {
  return <ThemePage />;
}
