"use client";

import {
  DraggableDataType,
  GameStacks,
} from "@/hooks/games/klondike/use-utils";
import { BoardHeader } from "./board-header";
import { BoardMain } from "./board-main";
import { useState } from "react";
import { DragOverlay, DragStartEvent, useDndMonitor } from "@dnd-kit/core";
import { CardContainer } from "./card-container";

type Props = {
  stacks: GameStacks;
  onDrawCard: () => void;
};

export function Board({ stacks, onDrawCard }: Props) {
  const [data, setData] = useState<DraggableDataType | undefined>();

  useDndMonitor({
    onDragStart({ active }: DragStartEvent) {
      setData(active.data?.current as DraggableDataType | undefined);
    },
    onDragEnd() {
      setData(undefined);
    },
  });

  return (
    <div className="flex flex-col w-[80%] h-[75%] gap-4 p-4 bg-green-800 rounded-md">
      <BoardHeader
        stacks={stacks}
        onDrawCard={onDrawCard}
        isCardActive={(card) => card.id === data?.cards[0]?.id}
      />
      <BoardMain stacks={stacks} activeCards={data?.cards ?? []} />
      <DragOverlay dropAnimation={{ duration: 250 }} zIndex={1}>
        {data && data.type === "draw" && data.cards[0] && (
          <CardContainer
            symbol={data.cards[0].symbol}
            color={data.cards[0].color}
            rank={data.cards[0].rank.name}
            className="relative flex flex-col justify-center items-center w-24 h-32 bg-slate-200 hover:cursor-pointer rounded-md gap-2"
          />
        )}
        {data && data.type === "pile" && data.cards.length > 0 && (
          <div className="relative w-24 h-32">
            {data.cards.map((card, i) => (
              <div
                key={card.id}
                className="absolute w-full h-full rounded-md border-2 border-black bg-slate-200"
                style={{
                  top: `${
                    (i +
                      (data.boardStackCardIndex !== -1
                        ? data.boardStackCardIndex
                        : 0)) *
                    18
                  }px`,
                }}
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
      </DragOverlay>
    </div>
  );
}
