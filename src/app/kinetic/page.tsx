import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinetic Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Kinetic theme.",
};

export default function Page() {
  return <ThemePage />;
}
