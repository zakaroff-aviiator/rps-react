import type { Player, Result } from '../types/game';

interface Props {
  players: [Player, Player];
  round: number;
  result: Result;
}

export const Scoreboard = ({ players, round, result }: Props) => {
  return (
    <div className="scoreboard">
      <div className="scoreboard__round">Round: {round}</div>
      <div className="scoreboard__scores">
        <span>{players[0].name}: {players[0].score}</span>
        <span>{players[1].name}: {players[1].score}</span>
      </div>
      {result && (
        <div className="scoreboard__status">
          Last result: {result}
        </div>
      )}
    </div>
  );
};
