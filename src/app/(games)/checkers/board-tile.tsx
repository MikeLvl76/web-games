"use client";

import { memo } from "react";
import { NextMove, Tile } from "./page";
import { Crown } from "lucide-react";

type Props = {
  tiles: Tile[];
  currentTile: Tile;
  currentIndex: number;
  selectedIndex: number;
  nextMove: NextMove;
  playerColor: Tile["pieceColor"];
  onClick: (tile: Tile, index: number) => void;
};

const BoardTile = memo((props: Props) => {
  const isSelected = props.selectedIndex === props.currentIndex;
  const canMoveHere =
    props.nextMove.indices.includes(props.currentIndex) &&
    props.selectedIndex !== -1 &&
    props.tiles[props.selectedIndex].pieceColor === props.playerColor;

  const tileBg =
    (Math.floor(props.currentIndex / 8) + (props.currentIndex % 8)) % 2 === 0
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
      : props.currentTile.pieceColor === "black"
      ? "bg-black w-12 h-12"
      : "bg-white w-12 h-12 border-1 border-black",
    isSelected && !canMoveHere ? "border-4 border-green-400" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={`flex w-18 h-18 border-1 border-black font-bold text-2xl text-center justify-center items-center select-none ${tileBg}`}
      key={props.currentIndex}
      onClick={() =>
        canMoveHere || props.currentTile.piece
          ? props.onClick(props.currentTile, props.currentIndex)
          : undefined
      }
    >
      {(canMoveHere || props.currentTile.piece) && (
        <div className={tileContentClasses}>
          {props.currentTile.piece === "dame" && (
            <Crown size="20" color="yellow" />
          )}
        </div>
      )}
    </span>
  );
});
BoardTile.displayName = "BoardTile";

export { BoardTile };
