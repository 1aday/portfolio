import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cathedral Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Cathedral theme.",
};

export default function Page() {
  return <ThemePage />;
}
