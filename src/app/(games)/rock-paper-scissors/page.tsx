"use client";

import { GameStatus } from "@/components/generic/game-status";
import { Button } from "@/components/ui/button";
import { Gem, LucideIcon, RotateCcw, Scissors, StickyNote } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

type MoveType = "Rock" | "Paper" | "Scissors";
type MovePropsType = { text: MoveType; icon: LucideIcon; by?: "player" | "ai" };
type MovesPropsType = { list: MovePropsType[] };

export default function RockPaperScissorsPage() {
  const [choice, setChoice] = useState<MovePropsType | null>(null);
  const [randomChoice, setRandomChoice] = useState<MovePropsType | null>(null);
  const [result, setResult] = useState<"player" | "ai" | "draw" | null>(null);

  const handleClick = (item: MovePropsType | null) => {
    if (choice || randomChoice || !item) return;
    setChoice(item);

    if (item.text === "Rock") {
      const random = Math.random();
      if (random < 0.2) {
        setRandomChoice({ text: "Rock", icon: Gem });
      } else if (random > 0.2 && random < 0.7) {
        setRandomChoice({ text: "Paper", icon: StickyNote });
      } else if (random > 0.8) {
        setRandomChoice({ text: "Scissors", icon: Scissors });
      }
      return;
    }

    if (item.text === "Paper") {
      const random = Math.random();
      if (random < 0.2) {
        setRandomChoice({ text: "Paper", icon: StickyNote });
      } else if (random > 0.2 && random < 0.7) {
        setRandomChoice({ text: "Scissors", icon: Scissors });
      } else if (random > 0.8) {
        setRandomChoice({ text: "Rock", icon: Gem });
      }
      return;
    }

    if (item.text === "Scissors") {
      const random = Math.random();
      if (random < 0.2) {
        setRandomChoice({ text: "Scissors", icon: Scissors });
      } else if (random > 0.2 && random < 0.7) {
        setRandomChoice({ text: "Rock", icon: Gem });
      } else if (random > 0.8) {
        setRandomChoice({ text: "Paper", icon: StickyNote });
      }
      return;
    }
  };

  const winner = useMemo(() => {
    if (result === "draw") {
      return "Draw";
    } else if (result === "ai") {
      return "AI";
    } else if (result === "player") {
      return "Player";
    }

    return null;
  }, [result]);

  useEffect(() => {
    if (choice && randomChoice) {
      if (choice.text === randomChoice.text) {
        setResult("draw");
        return;
      }
      if (choice.text === "Rock") {
        if (randomChoice.text === "Paper") {
          setResult("ai");
        } else if (randomChoice.text === "Scissors") {
          setResult("player");
        }
        return;
      }

      if (choice.text === "Paper") {
        if (randomChoice.text === "Rock") {
          setResult("player");
        } else if (randomChoice.text === "Scissors") {
          setResult("ai");
        }
        return;
      }

      if (choice.text === "Scissors") {
        if (randomChoice.text === "Paper") {
          setResult("player");
        } else if (randomChoice.text === "Rock") {
          setResult("ai");
        }
        return;
      }
    }
  }, [choice, randomChoice]);

  const Move = memo(({ text, by, ...rest }: MovePropsType) => {
    if (by === "player") {
      return (
        <div
          className={`flex flex-col justify-center items-center gap-4 border-2 border-black bg-black p-2 rounded-full w-32 h-32 select-none`}
        >
          <rest.icon size={32} color="white" />
          <label className="text-lg font-medium text-center text-white">
            {text}
          </label>
        </div>
      );
    }

    if (by === "ai") {
      return (
        <div
          className={`flex flex-col justify-center items-center gap-4 border-2 border-black bg-black p-2 rounded-full w-32 h-32 select-none`}
        >
          <rest.icon size={32} color="white" />
          <label className="text-lg font-medium text-center text-white">
            {text}
          </label>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col justify-center items-center gap-4 border-2 border-black p-2 rounded-full w-32 h-32 select-none hover:cursor-pointer`}
        onClick={() => handleClick({ text, ...rest })}
      >
        <rest.icon size={32} color={"black"} />
        <label className="text-lg font-medium text-center hover:cursor-pointer">
          {text}
        </label>
      </div>
    );
  });
  Move.displayName = "Move";

  const Moves = memo(({ list }: MovesPropsType) => (
    <div className="flex flex-row justify-between w-full">
      {list.map((item, i) => (
        <Move key={i} {...item} />
      ))}
    </div>
  ));
  Moves.displayName = "Moves";

  return (
    <div className="flex flex-row h-full justify-center items-center gap-8 p-2">
      <div className="flex flex-col w-[80%] h-[75%] justify-around">
        {randomChoice ? (
          <Move {...randomChoice} by="ai" />
        ) : (
          <span className="text-center text-xl font-medium self-center">
            Waiting for your choice...
          </span>
        )}
        {choice ? (
          <Move {...choice} by="player" />
        ) : (
          <Moves
            list={[
              { text: "Rock", icon: Gem },
              { text: "Paper", icon: StickyNote },
              { text: "Scissors", icon: Scissors },
            ]}
          />
        )}
      </div>
      <div className="flex w-[20%] h-[50%] items-start">
        <GameStatus
          title="Be lucky"
          infos={[
            {
              label: "Winner",
              value: winner ? winner : "/",
            },
          ]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setChoice(null);
                setRandomChoice(null);
                setResult(null);
              }}
            >
              <p className="text-white font-bold text-md text-center">
                Restart
              </p>
              <RotateCcw color="white" size={32} />
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
