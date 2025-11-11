"use client";

import { useMemo } from "react";
import { CardContainer } from "./card-container";
import Draggable from "@/components/generic/draggable";
import {
  Card,
  DraggableDataType,
  GameStacks,
  Stack,
} from "@/hooks/games/klondike/use-utils";

type Props = {
  name: keyof GameStacks;
  draw: Stack;
  isCardActive?: (card: Card) => boolean;
};

export function BoardDrawnCards({ name, draw, isCardActive }: Props) {
  const { lastCard, preLastCard } = useMemo(() => {
    return {
      lastCard: draw.cards[draw.cards.length - 1],
      preLastCard: draw.cards[draw.cards.length - 2],
    };
  }, [draw.cards]);

  return (
    <div className="relative w-24 h-32">
      {preLastCard ? (
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
          nodeId={`drag-drawn-card-${lastCard.id}`}
          data={{
            type: "draw",
            sourceName: name,
            cards: [lastCard],
            boardStackCardIndex: -1,
          }}
          disabled={!lastCard}
        >
          <div
            className={`relative flex flex-col justify-center items-center w-24 h-32 bg-slate-200 hover:cursor-pointer rounded-md gap-2
              ${
                isCardActive?.(lastCard)
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }
            `}
          >
            <CardContainer
              symbol={lastCard.symbol}
              color={lastCard.color}
              rank={lastCard.rank.name}
              className="flex flex-col justify-center items-center gap-2 h-full"
            />
          </div>
        </Draggable>
      )}
    </div>
  );
}
