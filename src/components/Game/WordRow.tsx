import { FC, useState, useEffect } from "react";
import { WORD_LENGTH } from "../../utils/constants";
import { LetterState } from "../../utils/wordUtils";
import CharacterBox from "./CharacterBox";

interface WordRowProps {
  letters: string;
  result?: LetterState[];
}

const WordRow: FC<WordRowProps> = ({
  letters: lettersProp = "",
  result = [],
}) => {
  const [lettersRemaining, setLettersRemaining] = useState(
    WORD_LENGTH - lettersProp.length
  );
  const [letters, setLetters] = useState(
    lettersProp.split("").concat(Array(lettersRemaining).fill(""))
  );

  useEffect(() => {
    setLettersRemaining(WORD_LENGTH - lettersProp.length);
  }, [lettersProp]);

  useEffect(() => {
    setLetters(lettersProp.split("").concat(Array(lettersRemaining).fill("")));
  }, [lettersRemaining, lettersProp]);

  return (
    <div className="grid grid-cols-5 gap-[5px]">
      {letters.slice(0, 5).map((letter, index) => (
        <CharacterBox key={index} value={letter} state={result[index]} />
      ))}
    </div>
  );
};

export default WordRow;
