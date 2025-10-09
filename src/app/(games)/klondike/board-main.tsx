"use client";

import Draggable from "@/components/generic/draggable";
import Droppable from "@/components/generic/droppable";
import { Card } from "@/server-actions/pack-generator";
import { DraggableDataType, DroppableDataType } from "@/lib/utils";
import { memo, useState } from "react";
import { CardContainer } from "./card-container";
import { DragOverlay, DragStartEvent, useDndMonitor } from "@dnd-kit/core";

type Props = {
  piles: Card[][];
};

export const BoardMain = memo(({ piles }: Props) => {
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
            {pile.map((card, cardIndex) => {
              const sub = pile.slice(cardIndex);

              const isDragging =
                activeStack.length > 0 &&
                activeStack.some((c) => c.id === card.id);

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
                  key={card.id}
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
            })}
          </div>
        </Droppable>
      ))}
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
