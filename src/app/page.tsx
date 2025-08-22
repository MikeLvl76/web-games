export default function Home() {
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <h1 className="font-bold text-2xl text-center">All your games here!</h1>
      <ul className="grid grid-cols-6 gap-4">
        {Array.from({ length: 20 }, (__, k) => k).map((item) => (
          <li
            key={item}
            className="flex items-center justify-center border-1 border-black rounded-sm w-64 h-64 gap-1 hover:cursor-pointer"
          >
            <p>Item {item + 1}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
