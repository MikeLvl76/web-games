"use client";

import { useState, useEffect } from "react";
import GamePreview from "./game-preview";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Preview } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  previews: Preview[];
  hideMCSMessage?: boolean;
};

export default function PreviewList({ previews, hideMCSMessage }: Props) {
  const pagination = usePagination<Preview>();
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState<Preview["type"] | undefined>();

  useEffect(() => {
    const compareNames = (name: string) =>
      name.toLowerCase().startsWith(searchText.toLowerCase());

    const compareTypes = (_type: Preview["type"]) => _type === type;

    const _previews = [];

    if (searchText.length > 0 && !type) {
      _previews.push(...previews.filter(({ name }) => compareNames(name)));
    } else if (type && searchText.length === 0) {
      _previews.push(
        ...previews.filter(
          ({ name, type }) => compareNames(name) && compareTypes(type),
        ),
      );
    } else if (searchText.length === 0 && !type) {
      _previews.push(...previews);
    }

    pagination.paginate(_previews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews, searchText, type]);

  return (
    <div className="relative flex flex-col w-full h-full items-center p-2">
      <div className="fixed top-0 z-10 flex flex-row items-center justify-evenly gap-8 w-[70%] h-16 bg-white shadow-lg/30">
        <div className="w-1/3 p-2">
          <input
            type="text"
            placeholder="Search a game..."
            onChange={(e) => setSearchText(e.target.value)}
            className="p-2 focus:outline-none focus:border-b-2 focus:border-b-slate-600 text-lg"
          />
        </div>
        <div className="flex flex-row w-1/3 justify-center items-center gap-4 bg-white">
          <ChevronsLeft
            className="hover:cursor-pointer"
            onClick={pagination.first}
          />
          <ChevronLeft
            className="hover:cursor-pointer"
            onClick={pagination.previous}
          />
          <span>
            {pagination.pageNumber}/{pagination.totalPages}
          </span>
          <ChevronRight
            className="hover:cursor-pointer"
            onClick={pagination.next}
          />
          <ChevronsRight
            className="hover:cursor-pointer"
            onClick={pagination.last}
          />
        </div>
        <div className="flex flex-row w-1/3 items-center justify-end p-2 gap-1">
          <Select
            defaultValue="None"
            onValueChange={(value) => {
              setType(
                value === "None" ? undefined : (value as Preview["type"]),
              );
            }}
          >
            <SelectTrigger className="focus:outline-none after:outline-none border-none font-medium text-lg">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {[
                { value: "None", text: "All" },
                { value: "solo", text: "Solo" },
                { value: "puzzle", text: "Puzzle" },
                { value: "versus", text: "Versus" },
              ].map(({ value, text }, i) => (
                <SelectItem key={i} value={value} className="text-lg font-bold">
                  {text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-16">
        {pagination.data.map((preview) => (
          <li
            key={preview.id}
            className="flex items-center justify-center rounded-sm w-50 h-50 gap-1 hover:cursor-pointer hover:scale-105 transition duration-400 ease-in-out"
          >
            <GamePreview data={preview} />
          </li>
        ))}
        {!hideMCSMessage && (
          <div className="w-full h-full rounded-md">
            <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
              <span className="text-xl font-medium text-slate-600">
                More coming soon...
              </span>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}
