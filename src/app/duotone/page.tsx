import ThemePage from "./ThemePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duotone Theme — Grox AI Portfolio",
  description: "Grox AI Product Studio portfolio in Duotone theme.",
};

export default function Page() {
  return <ThemePage />;
}
