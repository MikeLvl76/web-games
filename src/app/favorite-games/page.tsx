"use client";

import PreviewList from "@/components/generic/preview-list";
import { useStorageContext } from "@/components/provider/storage";
import { getGamesPreview, Preview } from "@/server-actions/preview";
import { useEffect, useState } from "react";

export default function FavoriteGamesPage() {
  const { content } = useStorageContext();
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    getGamesPreview()
      .then((res) =>
        setPreviews(
          res.filter((item) => content.favoriteGames.includes(item.name))
        )
      )
      .catch((e) => console.error(e));
  }, [content.favoriteGames]);

  return <PreviewList previews={previews} />;
}
