"use client";

import { CellSymbol } from "@/hooks/games/tic-tac-toe/use-utils";
import { memo } from "react";

type Props = {
  cells: CellSymbol[];
  handleClick: (index: number) => void;
};

const Grid = memo(({ cells, handleClick }: Props) => (
  <div className="grid grid-cols-3">
    {cells.map((cell, idx) => (
      <span
        className={`flex w-40 h-40 border-1 border-black hover:border-amber-400 hover:border-4 hover:cursor-pointer text-8xl text-center justify-center items-center select-none ${
          cell === "x" ? "text-red-500" : "text-blue-500"
        }`}
        onClick={() => handleClick(idx)}
        key={idx}
      >
        {cell ?? ""}
      </span>
    ))}
  </div>
));
Grid.displayName = "Grid";

export { Grid };
