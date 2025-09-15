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
      <div className="flex flex-row justify-between items-center h-52 p-2 select-none">
        <div className="flex flex-row w-[50%] justify-evenly items-center gap-6 p-2">
          {Object.entries(sequences).map(([sym, sq], index) => (
            <Droppable
              key={index}
              nodeId={`drop-seq-${Math.random().toString(16).substring(2)}`}
              data={{
                accepts: ["draw-drag", "col-drag"],
                sequence: sq,
                index,
                symbol: sym,
              }}
              disabled={sq.length === 13}
            >
              <div className="relative w-24 h-32">
                <div className="absolute inset-0 flex justify-center items-center rounded-md bg-slate-400/70">
                  <CardSymbolIcon
                    symbol={sym as CardSymbol}
                    color={SYMBOL_COLOR[sym as CardSymbol] as CardColor}
                  />
                </div>
                {sq.length > 0 && (
                  <div
                    className={`relative flex flex-col justify-center items-center gap-2 w-24 h-32 rounded-md bg-slate-200`}
                  >
                    <CardSymbolIcon
                      symbol={sym as CardSymbol}
                      color={SYMBOL_COLOR[sym as CardSymbol] as CardColor}
                    />
                    <p className="text-lg font-bold">
                      {sq[sq.length - 1].value}
                    </p>
                  </div>
                )}
              </div>
            </Droppable>
          ))}
        </div>

        <div className="flex flex-row w-[30%] justify-evenly items-center gap-6">
          <div className="relative w-24 h-32">
            <div className="absolute inset-0 rounded-md bg-slate-400/70" />
            {lastCard && (
              <Draggable
                nodeId={`drag-drawn-card-${Math.random()
                  .toString(16)
                  .substring(2)}`}
                data={{ type: "draw-drag", card: lastCard }}
                disabled={drawnCards.length === 0}
              >
                <div className="relative flex flex-col justify-center items-center w-24 h-32 bg-slate-200 hover:cursor-pointer rounded-md gap-2">
                  <CardSymbolIcon
                    symbol={lastCard.symbol}
                    color={lastCard.color}
                  />
                  <p className="text-lg font-bold">{lastCard.value}</p>
                </div>
              </Draggable>
            )}
          </div>

          <div className="relative w-24 h-32">
            <div className="absolute inset-0 rounded-md bg-slate-400/70" />
            <div
              onClick={draw}
              className={`relative flex justify-center items-center w-24 h-32 rounded-md hover:cursor-pointer ${
                pack.length > 0 ? "bg-red-700/60" : "bg-slate-400/70"
              } `}
            >
              {pack.length > 0 && (
                <p className="text-xl text-white">{pack.length}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
BoardHeader.displayName = "BoardHeader";
