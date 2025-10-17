"use client";

import { GameStatus } from "@/components/generic/game-status";
import P5Sketch from "@/components/generic/p5-sketch";
import { Button } from "@/components/ui/button";
import { Food } from "@/lib/p5/snake/food";
import { Snake } from "@/lib/p5/snake/snake";
import { RotateCcw } from "lucide-react";
import p5 from "p5";
import { useState } from "react";

// TODO: add timer + eat counter + snake size
export default function SnakePage() {
  const [refresh, setRefresh] = useState(0);

  const sketch = (p: p5) => {
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

      if (snake.isCrossing()) {
        p.background(0);
        p.fill(127, 0, 0);
        p.textSize(48);
        p.textAlign(p.CENTER);
        p.text("You lose", p.width * 0.5, p.height * 0.5);

        p.fill(127);
        p.textSize(32);
        p.text(`Your score: ${score}`, p.width * 0.5, p.height * 0.6);

        p.noLoop();
      }
    };

    p.keyPressed = () => {
      if (!snake) return;

      if (p.key === "ArrowLeft") snake.setDirection("left");
      else if (p.key === "ArrowRight") snake.setDirection("right");
      else if (p.key === "ArrowUp") snake.setDirection("up");
      else if (p.key === "ArrowDown") snake.setDirection("down");
    };
  };

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <P5Sketch sketch={sketch} refresh={refresh} />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Miam miam"
          infos={[{ label: "Move", value: "Arrow keys" }]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setRefresh((prev) => prev + 1);
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
