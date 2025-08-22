"use client";

import { memo, useState, MouseEvent, useCallback } from "react";

type Cell = {
  digit?: number;
};

export default function SudokuPage() {
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: 81 }, () => ({}))
  );

  const handleLeftClick = useCallback((event: MouseEvent, idx: number) => {
    if (event.button === 0) {
      return setCells((prev) =>
        prev.map((cell, i) => {
          if (i === idx) {
            return {
              ...cell,
              digit: cell.digit && cell.digit === 9 ? 1 : (cell.digit ?? 0) + 1,
            };
          }
          return cell;
        })
      );
    }
  }, []);

  const handleRightClick = useCallback((event: MouseEvent, idx: number) => {
    event.preventDefault();
    if (event.button === 2) {
      return setCells((prev) =>
        prev.map((cell, i) => {
          if (i === idx) {
            return {
              ...cell,
              digit:
                cell.digit && cell.digit === 1 ? 9 : (cell.digit ?? 10) - 1,
            };
          }
          return cell;
        })
      );
    }
  }, []);

  const Grid = memo(({ cells }: { cells: Cell[] }) => (
    <div className="grid grid-cols-9">
      {cells.map(({ digit }, idx) => (
        <span
          className="flex w-16 h-16 border-1 border-black hover:cursor-pointer text-2xl text-center justify-center items-center select-none"
          onClick={(e) => handleLeftClick(e, idx)}
          onContextMenu={(e) => handleRightClick(e, idx)}
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
