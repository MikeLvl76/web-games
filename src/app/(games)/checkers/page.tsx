"use client";

import { memo, useCallback, useEffect, useState } from "react";

type Tile = {
  piece?: "pawn" | "dame";
  pieceColor?: "black" | "white";
};

export default function CheckersPage() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [pieces, setPieces] = useState<Tile[]>(
    Array(12).fill({ piece: "pawn", pieceColor: "black" })
  );
  const [oppPieces, setOppPieces] = useState<Tile[]>(
    Array(12).fill({ piece: "pawn", pieceColor: "white" })
  );
  const [nextMoves, setNextMoves] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const generate = useCallback(() => {
    const _tiles = Array(64).fill({});
    let index = 0,
      oppIndex = 0;

    for (let i = 0; i < _tiles.length; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;

      if ((row + col) % 2 === 0 && oppIndex < oppPieces.length) {
        _tiles[i] = oppPieces[oppIndex];
        oppIndex++;
      }

      if (i >= 40) {
        if ((row + col) % 2 === 0 && index < pieces.length) {
          _tiles[i] = pieces[index];
          index++;
        }
      }
    }

    return _tiles;
  }, [oppPieces, pieces]);

  useEffect(() => {
    setTiles(generate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    (idx: number, tile: Tile) => {
      const rowSize = 8;
      setSelectedIdx(idx);
      const moves = [];

      if (tile.piece === "pawn") {
        const dirs =
          tile.pieceColor === "black"
            ? [
                [-1, -1], // top left diag
                [-1, 1], // top right diag
              ]
            : [
                [1, -1], // bottom left diag
                [1, 1], // bottom right diag
              ];

        for (const [dr, dc] of dirs) {
          const row = Math.floor(idx / rowSize) + dr;
          const col = (idx % rowSize) + dc;

          if (row >= 0 && row < rowSize && col >= 0 && col < rowSize) {
            const tile = tiles[row * rowSize + col];
            if (!tile.piece) {
              moves.push(row * rowSize + col);
            } else {
              const nextRow = row + dr;
              const nextCol = col + dc;

              if (
                nextRow >= 0 &&
                nextRow < rowSize &&
                nextCol >= 0 &&
                nextCol < rowSize
              ) {
                const jumpTile = tiles[nextRow * rowSize + nextCol];
                if (
                  tile.pieceColor !== tiles[idx].pieceColor &&
                  !jumpTile.piece
                ) {
                  moves.push(nextRow * rowSize + nextCol);
                }
              }
            }
          }
        }
      } else if (tile.piece === "dame") {
        const dirs = [
          [-1, -1], // top-left
          [-1, 1], // top-right
          [1, -1], // bottom-left
          [1, 1], // bottom-right
        ];

        for (const [dr, dc] of dirs) {
          let row = Math.floor(idx / rowSize);
          let col = idx % rowSize;

          while (true) {
            row += dr;
            col += dc;

            if (row < 0 || row >= rowSize || col < 0 || col >= rowSize) break;

            const index = row * rowSize + col;
            const tile = tiles[index];

            if (!tile.piece) {
              moves.push(index);
              continue;
            } else {
              const nextRow = row + dr;
              const nextCol = col + dc;

              if (
                nextRow >= 0 &&
                nextRow < rowSize &&
                nextCol >= 0 &&
                nextCol < rowSize
              ) {
                const jumpTile = tiles[nextRow * rowSize + nextCol];
                if (
                  tile.pieceColor !== tiles[idx].pieceColor &&
                  !jumpTile.piece
                ) {
                  moves.push(nextRow * rowSize + nextCol);
                }
              }
              break;
            }
          }
        }
      }
      setNextMoves(moves);
    },
    [tiles]
  );

  const Tile = memo(({ tile, idx }: { tile: Tile; idx: number }) => {
    const alternatingBg =
      (Math.floor(idx / 8) + (idx % 8)) % 2 === 0
        ? "bg-amber-200"
        : "bg-amber-900";

    const alternatingPieceBg = `hover:border-amber-400 hover:border-4 ${
      tile.pieceColor === "black"
        ? "bg-black"
        : "bg-white border-1 border-black"
    } ${selectedIdx === idx && "border-4 border-green-400"}`;

    return (
      <span
        className={`flex w-20 h-20 border-1 border-black font-bold text-2xl text-center justify-center items-center select-none ${alternatingBg}`}
        key={idx}
      >
        {nextMoves.includes(idx) ? (
          <div
            onClick={() => handleClick(idx, tile)}
            className={`w-4 h-4 rounded-full hover:cursor-pointer bg-green-500`}
          />
        ) : (
          tile.piece &&
          tile.pieceColor && (
            <div
              onClick={() => handleClick(idx, tile)}
              className={`w-12 h-12 rounded-full hover:cursor-pointer ${alternatingPieceBg}`}
            />
          )
        )}
      </span>
    );
  });
  Tile.displayName = "Tile";

  const Board = memo(({ tiles }: { tiles: Tile[] }) => (
    <div className="grid grid-cols-8">
      {tiles.map((tile, idx) => (
        <Tile tile={tile} idx={idx} key={idx} />
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
