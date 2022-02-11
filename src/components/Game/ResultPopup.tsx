import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalBackdrop from "../Common/ModalBackdrop";
import { useGameStateStore } from "../../stores/gameState";

interface ResultPopupProps {
  isOpened: boolean;
  closePopup: () => void;
  didWin: boolean;
}

const ResultPopup: FC<ResultPopupProps> = ({
  isOpened,
  didWin,
  closePopup,
}) => {
  const wonRow = useGameStateStore(
    (state) => state.rows[state.rows.length - 1]
  );

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      {isOpened && (
        <ModalBackdrop onClick={closePopup}>
          <motion.div
            className="modal absolute z-50 rounded-md bg-zinc-800 pt-3 text-lg text-white shadow-md"
            onClick={(e) => e.stopPropagation()}
            initial={{
              y: "-100vh",
            }}
            animate={{
              y: "0",
            }}
            exit={{
              y: "-100vh",
            }}
            transition={{
              bounce: 0.3,
              type: "spring",
              duration: 0.5,
            }}
          >
            <div className="flex flex-col items-center p-5">
              <h3 className="text-2xl">You {didWin ? "Won !" : "Loosed"}</h3>
              <p className="mb-5 leading-none text-zinc-400">
                {didWin
                  ? "Awesome! Keep It Up"
                  : "Don't Worry Try Again Next Time!"}
              </p>

              <div className="mb-11 flex space-x-2">
                {wonRow.guess.split("").map((letter, index) => (
                  <CharacterBoxForResult value={letter} key={index} />
                ))}
              </div>

              <div className="mb-3 flex w-[22rem] flex-col space-y-2">
                <button className="rounded bg-sky-500 py-2 pt-3 focus:ring focus:ring-sky-500/20">
                  Tweet Your Win
                </button>
                <button className="rounded bg-pink-600 py-2 pt-3 focus:ring focus:ring-pink-500/20">
                  Generate An Exclusive NFT
                </button>
              </div>
            </div>
          </motion.div>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

const CharacterBoxForResult = ({ value }: { value: string }) => {
  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded border !border-green-500 bg-green-500 pt-1 text-center text-2xl font-bold uppercase text-gray-100`}
    >
      <span className="leading-none">{value}</span>
    </div>
  );
};

export default ResultPopup;
