import React, { ReactNode } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';

interface MotionButtonProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
  }
  
  const MotionBlock: React.FC<MotionButtonProps> = ({ children, ...props }) => {
    const formVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 },
      };

  return (
    <AnimatePresence mode="wait">
            <motion.div
              {...props}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ width: "100%"}}
            >
                {children}
            </motion.div>
          </AnimatePresence>
  )
}

export default MotionBlock;