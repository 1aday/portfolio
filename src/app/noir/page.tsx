import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noir Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Noir theme.",
};

export default function Page() {
  return <ThemePage />;
}
