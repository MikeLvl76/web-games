"use client";

import { GameStatus } from "@/components/generic/game-status";
import { Button } from "@/components/ui/button";
import { stringifyTime } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import {
  memo,
  useState,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

type Cell = {
  digit?: number;
};

export default function SudokuPage() {
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: 81 }, () => ({}))
  );

  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    generate(60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isWin) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isWin]);

  useEffect(() => {
    setIsWin(
      cells.every((cell, i) => cell.digit && isSafe(cells, i, cell.digit))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells]);

  const isSafe = useCallback(
    (current: Cell[], index: number, digit: number): boolean => {
      const row = Math.floor(index / 9);
      const col = index % 9;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (current[row * 9 + c].digit === digit) return false;
      }

      // Check col
      for (let r = 0; r < 9; r++) {
        if (current[r * 9 + col].digit === digit) return false;
      }

      // Check 3x3 block
      const startRow = row - (row % 3);
      const startCol = col - (col % 3);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (current[(startRow + r) * 9 + (startCol + c)].digit === digit)
            return false;
        }
      }

      return true;
    },
    []
  );

  const generate = useCallback((hiddenDigits: number) => {
    const generateCells = (): Cell[] => {
      const current: Cell[] = Array.from({ length: 81 }, () => ({}));

      const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);

      const solve = (pos: number = 0): boolean => {
        if (pos === 81) return true;

        if (current[pos].digit) return solve(pos + 1);

        for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isSafe(current, pos, num)) {
            current[pos].digit = num;
            if (solve(pos + 1)) return true;
            current[pos].digit = undefined;
          }
        }

        return false;
      };

      solve();
      return current;
    };

    const hideDigits = (cells: Cell[], hiddenDigits: number): Cell[] => {
      const puzzle = cells;
      let removed = 0;

      while (removed < hiddenDigits) {
        const idx = Math.floor(Math.random() * 81);
        if (puzzle[idx].digit) {
          puzzle[idx].digit = undefined;
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

  const handleLeftClick = useCallback(
    (event: MouseEvent, idx: number) => {
      if (isWin) return;
      if (event.button === 0) {
        return setCells((prev) =>
          prev.map((cell, i) => {
            if (i === idx) {
              return {
                ...cell,
                digit:
                  cell.digit && cell.digit === 9 ? 1 : (cell.digit ?? 0) + 1,
              };
            }
            return cell;
          })
        );
      }
    },
    [isWin]
  );

  const handleRightClick = useCallback(
    (event: MouseEvent, idx: number) => {
      event.preventDefault();
      if (isWin) return;
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
    },
    [isWin]
  );

  const Grid = memo(({ cells }: { cells: Cell[] }) => (
    <div className="grid grid-cols-9">
      {cells.map(({ digit }, idx) => (
        <span
          className={`flex w-16 h-16 border-1 border-black hover:border-amber-400 hover:border-4 hover:cursor-pointer font-bold text-2xl text-center justify-center items-center select-none ${
            (idx + 1) % 3 === 0 ? "border-r-4" : ""
          } ${Math.floor(idx / 9) % 3 === 2 ? "border-b-4" : ""}`}
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
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <Grid cells={cells} />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Sudoku"
          description="Fill the grid with correct digits"
          controls={[
            { label: "Increase", value: "Left mouse click on cell" },
            { label: "Decrease", value: "Right mouse click on cell" },
          ]}
          infos={[
            {
              label: "Remaining cells",
              value: `${cells.filter((c) => !c.digit).length}`,
            },
            { label: "Game time", value: timer.text },
          ]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                generate(60);
                setTimer({ value: 0, text: stringifyTime(0) });
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(() => {
                  setTimer((prev) => ({
                    value: prev.value + 1,
                    text: stringifyTime(prev.value + 1),
                  }));
                }, 1000);
              }}
            >
              <p className="text-white font-bold text-md text-center">
                Restart
              </p>
              <RotateCcw color="white" size={32} />
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
