import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Tic Tac Toe",
  description: "Classical versus game!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
