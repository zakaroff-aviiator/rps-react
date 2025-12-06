import { useState } from 'react';
import type { Choice, Player, Result, GameMode } from '../types/game';
import { getRandomChoice, getRoundResult } from '../utils/gameLogic';
import { Scoreboard } from './Scoreboard';
import { PlayerPanel } from './PlayerPanel';

const initialPlayersPvp: [Player, Player] = [
  { id: 1, name: 'Player 1', score: 0, currentChoice: null, isComputer: false },
  { id: 2, name: 'Player 2', score: 0, currentChoice: null, isComputer: false },
];

const initialPlayersPve: [Player, Player] = [
  { id: 1, name: 'You', score: 0, currentChoice: null, isComputer: false },
  { id: 2, name: 'Computer', score: 0, currentChoice: null, isComputer: true },
];

export const Game = () => {
  const [mode, setMode] = useState<GameMode>('pvp');
  const [players, setPlayers] = useState<[Player, Player]>(initialPlayersPvp);
  const [result, setResult] = useState<Result>(null);
  const [round, setRound] = useState(1);

  const resetForMode = (newMode: GameMode) => {
    setMode(newMode);
    setPlayers(newMode === 'pvp' ? initialPlayersPvp : initialPlayersPve);
    setResult(null);
    setRound(1);
  };

  const handleChoicePvp = (playerId: 1 | 2, choice: Choice) => {
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

  const handleChoicePve = (playerId: 1 | 2, choice: Choice) => {
    // Only Player 1 is allowed to choose in PvE
    if (playerId !== 1) return;

    const computerChoice = getRandomChoice();

    setPlayers(prev => {
      const updated = prev.map(p => {
        if (p.id === 1) return { ...p, currentChoice: choice };
        if (p.id === 2) return { ...p, currentChoice: computerChoice };
        return p;
      }) as [Player, Player];

      const [p1, p2] = updated;

      const roundResult = getRoundResult(
        p1.currentChoice as Choice,
        p2.currentChoice as Choice
      );
      setResult(roundResult);

      if (roundResult === 'p1' || roundResult === 'p2') {
        const winnerId = roundResult === 'p1' ? 1 : 2;
        return updated.map(p =>
          p.id === winnerId ? { ...p, score: p.score + 1 } : p
        ) as [Player, Player];
      }

      return updated;
    });
  };

  const handleChoice = (playerId: 1 | 2, choice: Choice) => {
    if (result) return; // don’t allow new choices after result, wait for next round

    if (mode === 'pvp') {
      handleChoicePvp(playerId, choice);
    } else {
      handleChoicePve(playerId, choice);
    }
  };

  const nextRound = () => {
    setPlayers(prev =>
      prev.map(p => ({ ...p, currentChoice: null })) as [Player, Player]
    );
    setResult(null);
    setRound(r => r + 1);
  };

  const renderResultText = () => {
    if (!result) return null;

    if (result === 'draw') return 'Draw!';

    const winner =
      result === 'p1'
        ? players[0]
        : players[1];

    return `${winner.name} wins this round!`;
  };

  return (
    <div className="game">
      <h1 className="game__title">Rock · Paper · Scissors</h1>

      <div className="game__mode">
        <label htmlFor="mode">Mode: </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => resetForMode(e.target.value as GameMode)}
        >
          <option value="pvp">Player vs Player</option>
          <option value="pve">Player vs Computer</option>
        </select>
      </div>

      <Scoreboard players={players} round={round} result={result} />

      <div className="game__players">
        <PlayerPanel
          player={players[0]}
          onChoice={handleChoice}
          disabled={!!result}
        />
        <PlayerPanel
          player={players[1]}
          onChoice={handleChoice}
          disabled={!!result || !!players[1].isComputer} // computer "panel" is read-only
        />
      </div>

      {result && (
        <div className="game__result">{renderResultText()}</div>
      )}

      <button className="game__next" onClick={nextRound} disabled={!result}>
        Next round
      </button>
    </div>
  );
};
