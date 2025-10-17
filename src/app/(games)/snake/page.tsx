"use client";

import { GameStatus } from "@/components/generic/game-status";
import P5Sketch from "@/components/generic/p5-sketch";
import { Button } from "@/components/ui/button";
import { Food } from "@/lib/p5/snake/food";
import { Snake } from "@/lib/p5/snake/snake";
import { stringifyTime } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import p5 from "p5";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SnakePage() {
  const [refresh, setRefresh] = useState(0);
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const [gameOver, setGameOver] = useState(false);
  const timeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sizeRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    timeRef.current = timer.value;
  }, [timer]);

  useEffect(() => {
    if (gameOver) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [gameOver]);

  const sketch = useCallback((p: p5) => {
    let snake: Snake;
    let food: Food;
    let score: number;

    p.setup = () => {
      const div = document.getElementById("p5-container");
      p.createCanvas(
        div?.offsetWidth ?? p.windowWidth * 0.5,
        div?.offsetHeight ?? p.windowHeight * 0.8
      );
      p.background(0);
      snake = new Snake(p);
      food = new Food(p, 15);
      score = 0;
    };

    p.draw = () => {
      p.background(0);

      if (!snake) return;

      food.draw();
      snake.move();
      snake.draw();
      snake.eat(food, (s, f) => {
        score += Math.floor(f.r / 3) + Math.floor(s.body.length / 2);
      });
      sizeRef.current = snake.body.length;
      scoreRef.current = score;

      if (snake.isCrossing()) {
        p.noLoop();
        p.background(0);
        setGameOver(true);
        p.fill(127, 0, 0);
        p.textSize(48);
        p.textAlign(p.CENTER);
        p.text("You lose", p.width * 0.5, p.height * 0.5);

        p.fill(127);
        p.textSize(32);
        p.text(`Your score: ${score}`, p.width * 0.5, p.height * 0.6);
        p.text(
          `Game time: ${stringifyTime(timeRef.current)}`,
          p.width * 0.5,
          p.height * 0.7
        );
      }
    };

    p.keyPressed = () => {
      if (!snake) return;

      if (p.key === "ArrowLeft" || p.key === "q") snake.setDirection("left");
      else if (p.key === "ArrowRight" || p.key === "d")
        snake.setDirection("right");
      else if (p.key === "ArrowUp" || p.key === "z") snake.setDirection("up");
      else if (p.key === "ArrowDown" || p.key === "s")
        snake.setDirection("down");
    };
  }, []);

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <P5Sketch sketch={sketch} refresh={refresh} />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Miam miam"
          infos={[
            { label: "Move", value: "ZQSD / Arrow keys" },
            { label: "Game time", value: timer.text },
            { label: "Snake length", value: `${sizeRef.current}` },
            { label: "Eat count", value: `${sizeRef.current - 3}` },
            { label: "Score", value: `${scoreRef.current}` },
          ]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setRefresh((prev) => prev + 1);
                setGameOver(false);
                setTimer({ value: 0, text: stringifyTime(0) });
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(() => {
                  setTimer((prev) => ({
                    value: prev.value + 1,
                    text: stringifyTime(prev.value + 1),
                  }));
                }, 1000);
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
