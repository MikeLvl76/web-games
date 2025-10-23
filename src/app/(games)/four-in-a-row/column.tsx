"use client";

import { Dispatch, memo, SetStateAction } from "react";
import { Token } from "./page";
import { ArrowBigDown } from "lucide-react";

type Props = {
  index: number;
  hoveringIndex: number;
  setHoveringIndex: Dispatch<SetStateAction<number>>;
  tokens: Token[];
  handleClick: (index: number) => void;
};

const Column = memo(
  ({ index, hoveringIndex, setHoveringIndex, tokens, handleClick }: Props) => {
    const rowSize = 7;
    const colSize = 6;

    const elements = Array.from(
      { length: colSize },
      (_, k) => tokens[k * rowSize + index]
    );

    return (
      <div className="relative">
        {hoveringIndex === index && (
          <ArrowBigDown
            color="black"
            fill="red"
            size={64}
            className="absolute -top-20"
          />
        )}
        <div
          onMouseEnter={() => setHoveringIndex(index)}
          onMouseLeave={() => setHoveringIndex(-1)}
          className="flex flex-col gap-4 items-center"
        >
          {elements.map((elt, i) => (
            <div
              key={i}
              onClick={() => handleClick(index)}
              className={`${
                elt
                  ? elt === "red"
                    ? "bg-red-400"
                    : "bg-amber-200"
                  : "bg-white"
              } rounded-full w-16 h-16 place-self-center hover:cursor-pointer`}
            />
          ))}
        </div>
      </div>
    );
  }
);
Column.displayName = "Column";

export { Column };
