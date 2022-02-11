import { motion } from "framer-motion";
import { FC } from "react";

interface ModalBackdropProps {
  onClick: () => void;
}

const ModalBackdrop: FC<ModalBackdropProps> = ({ children, onClick }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[3px]"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default ModalBackdrop;
