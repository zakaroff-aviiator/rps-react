import type { Choice, Player } from '../types/game';
import { ChoiceButton } from './ChoiceButton';

interface Props {
  player: Player;
  onChoice: (playerId: 1 | 2, choice: Choice) => void;
  disabled?: boolean;
  isRevealing: boolean;
  side: 'left' | 'right';
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
}: Props) => {
  const hasChosen = !!player.currentChoice;
  const showGenericDuringReveal = isRevealing && hasChosen;

  // During reveal: always show a generic ✊ moving hand
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

  return (
    <div className="player-panel">
      <div className={handClass}>{displayedHand}</div>

      <h2 className="player-panel__name">{player.name}</h2>

      <div className="player-panel__choices">
        {choices.map((choice) => (
          <ChoiceButton
            key={choice}
            choice={choice}
            isActive={player.currentChoice === choice && !isRevealing}
            onClick={() => onChoice(player.id, choice)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
