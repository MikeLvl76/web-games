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

type Props = {
  selectors: {
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
    <div>
      {..._selectors.map(({ items, onValueChange }, i) => (
        <Select key={i} onValueChange={onValueChange}>
          <SelectTrigger
            value={items[0].value}
            className="hover:cursor-pointer focus:outline-none bg-white"
          >
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {items.map(({ value, text }) => (
              <SelectItem
                key={value}
                value={value}
                className="hover:cursor-pointer hover:bg-slate-300"
              >
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
});
Selectors.displayName = "Selectors";

const Switches = memo(({ _switches }: { _switches: Props["switches"] }) => (
  <div>
    {..._switches.map(({ label, bool, onChange }) => (
      <div>
        <label className="font-bold text-xl">{label}</label>
        <Input
          type="checkbox"
          checked={bool}
          onChange={onChange}
          className="w-6 h-6"
        />
      </div>
    ))}
  </div>
));
Switches.displayName = "Switches";

const Inputs = memo(({ _inputs }: { _inputs: Props["inputs"] }) => (
  <div>
    {..._inputs.map(({ label, type, interval, onChange }) => (
      <div>
        <label className="font-bold text-xl">{label}</label>
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
          className="w-16 h-6"
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
    <div>
      <div>
        <h1>Game menu</h1>
        <h3>Customize game with settings</h3>
      </div>
      <div>
        <Selectors _selectors={selectors} />
        <Switches _switches={switches} />
        <Inputs _inputs={inputs} />
      </div>
      <div className="flex justify-center items-end w-full h-[20%]">
        <Button
          variant="secondary"
          className="w-fit h-fit p-2 rounded-md hover:cursor-pointer bg-blue-400 text-white text-2xl self-end"
          onClick={onStart}
        >
          Start game
        </Button>
      </div>
    </div>
  );
}
