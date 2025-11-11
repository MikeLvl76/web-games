"use client";

import {
  BoardStackName,
  Card,
  DroppableDataType,
  Stack,
} from "@/hooks/games/klondike/use-utils";
import { BoardCard } from "./board-card";
import Droppable from "@/components/generic/droppable";

type Props = {
  name: BoardStackName;
  stack: Stack;
  activeCards: Card[];
};

export function BoardStack({ name, stack, activeCards }: Props) {
  return (
    <Droppable<DroppableDataType>
      nodeId={`drop-pile-${stack.id}`}
      data={{
        accepts: ["draw", "pile"],
        type: "pile",
        targetName: name,
      }}
    >
      <div className="relative w-24 h-32">
        <div className="absolute inset-0 rounded-md bg-slate-400/70" />
        {stack.cards.map((card, index) => {
          const sub = stack.cards.slice(index);
          return (
            <BoardCard
              key={card.id}
              name={name}
              current={card}
              index={index}
              cards={sub}
              isDragging={
                activeCards.length > 0 &&
                activeCards.some((c) => c.id === card.id)
              }
            />
          );
        })}
      </div>
    </Droppable>
  );
}
