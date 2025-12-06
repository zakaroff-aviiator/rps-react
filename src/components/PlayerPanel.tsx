import type { Choice, Player } from '../types/game';
import { ChoiceButton } from './ChoiceButton';
import { Stack, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  player: Player;
  onChoice: (playerId: 1 | 2, choice: Choice) => void;
  disabled?: boolean;
  isRevealing: boolean;
  side: 'left' | 'right';
  outcome: 'win' | 'lose' | 'draw' | 'none';
}

const choices: Choice[] = ['rock', 'paper', 'scissors'];

const handEmojiForChoice = (choice?: Choice | null) => {
  switch (choice) {
    case 'rock':
      return '✊';
    case 'paper':
      return '✋';
    case 'scissors':
      return '✌️';
    default:
      return '❔';
  }
};

export const PlayerPanel = ({
  player,
  onChoice,
  disabled,
  isRevealing,
  side,
  outcome,
}: Props) => {
  const hasChosen = !!player.currentChoice;
  const showGenericDuringReveal = isRevealing && hasChosen;

  const displayedHand = showGenericDuringReveal
    ? '✊'
    : handEmojiForChoice(player.currentChoice);

  const handClass =
    'player-panel__hand ' +
    (showGenericDuringReveal
      ? side === 'left'
        ? 'player-panel__hand--animate-left'
        : 'player-panel__hand--animate-right'
      : '');

  // outcome-based animation (scale / slight shake / opacity)
  const outcomeAnimation =
    outcome === 'win'
      ? { scale: 1.04, y: -2, opacity: 1 }
      : outcome === 'lose'
      ? { scale: 0.96, y: 2, opacity: 0.7 }
      : outcome === 'draw'
      ? { scale: 1.02, y: 0, opacity: 1 }
      : { scale: 1, y: 0, opacity: 1 };

  // border color by outcome
  let borderColor = 'transparent';
  if (outcome === 'win') borderColor = 'rgba(34,197,94,0.9)';
  else if (outcome === 'lose') borderColor = 'rgba(248,113,113,0.7)';
  else if (outcome === 'draw') borderColor = 'rgba(148,163,184,0.7)';

  return (
    <motion.div
      initial={false}
      animate={outcomeAnimation}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{ flex: 1, display: 'flex' }}
    >
      <Box
        sx={{
          flex: 1,
          px: { xs: 1, md: 3 },
          py: { xs: 1.5, md: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background:
            'radial-gradient(circle at top, rgba(15,23,42,0.8), transparent 55%)',
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          boxShadow:
            outcome === 'win'
              ? '0 0 32px rgba(34,197,94,0.5)'
              : outcome === 'draw'
              ? '0 0 24px rgba(148,163,184,0.35)'
              : '0 0 18px rgba(15,23,42,0.9)',
        }}
      >
        <Box className={handClass} sx={{ mb: 1.5 }}>
          <motion.span
            key={player.currentChoice ?? 'none'}
            initial={!isRevealing ? { scale: 0.6, rotate: -8, opacity: 0 } : false}
            animate={!isRevealing ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 18,
            }}
            style={{ fontSize: '3.4rem', display: 'inline-block' }}
          >
            {displayedHand}
          </motion.span>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#f9fafb',
            textAlign: 'center',
          }}
        >
          {player.name}
        </Typography>

        <Stack spacing={1} sx={{ width: '100%', maxWidth: 320 }}>
          {choices.map((choice) => (
            <ChoiceButton
              key={choice}
              choice={choice}
              isActive={player.currentChoice === choice && !isRevealing}
              onClick={() => onChoice(player.id, choice)}
              disabled={disabled}
            />
          ))}
        </Stack>
      </Box>
    </motion.div>
  );
};
