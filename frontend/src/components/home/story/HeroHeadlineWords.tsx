'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LINES = [
  { words: ['Where', 'The', 'Future'], accent: false },
  { words: ['Appears', 'First'], accent: true },
] as const;

export default function HeroHeadlineWords() {
  const reduced = useReducedMotion();
  let wordIndex = 0;

  if (reduced) {
    return (
      <h1 className="nw-hero3-headline font-display font-bold leading-[0.95] tracking-[-0.04em] text-white">
        <span className="block">Where The Future</span>
        <span className="block nw-hero3-headline-accent">Appears First</span>
      </h1>
    );
  }

  return (
    <h1 className="nw-hero3-headline font-display font-bold leading-[0.95] tracking-[-0.04em] text-white">
      {LINES.map((line) => (
        <span key={line.words.join('-')} className="block">
          {line.accent ? (
            <span className="nw-hero3-headline-accent">
              {line.words.map((word) => {
                const i = wordIndex++;
                return (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.12 + i * 0.07 }}
                    className="mr-[0.28em] inline-block last:mr-0"
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          ) : (
            line.words.map((word) => {
              const i = wordIndex++;
              return (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.12 + i * 0.07 }}
                  className="mr-[0.28em] inline-block last:mr-0"
                >
                  {word}
                </motion.span>
              );
            })
          )}
        </span>
      ))}
    </h1>
  );
}
