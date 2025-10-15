"use client";

import PreviewList from "@/components/generic/preview-list";
import { useStorageContext } from "@/components/provider/storage";
import { usePreviews } from "@/hooks/use-previews";

export default function FavoriteGamesPage() {
  const { content } = useStorageContext();
  const previews = usePreviews({
    filter: (item) => content.favoriteGames.includes(item.name),
    sort: "asc",
  });

  return <PreviewList previews={previews} />;
}
