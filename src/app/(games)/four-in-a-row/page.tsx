"use client";

import { stringifyTime } from "@/lib/utils";
import { ArrowBigDown, RotateCcw } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

type Token = "red" | "yellow" | undefined;

export default function FourInARowPage() {
  const [tokens, setTokens] = useState<Token[]>(Array(42).fill(undefined));
  const [isHoveringIndex, setIsHoveringIndex] = useState(-1);
  const [playerColor, setPlayerColor] = useState<NonNullable<Token>>("red");
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: "00:00",
  });

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
      const _tokens = [...tokens];

      const suitableIndex = findSuitableIndex(col);
      if (suitableIndex !== -1) {
        _tokens[suitableIndex] = playerColor;
        setTokens(_tokens);
        setPlayerColor((prev) => (prev === "red" ? "yellow" : "red"));
      }
    },
    [findSuitableIndex, playerColor, tokens]
  );

  useEffect(() => {
    let time = 0;
    const interval = setInterval(() => {
      time++;

      setTimer({ value: time, text: stringifyTime(time) });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
                elt
                  ? elt === "red"
                    ? "bg-red-400"
                    : "bg-amber-200"
                  : "bg-white"
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
      <div className="flex flex-col items-start gap-4 w-[15vw]">
        <span className="font-bold text-xl">Player vs Player</span>
        <div className="w-full">
          <div className="flex flex-row items-center justify-between">
            <p>Current turn</p>
            <p className="font-bold text-slate-700">
              {playerColor === "red" ? "Player 1" : "Player 2"}
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <p>Time</p>
          <p className="font-bold text-slate-700">{timer.text}</p>
        </div>
        <div className="flex w-full">
          <RotateCcw
            color="white"
            size={24}
            onClick={() => {
              alert("TODO");
            }}
            className="self-start w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
