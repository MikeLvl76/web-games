"use client";

import GameStatus from "@/components/custom/game/status";
import { Button } from "@/components/ui/button";
import { stringifyTime } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Grid } from "./grid";
import { useUtils } from "@/hooks/games/sudoku/use-utils";

type Props = {
  enableTime: boolean;
};

export default function SudokuGame({ enableTime }: Props) {
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utils = useUtils();
  const { isWin, setIsWin, cells } = utils.states;
  const { generate, isSafe, handleMouseClick } = utils.functions;

  useEffect(() => {
    generate(60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isWin || !enableTime) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [enableTime, isWin]);

  useEffect(() => {
    setIsWin(cells.every((cell, i) => cell && isSafe(cells, i, cell)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells]);

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <Grid cells={cells} handleMouseClick={handleMouseClick} />
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
              value: `${cells.filter((c) => !c).length}`,
            },
            { label: "Game time", value: enableTime ? timer.text : "Disabled" },
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
