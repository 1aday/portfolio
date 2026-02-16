import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shibori Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Shibori theme.",
};

export default function Page() {
  return <ThemePage />;
}
