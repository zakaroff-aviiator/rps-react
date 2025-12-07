import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface BackgroundFXProps {
  pulseKey: number;
}

export const BackgroundFX = ({ pulseKey }: BackgroundFXProps) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'radial-gradient(circle at top, #020617 0%, #020617 60%, #020617 100%)',
      }}
    >
      {/* drifting cyan glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.45), transparent 60%)',
          top: -200,
          left: -260,
        }}
        animate={{ x: [-100, 60, -100], y: [-60, 30, -60] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* drifting magenta glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.45), transparent 60%)',
          bottom: -260,
          right: -260,
        }}
        animate={{ x: [80, -40, 80], y: [40, -30, 40] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* round flash */}
      <motion.div
        key={pulseKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(94,234,212,0.7), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* subtle big 「じゃん」 on the left */}
      <Box
        sx={{
          position: 'absolute',
          left: '8%',
          top: '55%',
          transform: 'translateY(-50%)',
          fontSize: { xs: '4rem', md: '9rem' },
          fontWeight: 700,
          color: 'rgba(148,163,184,0.08)',
          letterSpacing: '0.1em',
        }}
      >
        じゃん
      </Box>

      {/* subtle big 「ぽん」 on the right */}
      <Box
        sx={{
          position: 'absolute',
          right: '8%',
          top: '45%',
          transform: 'translateY(-50%)',
          fontSize: { xs: '4rem', md: '9rem' },
          fontWeight: 700,
          color: 'rgba(148,163,184,0.08)',
          letterSpacing: '0.1em',
        }}
      >
        ぽん
      </Box>
    </Box>
  );
};
