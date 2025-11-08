"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePackGenerator } from "./use-pack-generator";
import { DndDefaultDataType } from "@/lib/utils";
import { DragEndEvent } from "@dnd-kit/core";

export type CardSymbol = "heart" | "spade" | "diamond" | "club";
export type CardColor = "black" | "red";
export type CardRank = {
  name: string;
  value: number;
};
export type Card = {
  id: string;
  rank: CardRank;
  symbol: CardSymbol;
  color: CardColor;
  isHidden: boolean;
};

export const SYMBOL_COLOR = {
  club: "black",
  spade: "black",
  heart: "red",
  diamond: "red",
};

export type Stack = {
  id: string;
  type: "board" | "foundation" | "draw" | "pack";
  cards: Card[];
};

export type GameStacks = {
  pack: Stack;
  draw: Stack;
  club_foundation: Stack;
  spade_foundation: Stack;
  heart_foundation: Stack;
  diamond_foundation: Stack;
  [key: `board_stack_${number}`]: Stack;
};

export type DraggableDataType = DndDefaultDataType & {
  card: Card;
  cardIndex: number;
  pileIndex: number;
  sub: Card[];
};

export type DroppableDataType = DndDefaultDataType & {
  symbol?: CardSymbol;
  pileIndex?: number;
};

type UtilsParams = Record<string, unknown>;

