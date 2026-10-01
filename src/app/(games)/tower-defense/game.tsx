"use client";

import GameDetails from "@/components/custom/game/details";
import P5Sketch from "@/components/custom/p5-sketch";
import { Button } from "@/components/ui/button";
import { EnemyGenerator } from "@/lib/p5/tower-defense/enemy-generator";
import { Tower } from "@/lib/p5/tower-defense/tower";
import { stringifyTime } from "@/lib/utils";
import {
  Gamepad2Icon,
  InfoIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";
import p5 from "p5";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  enableTime: boolean;
};

export default function TowerDefenseGame({ enableTime }: Props) {
  const [refresh, setRefresh] = useState(0);
  const [timer, setTimer] = useState<{ value: number; text: string }>({
    value: 0,
    text: stringifyTime(0),
  });
  const [gameOver, setGameOver] = useState(false);
  const timeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (!enableTime) return;

    timeRef.current = timer.value;
  }, [enableTime, timer]);

  useEffect(() => {
    if (gameOver || !enableTime) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => ({
        value: prev.value + 1,
        text: stringifyTime(prev.value + 1),
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [enableTime, gameOver]);

  const sketch = useCallback((p: p5) => {
    let score: number;
    let tower: Tower | null;
    let generator: EnemyGenerator | null;

    p.setup = () => {
      const div = document.getElementById("p5-container");
      p.createCanvas(
        div?.offsetWidth ?? p.windowWidth * 0.5,
        div?.offsetHeight ?? p.windowHeight * 0.8,
      );
      p.background(0);
      p.frameRate(60);
      score = 0;
      tower = new Tower(p, 80);
      generator = new EnemyGenerator(p, "unlimited", 50, tower);
    };

    p.draw = () => {
      p.background(0);

      if (!tower || !generator) return;
      tower.fire();
      tower.manage();
      tower.draw();

      generator.manage(tower.bullets);
      generator.generate();

      p.fill(255);
      p.textSize(16);
      p.text(`Enemies: ${generator.enemies.length}`, p.width / 2, 20);
    };
  }, []);

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <P5Sketch sketch={sketch} refresh={refresh} />
      </div>
      <div className="flex w-[20%]">
        <GameDetails
          sections={[
            {
              title: "Controls",
              icon: Gamepad2Icon,
              iconProps: { fill: "black", color: "black" },
              content: {
                infos: ["Move mouse to aim while shooting."],
                elements: [],
              },
            },
            {
              title: "Game infos",
              icon: InfoIcon,
              iconProps: { fill: "#3A79BA", color: "black" },
              content: {
                infos: [
                  `Score: ${scoreRef.current}`,
                  enableTime ? `Time: ${timer.text}` : "Time disabled",
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
                      scoreRef.current = 0;
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
