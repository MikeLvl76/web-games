import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Maze",
  description: "Escape from the maze!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
