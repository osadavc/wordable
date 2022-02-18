import create from "zustand";
import { MAX_GUESSES } from "../utils/constants";
import { LetterState } from "../utils/wordUtils";

interface GameStateStoreInterface {
  rows: GuessRow[];
  addGuesses: (
    guess: string,
    result: LetterState[],
    shouldReplace?: boolean
  ) => void;
  replaceGuesses: (guessList: GuessRow[]) => void;
  removeLastGuess: () => void;
  gameState: GameState;
  isResultOpen: boolean;
  setIsResultOpen: (isOpen: boolean) => void;
}

export interface GuessRow {
  guess: string;
  result?: LetterState[];
}

export enum GameState {
  PLAYING,
  WON,
  LOST,
  WAITING,
}

export const useGameStateStore = create<GameStateStoreInterface>(
  (set, get) => ({
    rows: [],
    gameState: GameState.WAITING,
    addGuesses: (
      guess: string,
      result: LetterState[],
      shouldReplace = false
    ) => {
      const rows = !shouldReplace
        ? [...get().rows, { guess, result }]
        : get().rows.map((row, i) =>
            i === get().rows.length - 1 ? { guess, result } : row
          );
      const didWin = shouldReplace
        ? result.every((letter) => letter === LetterState.Match)
        : false;

      set(() => ({
        rows,
        gameState: didWin
          ? GameState.WON
          : rows.length == MAX_GUESSES && shouldReplace
          ? GameState.LOST
          : GameState.PLAYING,
      }));
    },
    replaceGuesses: (guessList: GuessRow[]) => {
      const didWin = guessList[guessList.length - 1].result!.every(
        (letter) => letter === LetterState.Match
      );

      set(() => ({
        rows: guessList,
        gameState: didWin ? GameState.WON : GameState.LOST,
      }));
    },
    removeLastGuess: () => {
      const rows = [...get().rows];
      rows.pop();

      set(() => ({
        rows,
      }));
    },
    isResultOpen: false,
    setIsResultOpen: (isOpen: boolean) => {
      set(() => ({
        isResultOpen: isOpen,
      }));
    },
  })
);
