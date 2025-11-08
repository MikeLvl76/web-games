"use client";

import Draggable from "@/components/generic/draggable";
import { CardContainer } from "./card-container";
import { Card, DraggableDataType } from "@/hooks/games/klondike/use-utils";

type Props = {
  card: Card;
  cardIndex: number;
  pileIndex: number;
  sub: Card[];
  isDragging?: boolean;
};

export function BoardCard({
  card,
  cardIndex,
  pileIndex,
  sub,
  isDragging,
}: Props) {
  return (
    <Draggable<DraggableDataType>
      nodeId={card.id}
      data={{
        type: "col-drag",
        card,
        cardIndex,
        pileIndex,
        sub,
      }}
      disabled={card.isHidden}
    >
      <div
        key={cardIndex}
        className={`
                absolute w-24 h-32 rounded-md border-2 border-black shadow-2xl
                ${
                  card.isHidden
                    ? "bg-red-700"
                    : "bg-slate-200 hover:cursor-pointer"
                }
                ${isDragging ? "opacity-0" : "opacity-100"}
              `}
        style={{
          top: `${cardIndex * 18}px`,
        }}
      >
        {!card.isHidden && (
          <CardContainer
            symbol={card.symbol}
            color={card.color}
            rank={card.rank.name}
            className="flex flex-col justify-center items-center gap-2 h-full"
          />
        )}
      </div>
    </Draggable>
  );
}
