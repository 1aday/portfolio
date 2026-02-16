import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ivory Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Ivory theme.",
};

export default function Page() {
  return <ThemePage />;
}
