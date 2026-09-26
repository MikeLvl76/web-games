"use client";

import { Button } from "@/components/ui/button";
import { stringifyTime } from "@/lib/utils";
import {
  Gamepad2Icon,
  InfoIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Board } from "./board";
import { Token, useUtils } from "@/hooks/games/four-in-a-row/use-utils";
import GameDetails from "@/components/custom/game/details";

type Props = {
  playerColor: NonNullable<Token>;
  oppColor: NonNullable<Token>;
  enableTime: boolean;
};

export default function FourInARowGame({
  playerColor,
  oppColor,
  enableTime,
}: Props) {
  const [hoveringIndex, setHoveringIndex] = useState(-1);
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utils = useUtils({
    defaultP1Color: playerColor,
    defaultP2Color: oppColor,
  });
  const { players, tokens, setPlayers, setTokens } = utils.states;
  const { handleClick } = utils.functions;

  useEffect(() => {
    if (players.p1.isWinner || players.p2.isWinner || !enableTime) return;

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
          hoveringIndex={hoveringIndex}
          setHoveringIndex={setHoveringIndex}
          tokens={tokens}
          handleClick={handleClick}
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
                infos: ["Click on column to insert token."],
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
                  `${players.p1.color === "red" ? players.p1.name : players.p2.name} has red tokens`,
                  `${
                    players.p1.color === "yellow"
                      ? players.p1.name
                      : players.p2.name
                  } has yellow tokens`,
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
