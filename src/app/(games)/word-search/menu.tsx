"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export type Config = {
  enableCountdown: boolean;
  gridSize: number;
  wordLength: number;
  listSize: number;
};

type Props = {
  onStart: (config: Config) => void;
};

const GRID_DENSITY = 2;
const MIN_GRID_SIZE = 10;
const MAX_GRID_SIZE = 20;

export default function Menu({ onStart }: Props) {
  const [enableCountdown, setEnableCountdown] = useState(true);
  const [wordLength, setWordLength] = useState(3);
  const [listSize, setListSize] = useState(8);

  const gridSize = useMemo(() => {
    return Math.min(
      Math.max(
        Math.ceil(Math.sqrt(wordLength * listSize * GRID_DENSITY)),
        MIN_GRID_SIZE
      ),
      MAX_GRID_SIZE
    );
  }, [listSize, wordLength]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-[80vw] h-[80vh] rounded-md p-2 select-none bg-slate-300">
      <div className="flex flex-row items-center w-[20%] justify-between p-2">
        <label className="font-bold text-xl">Countdown</label>
        <Input
          type="checkbox"
          checked={enableCountdown}
          onChange={() => setEnableCountdown(!enableCountdown)}
          className="w-6 h-6"
        />
      </div>
      <div className="flex flex-row items-center w-[20%] justify-between p-2">
        <label className="font-bold text-xl">Word length ({wordLength})</label>
        <Input
          type="range"
          value={wordLength}
          min={3}
          step={1}
          max={10}
          onChange={(e) => setWordLength(Number(e.target.value))}
          className="hover:cursor-grab w-[50%]"
        />
      </div>
      <div className="flex flex-row items-center w-[20%] justify-between p-2">
        <label className="font-bold text-xl">List size ({listSize})</label>
        <Input
          type="range"
          value={listSize}
          min={5}
          step={1}
          max={25}
          onChange={(e) => setListSize(Number(e.target.value))}
          className="hover:cursor-grab w-[50%]"
        />
      </div>
      <div className="flex justify-center items-end w-full">
        <Button
          variant="secondary"
          className="w-fit h-fit p-2 rounded-md hover:cursor-pointer bg-blue-400 text-white text-2xl self-end"
          onClick={() =>
            onStart({ enableCountdown, wordLength, listSize, gridSize })
          }
        >
          Start game
        </Button>
      </div>
    </div>
  );
}
