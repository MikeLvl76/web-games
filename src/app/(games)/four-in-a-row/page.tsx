"use client";

import { memo, useCallback, useState } from "react";

type Token = "red" | "yellow" | undefined;

export default function FourInARowPage() {
  const [tokens, setTokens] = useState<Token[]>(Array(42).fill(undefined));

  const findSuitableIndex = useCallback(
    (colIndex: number) => {
      const rowSize = 7;
      const colSize = 6;

      if (colIndex < 0 || colIndex >= rowSize || tokens[colIndex]) return -1;

      for (let i = 0; i < colSize; i++) {
        const nextIndex = i * rowSize + colIndex;
        if (tokens[nextIndex]) return (i - 1) * rowSize + colIndex;
      }

      return (colSize - 1) * rowSize + colIndex;
    },
    [tokens]
  );

  const handleClick = useCallback(
    (index: number) => {
      const rowSize = 7;

      if (index < 0 || index >= rowSize) return;

      const col = index % rowSize;
      const _cells = [...tokens];

      const suitableIndex = findSuitableIndex(col);
      if (suitableIndex !== -1) {
        _cells[suitableIndex] = "red";
        setTokens(_cells);
      }
    },
    [findSuitableIndex, tokens]
  );

  const Board = memo(() => (
    <div className="grid grid-cols-7 items-center gap-2 bg-blue-600 w-[40vw] h-full rounded-lg p-2">
      {tokens.map((token, i) => (
        <div
          key={i}
          onClick={() => handleClick(i)}
          className={`${
            token ? "bg-red-400" : "bg-white"
          } rounded-full w-16 h-16 place-self-center hover:cursor-pointer`}
        />
      ))}
    </div>
  ));
  Board.displayName = "Board";

  return (
    <div className="flex flex-row justify-center w-[80vw] h-[70vh] gap-4">
      <Board />
    </div>
  );
}
