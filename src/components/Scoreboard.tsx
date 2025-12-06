import type { Player, Result } from '../types/game';

interface Props {
  players: [Player, Player];
  round: number;
  result: Result;
}

export const Scoreboard = ({ players, round, result }: Props) => {
  return (
    <div className="scoreboard">
      <div className="scoreboard__round">Round {round}</div>
      <div className="scoreboard__scores">
        <div className="scoreboard__player">
          <span className="scoreboard__name">{players[0].name}</span>
          <span className="scoreboard__badge">{players[0].score}</span>
        </div>
        <div className="scoreboard__player">
          <span className="scoreboard__name">{players[1].name}</span>
          <span className="scoreboard__badge">{players[1].score}</span>
        </div>
      </div>
      {result && (
        <div className="scoreboard__status">
          Last result: {result === 'draw' ? 'Draw' : result === 'p1' ? players[0].name : players[1].name}
        </div>
      )}
    </div>
  );
};
