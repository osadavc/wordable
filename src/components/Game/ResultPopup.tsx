import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalBackdrop from "../Common/ModalBackdrop";

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
  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      {isOpened && (
        <ModalBackdrop onClick={closePopup}>
          <motion.div
            className="modal absolute z-50 rounded-md bg-zinc-200 pt-3 text-lg shadow-md"
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
            <div>You {didWin ? "WON" : "DEFEAT"}</div>
          </motion.div>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default ResultPopup;
