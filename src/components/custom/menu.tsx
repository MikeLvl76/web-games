"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type Props = {
  selectors: {
    label: string;
    items: { value: string; text: string }[];
    onValueChange: (value: string) => void;
  }[];
  switches: { label: string; bool: boolean; onChange: () => void }[];
  inputs: {
    label: string;
    type: "text" | "number";
    onChange: (value: string | number) => void;
    interval?: { min: number; max: number; step: number };
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

const Switches = memo(({ _switches }: { _switches: Props["switches"] }) => (
  <div className="w-full flex flex-col items-center gap-4">
    {..._switches.map(({ label, bool, onChange }) => (
      <div className="w-4/5 flex flex-row justify-between items-center p-2">
        <label className="font-bold text-md">{label}</label>
        <Input
          type="checkbox"
          checked={bool}
          onChange={onChange}
          className="w-4 h-4 hover:cursor-pointer"
        />
      </div>
    ))}
  </div>
));
Switches.displayName = "Switches";

const Inputs = memo(({ _inputs }: { _inputs: Props["inputs"] }) => (
  <div className="w-full flex flex-col items-center gap-4">
    {..._inputs.map(({ label, type, interval, onChange }) => (
      <div className="min-w-2/3 max-w-4/5 flex flex-row justify-between items-center p-2">
        <label className="font-bold text-md">{label}</label>
        <Input
          type={type}
          min={interval?.min}
          max={interval?.max}
          step={interval?.step}
          onChange={(event) => {
            const value = event.target.value;
            if (Number.isNaN(Number(value))) {
              onChange(value as string);
            } else {
              onChange(Number(value));
            }
          }}
          className="w-20 h-8 text-slate-800 outline-none focus:outline-none "
        />
      </div>
    ))}
  </div>
));

export default function GameMenu({
  selectors,
  switches,
  inputs,
  onStart,
}: Props) {
  return (
    <div className="w-[30vw] sm:w-[40vw] md:w-[50vw] h-[70vh] flex flex-col gap-4 p-4 bg-slate-200 shadow-2xl/50 rounded-md">
      <div className="w-full flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold text-slate-800">Game menu</h1>
        <h3 className="text-sm text-slate-700">Customize game with settings</h3>
        <Separator className="w-full bg-slate-400 mt-2" />
      </div>
      <div className="grid grid-cols-3 w-full">
        {selectors.length > 0 && <Selectors _selectors={selectors} />}
        {switches.length > 0 && <Switches _switches={switches} />}
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
