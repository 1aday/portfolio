import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bazaar Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Bazaar theme.",
};

export default function Page() {
  return <ThemePage />;
}
