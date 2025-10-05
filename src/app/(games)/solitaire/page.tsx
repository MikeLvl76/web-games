"use client";

import {
  Card,
  CardSymbol,
  generatePack,
} from "@/server-actions/pack-generator";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useState } from "react";
import { BoardHeader } from "./board-header";
import { BoardMain } from "./board-main";
import { BoardTimer } from "./board-timer";
import { compareCards } from "@/utils/misc/compare-cards";
import { DraggableDataType, DroppableDataType } from "@/utils/misc/dnd-types";

export default function SolitairePage() {
  const [pack, setPack] = useState<Card[]>([]);
  const [sequences, setSequences] = useState<Record<CardSymbol, Card[]>>({
    club: [],
    spade: [],
    heart: [],
    diamond: [],
  });
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [piles, setPiles] = useState<Card[][]>([[], [], [], [], [], [], []]);

  const init = useCallback(async () => {
    try {
      const _pack = await generatePack();
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
    } catch (err) {
      console.error(err);
    }
  }, []);

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

          if (!pileIndex) return;
          const _piles = [...piles];
          const length = _piles[pileIndex].length;

          if (length > 0) {
            const lastCard = _piles[pileIndex][length - 1];
            if (!compareCards(lastCard, card)) {
              return;
            }
          }

          card.isHidden = false;
          _piles[pileIndex].push(card);

          setPiles(_piles);
          setDrawnCards((prev) => prev.slice(0, cardIndex));
          return;
        }

        if (source.type === "col-drag") {
          const { card, cardIndex, pileIndex: dragPileIndex, sub } = source;
          const { pileIndex: dropPileIndex } = dest;

          if (!dropPileIndex) return;
          const _piles = [...piles];
          const dragPile = _piles[dragPileIndex];
          const dropPile = _piles[dropPileIndex];

          if (dropPile.length > 0) {
            const lastCard = dropPile[dropPile.length - 1];
            if (!compareCards(lastCard, card)) {
              return;
            }
          }

          if (sub.length > 1) {
            dropPile.push(...sub);
            dragPile.splice(cardIndex, sub.length);
          } else {
            dropPile.push(card);
            dragPile.pop();
          }

          card.isHidden = false;

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
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex flex-col w-[70vw] h-[80vh] bg-green-800 rounded-md">
        <BoardTimer />
        <BoardHeader
          pack={pack}
          sequences={sequences}
          drawnCards={drawnCards}
          draw={draw}
        />
        <BoardMain piles={piles} />
      </div>
    </DndContext>
  );
}
