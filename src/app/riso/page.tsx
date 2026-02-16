import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riso Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Riso theme.",
};

export default function Page() {
  return <ThemePage />;
}
