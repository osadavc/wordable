import targetWords from "../words/target-words.json";
import dictionaryWords from "../words/dictionary.json";
import { GuessRow } from "../stores/gameState";

export enum LetterState {
  Miss = "Miss",
  Present = "Present",
  Match = "Match",
}

export const getTodaysWord = (): {
  word: string;
  wordOfTheDayIndex: number;
} => {
  const dayOffset = (Date.now() - +new Date(2022, 0, 1)) / 1000 / 60 / 60 / 24;
  const wordIndex = Math.floor(dayOffset) % targetWords.length;
  const word = targetWords[wordIndex];

  return {
    word,
    wordOfTheDayIndex: wordIndex,
  };
};

export const computeGuess = (
  guess: string,
  answerString: string
): LetterState[] => {
  const result: LetterState[] = [];

  if (guess.length !== answerString.length) {
    return result;
  }

  const guessArray = guess.split("");
  const answerArray = answerString.split("");
  const answerLetterCount: Record<string, number> = {};

  guessArray.forEach((letter, index) => {
    const currentAnswerLetter = answerArray[index];

    answerLetterCount[currentAnswerLetter] = answerLetterCount[
      currentAnswerLetter
    ]
      ? answerLetterCount[currentAnswerLetter] + 1
      : 1;

    if (letter == answerArray[index]) {
      result.push(LetterState.Match);
    } else if (answerArray.includes(letter)) {
      result.push(LetterState.Present);
    } else {
      result.push(LetterState.Miss);
    }
  });

  result.forEach((curResult, resultIndex) => {
    if (curResult !== LetterState.Present) {
      return;
    }

    const guessLetter = guessArray[resultIndex];

    answerArray.forEach((currentAnswerLetter, answerIndex) => {
      if (currentAnswerLetter !== guessLetter) {
        return;
      }

      if (result[answerIndex] === LetterState.Match) {
        result[resultIndex] = LetterState.Miss;
      }

      if (answerLetterCount[guessLetter] <= 0) {
        result[resultIndex] = LetterState.Miss;
      }
    });

    answerLetterCount[guessLetter]--;
  });

  return result;
};

export const isValidWord = (word: string): boolean => {
  return dictionaryWords.includes(word);
};

export const getWordEmojiGrid = (guess: GuessRow[]) => {
  return guess
    .map((i) =>
      i?.result?.map((j) => {
        switch (j) {
          case "Match":
            return "🟩";
          case "Miss":
            return "⬛";
          case "Present":
            return "🟨";
        }
      })
    )
    .map((i) => i?.join(""))
    .join("\n");
};
