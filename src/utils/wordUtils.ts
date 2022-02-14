import targetWords from "../words/target-words.json";
import dictionaryWords from "../words/dictionary.json";
import { GuessRow } from "../stores/gameState";

export enum LetterState {
  Miss = "Miss",
  Present = "Present",
  Match = "Match",
  Empty = "Empty",
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

const getOrdinal = (number: number) => {
  const ordinalRules = new Intl.PluralRules("en", {
    type: "ordinal",
  });
  const suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };

  const suffix =
    suffixes[ordinalRules.select(number) as "one" | "two" | "few" | "other"];
  return `${number}${suffix}`;
};

export const generateSvgImage = (
  wordIndex: number,
  resultArray: GuessRow[]
) => {
  const generatedResultArray = resultArray.concat(
    new Array(6 - resultArray.length).fill({
      result: [
        LetterState.Empty,
        LetterState.Empty,
        LetterState.Empty,
        LetterState.Empty,
        LetterState.Empty,
      ],
    })
  );

  const resultBoxList = generatedResultArray.map((row, i) => {
    return row?.result?.map(
      (result, j) =>
        `<rect x='${248 + j * (100 + 7)}' y="${
          250 + i * (100 + 7)
        }" width="100" height="100" rx="12" fill="${
          result == "Match"
            ? "#22C55E"
            : result == "Present"
            ? "#EAB308"
            : result == "Miss"
            ? "#6B7280"
            : ""
        }" stroke="${result == LetterState.Empty && "#6b7280"}"/>`
    );
  });

  const template = /*html*/ `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700);
	</style>
	<rect width="1024" height="1024" fill="#18181B" />
	${resultBoxList}
	<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Josefin Sans" font-size="48" font-weight="bold" letter-spacing="0em">
		<tspan x="371" y="112">
			WORDABLE
		</tspan>
	</text>
	<g>
		<text fill="#A1A1AA" width="1024" height="50" xml:space="preserve" style="white-space: pre" font-family="Josefin Sans" font-size="30" font-weight="bold" letter-spacing="0em">
			<tspan x="512" y="171.5" text-anchor="middle">
				${getOrdinal(wordIndex)} Word
			</tspan>
		</text>
	</g>
	<text fill="#A1A1AA" xml:space="preserve" style="white-space: pre" font-family="Josefin Sans" font-size="30" font-weight="bold" letter-spacing="0em">
		<tspan x="410" y="203.5">
			Won In ${resultArray.length} Tries
		</tspan>
	</text>
	<text fill="#A1A1AA" xml:space="preserve" style="white-space: pre" font-family="Josefin Sans" font-size="30" font-weight="bold" letter-spacing="0em">
		<tspan x="241" y="957.5">
			Play By Going To
		</tspan>
	</text>
	<text fill="#A1A1AA" xml:space="preserve" style="white-space: pre" font-family="Josefin Sans" font-size="30" font-weight="bold" letter-spacing="0em">
		<tspan x="494.564" y="957.5">
			wordable.netlify.app
		</tspan>
	</text>
</svg>
`;
};
