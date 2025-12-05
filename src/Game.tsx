import { useState } from 'react';
import type { Choice, Player, Result } from '../types/game';
import { getRoundResult } from '../utils/gameLogic';
import { Scoreboard } from './Scoreboard';
import { PlayerPanel } from './PlayerPanel';

const initialPlayers: [Player, Player] = [
  { id: 1, name: 'Player 1', score: 0, currentChoice: null },
  { id: 2, name: 'Player 2', score: 0, currentChoice: null },
];

export const Game = () => {
  const [players, setPlayers] = useState<[Player, Player]>(initialPlayers);
  const [result, setResult] = useState<Result>(null);
  const [round, setRound] = useState(1);

  const handleChoice = (playerId: 1 | 2, choice: Choice) => {
    setPlayers(prev => {
      const updated = prev.map(p =>
        p.id === playerId ? { ...p, currentChoice: choice } : p
      ) as [Player, Player];

      const [p1, p2] = updated;

      if (p1.currentChoice && p2.currentChoice) {
        const roundResult = getRoundResult(p1.currentChoice, p2.currentChoice);
        setResult(roundResult);

        if (roundResult === 'p1' || roundResult === 'p2') {
          const winnerId = roundResult === 'p1' ? 1 : 2;
          return updated.map(p =>
            p.id === winnerId ? { ...p, score: p.score + 1 } : p
          ) as [Player, Player];
        }
      }

      return updated;
    });
  };

  const nextRound = () => {
    setPlayers(prev =>
      prev.map(p => ({ ...p, currentChoice: null })) as [Player, Player]
    );
    setResult(null);
    setRound(r => r + 1);
  };

  return (
    <div className="game">
      <h1 className="game__title">Rock · Paper · Scissors</h1>

      <Scoreboard players={players} round={round} result={result} />

      <div className="game__players">
        <PlayerPanel player={players[0]} onChoice={handleChoice} disabled={!!result} />
        <PlayerPanel player={players[1]} onChoice={handleChoice} disabled={!!result} />
      </div>

      {result && (
        <div className="game__result">
          {result === 'draw'
            ? 'Draw!'
            : `${result === 'p1' ? players[0].name : players[1].name} wins this round!`}
        </div>
      )}

      <button className="game__next" onClick={nextRound} disabled={!result}>
        Next round
      </button>
    </div>
  );
};
