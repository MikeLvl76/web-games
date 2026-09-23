"use client";

import GamesDescriptionList from "@/components/custom/game/description-list";
import { useGamesDescription } from "@/hooks/use-games-description";

export default function HomePage() {
  const descriptions = useGamesDescription({ sort: "asc" });

  return <GamesDescriptionList descriptions={descriptions} />;
}
