"use client";

export default function FourInARowPage() {
  return (
    <div className="flex flex-row justify-center w-[80vw] h-[70vh] gap-4">
      <div className="grid grid-cols-7 items-center gap-2 bg-blue-400 w-[40vw] h-full rounded-lg p-2">
        {Array(42).fill(
          <div className="bg-white rounded-full w-16 h-16 place-self-center hover:cursor-pointer" />
        )}
      </div>
    </div>
  );
}
