import Link from "next/link";

export default function Home() {
  const URLs = [
    { name: "Tic Tac Toe", url: "/tic-tac-toe" },
    { name: "Sudoku", url: "/sudoku" },
    ...Array.from({ length: 18 }, (_, k) => ({
      name: `Item ${k + 1}`,
      url: "#",
    })),
  ];

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <h1 className="font-bold text-2xl text-center">All your games here!</h1>
      <ul className="grid grid-cols-6 gap-4">
        {URLs.map(({ name, url }, i) => (
          <li
            key={i}
            className="flex items-center justify-center border-1 border-black rounded-sm w-64 h-64 gap-1 hover:cursor-pointer"
          >
            <Link href={url}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
