import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Sudoku",
  description: "Solve this iconic game!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
