"use client";

type Props = {
  index: number;
  text: string;
  handleClick: (index: number) => void;
  onDisplay?: boolean;
};

export function Choice({ index, text, handleClick, onDisplay }: Props) {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-4 border-2 border-black p-2 rounded-full w-32 h-32 select-none hover:cursor-pointer`}
      onClick={() => {
        if (!!onDisplay) return;
        handleClick(index);
      }}
    >
      <label className="text-6xl hover:cursor-pointer">{text}</label>
    </div>
  );
}
