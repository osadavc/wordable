import { useRef, useState } from "react";
import useGuess from "../../hooks/useGuess";
import { GuessRow, useGameStateStore } from "../../stores/gameState";
import { MAX_GUESSES } from "../../utils/constants";
import { getWordEmojiGrid } from "../../utils/wordUtils";
import InfoChip from "../Common/InfoChip";
import WordRow from "./WordRow";

const GameBoard = () => {
  const gameStateRows = useGameStateStore((state) => state.rows);
  const [isInvalidWordOpen, setIsInvalidWordOpen] = useState(false);

  const handleInvalidWord = () => {
    setIsInvalidWordOpen(true);
    setTimeout(() => {
      setIsInvalidWordOpen(false);
    }, 1500);
  };

  const { guess } = useGuess({ handleInvalidWord });
  const rows = useRef<GuessRow[]>([...gameStateRows]);

  rows.current = [...gameStateRows];

  if (rows.current.length < MAX_GUESSES) {
    rows.current.push({
      guess,
    });
  }
  rows.current = rows.current.concat(
    Array(MAX_GUESSES - rows.current.length).fill("")
  );

  return (
    <div className="mx-auto w-96 pt-36 font-josefin">
      <InfoChip text="Invalid Word" isOpened={isInvalidWordOpen} />
      <main className="grid grid-rows-6 gap-2">
        {rows.current.map(({ guess, result }, index) => (
          <WordRow key={index} letters={guess} result={result} />
        ))}
        <button
          onClick={() => {
            navigator.clipboard.writeText(getWordEmojiGrid(gameStateRows));
          }}
        >
          COPY
        </button>
      </main>
    </div>
  );
};

export default GameBoard;
