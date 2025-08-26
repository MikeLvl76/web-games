"use client";

import { Crown } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

type Tile = {
  piece?: "pawn" | "dame";
  pieceColor?: "black" | "white";
  boardIndex?: number;
};

type NextMove = {
  indices: number[];
  captures: { fromIdx: number; targetIdx: number; jumpIdx: number }[];
};

export default function CheckersPage() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [pieces, setPieces] = useState<Tile[]>([]);
  const [oppPieces, setOppPieces] = useState<Tile[]>([]);
  const [nextMove, setNextMove] = useState<NextMove>({
    indices: [],
    captures: [],
  });
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [playerTurnColor, setPlayerTurnColor] =
    useState<Tile["pieceColor"]>("black");
  const [canContinue, setCanContinue] = useState(false);

  const generate = useCallback(() => {
    const _tiles: Tile[] = Array(64).fill({});
    const _pieces: Tile[] = Array(12).fill({
      piece: "pawn",
      pieceColor: "black",
    });
    const _oppPieces: Tile[] = Array(12).fill({
      piece: "pawn",
      pieceColor: "white",
    });

    let index = 0,
      oppIndex = 0;

    for (let i = 0; i < _tiles.length; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;

      if ((row + col) % 2 === 0 && oppIndex < _oppPieces.length) {
        _oppPieces[oppIndex].boardIndex = i;
        _tiles[i] = _oppPieces[oppIndex];

        oppIndex++;
      }

      if (i >= 40) {
        if ((row + col) % 2 === 0 && index < _pieces.length) {
          _pieces[index].boardIndex = i;
          _tiles[i] = _pieces[index];

          index++;
        }
      }
    }

    return [_tiles, _pieces, _oppPieces];
  }, []);

  useEffect(() => {
    const [_tiles, _pieces, _oppPieces] = generate();
    setTiles(_tiles);
    setPieces(_pieces);
    setOppPieces(_oppPieces);
  }, [generate]);

  const computeMoves = useCallback(
    (idx: number, tile: Tile) => {
      const rowSize = 8;
      const indices: number[] = [];
      const captures: NextMove["captures"] = [];

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
            const neighborIdx = row * rowSize + col;
            const neighbor = tiles[neighborIdx];

            if (!neighbor.piece) {
              indices.push(neighborIdx);
            } else {
              const nextRow = row + dr;
              const nextCol = col + dc;

              if (
                nextRow >= 0 &&
                nextRow < rowSize &&
                nextCol >= 0 &&
                nextCol < rowSize
              ) {
                const jumpIdx = nextRow * rowSize + nextCol;
                const jumpTile = tiles[jumpIdx];

                if (
                  neighbor.pieceColor !== tile.pieceColor &&
                  !jumpTile.piece
                ) {
                  indices.push(jumpIdx);
                  captures.push({
                    fromIdx: idx,
                    targetIdx: neighborIdx,
                    jumpIdx,
                  });
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

            const neighborIdx = row * rowSize + col;
            const neighbor = tiles[neighborIdx];

            if (!neighbor.piece) {
              indices.push(neighborIdx);
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
                const jumpIdx = nextRow * rowSize + nextCol;
                const jumpTile = tiles[jumpIdx];

                if (
                  neighbor.pieceColor !== tile.pieceColor &&
                  !jumpTile.piece
                ) {
                  indices.push(jumpIdx);
                  captures.push({
                    fromIdx: idx,
                    targetIdx: neighborIdx,
                    jumpIdx,
                  });
                }
              }
              break;
            }
          }
        }
      }

      return { indices, captures } satisfies NextMove;
    },
    [tiles]
  );

  function getFollowUpJumps(
    idx: number,
    tiles: Tile[],
    color: Tile["pieceColor"]
  ) {
    const rowSize = 8;
    const directions =
      color === "black"
        ? [
            [-1, -1],
            [-1, 1],
          ]
        : [
            [1, -1],
            [1, 1],
          ];
    const jumps: NextMove["captures"] = [];

    for (const [dr, dc] of directions) {
      const row = Math.floor(idx / rowSize);
      const col = idx % rowSize;
      const nRow = row + dr;
      const nCol = col + dc;

      if (nRow < 0 || nRow >= rowSize || nCol < 0 || nCol >= rowSize) continue;

      const neighborIdx = nRow * rowSize + nCol;
      const neighbor = tiles[neighborIdx];

      if (neighbor.pieceColor && neighbor.pieceColor !== color) {
        const jumpRow = nRow + dr;
        const jumpCol = nCol + dc;
        if (
          jumpRow >= 0 &&
          jumpRow < rowSize &&
          jumpCol >= 0 &&
          jumpCol < rowSize
        ) {
          const jumpIdx = jumpRow * rowSize + jumpCol;
          if (!tiles[jumpIdx].piece) {
            jumps.push({ fromIdx: idx, targetIdx: neighborIdx, jumpIdx });
          }
        }
      }
    }

    return jumps;
  }

  const getPromotedPiece = useCallback(
    (piece: Tile["piece"], idx: number) => {
      if (piece === "dame") return piece;

      const rowSize = 8;
      const lastRowStart = tiles.length - rowSize;

      const isBlackPromotion =
        playerTurnColor === "black" && idx >= 0 && idx < rowSize;
      const isWhitePromotion =
        playerTurnColor === "white" &&
        idx >= lastRowStart &&
        idx < tiles.length;

      return isBlackPromotion || isWhitePromotion ? "dame" : piece;
    },
    [playerTurnColor, tiles.length]
  );

  const movePiece = useCallback(
    (fromIdx: number, toIdx: number, captures: NextMove["captures"]) => {
      const _tiles = [...tiles];
      const origin = _tiles[fromIdx];

      if (origin.pieceColor !== playerTurnColor && selectedIdx !== -1) {
        return;
      }

      const capture = captures.find((c) => c.jumpIdx === toIdx);

      if (capture) {
        const target = _tiles[capture.targetIdx];

        _tiles[capture.targetIdx] = {};
        _tiles[fromIdx] = {};

        _tiles[toIdx] = {
          ...origin,
          piece: getPromotedPiece(origin.piece, toIdx),
        };

        if (target.pieceColor === "black") {
          setPieces((prev) =>
            prev.filter((p) => p.boardIndex !== capture.targetIdx)
          );
        } else if (target.pieceColor === "white") {
          setOppPieces((prev) =>
            prev.filter((p) => p.boardIndex !== capture.targetIdx)
          );
        }

        const followUps = getFollowUpJumps(toIdx, _tiles, playerTurnColor);
        setCanContinue(followUps.length > 0);

        if (followUps.length === 0) {
          setPlayerTurnColor((prev) => (prev === "black" ? "white" : "black"));
        }
      } else if (fromIdx !== toIdx) {
        _tiles[fromIdx] = {};
        _tiles[toIdx] = {
          ...origin,
          piece: getPromotedPiece(origin.piece, toIdx),
        };

        setCanContinue(false);
        setPlayerTurnColor((prev) => (prev === "black" ? "white" : "black"));
      }

      setTiles(_tiles);
    },
    [getPromotedPiece, playerTurnColor, selectedIdx, tiles]
  );

  const handleClick = useCallback(
    (idx: number, tile: Tile) => {
      if (selectedIdx === -1 && tile.piece) {
        setSelectedIdx(idx);
        setNextMove(computeMoves(idx, tile));
        return;
      }

      if (selectedIdx !== -1 && !tile.piece && nextMove.indices.includes(idx)) {
        movePiece(selectedIdx, idx, nextMove.captures);
        setSelectedIdx(-1);
        setNextMove({ indices: [], captures: [] });
        return;
      }

      setSelectedIdx(-1);
      setNextMove({ indices: [], captures: [] });
    },
    [computeMoves, movePiece, nextMove.captures, nextMove.indices, selectedIdx]
  );

  const Tile = memo(({ tile, idx }: { tile: Tile; idx: number }) => {
    const isSelected = selectedIdx === idx;
    const canMoveHere =
      nextMove.indices.includes(idx) &&
      selectedIdx !== -1 &&
      tiles[selectedIdx].pieceColor === playerTurnColor;

    const tileBg =
      (Math.floor(idx / 8) + (idx % 8)) % 2 === 0
        ? "bg-amber-200"
        : "bg-amber-900";

    const tileContentClasses = [
      "flex",
      "justify-center",
      "items-center",
      "rounded-full",
      "hover:cursor-pointer",
      canMoveHere
        ? "bg-green-500 w-4 h-4"
        : tile.pieceColor === "black"
        ? "bg-black w-12 h-12"
        : "bg-white w-12 h-12 border-1 border-black",
      isSelected && !canMoveHere ? "border-4 border-green-400" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        className={`flex w-20 h-20 border-1 border-black font-bold text-2xl text-center justify-center items-center select-none ${tileBg}`}
        key={idx}
        onClick={() =>
          canMoveHere || tile.piece ? handleClick(idx, tile) : undefined
        }
      >
        {(canMoveHere || tile.piece) && (
          <div className={tileContentClasses}>
            {tile.piece === "dame" && <Crown size="20" color="yellow" />}
          </div>
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
      <div className="flex flex-row items-center justify-between p-2 w-full">
        <h1 className="text-2xl font-bold text-center">
          {playerTurnColor === "black"
            ? "Turn of Player 1"
            : "Turn of Player 2"}
        </h1>
        {canContinue && (
          <button
            onClick={() => {
              setCanContinue(false);
              setPlayerTurnColor((prev) =>
                prev === "black" ? "white" : "black"
              );
            }}
            className="w-fit h-fit p-2 rounded-sm bg-blue-500 text-white"
          >
            End turn
          </button>
        )}
      </div>

      <Board tiles={tiles} />
    </div>
  );
}
