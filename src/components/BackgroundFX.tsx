import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface BackgroundFXProps {
  pulseKey: number; // increments when a round result appears
}

export const BackgroundFX = ({ pulseKey }: BackgroundFXProps) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,              // sits behind main game, above body
        background: 'transparent',
      }}
    >
      {/* Subtle cyan glow drifting on the left */}
      <motion.div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.55), transparent 60%)',
          top: -200,
          left: -250,
        }}
        animate={{ x: [-100, 60, -100], y: [-60, 30, -60] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle magenta / violet glow on the right */}
      <motion.div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.5), transparent 60%)',
          bottom: -250,
          right: -250,
        }}
        animate={{ x: [80, -40, 80], y: [40, -30, 40] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cyber arena flash on round end */}
      <motion.div
        key={pulseKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(94,234,212,0.8), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
    </Box>
  );
};
