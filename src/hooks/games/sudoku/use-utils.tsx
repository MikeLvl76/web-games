"use client";

import { useCallback, useState, MouseEvent } from "react";

export type CellValue = number | undefined;

type UtilsParams = object;

export function useUtils({}: UtilsParams = {}) {
  const [cells, setCells] = useState<CellValue[]>(Array(81).fill(undefined));
  const [isWin, setIsWin] = useState(false);

  const isSafe = useCallback(
    (current: CellValue[], index: number, value: number): boolean => {
      const row = Math.floor(index / 9);
      const col = index % 9;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (current[row * 9 + c] === value) return false;
      }

      // Check col
      for (let r = 0; r < 9; r++) {
        if (current[r * 9 + col] === value) return false;
      }

      // Check 3x3 block
      const startRow = row - (row % 3);
      const startCol = col - (col % 3);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (current[(startRow + r) * 9 + (startCol + c)] === value)
            return false;
        }
      }

      return true;
    },
    []
  );

  const generate = useCallback((hiddenDigits: number) => {
    const generateCells = (): CellValue[] => {
      const current: CellValue[] = Array(81).fill(undefined);

      const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);

      const solve = (pos: number = 0): boolean => {
        if (pos === 81) return true;

        if (current[pos]) return solve(pos + 1);

        for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isSafe(current, pos, num)) {
            current[pos] = num;
            if (solve(pos + 1)) return true;
            current[pos] = undefined;
          }
        }

        return false;
      };

      solve();
      return current;
    };

    const hideDigits = (
      cells: CellValue[],
      hiddenDigits: number
    ): CellValue[] => {
      const puzzle = cells;
      let removed = 0;

      while (removed < hiddenDigits) {
        const idx = Math.floor(Math.random() * 81);
        if (puzzle[idx]) {
          puzzle[idx] = undefined;
          removed++;
        }
      }

      return puzzle;
    };

    const generatedCells = generateCells();
    const puzzle = hideDigits(generatedCells, hiddenDigits);
    setCells(puzzle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseClick = useCallback(
    (event: MouseEvent, type: "left" | "right", index: number) => {
      event.preventDefault();
      if (isWin) return;
      const MOUSE_BUTTON_INDEX = type === "left" ? 0 : 2;

      if (event.button === MOUSE_BUTTON_INDEX) {
        return setCells((prev) =>
          prev.map((cell, i) => {
            if (i === index) {
              if (type === "left") {
                return cell && cell === 9 ? 1 : (cell ?? 0) + 1;
              }

              if (type === "right") {
                return cell && cell === 1 ? 9 : (cell ?? 10) - 1;
              }
            }
            return cell;
          })
        );
      }
    },
    [isWin]
  );

  return {
    states: { cells, setCells, isWin, setIsWin },
    functions: { isSafe, generate, handleMouseClick },
  };
}
