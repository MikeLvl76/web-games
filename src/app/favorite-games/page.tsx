"use client";

import GamesDescriptionList from "@/components/custom/game/description-list";
import { useStorageContext } from "@/components/provider/storage";
import { useGamesDescription } from "@/hooks/use-games-description";

export default function FavoriteGamesPage() {
  const { content } = useStorageContext();
  const descriptions = useGamesDescription({
    filter: (item) => content.favoriteGames.includes(item.name),
    sort: "asc",
  });

  return <GamesDescriptionList descriptions={descriptions} hideMCSMessage />;
}
