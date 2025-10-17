"use client";

import { JSX, memo } from "react";

type GameInfo = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  infos: GameInfo[];
  options: JSX.Element[];
};

const GameStatus = memo(({ title, infos, options }: Props) => (
  <div className="flex flex-col items-start gap-4 min-w-[15vw] w-fit h-fit bg-slate-200 shadow-2xl/50 rounded-md p-4">
    <span className="font-bold text-xl">{title}</span>
    {infos.map(({ label, value }, i) => (
      <div
        key={i}
        className="flex flex-row items-center justify-between w-full"
      >
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-medium text-black">{value}</span>
      </div>
    ))}
    <span className="font-bold text-xl">Options</span>
    <div className="flex flex-row justify-between items-center w-full">
      {...options}
    </div>
  </div>
));
GameStatus.displayName = "GameStatus";

export { GameStatus };
