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

const initialPlayersCvc: [Player, Player] = [
  { id: 1, name: 'Computer 1', score: 0, currentChoice: null, isComputer: true },
  { id: 2, name: 'Computer 2', score: 0, currentChoice: null, isComputer: true },
];

export const Game = () => {
  const [mode, setMode] = useState<GameMode>('pvp');
  const [players, setPlayers] = useState<[Player, Player]>(initialPlayersPvp);
  const [result, setResult] = useState<Result>(null);
  const [round, setRound] = useState(1);

  const resetForMode = (newMode: GameMode) => {
    setMode(newMode);
    if (newMode === 'pvp') setPlayers(initialPlayersPvp);
    if (newMode === 'pve') setPlayers(initialPlayersPve);
    if (newMode === 'cvc') setPlayers(initialPlayersCvc);
    setResult(null);
    setRound(1);
  };

  const handleNameChange = (playerId: 1 | 2, name: string) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId ? { ...p, name } : p
      ) as [Player, Player]
    );
  };

  // ---------- PvP ----------
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

  // ---------- PvE ----------
  const handleChoicePve = (playerId: 1 | 2, choice: Choice) => {
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

  // ---------- CvC ----------
  const playComputerRound = () => {
    if (result) return;

    const choice1 = getRandomChoice();
    const choice2 = getRandomChoice();

    setPlayers(prev => {
      const updated: [Player, Player] = [
        { ...prev[0], currentChoice: choice1 },
        { ...prev[1], currentChoice: choice2 },
      ];

      const roundResult = getRoundResult(choice1, choice2);
      setResult(roundResult);

      if (roundResult === 'p1' || roundResult === 'p2') {
        const winnerIndex = roundResult === 'p1' ? 0 : 1;
        updated[winnerIndex] = {
          ...updated[winnerIndex],
          score: updated[winnerIndex].score + 1,
        };
      }

      return updated;
    });
  };

  // ---------- Dispatcher ----------
  const handleChoice = (playerId: 1 | 2, choice: Choice) => {
    if (result) return;

    if (mode === 'pvp') {
      handleChoicePvp(playerId, choice);
    } else if (mode === 'pve') {
      handleChoicePve(playerId, choice);
    } else {
      return;
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

    const winner = result === 'p1' ? players[0] : players[1];
    return `${winner.name} wins this round!`;
  };

  const isComputerVsComputer = mode === 'cvc';

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
          <option value="cvc">Computer vs Computer</option>
        </select>
      </div>

      <div className="game__names">
        {players.map(p => (
          <div key={p.id} className="game__name-field">
            <label htmlFor={`player-name-${p.id}`}>Player {p.id} name</label>
            <input
              id={`player-name-${p.id}`}
              type="text"
              value={p.name}
              onChange={(e) => handleNameChange(p.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <Scoreboard players={players} round={round} result={result} />

      <div className="game__players">
        <PlayerPanel
          player={players[0]}
          onChoice={handleChoice}
          disabled={!!result || isComputerVsComputer || !!players[0].isComputer}
        />
        <PlayerPanel
          player={players[1]}
          onChoice={handleChoice}
          disabled={!!result || isComputerVsComputer || !!players[1].isComputer}
        />
      </div>

      {result && (
        <div className="game__result">{renderResultText()}</div>
      )}

      {isComputerVsComputer && (
        <button
          className="game__play"
          onClick={playComputerRound}
          disabled={!!result}
        >
          Play round
        </button>
      )}

      <button className="game__next" onClick={nextRound} disabled={!result}>
        Next round
      </button>
    </div>
  );
};
