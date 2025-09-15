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

  const handleDragEnd = (event?: DragEndEvent) => {
    console.log(event);
    const source = event?.active.data.current;
    const dest = event?.over?.data.current;

    if (dest?.accepts.includes(source?.type)) {
      console.log("ACCEPTED");
    }

    console.log("Source:", source);
    console.log("Dest:", dest);
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
