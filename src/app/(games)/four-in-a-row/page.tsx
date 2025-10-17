"use client";

import { GameStatus } from "@/components/generic/game-status";
import { Button } from "@/components/ui/button";
import { stringifyTime } from "@/lib/utils";
import { ArrowBigDown, RotateCcw } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

type Token = "red" | "yellow" | undefined;
const WINNING_COLLECTION_LENGTH = 4;

export default function FourInARowPage() {
  const [tokens, setTokens] = useState<Token[]>(Array(42).fill(undefined));
  const [isHoveringIndex, setIsHoveringIndex] = useState(-1);
  const [playerColor, setPlayerColor] = useState<NonNullable<Token>>("red");
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isEnd, setIsEnd] = useState(false);

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

  const checkEndGame = useCallback(
    (_tokens: Token[], index: number, color: NonNullable<Token>) => {
      const rowSize = 7;
      const colSize = 6;

      for (let r = 0; r < colSize; r++) {
        for (let c = 0; c < rowSize - 3; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      for (let r = 0; r < colSize - 3; r++) {
        for (let c = 0; c < rowSize; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k * rowSize]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      for (let r = 0; r < colSize - 3; r++) {
        for (let c = 0; c < rowSize - 3; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k * (rowSize + 1)]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      for (let r = 3; r < colSize; r++) {
        for (let c = 0; c < rowSize - 3; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k * (rowSize - 1)]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      return false;
    },
    []
  );

  const handleClick = useCallback(
    (index: number) => {
      if (isEnd) return;

      const rowSize = 7;

      if (index < 0 || index >= rowSize) return;

      const col = index % rowSize;
      const _tokens = [...tokens];

      const suitableIndex = findSuitableIndex(col);
      if (suitableIndex !== -1) {
        _tokens[suitableIndex] = playerColor;

        const isWin = checkEndGame(_tokens, suitableIndex, playerColor);

        if (isWin) {
          setIsEnd(true);
        } else {
          setPlayerColor((prev) => (prev === "red" ? "yellow" : "red"));
        }

        setTokens(_tokens);
      }
    },
    [checkEndGame, findSuitableIndex, isEnd, playerColor, tokens]
  );

  useEffect(() => {
    if (isEnd) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isEnd]);

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
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <Board />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Player vs player"
          infos={[
            {
              label: "Current turn",
              value: playerColor === "red" ? "Player 1" : "Player 2",
            },
            { label: "Game time", value: timer.text },
            {
              label: "Winner",
              value: isEnd
                ? playerColor === "red"
                  ? "Player 1"
                  : "Player 2"
                : "/",
            },
          ]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setIsEnd(false);
                setTimer({ value: 0, text: stringifyTime(0) });
                setPlayerColor("red");
                setIsHoveringIndex(-1);
                setTokens(Array(42).fill(undefined));
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(() => {
                  setTimer((prev) => ({
                    value: prev.value + 1,
                    text: stringifyTime(prev.value + 1),
                  }));
                }, 1000);
              }}
            >
              <p className="text-white font-bold text-md text-center">
                Restart
              </p>
              <RotateCcw color="white" size={32} />
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
