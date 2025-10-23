"use client";

import { useCallback, useState } from "react";

export type Token = "red" | "yellow" | undefined;
export type Player = {
  name: string;
  color: NonNullable<Token>;
  currentTurn: boolean;
  isWinner: boolean;
};
const WINNING_COLLECTION_LENGTH = 4;

type UtilsParams = {
  defaultP1Color?: NonNullable<Token>;
  defaultP2Color?: NonNullable<Token>;
};

export function useUtils({ defaultP1Color, defaultP2Color }: UtilsParams) {
  const [tokens, setTokens] = useState<Token[]>(Array(42).fill(undefined));
  const [players, setPlayers] = useState<Record<Player["name"], Player>>({
    p1: {
      name: "p1",
      color: defaultP1Color ?? "red",
      currentTurn: true,
      isWinner: false,
    },
    p2: {
      name: "p2",
      color: defaultP2Color ?? "yellow",
      currentTurn: false,
      isWinner: false,
    },
  });

  const findSuitableIndex = useCallback(
    (colIndex: number) => {
      const rowSize = 7;
      const colSize = 6;

      if (colIndex < 0 || colIndex >= rowSize || tokens[colIndex]) return -1;

      for (let i = 0; i < colSize; i++) {
        const nextIndex = i * rowSize + colIndex;
        if (tokens[nextIndex]) return (i - 1) * rowSize + colIndex;
      }

      return (colSize - 1) * rowSize + colIndex;
    },
    [tokens]
  );

  const checkEndGame = useCallback(
    (_tokens: Token[], index: number, color: NonNullable<Token>) => {
      const rowSize = 7;
      const colSize = 6;

      for (let r = 0; r < colSize; r++) {
        for (let c = 0; c < rowSize - 3; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      for (let r = 0; r < colSize - 3; r++) {
        for (let c = 0; c < rowSize; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k * rowSize]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      for (let r = 0; r < colSize - 3; r++) {
        for (let c = 0; c < rowSize - 3; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k * (rowSize + 1)]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      for (let r = 3; r < colSize; r++) {
        for (let c = 0; c < rowSize - 3; c++) {
          const collection = Array.from(
            { length: WINNING_COLLECTION_LENGTH },
            (_, k) => _tokens[index + k * (rowSize - 1)]
          );

          if (collection.every((token) => token === color)) {
            return true;
          }
        }
      }

      return false;
    },
    []
  );

  const handleClick = useCallback(
    (index: number) => {
      if (players.p1.isWinner || players.p2.isWinner) return;

      const rowSize = 7;

      if (index < 0 || index >= rowSize) return;

      const col = index % rowSize;
      const _tokens = [...tokens];
      const currentPlayer = players.p1.currentTurn ? players.p1 : players.p2;

      const suitableIndex = findSuitableIndex(col);
      if (suitableIndex !== -1) {
        _tokens[suitableIndex] = currentPlayer.color;

        const isWin = checkEndGame(_tokens, suitableIndex, currentPlayer.color);

        if (isWin) {
          setPlayers((prev) => {
            const hasP1Win = currentPlayer.name === prev.p1.name && isWin;

            return {
              ...prev,
              p1: {
                ...prev.p1,
                isWinner: hasP1Win,
              },
              p2: {
                ...prev.p2,
                isWinner: !hasP1Win,
              },
            };
          });
        } else {
          setPlayers((prev) => {
            const isP1Turn = !prev.p1.currentTurn;

            return {
              ...prev,
              p1: {
                ...prev.p1,
                currentTurn: isP1Turn,
              },
              p2: {
                ...prev.p2,
                currentTurn: !isP1Turn,
              },
            };
          });
        }

        setTokens(_tokens);
      }
    },
    [checkEndGame, findSuitableIndex, players, tokens]
  );

  return {
    states: {
      tokens,
      players,
      setTokens,
      setPlayers,
    },
    functions: {
      findSuitableIndex,
      checkEndGame,
      handleClick,
    },
  };
}
