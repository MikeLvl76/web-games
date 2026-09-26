"use client";

import { useEffect, useRef, useState } from "react";
import { Board } from "./board";
import { stringifyTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Gamepad2Icon,
  InfoIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";
import { PlayerColor, useUtils } from "../../../hooks/games/checkers/use-utils";
import GameDetails from "@/components/custom/game/details";

type Props = {
  playerColor: PlayerColor;
  oppColor: PlayerColor;
  allowMultJumps: boolean;
  enableTime: boolean;
};

export default function CheckersGame({
  playerColor,
  oppColor,
  allowMultJumps,
  enableTime,
}: Props) {
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utils = useUtils({
    defaultP1Color: playerColor,
    defaultP2Color: oppColor,
    enableMultJumps: allowMultJumps,
  });
  const { players, tiles, selectedIdx, setPlayers, setSelectedIdx } =
    utils.states;
  const { init, handleClick } = utils.functions;

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const { p1, p2 } = players;
    if (p1.isWinner || p2.isWinner || !enableTime) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [enableTime, players]);

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <Board
          tiles={tiles}
          selectedIndex={selectedIdx}
          currentPlayer={players.p1.currentTurn ? players.p1 : players.p2}
          onClick={handleClick}
        />
      </div>
      <div className="flex w-[20%]">
        <GameDetails
          sections={[
            {
              title: "Controls",
              icon: Gamepad2Icon,
              iconProps: { fill: "black", color: "black" },
              content: {
                infos: ["Click on piece and on available tile to move it."],
                elements: [],
              },
            },
            {
              title: "Game infos",
              icon: InfoIcon,
              iconProps: { fill: "#3A79BA", color: "black" },
              content: {
                infos: [
                  `${players.p1.currentTurn ? players.p1.name : players.p2.name} turn`,
                  `Player pieces: ${
                    tiles.filter((t) => t.piece?.color === players.p1.color)
                      .length
                  }`,
                  `Opponent pieces: ${
                    tiles.filter((t) => t.piece?.color === players.p2.color)
                      .length
                  }`,
                  enableTime ? `Time: ${timer.text}` : "Time disabled",
                  `Winner: ${
                    players.p1.isWinner
                      ? players.p1.name
                      : players.p2.isWinner
                        ? players.p2.name
                        : "/"
                  }`,
                ],
                elements: [],
              },
            },
            {
              title: "Options",
              icon: SettingsIcon,
              iconProps: { fill: "#aaaaaa", color: "black" },
              content: {
                infos: [],
                elements: [
                  <Button
                    key="end-turn-button"
                    onClick={() => {
                      setPlayers((prev) => {
                        const p1CanPlay = !prev.p1.currentTurn;

                        return {
                          ...prev,
                          p1: {
                            ...prev.p1,
                            canContinue: false,
                            currentTurn: p1CanPlay,
                          },
                          p2: {
                            ...prev.p2,
                            canContinue: false,
                            currentTurn: !p1CanPlay,
                          },
                        };
                      });
                    }}
                    className="w-fit h-fit p-2 rounded-sm bg-red-500 text-sm text-white font-bold hover:cursor-pointer disabled:opacity-20"
                    disabled={
                      !players.p1.canContinue && !players.p2.canContinue
                    }
                  >
                    End turn
                  </Button>,
                  <Button
                    key="restart-button"
                    variant="default"
                    className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
                    onClick={() => {
                      init();
                      setPlayers((prev) => ({
                        ...prev,
                        p1: {
                          ...prev.p1,
                          canContinue: false,
                          currentTurn: !prev.p1.isWinner,
                          isWinner: false,
                          nextMove: undefined,
                        },
                        p2: {
                          ...prev.p2,
                          canContinue: false,
                          currentTurn: !prev.p2.isWinner,
                          isWinner: false,
                          nextMove: undefined,
                        },
                      }));
                      setSelectedIdx(-1);
                      setTimer({ value: 0, text: stringifyTime(0) });
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
                    <RotateCcwIcon color="white" size={32} />
                  </Button>,
                ],
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
