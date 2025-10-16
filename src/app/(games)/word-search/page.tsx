"use client";

import { useListGenerator } from "@/hooks/games/word-search/use-list-generator";
import { memo, useCallback, useEffect, useState } from "react";

export default function WordSearch() {
  const randomList = useListGenerator({ maxSize: 8, wordLength: 5 });
  const [words, setWords] = useState<{ value: string; isFound: boolean }[]>([]);
  const [content, setContent] = useState<string[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [isEnd, setIsEnd] = useState(false);
  const [generate, setGenerate] = useState(true);

  const generateGridContent = useCallback(
    (size: number = 100) => {
      setWords(randomList.map((w) => ({ value: w, isFound: false })));

      const _content: string[] = Array(size).fill("");

      const _words = [...randomList];
      const rowSize = size / 10;
      const rowCount = Math.ceil(size / rowSize);
      const limit = _words.length;

      const pickRandomly = () => {
        const randomIdx = Math.floor(Math.random() * _words.length);
        const word =
          Math.random() < 0.4
            ? _words[randomIdx]
            : [..._words[randomIdx]].reverse().join("");

        _words.splice(randomIdx, 1);

        return word;
      };

      const canPlaceWord = (
        index: number,
        word: string,
        isHorizontal: boolean
      ) => {
        const row = Math.floor(index / rowSize);
        const col = index % rowSize;

        if (isHorizontal) {
          if (col + word.length > rowSize) return false;
          for (let i = 0; i < word.length; i++) {
            const charIndex = row * rowSize + (col + i);
            if (_content[charIndex] !== "" && _content[charIndex] !== word[i]) {
              return false;
            }
          }
        } else {
          if (row + word.length > rowCount) return false;
          for (let i = 0; i < word.length; i++) {
            const charIndex = (row + i) * rowSize + col;
            if (_content[charIndex] !== "" && _content[charIndex] !== word[i]) {
              return false;
            }
          }
        }

        return true;
      };

      for (let i = 0; i < limit; i++) {
        const word = pickRandomly();

        const position: "row" | "col" = Math.random() < 0.5 ? "row" : "col";

        if (position === "row") {
          // Place randomly in row
          let startIndex =
            Math.floor(Math.random() * rowCount) * rowSize +
            Math.floor(Math.random() * (rowSize - word.length + 1));

          while (!canPlaceWord(startIndex, word, true)) {
            startIndex =
              Math.floor(Math.random() * rowCount) * rowSize +
              Math.floor(Math.random() * (rowSize - word.length + 1));
          }

          _content.splice(startIndex, word.length, ...word);
          continue;
        }

        if (position === "col") {
          // Place randomly in col
          let startIndex =
            Math.floor(Math.random() * rowSize) +
            Math.floor(Math.random() * (rowCount - word.length + 1));

          while (!canPlaceWord(startIndex, word, false)) {
            startIndex =
              Math.floor(Math.random() * rowSize) +
              Math.floor(Math.random() * (rowCount - word.length + 1));
          }

          for (let c = 0; c < word.length; c++) {
            const replaceIndex = startIndex + rowSize * c;
            _content.splice(replaceIndex, 1, word[c]);
          }
          continue;
        }
      }

      setContent(
        _content.map((char) =>
          char === ""
            ? String.fromCharCode(Math.floor(Math.random() * 26) + 97)
            : char
        )
      );

      setGenerate((prev) => !prev);
    },
    [randomList]
  );

  useEffect(() => {
    if (!generate) return;

    generateGridContent();
  }, [generate, generateGridContent, randomList]);

  useEffect(() => {
    if (isEnd) {
      return;
    }

    const string = selectedIndices.map((idx) => content[idx]).join("");
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
  }, [content, isEnd, selectedIndices, words]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsHolding(false);
      setSelectedIndices([]);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseDown = (index: number) => {
    setIsHolding(true);
    setSelectedIndices([index]);
  };

  const handleMouseEnter = (index: number) => {
    if (isHolding) {
      setSelectedIndices((prev) => [...prev, index]);
    }
  };

  const WordList = memo(
    ({ words }: { words: { value: string; isFound: boolean }[] }) => (
      <div className="flex w-[20vw] h-[10vh]">
        <ul className="grid grid-cols-4 w-full h-full p-2 items-center">
          {words.map(({ value, isFound }, i) => (
            <li key={i} className="justify-self-center">
              <p
                className={`text-xl text-left font-bold decoration-4 decoration-red-500 ${
                  isFound ? "line-through" : ""
                }`}
              >
                {value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  );
  WordList.displayName = "WordList";

  const Grid = memo(({ content }: { content: string[] }) => (
    <div className="flex self-center w-[25vw] h-[60vh] border-1 border-black rounded-sm p-2">
      <ul
        className={`grid grid-flow-row grid-cols-10 w-full h-full items-center`}
      >
        {content.map((char, i) => (
          <li
            key={i}
            className={`flex items-center justify-center justify-self-center w-3/4 h-3/4 rounded-full p-2 ${
              selectedIndices.includes(i) || highlightIndices.includes(i)
                ? "bg-green-300"
                : "bg-white"
            } hover:cursor-pointer select-none`}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
          >
            <p className="text-xl font-bold">{char}</p>
          </li>
        ))}
      </ul>
    </div>
  ));
  Grid.displayName = "Grid";

  return (
    <div className="flex flex-col items-center gap-4 p-2 w-full">
      {isEnd && (
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-bold text-center">
            Congrats! You found all words!
          </h1>
          <button
            onClick={() => {
              setIsEnd(false);
              setContent([]);
              setWords([]);
              setHighlightIndices([]);
              setIsHolding(false);
              setSelectedIndices([]);
              setGenerate((prev) => !prev);
            }}
            className="w-fit h-fit p-2 rounded-sm bg-blue-500 text-white hover:cursor-pointer"
          >
            Play again
          </button>
        </div>
      )}
      <Grid content={content} />
      <WordList words={words} />
    </div>
  );
}
