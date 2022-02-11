import { useEffect, useRef, useState } from "react";
import useGuess from "../../hooks/useGuess";
import { GameState, GuessRow, useGameStateStore } from "../../stores/gameState";
import { API } from "../../utils/axios";
import { MAX_GUESSES } from "../../utils/constants";
import InfoChip from "../Common/InfoChip";
import WordRow from "./WordRow";

const GameBoard = () => {
  const { rows: gameStateRows, replaceGuesses } = useGameStateStore();
  const [isInvalidWordOpen, setIsInvalidWordOpen] = useState(false);

  useEffect(() => {
    API.get("/get-previous-rows").then(({ data }) => {
      if (!data.gameState) {
        useGameStateStore.setState({ gameState: GameState.PLAYING });
        return;
      }
      replaceGuesses(data.gameState.guesses);
    });
  }, []);

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
      </main>
    </div>
  );
};

export default GameBoard;
