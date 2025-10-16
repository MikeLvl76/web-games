"use client";

import { RotateCcw } from "lucide-react";
import { memo, ReactNode } from "react";
import { Tile } from "./page";

type Props = {
  playtime: string;
  playerColor: NonNullable<Tile["pieceColor"]>;
  winner: Tile["pieceColor"];
  onRestart: () => void;
  otherComponent: ReactNode;
};

const GameStatus = memo(
  ({ playtime, playerColor, winner, onRestart, otherComponent }: Props) => (
    <div className="flex flex-col items-start gap-4 w-[25vw] h-fit bg-slate-200 shadow-2xl/50 rounded-md p-2">
      <span className="font-bold text-xl">Player vs Player</span>
      <div className="flex flex-row items-center justify-between w-full">
        <p>Current turn</p>
        <p className="font-bold text-slate-700">
          {playerColor === "black" ? "Player 1" : "Player 2"}
        </p>
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <p>Time</p>
        <p className="font-bold text-slate-700">{playtime}</p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        {winner &&
          (winner === "black" ? (
            <span className="text-lg font-bold">Player 1 won!</span>
          ) : (
            <span className="text-lg font-bold">Player 2 won!</span>
          ))}
        {otherComponent}
        <RotateCcw
          color="white"
          size={24}
          onClick={onRestart}
          className="self-start w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
        />
      </div>
    </div>
  )
);
GameStatus.displayName = "GameStatus";

export { GameStatus };
