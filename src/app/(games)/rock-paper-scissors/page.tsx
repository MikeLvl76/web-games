"use client";

import GameMenu from "@/components/custom/menu";
import RockPaperScissorsGame from "./game";
import { useState } from "react";

export default function Page() {
  const [startGame, setStartGame] = useState(false);

  return (
    <div>
      {startGame ? (
        <RockPaperScissorsGame />
      ) : (
        <GameMenu
          gameName="Rock Paper Scissors"
          description="Rock beats Scissors, Paper beats Rocks and Scissors beats Paper. Be lucky."
          selectors={[]}
          inputs={[]}
          onStart={() => {
            setStartGame(true);
          }}
        />
      )}
    </div>
  );
}
