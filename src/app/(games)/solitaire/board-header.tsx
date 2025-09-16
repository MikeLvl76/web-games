"use client";

import CardSymbolIcon from "@/components/generic/card-symbol-icon";
import Draggable from "@/components/generic/draggable";
import Droppable from "@/components/generic/droppable";
import {
  Card,
  CardSymbol,
  SYMBOL_COLOR,
  CardColor,
} from "@/server-actions/pack-generator";
import { DraggableDataType, DroppableDataType } from "@/utils/misc/dnd-types";
import { memo } from "react";

type Props = {
  pack: Card[];
  sequences: Record<CardSymbol, Card[]>;
  drawnCards: Card[];
  draw: () => void;
};

export const BoardHeader = memo(
  ({ pack, sequences, drawnCards, draw }: Props) => {
    const lastCard = drawnCards[drawnCards.length - 1];

    return (
      <div className="flex flex-row justify-evenly items-center h-48 select-none">
        {Object.entries(sequences).map(([sym, sequence], index) => (
          <Droppable<DroppableDataType>
            key={index}
            nodeId={`drop-seq-${index}`}
            data={{
              accepts: ["draw-drag", "col-drag"],
              type: "sequence",
              symbol: sym as CardSymbol,
            }}
            disabled={sequence.length === 13}
          >
            <div className="relative w-24 h-32">
              <div className="absolute inset-0 flex justify-center items-center rounded-md bg-slate-400/70">
                <CardSymbolIcon
                  symbol={sym as CardSymbol}
                  color={SYMBOL_COLOR[sym as CardSymbol] as CardColor}
                />
              </div>
              {sequence.length > 0 && (
                <div
                  className={`relative flex flex-col justify-center items-center gap-2 w-24 h-32 rounded-md bg-slate-200`}
                >
                  <CardSymbolIcon
                    symbol={sym as CardSymbol}
                    color={SYMBOL_COLOR[sym as CardSymbol] as CardColor}
                  />
                  <p className="text-lg font-bold">
                    {sequence[sequence.length - 1].rank.name}
                  </p>
                </div>
              )}
            </div>
          </Droppable>
        ))}
        <div className="relative w-24 h-32" />

        <div className="relative w-24 h-32">
          {drawnCards.length > 1 ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center w-24 h-32 bg-slate-200 hover:cursor-pointer rounded-md gap-2">
              <CardSymbolIcon
                symbol={drawnCards[drawnCards.length - 2].symbol}
                color={drawnCards[drawnCards.length - 2].color}
              />
              <p className="text-lg font-bold">
                {drawnCards[drawnCards.length - 2].rank.name}
              </p>
            </div>
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
              }}
              disabled={drawnCards.length === 0}
            >
              <div className="relative flex flex-col justify-center items-center w-24 h-32 bg-slate-200 hover:cursor-pointer rounded-md gap-2">
                <CardSymbolIcon
                  symbol={lastCard.symbol}
                  color={lastCard.color}
                />
                <p className="text-lg font-bold">{lastCard.rank.name}</p>
              </div>
            </Draggable>
          )}
        </div>

        <div className="relative w-24 h-32">
          <div className="absolute inset-0 rounded-md bg-slate-400/70" />
          <div
            onClick={draw}
            className={`relative flex justify-center items-center w-24 h-32 rounded-md hover:cursor-pointer ${
              pack.length > 0
                ? "bg-red-700 border-2 border-black"
                : "bg-slate-400/70"
            } `}
          >
            {pack.length > 0 && (
              <p className="text-xl text-white">{pack.length}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
);
BoardHeader.displayName = "BoardHeader";
