import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Web games / Tower defense",
  description: "Prevent enemies from reaching your tower.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
