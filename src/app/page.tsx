import { getUrls } from "@/utils/urls";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const urls = getUrls();

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <h1 className="font-bold text-2xl text-center">All your games here!</h1>
      <ul className="grid grid-cols-6 gap-4">
        {urls.map(({ name, imageUrl, url }, i) => (
          <li
            key={i}
            className="flex items-center justify-center rounded-sm w-60 h-60 gap-1 hover:cursor-pointer"
          >
            <Link href={url}>
              <Image
                alt={name}
                src={imageUrl}
                width={600}
                height={600}
                priority
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
