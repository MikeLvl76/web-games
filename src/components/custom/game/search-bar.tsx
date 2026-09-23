"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameDescription } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  onSearch: (search: string, type: GameDescription["type"] | undefined) => void;
};

export default function GameSearchBar({ onSearch }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<GameDescription["type"] | undefined>();

  useEffect(() => {
    onSearch(name, type);
  }, [name, type]);

  return (
    <div className="flex flex-row items-center px-2 py-4 gap-8 w-1/3 h-16 bg-slate-300/80 shadow-lg/30 rounded-full">
      <div className="flex-1 p-2 border-r-2 border-r-slate-400">
        <input
          type="text"
          placeholder="Search by name..."
          onChange={(e) => setName(e.target.value)}
          className="w-full focus:outline-none text-lg"
        />
      </div>
      <div className="flex flex-row w-fit items-center justify-end p-2 gap-1">
        <Select
          defaultValue="None"
          onValueChange={(value) => {
            setType(
              value === "None" ? undefined : (value as GameDescription["type"]),
            );
          }}
        >
          <SelectTrigger className="focus:outline-none border-none font-medium text-lg hover:cursor-pointer">
            <SelectValue placeholder="..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-100 border-none focus:outline-none">
            {[
              { value: "None", text: "All" },
              { value: "solo", text: "Solo" },
              { value: "puzzle", text: "Puzzle" },
              { value: "versus", text: "Versus" },
            ].map(({ value, text }, i) => (
              <SelectItem
                key={i}
                value={value}
                className="text-md font-bold hover:cursor-pointer hover:bg-slate-200"
              >
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
