"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import { Food } from "@/utils/p5/snake/food";
import { Snake } from "@/utils/p5/snake/snake";
import { RotateCcw } from "lucide-react";
import p5 from "p5";
import { useState } from "react";

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
    <div className="flex flex-row justify-center items-center gap-2 p-2 w-full">
      <P5Sketch sketch={sketch} refresh={refresh} />
      <RotateCcw
        color="white"
        size={32}
        onClick={() => {
          setRefresh((prev) => prev + 1);
        }}
        className="self-start w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
      />
    </div>
  );
}
