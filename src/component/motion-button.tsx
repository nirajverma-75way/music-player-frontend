import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MotionButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
}

const MotionButton: React.FC<MotionButtonProps> = ({ children, ...props }) => {
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      style={{
        marginTop: 16,
        marginBottom: 16,
        padding: "12px 25px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#1976d2",
        color: "white",
        cursor: "pointer",
      }}
      {...props} // Pass all the props correctly
    >
      {children}
    </motion.button>
  );
};

export default MotionButton;
