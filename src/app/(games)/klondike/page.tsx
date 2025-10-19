"use client";

import { Card, CardSymbol, stringifyTime } from "@/lib/utils";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { BoardHeader } from "./board-header";
import { BoardMain } from "./board-main";
import {
  compareCards,
  DraggableDataType,
  DroppableDataType,
} from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { usePackGenerator } from "@/hooks/games/klondike/use-pack-generator";
import { GameStatus } from "@/components/generic/game-status";
import { Button } from "@/components/ui/button";

export default function KlondikePage() {
  const defaultPack = usePackGenerator();
  const [pack, setPack] = useState<Card[]>([]);
  const [sequences, setSequences] = useState<Record<CardSymbol, Card[]>>({
    club: [],
    spade: [],
    heart: [],
    diamond: [],
  });
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [piles, setPiles] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [isEnd, setIsEnd] = useState(false);
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const init = useCallback(() => {
    const _pack = [...defaultPack];
    const _piles: typeof piles = Array.from({ length: 7 }, (_, k) => {
      const pile: Card[] = [];

      for (let i = 0; i < k + 1; i++) {
        const randomIdx = Math.floor(Math.random() * _pack.length);
        const [card] = _pack.splice(randomIdx, 1);

        if (i === k) {
          card.isHidden = false;
        }
        pile.push(card);
      }

      return pile;
    });

    _pack.sort(() => Math.random() - 0.5);

    setPiles(_piles);
    setPack(_pack);
  }, [defaultPack]);

  const draw = useCallback(() => {
    const _pack = [...pack];

    if (_pack.length === 0) {
      if (drawnCards.length === 0) {
        return;
      }
      setPack(drawnCards);
      setDrawnCards([]);
      return;
    }

    const card = _pack.pop();

    setPack(_pack);
    setDrawnCards((prev) => (card ? [...prev, card] : prev));
  }, [drawnCards, pack]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const source: DraggableDataType | undefined = active.data
      .current as DraggableDataType;

    const dest: DroppableDataType | undefined = over.data
      .current as DroppableDataType;

    if (!source || !dest) return;

    if (dest.accepts?.includes(source.type)) {
      if (dest.type === "pile") {
        if (source.type === "draw-drag") {
          const { card, cardIndex } = source;
          const { pileIndex } = dest;

          if (typeof pileIndex === "undefined") return;
          const _piles = [...piles];
          const _pile = _piles[pileIndex];

          if (_pile.length > 0) {
            const lastCard = _pile[_pile.length - 1];
            if (!compareCards(lastCard, card)) {
              return;
            }
          }

          card.isHidden = false;
          _pile.push(card);

          setPiles(_piles);
          setDrawnCards((prev) => prev.slice(0, cardIndex));
          return;
        }

        if (source.type === "col-drag") {
          const { cardIndex, pileIndex: dragPileIndex, sub } = source;
          const { pileIndex: dropPileIndex } = dest;

          if (typeof dropPileIndex === "undefined" || sub.length === 0) return;
          const _piles = [...piles];
          const dragPile = _piles[dragPileIndex];
          const dropPile = _piles[dropPileIndex];
          const subHead = sub[0];

          if (dropPile.length > 0) {
            const lastCard = dropPile[dropPile.length - 1];
            if (!compareCards(lastCard, subHead)) {
              return;
            }
          } else {
            if (subHead.rank.name !== "king") return;
          }

          sub.forEach((c) => {
            c.isHidden = false;
          });
          dropPile.push(...sub);
          dragPile.splice(cardIndex, sub.length);

          const pileLastCard = dragPile[dragPile.length - 1];
          if (pileLastCard) {
            pileLastCard.isHidden = false;
          }

          setPiles(_piles);
          return;
        }
      } else if (dest.type === "sequence") {
        if (source.type === "draw-drag") {
          const { card, cardIndex } = source;
          const { symbol } = dest;

          if (!symbol) return;

          const sequence = sequences[symbol];
          const lastCard = sequence[sequence.length - 1];

          if (
            (!lastCard && card.rank.value > 1) ||
            (lastCard && !compareCards(lastCard, card, true))
          ) {
            return;
          }

          card.isHidden = false;
          setSequences((prev) => ({
            ...prev,
            [symbol]: [...[symbol], card],
          }));
          setDrawnCards((prev) => prev.slice(0, cardIndex));
          return;
        }

        if (source.type === "col-drag") {
          const { card, pileIndex } = source;
          const { symbol } = dest;

          if (!symbol) return;

          const sequence = sequences[symbol];
          const lastCard = sequence[sequence.length - 1];
          const _piles = [...piles];

          if (
            (!lastCard && card.rank.value > 1) ||
            (lastCard && !compareCards(lastCard, card, true))
          ) {
            return;
          }

          card.isHidden = false;
          setSequences((prev) => ({
            ...prev,
            [symbol]: [...[symbol], card],
          }));

          _piles[pileIndex].pop();
          const pileLastCard = _piles[pileIndex][_piles[pileIndex].length - 1];
          if (pileLastCard) {
            pileLastCard.isHidden = false;
          }

          setPiles(_piles);
          return;
        }
      }
    }
  };

  useEffect(() => {
    if (isEnd) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isEnd]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cards = Object.values(sequences);
    setIsEnd(cards.every((sq) => sq.length === 13));
  }, [sequences]);

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex flex-row justify-center items-center h-full gap-8 p-2">
        <div className="flex flex-col w-[80%] h-[75%] bg-green-800 rounded-md">
          <BoardHeader
            pack={pack}
            sequences={sequences}
            drawnCards={drawnCards}
            draw={draw}
          />
          <BoardMain piles={piles} />
        </div>
        <div className="flex w-[20%] h-[75%] items-start">
          <GameStatus
            title="Klondike"
            description="Recreate all four sequences"
            controls={[
              {
                label: "Move card",
                value: "Drag card onto a pile/sequence",
              },
            ]}
            infos={[
              { label: "Game time", value: timer.text },
              {
                label: "Recreated sequences",
                value: `${
                  Object.values(sequences).filter((sq) => sq.length === 13)
                    .length
                }`,
              },
            ]}
            options={[
              <Button
                key="restart-button"
                variant="default"
                className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
                onClick={() => {
                  setIsEnd(false);
                  setTimer({ value: 0, text: stringifyTime(0) });
                  setPack([]);
                  setDrawnCards([]);
                  setSequences({ club: [], diamond: [], heart: [], spade: [] });
                  setPiles([]);
                  init();
                  clearInterval(intervalRef.current!);
                  intervalRef.current = setInterval(() => {
                    setTimer((prev) => ({
                      value: prev.value + 1,
                      text: stringifyTime(prev.value + 1),
                    }));
                  }, 1000);
                }}
              >
                <p className="text-white font-bold text-md text-center">
                  Restart
                </p>
                <RotateCcw color="white" size={32} />
              </Button>,
            ]}
          />
        </div>
      </div>
    </DndContext>
  );
}
