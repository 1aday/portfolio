import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corsair Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Corsair theme.",
};

export default function Page() {
  return <ThemePage />;
}
