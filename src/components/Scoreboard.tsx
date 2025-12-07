import type { Player, Result } from '../types/game';
import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  players: [Player, Player];
  round: number;
  result: Result;
}

export const Scoreboard = ({ players, round, result }: Props) => {
  const [p1, p2] = players;

  const scoreVariants = {
    initial: { scale: 0.7, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };

  const lastResultText =
    result === 'draw'
      ? 'DRAW'
      : result === 'p1'
      ? `LAST: ${p1.name}`
      : result === 'p2'
      ? `LAST: ${p2.name}`
      : '';

  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: 'auto',
        px: 3,
        py: 1.5,
        borderRadius: 3,
        // blended background, no hard border
        bgcolor: 'rgba(15,23,42,0.85)',
        boxShadow: '0 14px 40px rgba(15,23,42,0.9)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
        gap={2}
      >
        {/* LEFT SIDE – Player 1 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {p1.name}
          </Typography>

          <motion.div
            key={p1.score}
            variants={scoreVariants}
            initial="initial"
            animate="animate"
            transition={{ type: 'spring', stiffness: 280, damping: 16 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 800,
                color: '#f97316',
                textShadow: '0 0 16px rgba(249,115,22,0.9)',
                lineHeight: 1,
              }}
            >
              {p1.score}
            </Typography>
          </motion.div>
        </Box>

        {/* CENTER INFO – Round & last result */}
        <Box
          sx={{
            minWidth: 140,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: 'rgba(15,23,42,0.95)',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#a5b4fc',
            }}
          >
            ROUND
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#e5e7eb',
              lineHeight: 1.2,
            }}
          >
            {round}
          </Typography>
          {result && (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                color: '#e5e7eb',
                maxWidth: 150,
                textAlign: 'center',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              }}
            >
              {lastResultText}
            </Typography>
          )}
        </Box>

        {/* RIGHT SIDE – Player 2 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'right',
            }}
          >
            {p2.name}
          </Typography>

          <motion.div
            key={p2.score}
            variants={scoreVariants}
            initial="initial"
            animate="animate"
            transition={{ type: 'spring', stiffness: 280, damping: 16 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 800,
                color: '#22c55e',
                textShadow: '0 0 16px rgba(34,197,94,0.9)',
                lineHeight: 1,
              }}
            >
              {p2.score}
            </Typography>
          </motion.div>
        </Box>
      </Stack>
    </Box>
  );
};
