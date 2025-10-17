import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Four in a row",
  description: "Align 4 pieces of yours!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
