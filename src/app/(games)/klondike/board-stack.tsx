"use client";

import { DroppableDataType, Stack } from "@/hooks/games/klondike/use-utils";
import { BoardCard } from "./board-card";
import Droppable from "@/components/generic/droppable";

type Props = {
  stack: Stack;
  isActive?: boolean;
};

export function BoardStack({ stack, isActive }: Props) {
  return (
    <Droppable<DroppableDataType>
      nodeId={`drop-pile-${stack.id}`}
      data={{
        accepts: ["col-drag", "draw-drag"],
        type: "pile",
        pileIndex: Number(stack.id.split("-").slice(-1)[0]) - 1,
      }}
    >
      <div className="relative w-24 h-32">
        <div className="absolute inset-0 rounded-md bg-slate-400/70" />
        {stack.cards.map((card, index) => {
          const sub = stack.cards.slice(index);
          return (
            <BoardCard
              key={card.id}
              card={card}
              cardIndex={index}
              pileIndex={Number(stack.id.split("-").slice(-1)[0]) - 1}
              sub={sub}
              isDragging={isActive}
            />
          );
        })}
      </div>
    </Droppable>
  );
}
