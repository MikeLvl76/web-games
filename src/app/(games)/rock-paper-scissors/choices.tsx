"use client";

import { Choice } from "./choice";

type Props = {
  data: { id: string; text: string }[];
  handleClick: (index: number) => void;
};

export function Choices({ data, handleClick }: Props) {
  return (
    <div className="flex flex-row justify-between w-full">
      {data.map((item, i) => (
        <Choice
          key={item.id}
          index={i}
          text={item.text}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
}
