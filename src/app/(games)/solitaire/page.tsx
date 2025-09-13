"use client";

import CardSymbolIcon from "@/components/generic/card-symbol-icon";
import {
  Card,
  CardSymbol,
  generatePack,
} from "@/server-actions/pack-generator";
import { Club, Diamond, Heart, Spade } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

export default function SolitairePage() {
  const [pack, setPack] = useState<Card[]>([]);
  const [sequences, setSequences] = useState<Record<CardSymbol, Card[]>>({
    club: [],
    spade: [],
    heart: [],
    diamond: [],
  });
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [piles, setPiles] = useState<Card[][]>([[], [], [], [], [], [], []]);

  const init = useCallback(async () => {
    try {
      const _pack = await generatePack();
      const _piles: typeof piles = Array.from({ length: 7 }, (_, k) => {
        const pile: Card[] = [];

        for (let i = 0; i < k + 1; i++) {
          const randomIdx = Math.floor(Math.random() * _pack.length);
          const [card] = _pack.splice(randomIdx, 1);

          if (i === k) {
            card.isHidden = false;
          }
          pile.push(card);
        }

        return pile;
      });

      _pack.sort(() => Math.random() - 0.5);

      setPiles(_piles);
      setPack(_pack);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const draw = useCallback(() => {
    const _pack = [...pack];

    if (_pack.length === 0) {
      if (drawnCards.length === 0) {
        return;
      }
      setPack(drawnCards);
      setDrawnCards([]);
      return;
    }

    const card = _pack.pop();

    setPack(_pack);
    setDrawnCards((prev) => (card ? [...prev, card] : prev));
  }, [drawnCards, pack]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Header = memo(
    ({
      pack,
      sequences,
      drawnCards,
    }: {
      pack: Card[];
      sequences: Record<CardSymbol, Card[]>;
      drawnCards: Card[];
    }) => {
      const sqsDiv = (
        <div className="flex flex-row w-[50%] justify-evenly items-center gap-6 p-2">
          {Object.entries(sequences).map(([sym, sq], i) => {
            if (sq.length === 0) {
              if (sym === "spade")
                return (
                  <div
                    key={i}
                    className="flex justify-center items-center w-24 h-32 rounded-md bg-slate-400/70"
                  >
                    <Spade key={i} color="black" size={32} fill="black" />
                  </div>
                );
              if (sym === "diamond")
                return (
                  <div
                    key={i}
                    className="flex justify-center items-center w-24 h-32 rounded-md bg-slate-400/70"
                  >
                    <Diamond key={i} color="red" size={32} fill="red" />
                  </div>
                );
              if (sym === "heart")
                return (
                  <div
                    key={i}
                    className="flex justify-center items-center w-24 h-32 rounded-md bg-slate-400/70"
                  >
                    <Heart key={i} color="red" size={32} fill="red" />
                  </div>
                );
              if (sym === "club")
                return (
                  <div
                    key={i}
                    className="flex justify-center items-center w-24 h-32 rounded-md bg-slate-400/70"
                  >
                    <Club key={i} color="black" size={32} fill="black" />
                  </div>
                );

              return <div key={i} />;
            }
            return (
              <div key={i} className="flex justify-center items-center">
                {sq[sq.length - 1].value}
              </div>
            );
          })}
        </div>
      );

      const lastCard = drawnCards[drawnCards.length - 1];
      const lastCardDrawnDiv = (
        <div
          className={`flex flex-col justify-center items-center w-24 h-32 ${
            lastCard ? "bg-slate-200" : "bg-slate-400/70"
          }  hover:cursor-pointer rounded-md gap-2`}
        >
          {lastCard && (
            <>
              <CardSymbolIcon symbol={lastCard.symbol} color={lastCard.color} />
              <p className="text-lg font-bold">{lastCard.value}</p>
            </>
          )}
        </div>
      );

      const packDiv = (
        <div
          onClick={draw}
          className={`flex justify-center items-center w-24 h-32 rounded-md hover:cursor-pointer ${
            pack.length > 0 ? "bg-red-700/60" : "bg-slate-400/70"
          } `}
        >
          {pack.length > 0 && (
            <p className="text-xl text-white">{pack.length}</p>
          )}
        </div>
      );

      return (
        <div className="flex flex-row justify-between items-center h-52 p-2 select-none">
          {sqsDiv}
          <div className="flex flex-row w-[30%] justify-evenly items-center gap-6">
            {lastCardDrawnDiv}
            {packDiv}
          </div>
        </div>
      );
    }
  );
  Header.displayName = "Header";

  const Piles = memo(({ piles }: { piles: Card[][] }) => (
    <div className="flex flex-row justify-evenly w-full select-none">
      {piles.map((pile, pileIndex) => (
        <div key={pileIndex} className="relative w-24 min-h-fit bg-transparent">
          {pile.map((card, cardIndex) => (
            <div
              key={cardIndex}
              className={`
                absolute w-24 h-32 rounded-md border-2 border-black shadow-2xl
                ${
                  card.isHidden
                    ? "bg-red-700"
                    : "bg-slate-200 hover:cursor-pointer"
                }
              `}
              style={{
                top: `${cardIndex * 36}px`,
              }}
            >
              {!card.isHidden && (
                <div className="flex flex-col justify-center items-center gap-2 h-full">
                  <CardSymbolIcon symbol={card.symbol} color={card.color} />
                  <p className="text-lg font-bold">{card.value}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  ));
  Piles.displayName = "Piles";

  return (
    <div className="flex flex-col gap-2 w-[70vw] h-[80vh] bg-green-800 rounded-md">
      <Header pack={pack} sequences={sequences} drawnCards={drawnCards} />
      <Piles piles={piles} />
    </div>
  );
}
