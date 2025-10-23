"use client";

import { GameStatus } from "@/components/generic/game-status";
import { Button } from "@/components/ui/button";
import { stringifyTime } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Board } from "./board";

export type Token = "red" | "yellow" | undefined;
type Player = {
  name: string;
  color: NonNullable<Token>;
  currentTurn: boolean;
  isWinner: boolean;
};

const WINNING_COLLECTION_LENGTH = 4;

export default function FourInARowPage() {
  const [tokens, setTokens] = useState<Token[]>(Array(42).fill(undefined));
  const [hoveringIndex, setHoveringIndex] = useState(-1);
  const [players, setPlayers] = useState<Record<Player["name"], Player>>({
    p1: {
      name: "p1",
      color: "red",
      currentTurn: true,
      isWinner: false,
    },
    p2: {
      name: "p2",
      color: "yellow",
      currentTurn: false,
      isWinner: false,
    },
  });
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (players.p1.isWinner || players.p2.isWinner) return;

      const rowSize = 7;

      if (index < 0 || index >= rowSize) return;

      const col = index % rowSize;
      const _tokens = [...tokens];
      const currentPlayer = players.p1.currentTurn ? players.p1 : players.p2;

      const suitableIndex = findSuitableIndex(col);
      if (suitableIndex !== -1) {
        _tokens[suitableIndex] = currentPlayer.color;

        const isWin = checkEndGame(_tokens, suitableIndex, currentPlayer.color);

        if (isWin) {
          setPlayers((prev) => {
            const hasP1Win = currentPlayer.name === prev.p1.name && isWin;

            return {
              ...prev,
              p1: {
                ...prev.p1,
                isWinner: hasP1Win,
              },
              p2: {
                ...prev.p2,
                isWinner: !hasP1Win,
              },
            };
          });
        } else {
          setPlayers((prev) => {
            const isP1Turn = !prev.p1.currentTurn;

            return {
              ...prev,
              p1: {
                ...prev.p1,
                currentTurn: isP1Turn,
              },
              p2: {
                ...prev.p2,
                currentTurn: !isP1Turn,
              },
            };
          });
        }

        setTokens(_tokens);
      }
    },
    [checkEndGame, findSuitableIndex, players, tokens]
  );

  useEffect(() => {
    if (players.p1.isWinner || players.p2.isWinner) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [players]);

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <Board
          hoveringIndex={hoveringIndex}
          setHoveringIndex={setHoveringIndex}
          tokens={tokens}
          handleClick={handleClick}
        />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Four in a row"
          description="Align four of your tokens"
          controls={[
            { label: "Insert token", value: "Click on one of columns" },
          ]}
          infos={[
            {
              label: "Current turn",
              value: players.p1.currentTurn ? "Player 1" : "Player 2",
            },
            {
              label: "Red tokens",
              value:
                players.p1.color === "red" ? players.p1.name : players.p2.name,
            },
            {
              label: "Yellow tokens",
              value:
                players.p1.color === "yellow"
                  ? players.p1.name
                  : players.p2.name,
            },
            { label: "Game time", value: timer.text },
            {
              label: "Winner",
              value: players.p1.isWinner
                ? players.p1.name
                : players.p2.isWinner
                ? players.p2.name
                : "/",
            },
          ]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setTimer({ value: 0, text: stringifyTime(0) });
                setPlayers((prev) => ({
                  ...prev,
                  p1: {
                    ...prev.p1,
                    currentTurn: !prev.p1.isWinner,
                    isWinner: false,
                  },
                  p2: {
                    ...prev.p2,
                    currentTurn: !prev.p2.isWinner,
                    isWinner: false,
                  },
                }));
                setHoveringIndex(-1);
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
