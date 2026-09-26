"use client";

import { useState } from "react";
import DinoRunGame from "./game";
import GameMenu from "@/components/custom/menu";

export default function Page() {
  const [startGame, setStartGame] = useState(false);

  return (
    <div>
      {startGame ? (
        <DinoRunGame />
      ) : (
        <GameMenu
          gameName="Dino Run"
          description="Run and jump over obstacles to earn points."
          selectors={[]}
          switches={[]}
          inputs={[]}
          onStart={() => {
            setStartGame(true);
          }}
        />
      )}
    </div>
  );
}
