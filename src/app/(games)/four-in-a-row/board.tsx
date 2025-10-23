"use client";

import { Dispatch, memo, SetStateAction } from "react";
import { Column } from "./column";
import { Token } from "@/hooks/games/four-in-a-row/use-utils";

type Props = {
  hoveringIndex: number;
  setHoveringIndex: Dispatch<SetStateAction<number>>;
  tokens: Token[];
  handleClick: (index: number) => void;
};

const Board = memo((props: Props) => {
  const rowSize = 7;

  const columns = Array.from({ length: rowSize }, (_, k) => (
    <Column key={k} {...props} index={k} />
  ));

  return (
    <div className="flex flex-row w-fit h-fit gap-4 justify-center items-center bg-blue-600 rounded-lg p-4">
      {columns}
    </div>
  );
});
Board.displayName = "Board";

export { Board };
