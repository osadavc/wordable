import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { WORD_LENGTH } from "../utils/constants";
import usePrevious from "./usePrevious";
import axios from "axios";
import { GameState, useGameStateStore } from "../stores/gameState";
import NProgress from "nprogress";

const { NEXT_PUBLIC_API_URL } = process.env;
axios.defaults.withCredentials = true;

interface useGuessProps {
  handleInvalidWord: () => void;
}

const useGuess = ({ handleInvalidWord }: useGuessProps): { guess: string } => {
  const [guess, setGuess] = useState("");
  const noKeyboardListeners = useRef(false);
  const previousGuess = usePrevious(guess);

  const addGuesses = useGameStateStore((store) => store.addGuesses);
  const gameStateRows = useGameStateStore((state) => state.rows);
  const gamePlayerState = useGameStateStore((state) => state.gameState);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    noKeyboardListeners.current = gamePlayerState == GameState.WON;
  }, [gamePlayerState]);

  useEffect(() => {
    if (guess.length == 0 && previousGuess?.length == WORD_LENGTH) {
      NProgress.start();
      axios
        .post(
          `${NEXT_PUBLIC_API_URL}.netlify/functions/check-daily-word?guess=${previousGuess.toLowerCase()}`,
          { rows: gameStateRows }
        )
        .then((res) => {
          addGuesses(previousGuess, res.data.result);
          NProgress.done();
        })
        .catch((err) => {
          setGuess(previousGuess);
          if (err?.response?.data?.error == "Guess Is Not A Valid Word") {
            handleInvalidWord();
          }
          NProgress.done();
        });
    }
  }, [guess, previousGuess, addGuesses, handleInvalidWord]);

  const onKeyDown = (event: KeyboardEvent) => {
    const letter = event.key;
    const { ctrlKey, altKey } = event;

    if (ctrlKey || altKey || noKeyboardListeners.current) return;

    setGuess((curGuess) => {
      const newGuess =
        letter.length === 1 &&
        curGuess.length !== WORD_LENGTH &&
        letter.match(/[a-z]/i)
          ? curGuess + letter
          : curGuess;

      switch (letter) {
        case "Backspace":
          return newGuess.slice(0, -1);
        case "Enter":
          if (newGuess.length === WORD_LENGTH) {
            return "";
          }
      }

      if (newGuess.length === WORD_LENGTH) {
        return newGuess;
      }

      return newGuess;
    });
  };

  return { guess };
};

export default useGuess;
