import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Klondike",
  description: "Recreate the 4 piles!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
