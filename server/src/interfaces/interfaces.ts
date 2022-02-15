export interface GuessRow {
  guess: string;
  result?: LetterState[];
}

export enum LetterState {
  Miss = "Miss",
  Present = "Present",
  Match = "Match",
  Empty = "Empty",
}
