import { useState } from 'react';
import type { Choice, Player, Result, GameMode } from '../types/game';
import { getRandomChoice, getRoundResult } from '../utils/gameLogic';
import { Scoreboard } from './Scoreboard';
import { PlayerPanel } from './PlayerPanel';
import { BackgroundFX } from './BackgroundFX';

import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';

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

type PlayerOutcome = 'win' | 'lose' | 'draw' | 'none';

export const Game = () => {
  const [mode, setMode] = useState<GameMode>('pvp');
  const [players, setPlayers] = useState<[Player, Player]>(initialPlayersPvp);
  const [result, setResult] = useState<Result>(null);
  const [round, setRound] = useState(1);
  const [isRevealing, setIsRevealing] = useState(false);
  const [bgPulse, setBgPulse] = useState(0); // drives cyber flash

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

  const startReveal = (p1Choice: Choice, p2Choice: Choice) => {
    setIsRevealing(true);
    setResult(null);

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

      // trigger cyber arena flash on every completed round
      setBgPulse((prev) => prev + 1);

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

  const handleChoice = (playerId: 1 | 2, choice: Choice) => {
    if (result || isRevealing) return;

    if (mode === 'pvp') {
      handleChoicePvp(playerId, choice);
    } else if (mode === 'pve') {
      handleChoicePve(playerId, choice);
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

  const getPlayerOutcome = (playerId: 1 | 2): PlayerOutcome => {
    if (!result) return 'none';
    if (result === 'draw') return 'draw';
    const winnerId = result === 'p1' ? 1 : 2;
    return playerId === winnerId ? 'win' : 'lose';
  };

  return (
    <>
      {/* background lives behind everything */}
      <BackgroundFX pulseKey={bgPulse} />

    <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
          zIndex: 1,  // IMPORTANT: game above background
        }}
      >
        <Box sx={{ width: '100vw' }}>
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              px: { xs: 2, md: 4 },
            }}
          >
            <Stack
              spacing={3}
              sx={{
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Rock · Paper · Scissors
              </Typography>

              {/* Mode + names */}
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="mode-label">Mode</InputLabel>
                  <Select
                    labelId="mode-label"
                    id="mode"
                    value={mode}
                    label="Mode"
                    onChange={(e) => resetForMode(e.target.value as GameMode)}
                    disabled={isRevealing}
                  >
                    <MenuItem value="pvp">Player vs Player</MenuItem>
                    <MenuItem value="pve">Player vs Computer</MenuItem>
                    <MenuItem value="cvc">Computer vs Computer</MenuItem>
                  </Select>
                </FormControl>

                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{ flex: 1 }}
                >
                  {players.map((p) => (
                    <TextField
                      key={p.id}
                      size="small"
                      label={`Player ${p.id} name`}
                      value={p.name}
                      onChange={(e) => handleNameChange(p.id, e.target.value)}
                      disabled={isRevealing}
                      sx={{ flex: 1, minWidth: 0 }}
                    />
                  ))}
                </Stack>
              </Stack>

              {/* Scoreboard */}
              <Scoreboard players={players} round={round} result={result} />

              {/* Arena */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
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
                  outcome={getPlayerOutcome(1)}
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
                  outcome={getPlayerOutcome(2)}
                />
              </Box>

              {/* Summary + controls */}
              <Stack spacing={1.5} alignItems="center" sx={{ pb: 1 }}>
                {result && !isRevealing && (
                  <Box>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ fontWeight: 700, color: '#f9fafb' }}
                    >
                      {renderResultText()}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      justifyContent="center"
                      sx={{ mt: 0.5 }}
                    >
                      {players.map((p) => (
                        <Box
                          key={p.id}
                          sx={{
                            px: 1.5,
                            py: 0.4,
                            borderRadius: 999,
                            bgcolor: 'rgba(15,23,42,0.7)',
                            border: '1px solid rgba(94,234,212,0.5)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <strong>{p.name}:</strong>{' '}
                          <span style={{ color: '#a5b4fc' }}>
                            {p.currentChoice ? choiceDisplay[p.currentChoice] : '—'}
                          </span>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Stack direction="row" spacing={2} justifyContent="center">
                  {isComputerVsComputer && (
                    <Button
                      variant="contained"
                      color="info"
                      onClick={playComputerRound}
                      disabled={!!result || isRevealing}
                    >
                      Play round
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={nextRound}
                    disabled={!result || isRevealing}
                  >
                    Next round
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
};
