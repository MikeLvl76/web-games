"use client";

import { Button } from "@/components/ui/button";
import {
  Gamepad2Icon,
  InfoIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Choice } from "./choice";
import { Choices } from "./choices";
import GameDetails from "@/components/custom/game/details";

const MOVES = {
  rock: { win: "scissors", lose: "paper" },
  paper: { win: "rock", lose: "scissors" },
  scissors: { win: "paper", lose: "rock" },
};
type MoveType = keyof typeof MOVES;

export default function RockPaperScissorsGame() {
  const [playerChoice, setPlayerChoice] = useState<MoveType | null>(null);
  const [randomChoice, setRandomChoice] = useState<MoveType | null>(null);
  const [result, setResult] = useState<"player" | "ai" | "draw" | null>(null);

  const choiceToText = (_choice: MoveType) => {
    if (_choice === "rock") return "✊";
    if (_choice === "paper") return "🖐️";
    if (_choice === "scissors") return "✌️";

    return "❌";
  };

  const handleClick = useCallback(
    (index: number) => {
      const entries = Object.entries(MOVES);
      if (index >= entries.length || playerChoice || randomChoice) return;

      entries.forEach(([move], i) => {
        if (i === index) {
          setPlayerChoice(move as MoveType);

          const randIndex = Math.floor(Math.random() * entries.length);
          const [randMove] = entries[randIndex];

          setRandomChoice(randMove as MoveType);

          return;
        }
      });
    },
    [playerChoice, randomChoice],
  );

  useEffect(() => {
    if (playerChoice && randomChoice) {
      const move = MOVES[playerChoice];

      if (move.win === randomChoice) return setResult("player");
      if (move.lose === randomChoice) return setResult("ai");
      return setResult("draw");
    }
  }, [playerChoice, randomChoice]);

  return (
    <div className="flex flex-row h-full justify-center items-center gap-8 p-2">
      <div className="flex flex-col w-[80%] h-[75%] justify-around">
        {randomChoice ? (
          <Choice
            index={Object.keys(MOVES).indexOf(randomChoice)}
            text={choiceToText(randomChoice)}
            handleClick={handleClick}
          />
        ) : (
          <span className="text-center text-xl font-medium self-center">
            Waiting for your choice...
          </span>
        )}
        {result && (
          <span className="text-2xl capitalize text-center p-2 font-bold w-32">
            {result}
          </span>
        )}
        {playerChoice ? (
          <Choice
            index={Object.keys(MOVES).indexOf(playerChoice)}
            text={choiceToText(playerChoice)}
            handleClick={handleClick}
          />
        ) : (
          <Choices
            data={[
              { id: "Rock", text: "✊" },
              { id: "Paper", text: "🖐️" },
              { id: "Scissors", text: "✌️" },
            ]}
            handleClick={handleClick}
          />
        )}
      </div>
      <div className="flex w-[20%] h-[50%] items-start">
        <GameDetails
          sections={[
            {
              title: "Controls",
              icon: Gamepad2Icon,
              iconProps: { fill: "black", color: "black" },
              content: {
                infos: ["Click on emoji to pick it."],
                elements: [],
              },
            },
            {
              title: "Game infos",
              icon: InfoIcon,
              iconProps: { fill: "#3A79BA", color: "black" },
              content: {
                infos: [`Winner: ${result ? result : "/"}`],
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
                      setPlayerChoice(null);
                      setRandomChoice(null);
                      setResult(null);
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
