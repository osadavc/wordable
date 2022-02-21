import { motion } from "framer-motion";
import { FC, useEffect } from "react";
import ScrollLock from "react-scrolllock";

interface ModalBackdropProps {
  onClick: () => void;
}

const ModalBackdrop: FC<ModalBackdropProps> = ({ children, onClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ScrollLock>
      <motion.div
        className="absolute inset-0 z-50 flex max-h-screen items-center justify-center bg-black/20 backdrop-blur-[3px] dark:bg-black/40"
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          type: "spring",
          duration: 0.3,
        }}
      >
        {children}
      </motion.div>
    </ScrollLock>
  );
};

export default ModalBackdrop;
