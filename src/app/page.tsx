"use client";

import GamePreview from "@/components/generic/game-preview";
import { getGamesPreview, Preview } from "@/server-actions/preview";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    getGamesPreview()
      .then((res) => setPreviews(res))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <div className="flex flex-row items-center justify-center gap-4 w-full">
        <div className="flex flex-row items-center justify-center gap-2">
          <input type="text" placeholder="Search a game..." />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <label>Filter by</label>
          <select>
            <option>---</option>
            <option>Type</option>
          </select>
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previews.map((preview) => (
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
