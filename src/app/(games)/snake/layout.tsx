import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Snake",
  description: "Let the snake grow!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
