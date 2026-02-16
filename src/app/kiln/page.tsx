import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiln Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Kiln theme.",
};

export default function Page() {
  return <ThemePage />;
}
