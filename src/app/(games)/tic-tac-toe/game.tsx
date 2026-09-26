"use client";

import { Button } from "@/components/ui/button";
import { CellSymbol, useUtils } from "@/hooks/games/tic-tac-toe/use-utils";
import {
  Gamepad2Icon,
  InfoIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";
import { Grid } from "./grid";
import GameDetails from "@/components/custom/game/details";

type Props = {
  playerSymbol: NonNullable<CellSymbol>;
  oppSymbol: NonNullable<CellSymbol>;
};

export default function TicTacToeGame({ playerSymbol, oppSymbol }: Props) {
  const utils = useUtils({
    defaultP1Symbol: playerSymbol,
    defaultP2Symbol: oppSymbol,
  });
  const { cells, players, setCells, setPlayers } = utils.states;
  const { handleClick } = utils.functions;

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <Grid cells={cells} handleClick={handleClick} />
      </div>
      <div className="flex w-[20%]">
        <GameDetails
          sections={[
            {
              title: "Controls",
              icon: Gamepad2Icon,
              iconProps: { fill: "black", color: "black" },
              content: {
                infos: ["Click on empty cell to add symbol."],
                elements: [],
              },
            },
            {
              title: "Game infos",
              icon: InfoIcon,
              iconProps: { fill: "#3A79BA", color: "black" },
              content: {
                infos: [
                  `${players.p1.currentTurn ? players.p1.name : players.p2.name} turn`,
                  `x is ${players.p1.symbol === "x" ? players.p1.name : players.p2.name}`,
                  `o is ${players.p1.symbol === "o" ? players.p1.name : players.p2.name}`,
                  `Winner: ${
                    players.p1.isWinner
                      ? players.p1.name
                      : players.p2.isWinner
                        ? players.p2.name
                        : "/"
                  }`,
                ],
                elements: [],
              },
            },
            {
              title: "Options",
              icon: SettingsIcon,
              iconProps: { fill: "#aaaaaa", color: "black" },
              content: {
                infos: [],
                elements: [
                  <Button
                    key="restart-button"
                    variant="default"
                    className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
                    onClick={() => {
                      setCells(Array(9).fill(undefined));
                      setPlayers((prev) => ({
                        ...prev,
                        p1: {
                          ...prev.p1,
                          currentTurn: !prev.p1.isWinner,
                          isWinner: false,
                        },
                        p2: {
                          ...prev.p2,
                          currentTurn: !prev.p2.isWinner,
                          isWinner: false,
                        },
                      }));
                    }}
                  >
                    <p className="text-white font-bold text-md text-center">
                      Restart
                    </p>
                    <RotateCcwIcon color="white" size={32} />
                  </Button>,
                ],
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
