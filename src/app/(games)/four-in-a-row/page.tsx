"use client";

import { GameStatus } from "@/components/generic/game-status";
import { Button } from "@/components/ui/button";
import { stringifyTime } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Board } from "./board";
import { useUtils } from "@/hooks/games/four-in-a-row/use-utils";

export default function FourInARowPage() {
  const [hoveringIndex, setHoveringIndex] = useState(-1);
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utils = useUtils();
  const { players, tokens, setPlayers, setTokens } = utils.states;
  const { handleClick } = utils.functions;

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
