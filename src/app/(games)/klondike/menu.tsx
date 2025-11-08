"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export type Config = {
  enableTime: boolean;
};

type Props = {
  onStart: (config: Config) => void;
};

export default function Menu({ onStart }: Props) {
  const [enableTime, setEnableTime] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-[80vw] h-[80vh] rounded-md p-2 select-none bg-slate-300">
      <div className="flex flex-row items-center w-[20%] justify-between p-2">
        <label className="font-bold text-xl">Time</label>
        <Input
          type="checkbox"
          checked={enableTime}
          onChange={() => setEnableTime(!enableTime)}
          className="w-6 h-6"
        />
      </div>
      <div className="flex justify-center items-end w-full">
        <Button
          variant="secondary"
          className="w-fit h-fit p-2 rounded-md hover:cursor-pointer bg-blue-400 text-white text-2xl self-end"
          onClick={() => onStart({ enableTime })}
        >
          Start game
        </Button>
      </div>
    </div>
  );
}
