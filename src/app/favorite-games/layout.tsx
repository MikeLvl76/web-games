import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Web games / Favorite games",
  description: "Here is your favorite games!",
};

export default function Layout({ children }: Props) {
  return <div className="w-full h-full">{children}</div>;
}
