"use client";

import Draggable from "@/components/generic/draggable";
import Droppable from "@/components/generic/droppable";
import { Card } from "@/server-actions/pack-generator";
import { DraggableDataType, DroppableDataType } from "@/utils/misc/dnd-types";
import { memo, useState } from "react";
import { CardContainer } from "./card-container";
import { DragOverlay, DragStartEvent, useDndMonitor } from "@dnd-kit/core";

type Props = {
  piles: Card[][];
};

export const BoardMain = memo(({ piles }: Props) => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  useDndMonitor({
    onDragStart({ active }: DragStartEvent) {
      setActiveCard(active.data?.current?.card);
    },
    onDragEnd() {
      setActiveCard(null);
    },
  });

  return (
    <div className="flex flex-row justify-evenly w-full select-none">
      {piles.map((pile, pileIndex) => (
        <Droppable<DroppableDataType>
          key={pileIndex}
          nodeId={`drop-pile-${pileIndex}`}
          data={{
            accepts: ["col-drag", "draw-drag"],
            type: "pile",
            pileIndex,
          }}
        >
          <div className="relative w-24 h-32">
            <div className="absolute inset-0 rounded-md bg-slate-400/70" />
            {pile.map((card, cardIndex) => (
              <Draggable<DraggableDataType>
                nodeId={`drag-card-${pileIndex}-${cardIndex}`}
                data={{
                  type: "col-drag",
                  card,
                  cardIndex,
                  pileIndex,
                }}
                disabled={card.isHidden}
                key={cardIndex}
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
            ))}
          </div>
        </Droppable>
      ))}
      <DragOverlay dropAnimation={{ duration: 500 }} zIndex={1}>
        {activeCard && (
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
