import { motion } from 'framer-motion';

interface NeonFistProps {
  direction: 'left' | 'right'; // where the knuckles face
}

export const NeonFist = ({ direction }: NeonFistProps) => {
  const isRight = direction === 'right';

  return (
    <motion.svg
      width="110"
      height="110"
      viewBox="0 0 120 120"
      initial={false}
      style={{
        filter: 'drop-shadow(0 0 18px rgba(56,189,248,0.7))',
        transform: isRight ? 'scaleX(1)' : 'scaleX(-1)',
      }}
    >
      <defs>
        <linearGradient id="fistFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path
        d="M20 60C20 38 32 25 50 25h30c14 0 22 8 22 20 0 9-3 16-9 20-4 3-10 5-17 5H50C32 70 20 82 20 60Z"
        fill="url(#fistFill)"
        stroke="#92400e"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};
