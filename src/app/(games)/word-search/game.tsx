"use client";

import { GameStatus } from "@/components/custom/game-status";
import { Button } from "@/components/ui/button";
import { useUtils } from "@/hooks/games/word-search/use-utils";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Grid } from "./grid";
import { WordList } from "./list";
import { stringifyTime } from "@/lib/utils";

type Props = {
  enableCountdown: boolean;
  gridSize: number;
  wordLength: number;
  listSize: number;
};

export default function WordSearchGame({
  enableCountdown,
  gridSize,
  wordLength,
  listSize,
}: Props) {
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<{ value: number; text: string }>({
    value: 20 * listSize, // 20s per word
    text: stringifyTime(20 * listSize),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const utils = useUtils({ gridSize, wordLength, listSize });
  const {
    isEnd,
    selectedIndices,
    content,
    words,
    setWords,
    setIsEnd,
    setIsHolding,
    setSelectedIndices,
  } = utils.states;
  const { handleMouseDown, handleMouseEnter, generateList } = utils.functions;

  useEffect(() => {
    if (isEnd || !enableCountdown) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        const time = Math.max(prev.value - 1, 0);
        return {
          value: time,
          text: stringifyTime(time),
        };
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [enableCountdown, isEnd]);

  useEffect(() => {
    if (isEnd || countdown.value === 0) {
      return;
    }

    const string = selectedIndices
      .map((idx) => content[idx].charValue)
      .join("");
    // TODO: check if each index is n-1/n+1 of next index
    const word = words.find(({ value }) => string.includes(value));

    if (word) {
      const index = string.indexOf(word.value);

      setHighlightIndices((prev) => [
        ...prev,
        ...selectedIndices.slice(index, index + word.value.length),
      ]);
      setWords((prev) =>
        prev.map((w) => (w === word ? { ...w, isFound: true } : w))
      );
    }

    if (words.length > 0 && words.every((w) => w.isFound)) {
      setIsEnd(true);
    }
  }, [
    content,
    countdown.value,
    isEnd,
    selectedIndices,
    setIsEnd,
    setWords,
    words,
  ]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsHolding(false);
      setSelectedIndices([]);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [setIsHolding, setSelectedIndices]);

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex flex-row w-[80%] justify-center gap-4 p-2">
        <WordList words={words} />
        <Grid
          content={content}
          selectedIndices={selectedIndices}
          highlightIndices={highlightIndices}
          handleMouseDown={handleMouseDown}
          handleMouseEnter={handleMouseEnter}
        />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Word Search"
          description="Find the words inside a grid full of characters"
          controls={[
            {
              label: "Highlight word",
              value: "Drag over chars with mouse left button",
            },
          ]}
          infos={[
            { label: "Words", value: `${words.length}` },
            {
              label: "Found",
              value: `${words.filter((w) => w.isFound).length}`,
            },
            {
              label: "Countdown",
              value: enableCountdown ? countdown.text : "Disabled",
            },
          ]}
          options={[
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setIsEnd(false);
                generateList();
                setIsHolding(false);
                setHighlightIndices([]);
                setSelectedIndices([]);
                setCountdown({
                  value: 20 * listSize,
                  text: stringifyTime(20 * listSize),
                });
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(() => {
                  setCountdown((prev) => {
                    const time = Math.max(prev.value - 1, 0);
                    return {
                      value: time,
                      text: stringifyTime(time),
                    };
                  });
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
