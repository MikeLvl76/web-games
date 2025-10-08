"use client";

import GamePreview from "@/components/generic/game-preview";
import { getGamesPreview, Preview } from "@/server-actions/preview";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [filteredPreviews, setFilteredPreviews] = useState<Preview[]>([]);
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState<Preview["type"] | undefined>();

  useEffect(() => {
    getGamesPreview()
      .then((res) => setPreviews(res))
      .catch((e) => console.error(e));
  }, []);

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
    <div className="flex flex-col items-center gap-4 p-2">
      <div className="flex flex-row items-center justify-center gap-8 w-full">
        <div className="flex flex-row items-center justify-center gap-2">
          <input
            type="text"
            placeholder="Search a game..."
            onChange={(e) => setSearchText(e.target.value)}
            className="p-2 focus:outline-none focus:border-b-2 focus:border-b-slate-600 text-xl max-w-50"
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <label className="font-bold text-xl">Filter by</label>
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
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
