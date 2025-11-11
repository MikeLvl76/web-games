"use client";

import { memo } from "react";
import { BoardStack } from "./board-stack";
import { Card, GameStacks } from "@/hooks/games/klondike/use-utils";

type Props = {
  stacks: GameStacks;
  activeCards: Card[];
};

export const BoardMain = memo(({ stacks, activeCards }: Props) => {
  return (
    <div className="flex flex-row justify-evenly w-full h-full select-none">
      {Array.from({ length: 7 }, (_, k) => {
        const stack = stacks[`board_stack_${k + 1}`];
        return (
          <BoardStack
            key={stack.id}
            name={`board_stack_${k + 1}`}
            stack={stack}
            activeCards={activeCards}
          />
        );
      })}
    </div>
  );
});
BoardMain.displayName = "BoardMain";
