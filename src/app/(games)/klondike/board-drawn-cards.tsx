"use client";

import { Card, DraggableDataType } from "@/lib/utils";
import { useMemo } from "react";
import { CardContainer } from "./card-container";
import Draggable from "@/components/generic/draggable";

type Props = {
  drawnCards: Card[];
};

export function BoardDrawnCards({ drawnCards }: Props) {
  const lastCard = useMemo(() => {
    const [last] = drawnCards.slice(-1);
    return last;
  }, [drawnCards]);

  const preLastCard = useMemo(() => {
    const [last] = drawnCards.slice(-2, -1);
    return last;
  }, [drawnCards]);

  return (
    <div className="relative w-24 h-32">
      {drawnCards.length > 1 ? (
        <CardContainer
          symbol={preLastCard.symbol}
          color={preLastCard.color}
          rank={preLastCard.rank.name}
          className="absolute inset-0 flex flex-col justify-center items-center w-24 h-32 bg-slate-200 hover:cursor-pointer rounded-md gap-2"
        />
      ) : (
        <div className="absolute inset-0 rounded-md bg-slate-400/70" />
      )}
      {lastCard && (
        <Draggable<DraggableDataType>
          nodeId={`drag-drawn-card-${drawnCards.length - 1}`}
          data={{
            type: "draw-drag",
            card: lastCard,
            cardIndex: drawnCards.length - 1,
            pileIndex: -1,
            sub: [],
          }}
          disabled={drawnCards.length === 0}
        >
          <CardContainer
            symbol={lastCard.symbol}
            color={lastCard.color}
            rank={lastCard.rank.name}
            className="relative flex flex-col justify-center items-center w-24 h-32 bg-slate-200 hover:cursor-pointer rounded-md gap-2"
          />
        </Draggable>
      )}
    </div>
  );
}
