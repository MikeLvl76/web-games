"use client";

import { MouseEvent } from "react";

type Props = {
  index: number;
  handleMouseClick: (
    event: MouseEvent,
    button: "left" | "right",
    index: number
  ) => void;
  content: string;
};

export function GridCell({ index, handleMouseClick, content }: Props) {
  return (
    <span
      className={`flex w-16 h-16 border-1 border-black hover:border-amber-400 hover:border-4 hover:cursor-pointer font-bold text-2xl text-center justify-center items-center select-none ${
        (index + 1) % 3 === 0 ? "border-r-4" : ""
      } ${Math.floor(index / 9) % 3 === 2 ? "border-b-4" : ""}`}
      onClick={(e) => handleMouseClick(e, "left", index)}
      onContextMenu={(e) => handleMouseClick(e, "right", index)}
    >
      {content}
    </span>
  );
}
