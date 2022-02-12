import { FC, useEffect, useRef, useState } from "react";
import useGuess from "../../hooks/useGuess";
import { GameState, GuessRow, useGameStateStore } from "../../stores/gameState";
import { API } from "../../services/APIClient";
import { MAX_GUESSES } from "../../utils/constants";
import InfoChip from "../Common/InfoChip";
import ResultPopup from "./ResultPopup";
import WordRow from "./WordRow";

interface GameBoardProps {
  previousGameState: {
    guesses: GuessRow[];
  };
}

const GameBoard: FC<GameBoardProps> = ({ previousGameState }) => {
  const {
    rows: gameStateRows,
    replaceGuesses,
    gameState,
  } = useGameStateStore();

  const [isInvalidWordOpen, setIsInvalidWordOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    if (!previousGameState) {
      useGameStateStore.setState({ gameState: GameState.PLAYING });
      return;
    }
    replaceGuesses(previousGameState.guesses);
  }, [previousGameState]);

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

  useEffect(() => {
    if (gameState != GameState.PLAYING) {
      if (gameState != GameState.WAITING) setIsResultOpen(true);
    } else {
      setIsResultOpen(false);
    }
  }, [gameState]);

  return (
    <div className="mx-auto max-w-[24rem] pt-36 font-josefin">
      <InfoChip text="Invalid Word" isOpened={isInvalidWordOpen} />
      <ResultPopup
        isOpened={isResultOpen}
        closePopup={() => {
          setIsResultOpen(false);
        }}
        didWin={gameState == GameState.WON && true}
      />

      <main className="grid grid-rows-6 gap-2">
        {rows.current.map(({ guess, result }, index) => (
          <WordRow key={index} letters={guess} result={result} />
        ))}
      </main>
    </div>
  );
};

export default GameBoard;
