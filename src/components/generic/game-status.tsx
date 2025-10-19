"use client";

import { JSX, memo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Gamepad2, Info, Puzzle } from "lucide-react";

type GameInfo = {
  label: string;
  value: string;
};
type GameControls = GameInfo;

type Props = {
  title: string;
  description: string;
  controls: GameControls[];
  infos: GameInfo[];
  options: JSX.Element[];
};

const GameStatus = memo(
  ({ title, description, controls, infos, options }: Props) => (
    <div className="flex flex-col items-start gap-4 min-w-[20vw] w-fit h-fit bg-slate-200 shadow-2xl/50 rounded-md p-4">
      <div className="flex flex-col items-center w-full">
        <span className="font-bold text-xl text-center">{title}</span>
        <span className="text-md text-slate-700 text-center">
          {description}
        </span>
      </div>
      <Collapsible className="w-full">
        <CollapsibleTrigger className="flex flex-row justify-between items-center w-full border-b-2 border-b-black hover:cursor-pointer hover:bg-slate-300 px-2">
          <span className="font-bold text-lg">Controls</span>
          <Gamepad2 fill="gray" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1 mt-2">
          {controls.map(({ label, value }, i) => (
            <div
              key={i}
              className="flex flex-row items-center justify-between w-full"
            >
              <span className="font-bold text-slate-700 max-w-[50%]">
                {label}
              </span>
              <span
                className="font-medium text-black max-w-[50%] text-pretty text-right"
                title={value}
              >
                {value}
              </span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="w-full">
        <CollapsibleTrigger className="flex flex-row justify-between items-center w-full border-b-2 border-b-black hover:cursor-pointer hover:bg-slate-300 px-2">
          <span className="font-bold text-lg">Infos</span>
          <Info fill="#4295f5" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1 mt-2">
          {infos.map(({ label, value }, i) => (
            <div
              key={i}
              className="flex flex-row items-center justify-between w-full"
            >
              <span className="font-bold text-slate-700 max-w-[50%]">
                {label}
              </span>
              <span className="font-medium text-black max-w-[50%] text-pretty text-right">
                {value}
              </span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="w-full">
        <CollapsibleTrigger className="flex flex-row justify-between items-center w-full border-b-2 border-b-black hover:cursor-pointer hover:bg-slate-300 px-2">
          <span className="font-bold text-lg">Play options</span>
          <Puzzle fill="#18d606" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1 mt-2">
          <div className="flex flex-row justify-between items-center w-full p-2 mt-4">
            {...options}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
);
GameStatus.displayName = "GameStatus";

export { GameStatus };
