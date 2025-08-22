"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function TicTacToeLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-[95vh] max-w-screen max-h-[95vh] items-center gap-2">
      <ArrowLeft
        size={32}
        color="black"
        className="self-start hover:cursor-pointer shadow-xl/50 rounded-full p-2 w-fit h-fit"
        onClick={() => router.push("/")}
      />
      {children}
    </div>
  );
}
