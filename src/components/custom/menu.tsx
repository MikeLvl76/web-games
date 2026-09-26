"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentProps, memo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { AsteriskIcon, SettingsIcon } from "lucide-react";

type Props = {
  gameName: string;
  description: string;
  selectors: {
    label: string;
    items: { value: string; text: string }[];
    onValueChange: (value: string) => void;
  }[];
  inputs: {
    label: string;
    inputProps?: ComponentProps<"input">;
  }[];
  onStart: () => void;
};

const Selectors = memo(({ _selectors }: { _selectors: Props["selectors"] }) => {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      {..._selectors.map(({ label, items, onValueChange }, i) => (
        <div className="flex flex-col items-center p-2">
          <label className="font-bold text-md">{label}</label>
          <Select key={i} onValueChange={onValueChange}>
            <SelectTrigger
              value={items[0].value}
              className="hover:cursor-pointer focus:outline-none focus:border-none bg-none outline-none border-none"
            >
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent className="bg-white/30 outline-none border-none">
              {items.map(({ value, text }) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="bg-slate-100 hover:cursor-pointer hover:bg-slate-300"
                >
                  {text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
});
Selectors.displayName = "Selectors";

const Inputs = memo(({ _inputs }: { _inputs: Props["inputs"] }) => (
  <div className="w-full flex flex-col items-center gap-4">
    {..._inputs.map(({ label, inputProps }) => (
      <div className="min-w-5/6 flex flex-row justify-between items-center p-2">
        <label className="font-bold text-md">{label}</label>
        <Input {...inputProps} />
      </div>
    ))}
  </div>
));

export default function GameMenu({
  gameName,
  description,
  selectors,
  inputs,
  onStart,
}: Props) {
  return (
    <div className="w-[30vw] sm:w-[40vw] md:w-[50vw] h-[70vh] flex flex-col gap-4 p-4 bg-slate-200 shadow-2xl/50 rounded-md">
      <div className="w-full flex flex-col items-start p-2">
        <h1 className="text-xl font-bold text-slate-800">{gameName}</h1>
        <div className="flex flex-row justify-start items-center gap-2">
          <AsteriskIcon size={20} color="#B59410" />
          <h3 className="text-md text-right text-slate-600 text-pretty break-all">
            {description}
          </h3>
        </div>
        <Separator className="w-full bg-slate-400 mt-2" />
      </div>
      <div className="flex flex-row justify-center items-center gap-2 px-2">
        <p className="text-sm font-bold text-slate-800">Settings</p>
        <SettingsIcon size={20} color="#636363" />
      </div>
      <div className="grid grid-cols-3 w-full">
        {selectors.length > 0 && <Selectors _selectors={selectors} />}
        {inputs.length > 0 && <Inputs _inputs={inputs} />}
      </div>
      <div className="flex justify-end items-end w-full h-full">
        <Button
          variant="secondary"
          className="w-fit h-fit p-2 rounded-md hover:cursor-pointer bg-blue-600 text-slate-100 text-lg self-end"
          onClick={onStart}
        >
          Start game
        </Button>
      </div>
    </div>
  );
}
