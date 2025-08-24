"use client";

import { memo, useCallback, useEffect, useState } from "react";

type Tile = {
  piece?: "pawn" | "dame";
  pieceColor?: "black" | "white";
};

export default function CheckersPage() {
  const [tiles, setTiles] = useState<Tile[]>(Array(64).fill({}));
  const [pieces, setPieces] = useState<Tile[]>(
    Array(12).fill({ piece: "pawn", pieceColor: "black" })
  );
  const [oppPieces, setOppPieces] = useState<Tile[]>(
    Array(12).fill({ piece: "pawn", pieceColor: "white" })
  );

  const generate = useCallback(() => {
    const current = [...tiles];
    let index = 0,
      oppIndex = 0;

    for (let i = 0; i < current.length; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;

      if ((row + col) % 2 === 0 && oppIndex < oppPieces.length) {
        current[i] = oppPieces[oppIndex];
        oppIndex++;
      }

      if (i >= 40) {
        if ((row + col) % 2 === 0 && index < pieces.length) {
          current[i] = pieces[index];
          index++;
        }
      }
    }

    return current;
  }, [oppPieces, pieces, tiles]);

  useEffect(() => {
    setTiles(generate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Board = memo(({ tiles }: { tiles: Tile[] }) => (
    <div className="grid grid-cols-8">
      {tiles.map((tile, idx) => (
        <span
          className={`flex w-20 h-20 border-1 border-black hover:border-amber-400 hover:border-4 hover:cursor-pointer font-bold text-2xl text-center justify-center items-center select-none ${
            (Math.floor(idx / 8) + (idx % 8)) % 2 === 0
              ? "bg-amber-200"
              : "bg-amber-900"
          }`}
          key={idx}
        >
          {tile.piece && tile.pieceColor && (
            <div
              className={`w-12 h-12 rounded-full ${
                tile.pieceColor === "black"
                  ? "bg-black border-1 border-white"
                  : "bg-white border-1 border-black"
              }`}
            />
          )}
        </span>
      ))}
    </div>
  ));
  Board.displayName = "Board";

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <Board tiles={tiles} />
    </div>
  );
}
