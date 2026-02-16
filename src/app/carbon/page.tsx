import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carbon Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Carbon theme.",
};

export default function Page() {
  return <ThemePage />;
}