export function useUtils({}: UtilsParams = {}) {
  const { pack: defaultPack, generatePack } = usePackGenerator();
  const [stacks, setStacks] = useState<GameStacks>({
    pack: { id: "pack-stack", type: "pack", cards: [] },
    draw: { id: "draw-stack", type: "draw", cards: [] },
    club_foundation: {
      id: "club-foundation-stack",
      type: "foundation",
      cards: [],
    },
    spade_foundation: {
      id: "spade-foundation-stack",
      type: "foundation",
      cards: [],
    },
    heart_foundation: {
      id: "heart-foundation-stack",
      type: "foundation",
      cards: [],
    },
    diamond_foundation: {
      id: "diamond-foundation-stack",
      type: "foundation",
      cards: [],
    },
    ...Array.from({ length: 7 }, (_, k) => ({
      [`board_stack_${k + 1}`]: {
        id: `board-stack-${k + 1}`,
        type: "board",
        cards: [],
      },
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  });

  const compareCards = (c1: Card, c2: Card, includeSequence?: boolean) =>
    (includeSequence &&
      c2.rank.value - c1.rank.value === 1 &&
      c1.symbol === c2.symbol &&
      c1.color === c2.color) ||
    (c1.rank.value - c2.rank.value === 1 &&
      c1.symbol !== c2.symbol &&
      c1.color !== c2.color);

  const completeFoundations = useMemo(() => {
    if (JSON.stringify(stacks) === "{}") return 0;

    const clubFoundation = stacks[`club_foundation`].cards;
    const spadeFoundation = stacks[`spade_foundation`].cards;
    const heartFoundation = stacks[`heart_foundation`].cards;
    const diamondFoundation = stacks[`diamond_foundation`].cards;

    let count = 0;

    if (clubFoundation.length === 13) count++;
    if (spadeFoundation.length === 13) count++;
    if (heartFoundation.length === 13) count++;
    if (diamondFoundation.length === 13) count++;

    return count;
  }, [stacks]);

  const setup = useCallback(() => {
    const _stacks: GameStacks = {
      pack: {
        id: "pack-stack",
        type: "pack",
        cards: [...defaultPack].sort(() => Math.random() - 0.5),
      },
      draw: { id: "draw-stack", type: "draw", cards: [] },
      club_foundation: {
        id: "club-foundation-stack",
        type: "foundation",
        cards: [],
      },
      spade_foundation: {
        id: "spade-foundation-stack",
        type: "foundation",
        cards: [],
      },
      heart_foundation: {
        id: "heart-foundation-stack",
        type: "foundation",
        cards: [],
      },
      diamond_foundation: {
        id: "diamond-foundation-stack",
        type: "foundation",
        cards: [],
      },
      ...Array.from({ length: 7 }, (_, k) => ({
        [`board_stack_${k + 1}`]: {
          id: `board-stack-${k + 1}`,
          type: "board",
          cards: [],
        },
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
    const NB_PILES = 7;

    for (let k = 0; k < NB_PILES; k++) {
      for (let i = 0; i < k + 1; i++) {
        const randomIdx = Math.floor(Math.random() * _stacks.pack.cards.length);
        const [card] = _stacks.pack.cards.splice(randomIdx, 1);

        if (card) {
          card.isHidden = !(i === k);
          _stacks[`board_stack_${k + 1}`].cards.push(card);
        }
      }
    }

    setStacks(_stacks);
  }, [defaultPack]);

  const drawCard = useCallback(() => {
    setStacks((prev) =>
      prev.pack.cards.length === 0 && prev.draw.cards.length > 0
        ? // When clicking on empty pack -> refill pack with drawn cards
          {
            ...prev,
            pack: {
              ...prev.pack,
              cards: prev.draw.cards,
            },
            draw: {
              ...prev.draw,
              cards: [],
            },
          }
        : {
            ...prev,
            pack: {
              ...prev.pack,
              cards: prev.pack.cards.slice(0, -1),
            },
            draw: {
              ...prev.draw,
              cards: [...prev.draw.cards, ...prev.pack.cards.slice(-1)],
            },
          }
    );
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
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
            const _stacks = { ...stacks };
            const _cards = _stacks[`board_stack_${pileIndex + 1}`].cards;

            if (_cards.length > 0) {
              const [lastCard] = _cards.slice(-1);
              if (!compareCards(lastCard, card)) {
                return;
              }
            }

            card.isHidden = false;
            _cards.push(card);
            stacks.draw.cards.splice(cardIndex, 1);

            setStacks(_stacks);
            return;
          }

          if (source.type === "col-drag") {
            const { cardIndex, pileIndex: dragPileIndex, sub } = source;
            const { pileIndex: dropPileIndex } = dest;

            if (typeof dropPileIndex === "undefined" || sub.length === 0)
              return;

            const _stacks = { ...stacks };
            const dragPile = _stacks[`board_stack_${dragPileIndex + 1}`].cards;
            const dropPile = _stacks[`board_stack_${dropPileIndex + 1}`].cards;
            const subHead = sub[0];

            if (dropPile.length > 0) {
              const [lastCard] = dropPile.slice(-1);
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

            const [pileLastCard] = dragPile.slice(-1);
            if (pileLastCard) {
              pileLastCard.isHidden = false;
            }

            setStacks(_stacks);
            return;
          }
        } else if (dest.type === "sequence") {
          if (source.type === "draw-drag") {
            const { card, cardIndex } = source;
            const { symbol } = dest;

            if (!symbol) return;
            const _stacks = { ...stacks };
            const foundation = _stacks[`${symbol}_foundation`].cards;
            const [lastCard] = foundation.slice(-1);

            if (
              (!lastCard && card.rank.value > 1) ||
              (lastCard && !compareCards(lastCard, card, true))
            ) {
              return;
            }

            card.isHidden = false;
            foundation.push(card);
            stacks.draw.cards.splice(cardIndex, 1);

            setStacks(_stacks);
            return;
          }

          if (source.type === "col-drag") {
            const { card, pileIndex } = source;
            const { symbol } = dest;

            if (!symbol) return;
            const _stacks = { ...stacks };
            const foundation = _stacks[`${symbol}_foundation`].cards;
            const _cards = _stacks[`board_stack_${pileIndex + 1}`].cards;
            const [lastCard] = foundation.slice(-1);

            if (
              (!lastCard && card.rank.value > 1) ||
              (lastCard && !compareCards(lastCard, card, true))
            ) {
              return;
            }

            card.isHidden = false;
            foundation.push(card);
            _cards.pop();

            const [pileLastCard] = _cards.slice(-1);
            if (pileLastCard) {
              pileLastCard.isHidden = false;
            }

            setStacks(_stacks);
            return;
          }
        }
      }
    },
    [stacks]
  );

  useEffect(() => {
    setup();
  }, [setup]);

  return {
    variables: { defaultPack, completeFoundations },
    states: { stacks, setStacks },
    functions: { setup, drawCard, handleDragEnd, generatePack, compareCards },
  };
}
