import type { Player, Result } from '../types/game';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  players: [Player, Player];
  round: number;
  result: Result;
}

export const Scoreboard = ({ players, round, result }: Props) => {
  const [p1, p2] = players;

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderRadius: 999,
        bgcolor: 'rgba(15,23,42,0.75)',
        border: '1px solid rgba(56,189,248,0.5)',
        maxWidth: 480,
        mx: 'auto',
      }}
    >
      <Stack spacing={0.5} alignItems="center">
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: '#38bdf8',
          }}
        >
          Round {round}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
              {p1.name}
            </Typography>
            <motion.span
              key={p1.score}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <Chip label={p1.score} color="primary" size="small" />
            </motion.span>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
              {p2.name}
            </Typography>
            <motion.span
              key={p2.score}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <Chip label={p2.score} color="primary" size="small" />
            </motion.span>
          </Stack>
        </Stack>

        {result && (
          <Typography variant="caption" sx={{ color: '#e5e7eb' }}>
            Last result:{' '}
            {result === 'draw'
              ? 'Draw'
              : result === 'p1'
              ? p1.name
              : p2.name}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
