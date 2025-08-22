"use client";

import { memo, useState } from "react";

type Cell = {
  digit?: number;
};

export default function SudokuPage() {
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: 81 }, () => ({}))
  );

  const Grid = memo(({ cells }: { cells: Cell[] }) => (
    <div className="grid grid-cols-9">
      {cells.map(({ digit }, idx) => (
        <span
          className="flex w-16 h-16 border-1 border-black hover:cursor-pointer text-sm text-center justify-center items-center"
          //onClick={() => handleClick(idx)}
          key={idx}
        >
          {digit ?? ""}
        </span>
      ))}
    </div>
  ));
  Grid.displayName = "Grid";

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <h1 className="text-center font-bold text-xl">
        Left click to increase digit in a cell. Right click to decrease digit in
        a cell.
      </h1>
      <Grid cells={cells} />
    </div>
  );
}
