import type { Choice, Player } from '../types/game';
import { ChoiceButton } from './ChoiceButton';

interface Props {
  player: Player;
  onChoice: (playerId: 1 | 2, choice: Choice) => void;
  disabled?: boolean;
}

const choices: Choice[] = ['rock', 'paper', 'scissors'];

export const PlayerPanel = ({ player, onChoice, disabled }: Props) => {
  return (
    <div className="player-panel">
      <h2 className="player-panel__name">{player.name}</h2>
      <div className="player-panel__choices">
        {choices.map(choice => (
          <ChoiceButton
            key={choice}
            choice={choice}
            isActive={player.currentChoice === choice}
            onClick={() => onChoice(player.id, choice)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
