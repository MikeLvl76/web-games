"use client";

import { memo } from "react";
import { BoardTile } from "./board-tile";
import { Player, Tile } from "./use-utils";

type Props = {
  tiles: Tile[];
  selectedIndex: number;
  currentPlayer: Player;
  onClick: (tile: Tile, index: number) => void;
};

const Board = memo((props: Props) => (
  <div className="grid grid-cols-8">
    {props.tiles.map((tile, idx) => (
      <BoardTile key={idx} {...props} currentIndex={idx} currentTile={tile} />
    ))}
  </div>
));
Board.displayName = "Board";

export { Board };
