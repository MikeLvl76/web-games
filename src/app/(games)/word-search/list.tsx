"use client";

import { Word } from "@/hooks/games/word-search/use-utils";
import { memo } from "react";

type Props = {
  words: Word[];
};

const WordList = memo(({ words }: Props) => (
  <div className="flex w-[20vw] h-[10vh]">
    <ul className="grid grid-cols-2 w-full h-full gap-2 p-2 items-center">
      {words
        .sort((a, b) => a.value.localeCompare(b.value))
        .map(({ value, isFound }, i) => (
          <li key={i} className="justify-self-center">
            <p
              className={`text-xl text-left font-bold decoration-4 decoration-red-500 ${
                isFound ? "line-through" : ""
              }`}
            >
              {value}
            </p>
          </li>
        ))}
    </ul>
  </div>
));
WordList.displayName = "WordList";

export { WordList };
