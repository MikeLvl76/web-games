"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export type Config = {
  enableCountdown: boolean;
  enablePath: boolean;
  enableReset: boolean;
  size: number;
};

type Props = {
  onStart: (config: Config) => void;
};

export default function Menu({ onStart }: Props) {
  const [enableCountdown, setEnableCountdown] = useState(true);
  const [enablePath, setEnablePath] = useState(true);
  const [enableReset, setEnableReset] = useState(true);
  const [size, setSize] = useState(40);

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
        <label className="font-bold text-xl">Path</label>
        <Input
          type="checkbox"
          checked={enablePath}
          onChange={() => setEnablePath(!enablePath)}
          className="w-6 h-6"
        />
      </div>
      <div className="flex flex-row items-center w-[20%] justify-between p-2">
        <label className="font-bold text-xl">Reset position</label>
        <Input
          type="checkbox"
          checked={enableReset}
          onChange={() => setEnableReset(!enableReset)}
          className="w-6 h-6"
        />
      </div>
      <div className="flex flex-row items-center w-[20%] justify-between p-2">
        <label className="font-bold text-xl">Size ({size})</label>
        <Input
          type="range"
          value={size}
          min={30}
          step={1}
          max={50}
          onChange={(e) => setSize(Number(e.target.value))}
          className="hover:cursor-grab w-[50%]"
        />
      </div>
      <div className="flex justify-center items-end w-full">
        <Button
          variant="secondary"
          className="w-fit h-fit p-2 rounded-md hover:cursor-pointer bg-blue-400 text-white text-2xl self-end"
          onClick={() =>
            onStart({ enableCountdown, enablePath, enableReset, size })
          }
        >
          Start game
        </Button>
      </div>
    </div>
  );
}
