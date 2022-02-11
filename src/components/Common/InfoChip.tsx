import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";

interface InfoChipProps {
  text: string;
  isOpened: boolean;
}

const InfoChip: FC<InfoChipProps> = ({ text, isOpened }) => {
  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      {isOpened && (
        <motion.div
          className="absolute top-20 right-[50%] z-50 rounded-md bg-zinc-200 px-4 py-2 pt-3 text-lg shadow-md"
          initial={{
            y: "-100vh",
            x: "50%",
          }}
          animate={{
            y: 0,
            x: "50%",
          }}
          exit={{
            y: "-100vh",
            x: "50%",
          }}
          transition={{
            bounce: 0.3,
            type: "spring",
            duration: 0.5,
          }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoChip;
