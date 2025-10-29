"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Circle, X } from "lucide-react";
import { CellSymbol } from "@/hooks/games/tic-tac-toe/use-utils";

export type Config = {
  playerSymbol: NonNullable<CellSymbol>;
  oppSymbol: NonNullable<CellSymbol>;
};

type Props = {
  onStart: (config: Config) => void;
};

export default function Menu({ onStart }: Props) {
  const [playerSymbol, setPlayerSymbol] =
    useState<NonNullable<CellSymbol>>("x");
  const [oppSymbol, setOppSymbol] = useState<NonNullable<CellSymbol>>("o");

  return (
    <div className="flex flex-col items-center gap-4 w-[80vw] h-[80vh] rounded-md p-2 select-none bg-slate-300">
      <div className="flex flex-row w-full h-[50%] justify-around items-center">
        <div className="flex flex-col gap-2 p-2 items-center justify-center">
          <label className="font-bold text-lg">You</label>
          {playerSymbol === "x" ? (
            <X color="blue" size={128} />
          ) : (
            <Circle color="blue" size={100} />
          )}
          <Select
            value={playerSymbol}
            onValueChange={(value) => {
              setPlayerSymbol(value as NonNullable<CellSymbol>);
              setOppSymbol(
                (value as NonNullable<CellSymbol>) === "x" ? "o" : "x"
              );
            }}
          >
            <SelectTrigger className="hover:cursor-pointer focus:outline-none bg-white">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {["x", "o"].map((item, i) => (
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
          {oppSymbol === "x" ? (
            <X color="red" size={128} />
          ) : (
            <Circle color="red" size={100} />
          )}
          <label className="text-xl p-1">{oppSymbol}</label>
        </div>
      </div>

      <div className="flex justify-center items-end w-full h-[20%]">
        <Button
          variant="secondary"
          className="w-fit h-fit p-2 rounded-md hover:cursor-pointer bg-blue-400 text-white text-2xl self-end"
          onClick={() => onStart({ playerSymbol, oppSymbol })}
        >
          Start game
        </Button>
      </div>
    </div>
  );
}
