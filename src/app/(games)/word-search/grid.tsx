"use client";

import { ContentItem } from "@/hooks/games/word-search/use-utils";
import { memo } from "react";

type Props = {
  content: ContentItem[];
  selectedIndices: number[];
  highlightIndices: number[];
  handleMouseDown: (index: number) => void;
  handleMouseEnter: (index: number) => void;
};

const Grid = memo(
  ({
    content,
    selectedIndices,
    highlightIndices,
    handleMouseDown,
    handleMouseEnter,
  }: Props) => (
    <div className="flex w-fit h-fit border-1 border-black rounded-sm p-2">
      <ul
        style={{
          gridTemplateColumns: `repeat(${Math.sqrt(content.length)}, 1fr)`,
        }}
        className={`grid grid-flow-row items-center`}
      >
        {content.map(({ charValue }, i) => (
          <li
            key={i}
            className={`flex aspect-square items-center justify-center justify-self-center w-full h-1/4 p-2 ${
              selectedIndices.includes(i) || highlightIndices.includes(i)
                ? "text-red-500"
                : "text-black"
            } hover:cursor-pointer hover:text-red-500 select-none`}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
          >
            <p className="text-xl font-bold">{charValue}</p>
          </li>
        ))}
      </ul>
    </div>
  )
);
Grid.displayName = "Grid";

export { Grid };
