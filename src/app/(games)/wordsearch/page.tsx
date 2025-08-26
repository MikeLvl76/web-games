"use client";

import generateList from "@/utils/word-generator";
import { memo, useCallback, useEffect, useState } from "react";

export default function WordSearch() {
  const [words, setWords] = useState<string[]>([]);
  const [content, setContent] = useState<string[]>([]);

  const generateGridContent = useCallback(
    (words: string[], size: number = 80) => {
      setWords(words);

      const _content: string[] = Array.from({ length: size }, () =>
        String.fromCharCode(Math.floor(Math.random() * 26) + 97)
      );

      const _words = [...words];
      const rowSize = size / 10;
      const limit = _words.length;

      for (let i = 0; i < limit; i++) {
        const randomIdx = Math.floor(Math.random() * _words.length);
        const word = _words[randomIdx];
        _words.splice(randomIdx, 1);

        const wordStartIdx = i * rowSize;

        _content.splice(wordStartIdx, word.length, ...word);
      }

      return _content;
    },
    []
  );

  useEffect(() => {
    generateList(8, 5)
      .then((list) => setContent(generateGridContent(list)))
      .catch((err) => console.error(err));
  }, [generateGridContent]);

  const WordList = memo(({ words }: { words: string[] }) => (
    <div className="flex w-[40vw] h-[20vh]">
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
    <div className="flex w-[30vw] h-[50vh] border-1 border-black rounded-sm p-2">
      <ul className="grid grid-flow-row grid-cols-8 w-full h-full items-center">
        {content.map((char, i) => (
          <li
            key={i}
            className="justify-self-center w-fit h-fit rounded-full hover:cursor-pointer hover:border-1 hover:border-black select-none"
          >
            <p className="text-3xl font-bold">{char}</p>
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
