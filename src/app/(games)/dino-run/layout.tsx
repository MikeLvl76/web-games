import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Dino Run",
  description: "Jump above obstacles to earn points!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
