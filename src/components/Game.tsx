import { useState } from 'react';
import type { Choice, Player, Result, GameMode } from '../types/game';
import { getRandomChoice, getRoundResult } from '../utils/gameLogic';
import { Scoreboard } from './Scoreboard';
import { PlayerPanel } from './PlayerPanel';

const choiceDisplay: Record<Choice, string> = {
  rock: '✊ Rock',
  paper: '✋ Paper',
  scissors: '✌️ Scissors',
};

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
  const [isRevealing, setIsRevealing] = useState(false); // for hand animation

  const resetForMode = (newMode: GameMode) => {
    setMode(newMode);
    if (newMode === 'pvp') setPlayers(initialPlayersPvp);
    if (newMode === 'pve') setPlayers(initialPlayersPve);
    if (newMode === 'cvc') setPlayers(initialPlayersCvc);
    setResult(null);
    setRound(1);
    setIsRevealing(false);
  };

  const handleNameChange = (playerId: 1 | 2, name: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, name } : p)) as [Player, Player]
    );
  };

  // common reveal logic with hand animation
  const startReveal = (p1Choice: Choice, p2Choice: Choice) => {
    setIsRevealing(true);
    setResult(null);

    // 0.9s = duration of the hand shake animation
    setTimeout(() => {
      const roundResult = getRoundResult(p1Choice, p2Choice);
      setResult(roundResult);

      if (roundResult === 'p1' || roundResult === 'p2') {
        const winnerId = roundResult === 'p1' ? 1 : 2;
        setPlayers(prev =>
          prev.map(p =>
            p.id === winnerId ? { ...p, score: p.score + 1 } : p
          ) as [Player, Player]
        );
      }

      setIsRevealing(false);
    }, 900);
  };

  // ---------- PvP ----------
  const handleChoicePvp = (playerId: 1 | 2, choice: Choice) => {
    if (isRevealing) return;

    setPlayers(prev => {
      const updated = prev.map(p =>
        p.id === playerId ? { ...p, currentChoice: choice } : p
      ) as [Player, Player];

      const [p1, p2] = updated;

      if (p1.currentChoice && p2.currentChoice) {
        startReveal(p1.currentChoice as Choice, p2.currentChoice as Choice);
      }

      return updated;
    });
  };

  // ---------- PvE ----------
  const handleChoicePve = (playerId: 1 | 2, choice: Choice) => {
    if (playerId !== 1 || isRevealing) return;

    const computerChoice = getRandomChoice();

    setPlayers(prev => {
      const updated = prev.map(p => {
        if (p.id === 1) return { ...p, currentChoice: choice };
        if (p.id === 2) return { ...p, currentChoice: computerChoice };
        return p;
      }) as [Player, Player];

      startReveal(choice, computerChoice);

      return updated;
    });
  };

  // ---------- CvC ----------
  const playComputerRound = () => {
    if (result || isRevealing) return;

    const choice1 = getRandomChoice();
    const choice2 = getRandomChoice();

    setPlayers(prev => {
      const updated: [Player, Player] = [
        { ...prev[0], currentChoice: choice1 },
        { ...prev[1], currentChoice: choice2 },
      ];

      startReveal(choice1, choice2);

      return updated;
    });
  };

  // ---------- Dispatcher ----------
  const handleChoice = (playerId: 1 | 2, choice: Choice) => {
    if (result || isRevealing) return;

    if (mode === 'pvp') {
      handleChoicePvp(playerId, choice);
    } else if (mode === 'pve') {
      handleChoicePve(playerId, choice);
    } else {
      // cvc: human doesn’t click choices
      return;
    }
  };

  const nextRound = () => {
    if (isRevealing) return;

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
          disabled={isRevealing}
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
              disabled={isRevealing}
            />
          </div>
        ))}
      </div>

      <Scoreboard players={players} round={round} result={result} />

      <div className="game__players">
        <PlayerPanel
          player={players[0]}
          onChoice={handleChoice}
          disabled={
            !!result ||
            isRevealing ||
            isComputerVsComputer ||
            !!players[0].isComputer
          }
          isRevealing={isRevealing}
          side="left"
        />
        <PlayerPanel
          player={players[1]}
          onChoice={handleChoice}
          disabled={
            !!result ||
            isRevealing ||
            isComputerVsComputer ||
            !!players[1].isComputer
          }
          isRevealing={isRevealing}
          side="right"
        />
      </div>

      {/* show result & choices only after animation */}
      {result && !isRevealing && (
        <div className="game__summary">
          <div className="game__result">{renderResultText()}</div>
          <div className="game__choices">
            {players.map((p) => (
              <div key={p.id} className="game__choice">
                <span className="game__choice-name">{p.name}</span>
                <span className="game__choice-value">
                  {p.currentChoice ? choiceDisplay[p.currentChoice] : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isComputerVsComputer && (
        <button
          className="game__play"
          onClick={playComputerRound}
          disabled={!!result || isRevealing}
        >
          Play round
        </button>
      )}

      <button
        className="game__next"
        onClick={nextRound}
        disabled={!result || isRevealing}
      >
        Next round
      </button>
    </div>
  );
};
