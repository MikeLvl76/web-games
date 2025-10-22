"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PlayerColor } from "../../../hooks/games/checkers/use-utils";
import { User } from "lucide-react";

export type Config = {
  playerColor: PlayerColor;
  oppColor: PlayerColor;
  allowMultJumps: boolean;
  enableTime: boolean;
};

type Props = {
  onStart: (config: Config) => void;
};

export default function Menu({ onStart }: Props) {
  const [playerColor, setPlayerColor] = useState<PlayerColor>("black");
  const [oppColor, setOppColor] = useState<PlayerColor>("white");
  const [allowMultJumps, setAllowMultJumps] = useState(true);
  const [enableTime, setEnableTime] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4 w-[80vw] h-[80vh] rounded-md p-2 select-none bg-slate-300">
      <div className="flex flex-row w-full h-[50%] justify-around items-center">
        <div className="flex flex-col gap-2 p-2 items-center justify-center">
          <label className="font-bold text-lg">You</label>
          <User fill={playerColor} color="black" size={128} />
          <Select
            value={playerColor}
            onValueChange={(value) => {
              setPlayerColor(value as PlayerColor);
              setOppColor(
                (value as PlayerColor) === "black" ? "white" : "black"
              );
            }}
          >
            <SelectTrigger className="hover:cursor-pointer focus:outline-none bg-white">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {["black", "white"].map((item, i) => (
                <SelectItem
                  key={i}
                  value={item}
                  className="hover:cursor-pointer hover:bg-slate-300"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 p-2 items-center">
          <label className="font-bold text-lg">Opponent</label>
          <User fill={oppColor} color="black" size={128} />
          <label className="text-xl p-1">
            {oppColor.substring(0, 1).toUpperCase()}
            {oppColor.substring(1)}
          </label>
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="flex flex-row items-center w-[20%] justify-between p-2">
          <label className="font-bold text-xl">Mutiple jumps</label>
          <Input
            type="checkbox"
            checked={allowMultJumps}
            onChange={() => setAllowMultJumps(!allowMultJumps)}
            className="w-6 h-6"
          />
        </div>
        <div className="flex flex-row items-center w-[20%] justify-between p-2">
          <label className="font-bold text-xl">Time</label>
          <Input
            type="checkbox"
            checked={enableTime}
            onChange={() => setEnableTime(!enableTime)}
            className="w-6 h-6"
          />
        </div>
      </div>

      <div className="flex justify-center items-end w-full h-[20%]">
        <Button
          variant="secondary"
          className="w-fit h-fit p-2 rounded-md hover:cursor-pointer bg-blue-400 text-white text-2xl self-end"
          onClick={() =>
            onStart({ playerColor, oppColor, allowMultJumps, enableTime })
          }
        >
          Start game
        </Button>
      </div>
    </div>
  );
}
