import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Rock, Paper, Scissors",
  description: "Show your luck!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
