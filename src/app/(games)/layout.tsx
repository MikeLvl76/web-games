"use client";

import { DndContext } from "@dnd-kit/core";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function TicTacToeLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <DndContext>
      <div className="flex flex-col max-w-screen max-h-screen items-center">
        <div className="w-16 h-16 flex self-start">
          <ArrowLeft
            size={32}
            color="black"
            className="self-start hover:cursor-pointer shadow-xl/50 rounded-full p-2 w-fit h-fit"
            onClick={() => router.push("/")}
          />
        </div>
        {children}
      </div>
    </DndContext>
  );
}
