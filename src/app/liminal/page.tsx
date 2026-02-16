import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liminal Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Liminal theme.",
};

export default function Page() {
  return <ThemePage />;
}
