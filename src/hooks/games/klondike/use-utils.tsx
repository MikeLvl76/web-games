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

export type BoardStackName = `board_stack_${number}`;

export type GameStacks = {
  pack: Stack;
  draw: Stack;
  club_foundation: Stack;
  spade_foundation: Stack;
  heart_foundation: Stack;
  diamond_foundation: Stack;
  [key: BoardStackName]: Stack;
};

export interface DraggableDataType extends DndDefaultDataType {
  sourceName: keyof GameStacks;
  cards: Card[];
  boardStackCardIndex: number;
}

export interface DroppableDataType extends DndDefaultDataType {
  targetName: keyof GameStacks;
}

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
  const [movesCount, setMovesCount] = useState(0);

  const compareCards = (c1: Card, c2: Card, includeFoundation?: boolean) => {
    if (includeFoundation) {
      // Foundation
      return (
        c2.rank.value - c1.rank.value === 1 &&
        c1.symbol === c2.symbol &&
        c1.color === c2.color
      );
    }

    // Board
    return (
      c1.rank.value - c2.rank.value === 1 &&
      c1.symbol !== c2.symbol &&
      c1.color !== c2.color
    );
  };

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
      if (!active || !over) return;

      const source: DraggableDataType | undefined = active.data
        .current as DraggableDataType;

      const dest: DroppableDataType | undefined = over.data
        .current as DroppableDataType;

      if (!source || !dest || !dest.accepts?.includes(source.type)) return;

      const _stacks = { ...stacks };
      const { sourceName, cards, boardStackCardIndex } = source;
      const { targetName } = dest;

      if (dest.type === "pile") {
        if (source.type === "draw") {
          const sourceCards = _stacks[sourceName].cards;
          const targetCards = _stacks[targetName].cards;
          const [card] = cards;
          if (!card) return;

          if (targetCards.length > 0) {
            const [lastCard] = targetCards.slice(-1);
            if (!lastCard || !compareCards(lastCard, card)) {
              return;
            }
          }

          card.isHidden = false;
          targetCards.push(card);
          sourceCards.pop();
          setStacks(_stacks);
          setMovesCount((prev) => prev + 1);
          return;
        }

        if (source.type === "pile") {
          if (boardStackCardIndex === -1 || cards.length === 0) return;

          const sourceCards = _stacks[sourceName].cards;
          const targetCards = _stacks[targetName].cards;

          const head = cards[0];

          if (targetCards.length > 0) {
            const [lastCard] = targetCards.slice(-1);
            if (!head || !lastCard || !compareCards(lastCard, head)) {
              return;
            }
          } else {
            if (head.rank.name !== "king") return;
          }

          targetCards.push(...cards.map((c) => ({ ...c, isHidden: false })));
          sourceCards.splice(boardStackCardIndex, cards.length);

          const [pileLastCard] = sourceCards.slice(-1);
          if (pileLastCard) {
            pileLastCard.isHidden = false;
          }

          setStacks(_stacks);
          setMovesCount((prev) => prev + 1);
          return;
        }
        return;
      }

      if (dest.type === "foundation") {
        const sourceCards = _stacks[sourceName].cards;
        const foundationCards = _stacks[targetName].cards;
        const [foundationCard] = foundationCards.slice(-1);
        const [card] = cards.slice(-1);

        if (
          (!foundationCard && card.rank.value > 1) ||
          (card && foundationCard && !compareCards(foundationCard, card, true))
        ) {
          return;
        }

        foundationCards.push(card);
        sourceCards.pop();

        if (source.type === "pile") {
          const [pileLastCard] = sourceCards.slice(-1);
          if (pileLastCard) {
            pileLastCard.isHidden = false;
          }
        }

        setStacks(_stacks);
        setMovesCount((prev) => prev + 1);
        return;
      }
    },
    [stacks]
  );

  useEffect(() => {
    setup();
  }, [setup]);

  return {
    variables: { defaultPack, completeFoundations },
    states: { stacks, setStacks, movesCount, setMovesCount },
    functions: { setup, drawCard, handleDragEnd, generatePack, compareCards },
  };
}
