import { FC, useEffect, useRef, useState } from "react";
import useGuess from "../../hooks/useGuess";
import { GameState, GuessRow, useGameStateStore } from "../../stores/gameState";
import { MAX_GUESSES } from "../../utils/constants";
import InfoChip from "../Common/InfoChip";
import Keyboard from "./Keyboard";
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
    isResultOpen,
    setIsResultOpen,
  } = useGameStateStore();

  const [isInvalidWordOpen, setIsInvalidWordOpen] = useState(false);

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

  const { guess, onKeyDown } = useGuess({ handleInvalidWord });
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
    <div>
      <InfoChip text="Invalid Word" isOpened={isInvalidWordOpen} />
      <ResultPopup
        isOpened={isResultOpen}
        closePopup={() => {
          setIsResultOpen(false);
        }}
        didWin={gameState == GameState.WON}
        didLoose={gameState == GameState.LOST}
      />

      <main className="mainBoard grid grid-rows-6 gap-[5px] p-[10px]">
        {rows.current.map(({ guess, result }, index) => (
          <WordRow key={index} letters={guess} result={result} />
        ))}
      </main>

      <div className="px-2">
        <Keyboard
          onClick={(letter) => {
            onKeyDown(
              new KeyboardEvent("keydown", {
                key: letter,
                altKey: false,
                ctrlKey: false,
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default GameBoard;
