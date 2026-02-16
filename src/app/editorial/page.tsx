import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Editorial theme.",
};

export default function Page() {
  return <ThemePage />;
}
