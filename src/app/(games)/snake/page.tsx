"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import { Snake } from "@/utils/p5/snake/snake";
import p5 from "p5";

export default function SnakePage() {
  const sketch = (p: p5) => {
    let snake: Snake;

    p.setup = () => {
      p.createCanvas(p.windowWidth * 0.5, p.windowHeight * 0.8);
      p.background(0);
      snake = new Snake(p);
    };

    p.draw = () => {
      p.background(0);

      if (!snake) return;

      snake.move();
      snake.draw();

      if (snake.isCrossing()) {
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
    <div className="flex flex-col items-center gap-4 p-2 w-full">
      <P5Sketch sketch={sketch} />
    </div>
  );
}
