"use client";

import { Button } from "@/components/ui/button";
import { stringifyTime } from "@/lib/utils";
import {
  Gamepad2Icon,
  InfoIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Grid } from "./grid";
import { useUtils } from "@/hooks/games/sudoku/use-utils";
import GameDetails from "@/components/custom/game/details";

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
        <GameDetails
          sections={[
            {
              title: "Controls",
              icon: Gamepad2Icon,
              iconProps: { fill: "black", color: "black" },
              content: {
                infos: [
                  "Left/right mouse button on cell to increase/decrease digit.",
                ],
                elements: [],
              },
            },
            {
              title: "Game infos",
              icon: InfoIcon,
              iconProps: { fill: "#3A79BA", color: "black" },
              content: {
                infos: [
                  `${cells.filter((c) => !c).length} cell(s) remaining`,
                  enableTime ? `Time: ${timer.text}` : "Time disabled",
                ],
                elements: [],
              },
            },
            {
              title: "Options",
              icon: SettingsIcon,
              iconProps: { fill: "#aaaaaa", color: "black" },
              content: {
                infos: [],
                elements: [
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
                    <RotateCcwIcon color="white" size={32} />
                  </Button>,
                ],
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
