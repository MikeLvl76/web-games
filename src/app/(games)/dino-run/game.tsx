"use client";

import P5Sketch from "@/components/custom/p5-sketch";
import { stringifyTime } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import p5 from "p5";
import { useCallback, useEffect, useRef, useState } from "react";
import GameStatus from "@/components/custom/game/status";
import { Button } from "@/components/ui/button";
import { Dino } from "@/lib/p5/dino-run/dino";
import { Obstacle } from "@/lib/p5/dino-run/obstacle";

type Props = {};

export default function DinoRunGame({}: Props) {
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [refresh, setRefresh] = useState(0);

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
    let dino: Dino | null = null;
    let obstacle: Obstacle | null = null;
    let groundHeight = 0;
    let score = 0;

    p.setup = () => {
      const div = document.getElementById("p5-container");
      const canvas = p.createCanvas(
        (div?.offsetWidth ?? p.windowWidth) * 0.9,
        (div?.offsetHeight ?? p.windowHeight) * 1.15,
      );
      canvas.elt.tabIndex = 0;

      // Avoid losing focus for keyboard when clicking elsewhere
      canvas.elt.addEventListener("mousedown", () => {
        canvas.elt.focus();
      });

      canvas.elt.focus();
      p.frameRate(60);
      p.background(0);

      groundHeight = p.height * 0.85;
      dino = new Dino(p, groundHeight);
      obstacle = new Obstacle(p, groundHeight);
    };

    p.draw = () => {
      p.background(0);

      p.textAlign(p.CENTER);
      p.textSize(24);
      p.strokeWeight(2);
      p.stroke(0);
      p.fill(200, 0, 0);
      const text = `Score: ${p.lerp(0, Math.floor(score), 1)}`;
      p.text(text, p.textWidth(text), 32);

      if (!dino || !obstacle) {
        throw Error("Unknown null value(s)");
      }

      p.stroke(255);
      p.strokeWeight(2);
      p.line(0, groundHeight, p.width, groundHeight);

      dino.handleJump();

      obstacle.scroll();

      if (dino.hasJumpedOver(obstacle)) {
        score += 20 * (p.deltaTime / 1000);
      }

      dino.draw();
      obstacle.draw();

      score += p.deltaTime / 1000;

      if (Math.floor(score) % 500 === 0) {
        obstacle.increaseScrollSpeed(0.2 * (p.deltaTime / 1000));
      }

      if (dino.hit(obstacle)) {
        p.background(0);
        p.textAlign(p.CENTER);
        p.textSize(32);
        p.noStroke();
        p.fill(127, 0, 0);
        p.text("GAME OVER", p.width / 2, p.height / 2);
        p.text(`Score: ${Math.floor(score)}`, p.width / 2, p.height * 0.7);
        p.noLoop();

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        score = 0;
      }
    };

    p.keyPressed = () => {
      if (p.keyCode === 32) {
        dino?.startJump();
      }
    };
  }, []);

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <P5Sketch sketch={sketch} refresh={refresh} />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Dino Run"
          description="Jump over obstacles to earn points"
          controls={[{ label: "Jump", value: "Space bar" }]}
          infos={[
            {
              label: "Timer",
              value: timer.text,
            },
          ]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setRefresh((prev) => prev + 1);

                gameOverRef.current = false;
                setGameOver(false);
                setTimer({
                  value: 0,
                  text: stringifyTime(0),
                });
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
