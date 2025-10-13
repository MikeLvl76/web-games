"use client";

import { ArrowBigDown } from "lucide-react";
import { memo, useCallback, useState } from "react";

type Token = "red" | "yellow" | undefined;

export default function FourInARowPage() {
  const [tokens, setTokens] = useState<Token[]>(Array(42).fill(undefined));
  const [isHoveringIndex, setIsHoveringIndex] = useState(-1);

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

  const Column = memo(({ index }: { index: number }) => {
    const rowSize = 7;
    const colSize = 6;

    const elements = Array.from(
      { length: colSize },
      (_, k) => tokens[k * rowSize + index]
    );

    return (
      <div className="relative">
        {isHoveringIndex === index && (
          <ArrowBigDown
            color="black"
            fill="red"
            size={64}
            className="absolute -top-20"
          />
        )}
        <div
          onMouseEnter={() => setIsHoveringIndex(index)}
          onMouseLeave={() => setIsHoveringIndex(-1)}
          className="flex flex-col gap-4 items-center"
        >
          {elements.map((elt, i) => (
            <div
              key={i}
              onClick={() => handleClick(index)}
              className={`${
                elt ? "bg-red-400" : "bg-white"
              } rounded-full w-16 h-16 place-self-center hover:cursor-pointer`}
            />
          ))}
        </div>
      </div>
    );
  });
  Column.displayName = "Column";

  const Board = memo(() => {
    const rowSize = 7;

    const columns = Array.from({ length: rowSize }, (_, k) => (
      <Column key={k} index={k} />
    ));

    return (
      <div className="flex flex-row w-fit h-fit gap-4 justify-center items-center bg-blue-600 rounded-lg p-4">
        {columns}
      </div>
    );
  });
  Board.displayName = "Board";

  return (
    <div className="flex flex-row justify-center w-[80vw] h-[70vh] gap-4">
      <Board />
    </div>
  );
}
