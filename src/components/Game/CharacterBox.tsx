import { FC, useState, useEffect } from "react";
import usePrevious from "../../hooks/usePrevious";
import { LetterState } from "../../utils/wordUtils";
import { motion, useMotionValue } from "framer-motion";

interface CharacterBoxProps {
  value: string;
  state: LetterState;
}

const characterStyles = {
  [LetterState.Miss]: "!border-gray-500 bg-gray-500",
  [LetterState.Present]: "!border-yellow-500 bg-yellow-500",
  [LetterState.Match]: "!border-green-500 bg-green-500",
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
      className={`rounded border border-gray-500 p-4 pt-5 text-center text-2xl font-bold uppercase text-gray-100 before:inline-block before:content-['_'] ${stateStyles} ${
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
