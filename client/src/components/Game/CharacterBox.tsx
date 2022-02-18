import { FC, useState, useEffect } from "react";
import usePrevious from "../../hooks/usePrevious";
import { LetterState } from "../../utils/wordUtils";
import { motion, useMotionValue } from "framer-motion";

interface CharacterBoxProps {
  value: string;
  state: LetterState;
}

const characterStyles = {
  [LetterState.Miss]: "!border-gray-500 from-gray-500 to-gray-700",
  [LetterState.Present]: "!border-yellow-500 from-yellow-500 to-yellow-700",
  [LetterState.Match]: "!border-green-500 from-green-500 to-green-700",
  [LetterState.Empty]: "",
};

const CharacterBox: FC<CharacterBoxProps> = ({ state, value }) => {
  const [stateStyles, setStateStyles] = useState("");
  const scale = useMotionValue(1);
  const previousValue = usePrevious(value);

  useEffect(() => {
    setStateStyles(state == null ? "" : characterStyles[state]);
  }, [state]);

  useEffect(() => {
    if (!previousValue && value && stateStyles == "" && state) {
      scale.set(1.15);

      setTimeout(() => {
        scale.set(1);
      }, 40);
    }
  }, [value, previousValue, scale, stateStyles, state]);

  return (
    <motion.div
      className={`flex w-full select-none items-center justify-center rounded border border-gray-500 bg-gradient-to-br pt-1 text-center text-2xl font-bold uppercase text-gray-100 ${stateStyles} ${
        value && "border-gray-300 transition-all"
      }`}
      style={{
        scale,
      }}
    >
      <span className="leading-none">{value}</span>
    </motion.div>
  );
};

export default CharacterBox;
