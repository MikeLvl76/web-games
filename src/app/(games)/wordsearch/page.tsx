"use client";

import generateList from "@/utils/word-generator";
import { memo, useCallback, useEffect, useState } from "react";

export default function WordSearch() {
  const [words, setWords] = useState<string[]>([]);
  const [content, setContent] = useState<string[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const generateGridContent = useCallback(
    (words: string[], size: number = 100) => {
      setWords(words);

      const _content: string[] = Array.from({ length: size }, () => "");

      const _words = [...words];
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

      return _content.map((char) =>
        char === ""
          ? String.fromCharCode(Math.floor(Math.random() * 26) + 97)
          : char
      );
    },
    []
  );

  useEffect(() => {
    generateList(8, 5)
      .then((list) => setContent(generateGridContent(list)))
      .catch((err) => console.error(err));
  }, [generateGridContent]);

  useEffect(() => {
    const string = selectedIndices.map((idx) => content[idx]).join("");

    const word = words.find((w) => string.includes(w));

    if (word) {
      setWords((prev) => prev.filter((w) => w !== word));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndices, words]);

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

  const WordList = memo(({ words }: { words: string[] }) => (
    <div className="flex w-[20vw] h-[20vh]">
      <ul className="grid grid-cols-4 w-full h-full p-2 items-center">
        {words.map((word, i) => (
          <li key={i} className="justify-self-center">
            <p className="text-xl font-bold">{word}</p>
          </li>
        ))}
      </ul>
    </div>
  ));
  WordList.displayName = "WordList";

  const Grid = memo(({ content }: { content: string[] }) => (
    <div className="flex w-[25vw] h-[60vh] border-1 border-black rounded-sm p-2">
      <ul
        className={`grid grid-flow-row grid-cols-10 w-full h-full items-center`}
      >
        {content.map((char, i) => (
          <li
            key={i}
            className={`flex items-center justify-center justify-self-center w-3/4 h-3/4 rounded-full p-2 ${
              selectedIndices.includes(i) ? "bg-green-300" : "bg-white"
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
    <div className="flex flex-col items-center gap-2 p-2">
      <WordList words={words} />
      <Grid content={content} />
    </div>
  );
}
