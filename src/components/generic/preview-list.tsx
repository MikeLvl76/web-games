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

type Props = {
  previews: Preview[];
};

export default function PreviewList({ previews }: Props) {
  const [filteredPreviews, setFilteredPreviews] = useState<Preview[]>([]);
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState<Preview["type"] | undefined>();

  useEffect(() => {
    const compareNames = (name: string) =>
      name.toLowerCase().startsWith(searchText.toLowerCase());

    const compareTypes = (_type: Preview["type"]) => _type === type;

    if (searchText.length > 0 && !type) {
      setFilteredPreviews(previews.filter(({ name }) => compareNames(name)));
    } else if (type && searchText.length === 0) {
      setFilteredPreviews(previews.filter(({ type }) => compareTypes(type)));
    } else if (searchText.length > 0 && type) {
      setFilteredPreviews(
        previews.filter(
          ({ name, type }) => compareNames(name) && compareTypes(type)
        )
      );
    } else if (searchText.length === 0 && !type) {
      setFilteredPreviews(previews);
    }
  }, [previews, searchText, type]);

  return (
    <div className="relative flex flex-col w-full h-full items-center p-2">
      <div className="fixed top-0 z-10 flex flex-row items-center justify-evenly gap-8 w-[80%] h-16 bg-white">
        <input
          type="text"
          placeholder="Search a game..."
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 focus:outline-none focus:border-b-2 focus:border-b-slate-600 text-lg max-w-50"
        />
        <div className="flex flex-row items-center justify-center gap-2">
          <label className="font-medium text-lg">Filter by</label>
          <select
            onChange={(e) => {
              const value = e.target.value as Preview["type"];
              setType(value.length === 0 ? undefined : value);
            }}
            className="p-2 focus:outline-none hover:cursor-pointer rounded-sm"
          >
            {[
              { value: "", text: "---" },
              { value: "solo", text: "Solo" },
              { value: "puzzle", text: "Puzzle" },
              { value: "versus", text: "Versus" },
            ].map(({ value, text }, i) => (
              <option key={i} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row justify-center items-center gap-4 bg-white">
          <ChevronsLeft className="hover:cursor-pointer" />
          <ChevronLeft className="hover:cursor-pointer" />
          <span>0</span>
          <ChevronRight className="hover:cursor-pointer" />
          <ChevronsRight className="hover:cursor-pointer" />
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
        {filteredPreviews.map((preview) => (
          <li
            key={preview.id}
            className="flex items-center justify-center rounded-sm w-60 h-60 gap-1 hover:cursor-pointer"
          >
            <GamePreview data={preview} />
          </li>
        ))}
      </ul>
    </div>
  );
}
