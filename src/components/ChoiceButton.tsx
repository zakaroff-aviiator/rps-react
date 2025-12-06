import type { Choice } from '../types/game';

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
  return (
    <button
      className={`choice-button choice-button--${choice} ${isActive ? 'choice-button--active' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {choiceLabels[choice]}
    </button>
  );
};
