import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Word search",
  description: "Read(y). Get set. Go!",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
