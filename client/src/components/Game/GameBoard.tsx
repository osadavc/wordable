import { FC, useEffect, useRef, useState } from "react";
import useGuess from "../../hooks/useGuess";
import useMediaQuery from "../../hooks/useMediaQuery";
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

  const isKeyboardRequired = useMediaQuery("(max-width: 1024px)");
  const [isKeyboardForceOpen, setIsKeyboardForceOpen] = useState(false);

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
    <div className="flex flex-col items-center">
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

      {(isKeyboardRequired || isKeyboardForceOpen) &&
        gameState == GameState.PLAYING && (
          <div className="mainBoard mb-10 !h-auto px-2 lg:mb-5">
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
        )}

      {gameState == GameState.PLAYING && (
        <button
          className="hidden rounded-md border border-zinc-800 py-1 px-3 pt-[0.38rem] text-zinc-800 dark:border-zinc-500 dark:text-zinc-200 lg:block"
          onClick={() => {
            setIsKeyboardForceOpen((prev) => !prev);
          }}
        >
          {isKeyboardForceOpen ? "Hide" : "Show"} Keyboard
        </button>
      )}
    </div>
  );
};

export default GameBoard;
