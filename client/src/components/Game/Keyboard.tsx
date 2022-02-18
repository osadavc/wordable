import { FC, MouseEvent } from "react";
import { useGameStateStore } from "../../stores/gameState";
import { characterStyles } from "./CharacterBox";
import { FiDelete } from "react-icons/fi";

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
    <div className="keyboard grid auto-rows-[3em] gap-1 text-white">
      {keyboardKeys.map((row, index) => (
        <>
          {row.map((key, index) => {
            const letterState = keyboardLetterState[key];
            const isNotBackSpace = key != "Backspace";

            return (
              <button
                className={`${
                  key && "col-span-2"
                } flex items-center justify-center rounded-md bg-gradient-to-br ${
                  isNotBackSpace ? "pt-1" : "pr-[0.1rem]"
                } text-lg font-bold uppercase ${
                  key &&
                  !characterStyles[letterState] &&
                  "from-gray-300 to-gray-600"
                } ${characterStyles[letterState]} ${
                  key.length > 1 && "col-span-3 text-xs"
                }`}
                key={index}
                onClick={onClick}
              >
                {isNotBackSpace ? key : <FiDelete className="h-7 w-7" />}
              </button>
            );
          })}
        </>
      ))}
    </div>
  );
};

export default Keyboard;
