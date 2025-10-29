"use client";

import { useCallback, useState } from "react";

export type CellSymbol = "x" | "o" | undefined;
export type Player = {
  name: string;
  symbol: NonNullable<CellSymbol>;
  currentTurn: boolean;
  isWinner: boolean;
};
type UtilsParams = {
  defaultP1Symbol?: NonNullable<CellSymbol>;
  defaultP2Symbol?: NonNullable<CellSymbol>;
};

export function useUtils({ defaultP1Symbol, defaultP2Symbol }: UtilsParams) {
  const [cells, setCells] = useState<CellSymbol[]>(Array(9).fill(undefined));
  const [players, setPlayers] = useState<Record<Player["name"], Player>>({
    p1: {
      name: "p1",
      symbol: defaultP1Symbol ?? "x",
      currentTurn: true,
      isWinner: false,
    },
    p2: {
      name: "p2",
      symbol: defaultP2Symbol ?? "o",
      currentTurn: false,
      isWinner: false,
    },
  });

  const checkWinner = useCallback(
    (cells: CellSymbol[]) => {
      const symbol = players.p1.currentTurn
        ? players.p1.symbol
        : players.p2.symbol;

      const downDiag = [];
      const upDiag = [];
      const rowSize = 3;

      for (let i = 0; i < rowSize; i++) {
        const row = Math.floor(i / rowSize);
        const col = i % rowSize;
        const cellIndex = row * rowSize + col;
        const cell = cells[cellIndex];

        if (row === col && cell === symbol) {
          downDiag.push(cell);
        }

        if (
          cellIndex > 0 &&
          cellIndex < cells.length - 1 &&
          cellIndex % 2 === 0 &&
          cell === symbol
        ) {
          upDiag.push(cell);
        }

        const cols = cells.filter((_, j) => (j + i) % 3 === 0);
        if (cols.every((cell) => cell === symbol)) {
          return symbol;
        }
        const rows = cells.filter((_, j) => j === 3 * i + (j % 3));
        if (rows.every((cell) => cell === symbol)) {
          return symbol;
        }
      }

      if (downDiag.length === 3 || upDiag.length === 3) {
        return symbol;
      }

      return undefined;
    },
    [players.p1, players.p2]
  );

  const handleClick = useCallback(
    (idx: number) => {
      if (cells[idx] || players.p1.isWinner || players.p2.isWinner) return;

      const player = players.p1.currentTurn ? players.p1 : players.p2;
      const _tiles = [...cells];
      _tiles[idx] = player.symbol;

      const winner = checkWinner(_tiles);
      if (winner) {
        setPlayers((prev) => {
          const hasP1Win = prev.p1.symbol === winner;

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

      setCells(_tiles);
    },
    [checkWinner, players.p1, players.p2, cells]
  );

  return {
    states: {
      players,
      setPlayers,
      cells,
      setCells,
    },
    functions: {
      checkWinner,
      handleClick,
    },
  };
}
