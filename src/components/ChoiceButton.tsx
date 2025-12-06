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

const choiceColor: Record<Choice, 'warning' | 'info' | 'error'> = {
  rock: 'warning',
  paper: 'info',
  scissors: 'error',
};

export const ChoiceButton = ({ choice, isActive, disabled, onClick }: Props) => {
  return (
    <Button
      variant={isActive ? 'contained' : 'outlined'}
      color={choiceColor[choice]}
      disabled={disabled}
      onClick={onClick}
      fullWidth
      sx={{
        borderRadius: 999,
        textTransform: 'none',
        justifyContent: 'flex-start',
        px: 2,
        py: 1,
        fontWeight: isActive ? 600 : 500,
      }}
    >
      {choiceLabels[choice]}
    </Button>
  );
};
