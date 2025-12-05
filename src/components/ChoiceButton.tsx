import type { Choice } from '../types/game';

interface Props {
  choice: Choice;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const ChoiceButton = ({ choice, isActive, disabled, onClick }: Props) => {
  return (
    <button
      className={`choice-button ${isActive ? 'choice-button--active' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {choice}
    </button>
  );
};
