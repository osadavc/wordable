import create from "zustand";
import { MAX_GUESSES } from "../utils/constants";
import { LetterState } from "../utils/wordUtils";

interface GameStateStoreInterface {
  rows: GuessRow[];
  addGuesses: (guess: string, result: LetterState[]) => void;
  gameState: GameState;
}

export interface GuessRow {
  guess: string;
  result?: LetterState[];
}

export enum GameState {
  PLAYING,
  WON,
  LOST,
}

export const useGameStateStore = create<GameStateStoreInterface>(
  (set, get) => ({
    rows: [],
    gameState: GameState.PLAYING,
    addGuesses: (guess: string, result: LetterState[]) => {
      const rows = [...get().rows, { guess, result }];
      const didWin = result.every((letter) => letter === LetterState.Match);

      set(() => ({
        rows,
        gameState: didWin
          ? GameState.WON
          : rows.length == MAX_GUESSES
          ? GameState.LOST
          : GameState.PLAYING,
      }));
    },
  })
);
