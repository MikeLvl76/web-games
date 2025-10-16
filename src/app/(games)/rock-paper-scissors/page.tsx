"use client";

import { Gem, LucideIcon, Scissors, StickyNote } from "lucide-react";
import { memo, useEffect, useState } from "react";

type MoveType = "Rock" | "Paper" | "Scissors";
type MovePropsType = { text: MoveType; icon: LucideIcon; by?: "player" | "ia" };
type MovesPropsType = { list: MovePropsType[] };

export default function RockPaperScissorsPage() {
  const [choice, setChoice] = useState<MovePropsType | null>(null);
  const [randomChoice, setRandomChoice] = useState<MovePropsType | null>(null);
  const [result, setResult] = useState<"player" | "ia" | "draw" | null>(null);

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

  useEffect(() => {
    if (choice && randomChoice) {
      if (choice.text === randomChoice.text) {
        setResult("draw");
        return;
      }
      if (choice.text === "Rock") {
        if (randomChoice.text === "Paper") {
          setResult("ia");
        } else if (randomChoice.text === "Scissors") {
          setResult("player");
        }
        return;
      }

      if (choice.text === "Paper") {
        if (randomChoice.text === "Rock") {
          setResult("player");
        } else if (randomChoice.text === "Scissors") {
          setResult("ia");
        }
        return;
      }

      if (choice.text === "Scissors") {
        if (randomChoice.text === "Paper") {
          setResult("player");
        } else if (randomChoice.text === "Rock") {
          setResult("ia");
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

    if (by === "ia") {
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
    <div className="flex flex-row justify-evenly w-full">
      {list.map((item, i) => (
        <Move key={i} {...item} />
      ))}
    </div>
  ));
  Moves.displayName = "Moves";

  const EndGame = memo(() => {
    if (result) {
      let msg;

      if (result === "draw") {
        msg = "Draw";
      } else if (result === "ia") {
        msg = "You lose!";
      } else if (result === "player") {
        msg = "You win!";
      }

      return (
        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl font-bold">{msg}</span>
          <button
            onClick={() => {
              setChoice(null);
              setRandomChoice(null);
              setResult(null);
            }}
            className="w-fit h-fit p-2 bg-blue-400 rounded-md text-white text-center hover:cursor-pointer text-xl"
          >
            Restart
          </button>
        </div>
      );
    }
  });
  EndGame.displayName = "EndGame";

  return (
    <div className="flex flex-col items-center justify-between w-[50vw] h-[70vh] p-4">
      {randomChoice ? (
        <Move {...randomChoice} by="ia" />
      ) : (
        <span className="text-center text-xl font-medium">
          Waiting for your choice...
        </span>
      )}
      <EndGame />
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
  );
}
