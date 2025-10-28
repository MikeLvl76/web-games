"use client";

import { memo, MouseEvent } from "react";
import { GridCell } from "./grid-cell";
import { CellValue } from "@/hooks/games/sudoku/use-utils";

type Props = {
  cells: CellValue[];
  handleMouseClick: (
    event: MouseEvent,
    button: "left" | "right",
    index: number
  ) => void;
};

const Grid = memo(({ cells, handleMouseClick }: Props) => (
  <div className="grid grid-cols-9">
    {cells.map((content, index) => (
      <GridCell
        key={index}
        index={index}
        content={`${content ?? ""}`}
        handleMouseClick={handleMouseClick}
      />
    ))}
  </div>
));
Grid.displayName = "Grid";

export { Grid };
