"use client";

import { ReactNode } from "react";

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-screen h-screen max-h-screen justify-center items-center">
      {children}
    </div>
  );
}
