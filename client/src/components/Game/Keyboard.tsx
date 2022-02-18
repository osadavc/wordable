import { FC, MouseEvent } from "react";
import { useGameStateStore } from "../../stores/gameState";
import { characterStyles } from "./CharacterBox";

const keyboardKeys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["", "a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

interface KeyboardProps {
  onClick: (letter: string) => void;
}

const Keyboard: FC<KeyboardProps> = ({ onClick: onClickProp }) => {
  const keyboardLetterState = useGameStateStore(
    (state) => state.keyboardLetterState
  );

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { textContent } = event.currentTarget;
    if (!textContent) return;

    onClickProp(textContent);
  };

  return (
    <div className="flex flex-col text-white">
      {keyboardKeys.map((row, index) => (
        <div key={index} className="my-[0.26rem] flex justify-center space-x-1">
          {row.map((key, index) => {
            const letterState = keyboardLetterState[key];

            return (
              <button
                className={`flex-1 rounded-md bg-gradient-to-br py-[0.45rem] pt-3 text-lg font-bold uppercase ${
                  key &&
                  !characterStyles[letterState] &&
                  "from-gray-300 to-gray-600"
                } ${characterStyles[letterState]} ${
                  key.length > 1 && "text-sm"
                }`}
                key={index}
                onClick={onClick}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
