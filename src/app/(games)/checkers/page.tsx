"use client";

import { useState } from "react";
import CheckersGame from "./game";
import Menu from "@/components/custom/menu";
import { PlayerColor } from "@/hooks/games/checkers/use-utils";

type Config = {
  playerColor: PlayerColor;
  oppColor: PlayerColor;
  allowMultJumps: boolean;
  enableTime: boolean;
};

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    playerColor: "black",
    oppColor: "white",
    enableTime: true,
    allowMultJumps: true,
  });

  return (
    <div>
      {startGame ? (
        <CheckersGame {...config} />
      ) : (
        <Menu
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[
            {
              items: [
                { value: "black", text: "Black" },
                { value: "white", text: "White" },
              ],
              onValueChange: (value) => {
                setConfig((prev) => ({
                  ...prev,
                  playerColor: value as PlayerColor,
                }));
              },
            },
            {
              items: [
                { value: "white", text: "White" },
                { value: "black", text: "Black" },
              ],
              onValueChange: (value) => {
                setConfig((prev) => ({
                  ...prev,
                  oppColor: value as PlayerColor,
                }));
              },
            },
          ]}
          switches={[
            {
              label: "Enable time",
              bool: config.enableTime,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  enableTime: !prev.enableTime,
                })),
            },
            {
              label: "Allow multiple jumps",
              bool: config.allowMultJumps,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  allowMultJumps: !prev.allowMultJumps,
                })),
            },
          ]}
          inputs={[]}
        />
      )}
    </div>
  );
}
