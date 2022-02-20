import { GuessRow, LetterState } from "../interfaces/interfaces";
import targetWords from "../words/target-words.json";

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

  const template = /*html*/ `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="//www.w3.org/2000/svg">
	<style>
		@import url(//fonts.googleapis.com/css2?family=Josefin+Sans:wght@700);
	</style>
	<rect width="1024" height="1024" fill="#18181B" />
	${resultBoxList}
	<text fill="white" xml:space="default" style="white-space: normal" font-family="Josefin Sans" font-size="48" font-weight="bold" letter-spacing="0em">
		<tspan x="371" y="112">WORDABLE</tspan>
	</text>
	<g>
		<text fill="#A1A1AA" width="1024" height="50" xml:space="default" style="white-space: normal" font-family="Josefin Sans" font-size="30" font-weight="bold" letter-spacing="0em">
			<tspan x="512" y="171.5" text-anchor="middle">${getOrdinal(
        wordIndex
      )} Word</tspan>
		</text>
	</g>
	<text fill="#A1A1AA" xml:space="default" style="white-space: normal" font-family="Josefin Sans" font-size="30" font-weight="bold" letter-spacing="0em">
		<tspan x="410" y="203.5">
			Won In ${resultArray.length} Tries
		</tspan>
	</text>
	<g>
    <text fill="#A1A1AA" xml:space="default" style="white-space: normal" font-family="Josefin Sans" width="1024" height="50" font-size="30" font-weight="bold" letter-spacing="0em">
		<tspan y="957.5" x="512" text-anchor="middle">Play By Going To wordable.weoffersolution.com</tspan>
	</text>
</g>
	
</svg>
`;

  return template;
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
