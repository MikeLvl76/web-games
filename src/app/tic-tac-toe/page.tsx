"use client";

import { memo, useCallback, useState } from "react";

type Tile = {
  symbol?: "x" | "o";
};

export default function TicTacToePage() {
  const [tiles, setTiles] = useState<Tile[]>(
    Array.from({ length: 9 }, () => ({}))
  );
  const [player, setPlayer] = useState<Tile["symbol"]>("o");
  const [winner, setWinner] = useState<Tile["symbol"] | undefined>();

  const handleClick = useCallback(
    (idx: number) => {
      if (tiles[idx].symbol || winner) return;

      const current = tiles.map((tile, i) =>
        i === idx ? ({ ...tile, symbol: player } as Tile) : tile
      );

      const result = checkFinish(current);

      if (result) {
        setWinner(result);
      } else {
        setPlayer((prev) => (prev === "o" ? "x" : "o"));
      }

      setTiles(current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [winner, player]
  );

  const checkFinish = useCallback(
    (tiles: Tile[]) => {
      const symbol: Tile["symbol"] = player;

      const firstDiag = tiles.filter((_, i) => i % 4 === 0);

      if (firstDiag.every((tile) => tile.symbol === symbol)) {
        return symbol;
      }

      const secondDiag = tiles.filter(
        (_, i) => i !== 0 && i < tiles.length - 1 && i % 2 === 0
      );

      if (secondDiag.every((tile) => tile.symbol === symbol)) {
        return symbol;
      }

      for (let j = 0; j < 3; j++) {
        const cols = tiles.filter((_, i) => (i + j) % 3 === 0);
        if (cols.every((tile) => tile.symbol === symbol)) {
          return symbol;
        }
        const rows = tiles.filter((_, i) => i === 3 * j + (i % 3));
        if (rows.every((tile) => tile.symbol === symbol)) {
          return symbol;
        }
      }
      return null;
    },
    [player]
  );

  const Board = memo(({ tiles }: { tiles: Tile[] }) => (
    <div className="grid grid-cols-3">
      {tiles.map(({ symbol }, idx) => (
        <span
          className={`flex w-32 h-32 border-1 border-black hover:cursor-pointer text-6xl text-center justify-center items-center ${
            symbol === "x" ? "text-red-500" : "text-blue-500"
          }`}
          onClick={() => handleClick(idx)}
          key={idx}
        >
          {symbol ?? ""}
        </span>
      ))}
    </div>
  ));
  Board.displayName = "Board";

  const reset = () => {
    setTiles(Array.from({ length: 9 }, () => ({})));
    setWinner(undefined);
    setPlayer("o");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      {winner ? (
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-bold text-2xl">
            {winner === "o" ? "Player 1" : "Player 2"} wins!
          </h1>
          <button
            onClick={reset}
            className="bg-blue-500 text-center text-white w-fit h-fit p-2 rounded-sm hover:cursor-pointer"
          >
            Restart
          </button>
        </div>
      ) : (
        <h1 className="font-bold text-2xl">
          {player === "o" ? "Player 1" : "Player 2"} turn
        </h1>
      )}
      <Board tiles={tiles} />
    </div>
  );
}
