"use client";

import Draggable from "@/components/custom/draggable";
import { CardContainer } from "./card-container";
import {
  BoardStackName,
  Card,
  DraggableDataType,
} from "@/hooks/games/klondike/use-utils";

type Props = {
  name: BoardStackName;
  current: Card;
  index: number;
  cards: Card[];
  isDragging?: boolean;
};

export function BoardCard({ name, current, cards, index, isDragging }: Props) {
  return (
    <Draggable<DraggableDataType>
      nodeId={`drag-pile-card-${current.id}`}
      data={{
        type: "pile",
        sourceName: name,
        cards,
        boardStackCardIndex: index,
      }}
      disabled={current.isHidden}
    >
      <div
        className={`
                absolute w-24 h-32 rounded-md border-2 border-black shadow-2xl transition-opacity
                ${
                  current.isHidden
                    ? "bg-red-700"
                    : "bg-slate-200 hover:cursor-pointer"
                }
                ${isDragging ? "opacity-0 pointer-events-none" : ""}
              `}
        style={{
          top: `${index * 18}px`,
        }}
      >
        {!current.isHidden && (
          <CardContainer
            symbol={current.symbol}
            color={current.color}
            rank={current.rank.name}
            className="flex flex-col justify-center items-center gap-2 h-full"
          />
        )}
      </div>
    </Draggable>
  );
}
