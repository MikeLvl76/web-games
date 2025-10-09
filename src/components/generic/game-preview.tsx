import { Preview } from "@/server-actions/preview";
import { CircleSlash, Heart, HeartPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useStorageContext } from "../provider/storage";

type Props = {
  data: Preview;
};

export default function GamePreview({ data }: Props) {
  const { name, url, estimatedPlaytime, type, filepath } = data;
  const { content, setContent } = useStorageContext();
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(content.favoriteGames.includes(name));

  return (
    <div className="w-[50vw] h-[30vh] rounded-md shadow-2xl/50">
      <Link href={url}>
        <div className="relative w-full h-full group overflow-hidden">
          {!error ? (
            <Image
              alt={name}
              src={filepath}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setError(true)}
              className="object-cover rounded-md"
            />
          ) : (
            <div className="flex flex-col justify-center items-center gap-2 bg-slate-200 w-full h-full">
              <CircleSlash size={32} color="#5c5958" />
            </div>
          )}
          <div
            className="absolute top-0 left-0 w-full flex flex-row items-center justify-between gap-2 -translate-y-full group-hover:translate-y-0
               bg-white/0 text-white p-2 text-center transition-all duration-500"
          >
            <p className="text-sm font-medium text-white bg-black rounded-2xl p-2 w-fit h-fit">
              {name}
            </p>
            {added ? (
              <Heart
                size={20}
                color="white"
                fill="white"
                className="text-sm font-medium bg-black rounded-2xl p-2 w-fit h-fit"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setContent((prev) => ({
                    ...prev,
                    favoriteGames: prev.favoriteGames.filter(
                      (_n) => _n !== name
                    ),
                  }));

                  setAdded(!added);
                }}
              />
            ) : (
              <HeartPlus
                size={20}
                color="white"
                className="text-sm font-medium bg-black rounded-2xl p-2 w-fit h-fit"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setContent((prev) => ({
                    ...prev,
                    favoriteGames: [...prev.favoriteGames, name],
                  }));

                  setAdded(!added);
                }}
              />
            )}
          </div>
          <div
            className="absolute bottom-0 left-0 w-full flex flex-row items-center justify-end gap-2 translate-y-full group-hover:translate-y-0
               bg-white/0 text-white p-2 text-center transition-all duration-500"
          >
            <p className="text-sm font-medium text-white bg-black rounded-2xl p-2 w-fit h-fit">
              {estimatedPlaytime}
            </p>
            <p className="text-sm font-medium text-white bg-black rounded-2xl p-2 w-fit h-fit">
              {type}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
