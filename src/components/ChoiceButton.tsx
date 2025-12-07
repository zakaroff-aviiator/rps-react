import type { Choice } from '../types/game';
import { Button } from '@mui/material';

interface Props {
  choice: Choice;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const choiceLabels: Record<Choice, string> = {
  rock: '✊ Rock',
  paper: '✋ Paper',
  scissors: '✌️ Scissors',
};

export const ChoiceButton = ({ choice, isActive, disabled, onClick }: Props) => {
  const activeBgByChoice: Record<Choice, string> = {
    rock: 'rgba(248,113,113,0.22)',
    paper: 'rgba(56,189,248,0.22)',
    scissors: 'rgba(244,114,182,0.22)',
  };

  return (
    <Button
      fullWidth
      disabled={disabled}
      onClick={onClick}
      variant="text"
      disableElevation
      disableRipple
      sx={{
        justifyContent: 'flex-start',
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.95rem',

        py: 1,
        px: 1.4,
        borderRadius: 999,

        // absolutely no border
        border: 'none',
        outline: 'none',

        backgroundColor: isActive
          ? activeBgByChoice[choice]
          : 'rgba(15,23,42,0.7)',

        boxShadow: isActive
          ? '0 0 16px rgba(94,234,212,0.55)'
          : '0 0 0 rgba(0,0,0,0)',

        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.22s ease-out',

        color: '#e5e7eb',

        '&:hover': {
          backgroundColor: disabled
            ? 'rgba(15,23,42,0.7)'
            : 'rgba(148,163,184,0.32)',
          transform: disabled ? 'scale(1)' : 'scale(1.03)',
          boxShadow: disabled
            ? '0 0 0 rgba(0,0,0,0)'
            : '0 0 18px rgba(94,234,212,0.45)',
        },

        // kill browser / MUI focus ring
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
        '&:focus-visible': {
          outline: 'none',
          boxShadow: isActive
            ? '0 0 16px rgba(94,234,212,0.55)'
            : 'none',
        },

        '&.Mui-disabled': {
          opacity: 0.5,
          boxShadow: 'none',
          cursor: 'default',
        },
      }}
    >
      {choiceLabels[choice]}
    </Button>
  );
};
