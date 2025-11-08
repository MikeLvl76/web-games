"use client";

import { memo, useState } from "react";
import { CardContainer } from "./card-container";
import { DragOverlay, DragStartEvent, useDndMonitor } from "@dnd-kit/core";
import { BoardStack } from "./board-stack";
import { Card, GameStacks } from "@/hooks/games/klondike/use-utils";

type Props = {
  stacks: GameStacks;
};

export const BoardMain = memo(({ stacks }: Props) => {
  const [activeStack, setActiveStack] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>();

  useDndMonitor({
    onDragStart({ active }: DragStartEvent) {
      setActiveStack(active.data?.current?.sub);
      setActiveCard(active.data?.current?.card);
    },
    onDragEnd() {
      setActiveStack([]);
      setActiveCard(null);
    },
  });

  return (
    <div className="flex flex-row justify-evenly w-full h-full select-none">
      {Array.from({ length: 7 }, (_, k) => {
        const stack = stacks[`board_stack_${k + 1}`];
        return <BoardStack key={stack.id} stack={stack} />;
      })}
      <DragOverlay dropAnimation={{ duration: 250 }} zIndex={1}>
        {activeStack.length > 0 && !activeCard && (
          <div className="relative w-24 h-32 translate-y-8">
            {activeStack.map((card, i) => (
              <div
                key={card.id}
                className="absolute w-full h-full rounded-md border-2 border-black bg-slate-200"
                style={{ top: `${i * 18}px` }}
              >
                <CardContainer
                  symbol={card.symbol}
                  color={card.color}
                  rank={card.rank.name}
                  className="flex flex-col justify-center items-center gap-2 h-full hover:cursor-grab"
                />
              </div>
            ))}
          </div>
        )}
        {activeCard && activeStack.length < 2 && (
          <CardContainer
            symbol={activeCard.symbol}
            color={activeCard.color}
            rank={activeCard.rank.name}
            className="relative flex flex-col justify-center items-center gap-2 w-24 h-32 rounded-md bg-slate-200 border-2 border-black hover:cursor-grab"
          />
        )}
      </DragOverlay>
    </div>
  );
});
BoardMain.displayName = "BoardMain";
