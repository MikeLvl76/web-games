"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Board } from "./board";
import { GameStatus } from "../../../components/generic/game-status";
import { stringifyTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export type Tile = {
  piece?: "pawn" | "dame";
  pieceColor?: "black" | "white";
  boardIndex?: number;
};

export type NextMove = {
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
  const [winner, setWinner] = useState<Tile["pieceColor"]>();
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const init = useCallback(() => {
    const [_tiles, _pieces, _oppPieces] = generate();
    setTiles(_tiles);
    setPieces(_pieces);
    setOppPieces(_oppPieces);
  }, [generate]);

  useEffect(() => {
    init();
  }, [generate, init]);

  useEffect(() => {
    if (winner) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [winner]);

  const checkWinner = useCallback(() => {
    if (pieces.length === 0) setWinner("white");
    if (oppPieces.length === 0) setWinner("black");
  }, [oppPieces.length, pieces.length]);

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
    (tile: Tile, idx: number) => {
      if (winner) return;

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

      checkWinner();
      setSelectedIdx(-1);
      setNextMove({ indices: [], captures: [] });
    },
    [
      checkWinner,
      computeMoves,
      movePiece,
      nextMove.captures,
      nextMove.indices,
      selectedIdx,
      winner,
    ]
  );

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <Board
          tiles={tiles}
          selectedIndex={selectedIdx}
          nextMove={nextMove}
          playerColor={playerTurnColor}
          onClick={handleClick}
        />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Player vs Player"
          infos={[
            {
              label: "Current turn",
              value: playerTurnColor === "black" ? "Player 1" : "Player 2",
            },
            { label: "Game time", value: timer.text },
            {
              label: "Winner",
              value: winner
                ? winner === "black"
                  ? "Player 1"
                  : "Player 2"
                : "/",
            },
          ]}
          options={[
            <Button
              key="end-turn-button"
              onClick={() => {
                setCanContinue(false);
                setPlayerTurnColor((prev) =>
                  prev === "black" ? "white" : "black"
                );
              }}
              className="w-fit h-fit p-2 rounded-sm bg-red-500 text-sm text-white font-bold hover:cursor-pointer disabled:opacity-20"
              disabled={!canContinue}
            >
              End turn
            </Button>,
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                init();
                setCanContinue(false);
                setPlayerTurnColor(() =>
                  winner === "black" ? "white" : "black"
                );
                setWinner(undefined);
                setSelectedIdx(-1);
                setNextMove({ indices: [], captures: [] });
                setTimer({ value: 0, text: stringifyTime(0) });
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(() => {
                  setTimer((prev) => ({
                    value: prev.value + 1,
                    text: stringifyTime(prev.value + 1),
                  }));
                }, 1000);
              }}
            >
              <p className="text-white font-bold text-md text-center">
                Restart
              </p>
              <RotateCcw color="white" size={32} />
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
