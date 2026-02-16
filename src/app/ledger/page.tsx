import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ledger Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Ledger theme.",
};

export default function Page() {
  return <ThemePage />;
}
