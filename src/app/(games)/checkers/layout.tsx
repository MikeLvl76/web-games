import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Checkers",
  description: "Capture your opponent pieces!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
