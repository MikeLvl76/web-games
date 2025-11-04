"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useListGenerator } from "./use-list-generator";

export type Word = { value: string; isFound: boolean };

type UtilsParams = {
  gridSize: number;
  wordLength: number;
  listSize: number;
};

export type ContentItem = {
  charValue: string;
  withinWord: boolean;
};

export function useUtils({ gridSize, wordLength, listSize }: UtilsParams) {
  const { list: randomList, generateList } = useListGenerator({
    maxSize: listSize,
    wordLength,
  });
  const [words, setWords] = useState<Word[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isEnd, setIsEnd] = useState(false);

  const rowSize = useMemo(() => gridSize, [gridSize]);

  useEffect(() => {
    setWords(randomList.map((w) => ({ value: w, isFound: false })));
  }, [randomList]);

  useEffect(() => {
    generateGridContent(randomList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomList]);

  const canPlaceWord = useCallback(
    (
      _content: ContentItem[],
      index: number,
      word: string,
      isHorizontal: boolean
    ) => {
      const row = Math.floor(index / rowSize);
      const col = index % rowSize;

      if (
        (isHorizontal && col + word.length >= rowSize) ||
        (!isHorizontal && row + word.length >= rowSize)
      )
        return false;

      for (let i = 0; i < word.length; i++) {
        const charIndex = isHorizontal
          ? row * rowSize + (col + i)
          : (row + i) * rowSize + col;

        const cell = _content[charIndex];
        if (cell.withinWord && cell.charValue !== word[i]) {
          return false;
        }
      }

      return true;
    },
    [rowSize]
  );

  const findPlacement = useCallback(
    (
      _content: ContentItem[],
      word: string
    ): { index: number; horizontal: boolean } | null => {
      const indices = Array.from({ length: _content.length }, (_, i) => i);

      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      for (const idx of indices) {
        const horizontal = Math.random() < 0.5;
        if (canPlaceWord(_content, idx, word, horizontal)) {
          return { index: idx, horizontal };
        }

        if (canPlaceWord(_content, idx, word, !horizontal)) {
          return { index: idx, horizontal: !horizontal };
        }
      }

      return null;
    },
    [canPlaceWord]
  );

  const generateGridContent = useCallback(
    (list: string[]) => {
      const _content: ContentItem[] = Array.from(
        { length: Math.pow(gridSize, 2) },
        () => ({
          charValue: "",
          withinWord: false,
        })
      );

      for (const word of list) {
        const placement = findPlacement(_content, word);
        if (!placement) {
          continue;
        }

        const { index, horizontal } = placement;
        for (let i = 0; i < word.length; i++) {
          const replaceIndex = horizontal ? index + i : index + rowSize * i;

          _content[replaceIndex] = {
            charValue: word[i],
            withinWord: true,
          };
        }
      }

      setContent(
        _content.map((item) => ({
          ...item,
          charValue:
            item.charValue === ""
              ? String.fromCharCode(Math.floor(Math.random() * 26) + 97)
              : item.charValue,
        }))
      );
    },
    [findPlacement, gridSize, rowSize]
  );

  const handleMouseDown = (index: number) => {
    setIsHolding(true);
    setSelectedIndices([index]);
  };

  const handleMouseEnter = (index: number) => {
    if (isHolding) {
      setSelectedIndices((prev) => [...prev, index]);
    }
  };

  return {
    variables: { randomList },
    states: {
      words,
      content,
      isHolding,
      selectedIndices,
      isEnd,
      setWords,
      setContent,
      setIsHolding,
      setSelectedIndices,
      setIsEnd,
    },
    functions: {
      generateGridContent,
      handleMouseDown,
      handleMouseEnter,
      generateList,
    },
  };
}
