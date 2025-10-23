"use client";

import { useCallback, useState } from "react";

export type PlayerColor = "black" | "white";
export type PieceType = "pawn" | "dame";
export type Tile = {
  piece?: { color: PlayerColor; type: PieceType };
};
export type NextMove = {
  indices: number[];
  captures: { fromIdx: number; targetIdx: number; jumpIdx: number }[];
};
export type Player = {
  name: string;
  color: PlayerColor;
  canContinue: boolean;
  currentTurn: boolean;
  isWinner: boolean;
  nextMove?: NextMove;
};

type UtilsParams = {
  defaultP1Color?: PlayerColor;
  defaultP2Color?: PlayerColor;
  enableMultJumps: boolean;
};

export function useUtils(
  { defaultP1Color, defaultP2Color, enableMultJumps }: UtilsParams = {
    enableMultJumps: true,
  }
) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [players, setPlayers] = useState<Record<Player["name"], Player>>({
    p1: {
      name: "p1",
      color: defaultP1Color ?? "black",
      canContinue: false,
      currentTurn: true,
      isWinner: false,
    },
    p2: {
      name: "p2",
      color: defaultP2Color ?? "white",
      canContinue: false,
      currentTurn: false,
      isWinner: false,
    },
  });
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const init = useCallback(() => {
    const PLAYERS_PIECE_MAX_COUNT = 12;
    let playerPieceCount = 0,
      oppPieceCount = 0;

    const _tiles: Tile[] = Array.from({ length: 64 }, (_, k) => {
      const row = Math.floor(k / 8);
      const col = k % 8;

      if ((row + col) % 2 === 0 && oppPieceCount < PLAYERS_PIECE_MAX_COUNT) {
        oppPieceCount++;
        return {
          piece: {
            type: "pawn",
            color: players.p2.color,
          },
        };
      }

      if (
        k >= 40 &&
        (row + col) % 2 === 0 &&
        playerPieceCount < PLAYERS_PIECE_MAX_COUNT
      ) {
        playerPieceCount++;
        return {
          piece: {
            type: "pawn",
            color: players.p1.color,
          },
        };
      }

      return { piece: undefined };
    });

    setTiles(_tiles);
  }, [players.p1.color, players.p2.color]);

  const checkWinner = useCallback(
    (currentPlayer: Player) => {
      const pieces = tiles.filter(
        (tile) => tile.piece?.color === currentPlayer.color
      );
      if (pieces.length === 0) {
        setPlayers((prev) => {
          const isP1 = currentPlayer.name === prev.p1.name;

          return {
            ...prev,
            p1: {
              ...prev.p1,
              isWinner: !isP1,
            },
            p2: {
              ...prev.p2,
              isWinner: isP1,
            },
          };
        });
      }
    },
    [tiles]
  );

  const getNextMove = useCallback(
    (idx: number, tile: Tile, currentPlayer: Player) => {
      const rowSize = 8;
      const indices: number[] = [];
      const captures: NextMove["captures"] = [];
      const piece = tile.piece;

      if (!piece) return;

      if (piece.type === "pawn") {
        const dirs =
          currentPlayer.name === players.p1.name
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

                if (neighbor.piece?.color !== piece.color && !jumpTile.piece) {
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
      } else if (piece.type === "dame") {
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

                if (neighbor.piece?.color !== piece.color && !jumpTile.piece) {
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
    [players.p1.name, tiles]
  );

  const getJumps = useCallback(
    (index: number, color: PlayerColor, _tiles: Tile[]) => {
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
        const row = Math.floor(index / rowSize);
        const col = index % rowSize;
        const nRow = row + dr;
        const nCol = col + dc;

        if (nRow < 0 || nRow >= rowSize || nCol < 0 || nCol >= rowSize)
          continue;

        const neighborIdx = nRow * rowSize + nCol;
        const neighbor = _tiles[neighborIdx];

        if (neighbor.piece && neighbor.piece.color !== color) {
          const jumpRow = nRow + dr;
          const jumpCol = nCol + dc;
          if (
            jumpRow >= 0 &&
            jumpRow < rowSize &&
            jumpCol >= 0 &&
            jumpCol < rowSize
          ) {
            const jumpIdx = jumpRow * rowSize + jumpCol;
            if (!_tiles[jumpIdx].piece) {
              jumps.push({ fromIdx: index, targetIdx: neighborIdx, jumpIdx });
            }
          }
        }
      }

      return jumps;
    },
    []
  );

  const applyPromotion = useCallback(
    (piece: Tile["piece"], index: number) => {
      if (!piece) return piece;
      const rowSize = 8;
      const lastRowStart = tiles.length - rowSize;

      if (piece.color === "black" && index >= 0 && index < rowSize) {
        return { ...piece, type: "dame" } as Tile["piece"];
      }

      if (piece.color === "white" && index >= lastRowStart) {
        return { ...piece, type: "dame" } as Tile["piece"];
      }

      return piece;
    },
    [tiles.length]
  );

  const move = useCallback(
    (player: Player, originIdx: number, targetIdx: number) => {
      const copy = [...tiles];
      const originTile = copy[originIdx];
      if (originTile.piece?.color !== player.color && selectedIdx !== -1) {
        return;
      }

      const capture = player.nextMove?.captures.find(
        (c) => c.jumpIdx === targetIdx
      );

      if (capture) {
        copy[capture.targetIdx].piece = undefined;
        copy[targetIdx].piece = applyPromotion(originTile.piece, targetIdx);
        originTile.piece = undefined;

        const jumps = getJumps(targetIdx, player.color, copy);

        setPlayers((prev) => {
          const isP1Playing = prev.p1.currentTurn;
          const canContinue = jumps.length > 0 && enableMultJumps;

          return {
            ...prev,
            p1: {
              ...prev.p1,
              canContinue: isP1Playing ? canContinue : false,
              currentTurn: isP1Playing ? canContinue : !canContinue,
            },
            p2: {
              ...prev.p2,
              canContinue: !isP1Playing ? canContinue : false,
              currentTurn: !isP1Playing ? canContinue : !canContinue,
            },
          };
        });
      } else if (originIdx !== targetIdx) {
        copy[targetIdx].piece = applyPromotion(originTile.piece, targetIdx);
        originTile.piece = undefined;

        setPlayers((prev) => {
          const p1CanPlay = !prev.p1.currentTurn;

          return {
            ...prev,
            p1: {
              ...prev.p1,
              canContinue: false,
              currentTurn: p1CanPlay,
            },
            p2: {
              ...prev.p2,
              canContinue: false,
              currentTurn: !p1CanPlay,
            },
          };
        });
      }

      setTiles(copy);
    },
    [applyPromotion, enableMultJumps, getJumps, selectedIdx, tiles]
  );

  const handleClick = useCallback(
    (tile: Tile, index: number) => {
      if (!tile.piece && selectedIdx === -1) return;
      const { p1, p2 } = players;

      const currentPlayer = p1.currentTurn ? { ...p1 } : { ...p2 };

      if (currentPlayer.isWinner) return;

      if (selectedIdx === -1 && tile.piece) {
        setSelectedIdx(index);

        setPlayers((prev) => {
          const isP1 = currentPlayer.name === prev.p1.name;
          return {
            ...prev,
            p1: {
              ...prev.p1,
              nextMove: isP1
                ? getNextMove(index, tile, currentPlayer)
                : prev.p1.nextMove,
            },
            p2: {
              ...prev.p2,
              nextMove: !isP1
                ? getNextMove(index, tile, currentPlayer)
                : prev.p2.nextMove,
            },
          };
        });
        return;
      }

      if (
        selectedIdx !== -1 &&
        !tile.piece &&
        currentPlayer.nextMove?.indices.includes(index)
      ) {
        move(currentPlayer, selectedIdx, index);
        setSelectedIdx(-1);
        setPlayers((prev) => ({
          p1: { ...prev.p1, nextMove: undefined },
          p2: { ...prev.p2, nextMove: undefined },
        }));
        return;
      }

      checkWinner(currentPlayer);
      setSelectedIdx(-1);
      setPlayers((prev) => ({
        p1: { ...prev.p1, nextMove: undefined },
        p2: { ...prev.p2, nextMove: undefined },
      }));
    },
    [checkWinner, getNextMove, move, players, selectedIdx]
  );

  return {
    states: {
      tiles,
      players,
      selectedIdx,
      setTiles,
      setPlayers,
      setSelectedIdx,
    },
    functions: {
      init,
      checkWinner,
      getNextMove,
      getJumps,
      applyPromotion,
      move,
      handleClick,
    },
  };
}
