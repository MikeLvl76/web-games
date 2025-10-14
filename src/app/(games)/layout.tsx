"use client";

import { ReactNode } from "react";

export default function TicTacToeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col max-w-screen max-h-screen items-center">
      {children}
    </div>
  );
}
