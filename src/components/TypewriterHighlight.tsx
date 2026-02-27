import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface TypewriterHighlightProps {
  text: string;
  delayMs?: number;
  speedMsPerChar?: number;
}

export const TypewriterHighlight: React.FC<TypewriterHighlightProps> = ({
  text,
  delayMs = 300,
  speedMsPerChar = 35,
}) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, speedMsPerChar);
    }, delayMs);

    return () => {
      clearTimeout(startTimeout);
      setVisibleChars(0);
    };
  }, [text, delayMs, speedMsPerChar]);

  if (!text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="inline-block px-3 py-2 rounded-xl bg-finomik-blue-soft text-finomik-primary font-extrabold text-lg md:text-xl tracking-tight"
    >
      {text.slice(0, visibleChars)}
      <span className="inline-block w-[1px] ml-0.5 bg-finomik-primary animate-pulse align-middle" />
    </motion.div>
  );
};

