"use client";

import { stringifyTime } from "@/lib/utils";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import {
  Gamepad2Icon,
  InfoIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUtils } from "@/hooks/games/klondike/use-utils";
import { Board } from "./board";
import GameDetails from "@/components/custom/game/details";

type Props = {
  enableTime: boolean;
};

export default function KlondikeGame({ enableTime }: Props) {
  const [isEnd, setIsEnd] = useState(false);
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utils = useUtils();
  const { completeFoundations } = utils.variables;
  const { stacks, movesCount, setMovesCount } = utils.states;
  const { setup, handleDragEnd, drawCard } = utils.functions;

  useEffect(() => {
    if (isEnd || !enableTime) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [enableTime, isEnd]);

  useEffect(() => {
    const isDone =
      stacks["club_foundation"].cards.length === 13 &&
      stacks["spade_foundation"].cards.length === 13 &&
      stacks["heart_foundation"].cards.length === 13 &&
      stacks["diamond_foundation"].cards.length === 13;

    setIsEnd(isDone);
  }, [stacks]);

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="flex flex-row justify-center items-center h-screen gap-8 p-2">
        <Board stacks={stacks} onDrawCard={drawCard} />
        <div className="flex w-[20%] h-[75%] items-start">
          <GameDetails
            sections={[
              {
                title: "Controls",
                icon: Gamepad2Icon,
                iconProps: { fill: "black", color: "black" },
                content: {
                  infos: ["Click and hold left mouse button to move card."],
                  elements: [],
                },
              },
              {
                title: "Game infos",
                icon: InfoIcon,
                iconProps: { fill: "#3A79BA", color: "black" },
                content: {
                  infos: [
                    `${movesCount} moves`,
                    `${completeFoundations} completed suites`,
                    `Time: ${timer.text}`,
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
                        setIsEnd(false);
                        setTimer({ value: 0, text: stringifyTime(0) });
                        setup();
                        setMovesCount(0);
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
    </DndContext>
  );
}
