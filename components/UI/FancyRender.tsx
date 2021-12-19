import { motion } from "framer-motion";
import React, { Children } from "react";

function FancyRender(props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 70,
      }}
      exit={{ opacity: 0 }}
    >

        {props.children}
    </motion.div>
  );
}

export default FancyRender;
