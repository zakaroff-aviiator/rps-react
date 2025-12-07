import { useState, useRef, useEffect } from 'react';
import type { Choice, Player, Result, GameMode } from '../types/game';
import { getRandomChoice, getRoundResult } from '../utils/gameLogic';
import { Scoreboard } from './Scoreboard';
import { PlayerPanel } from './PlayerPanel';
import { BackgroundFX } from './BackgroundFX';
import { LogoJanKenPon } from './LogoJanKenPon';

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

const MATCH_TARGET = 5; // first to 5 wins the match

export const Game = () => {
  const [mode, setMode] = useState<GameMode>('pvp');
  const [players, setPlayers] = useState<[Player, Player]>(initialPlayersPvp);
  const [result, setResult] = useState<Result>(null);
  const [round, setRound] = useState(1);
  const [isRevealing, setIsRevealing] = useState(false);
  const [bgPulse, setBgPulse] = useState(0);
  const [matchWinner, setMatchWinner] = useState<Player | null>(null);

  const revealIdRef = useRef(0);

  // sound refs
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const revealSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('/sounds/click.mp3');
    revealSoundRef.current = new Audio('/sounds/reveal.mp3');
    winSoundRef.current = new Audio('/sounds/win.mp3');
  }, []);

  const playSound = (ref: React.RefObject<HTMLAudioElement | null>) => {
    const el = ref.current;
    if (!el) return;
    try {
      el.currentTime = 0;
      void el.play();
    } catch {
      // ignore
    }
  };

  const resetForMode = (newMode: GameMode) => {
    setMode(newMode);
    if (newMode === 'pvp') setPlayers(initialPlayersPvp);
    if (newMode === 'pve') setPlayers(initialPlayersPve);
    if (newMode === 'cvc') setPlayers(initialPlayersCvc);
    setResult(null);
    setRound(1);
    setIsRevealing(false);
    setMatchWinner(null);
    revealIdRef.current = 0;
  };

  const handleNameChange = (playerId: 1 | 2, name: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, name } : p)) as [Player, Player]
    );
  };

  const resetMatch = () => {
    setPlayers(prev =>
      prev.map(p => ({ ...p, score: 0, currentChoice: null })) as [Player, Player]
    );
    setResult(null);
    setRound(1);
    setMatchWinner(null);
    revealIdRef.current = 0;
  };

  // ---------- Common reveal logic ----------
  const startReveal = (p1Choice: Choice, p2Choice: Choice) => {
    const myId = revealIdRef.current + 1;
    revealIdRef.current = myId;

    setIsRevealing(true);
    setResult(null);
    playSound(revealSoundRef);

    setTimeout(() => {
      if (revealIdRef.current !== myId) return;

      const roundResult = getRoundResult(p1Choice, p2Choice);
      setResult(roundResult);

      if (roundResult === 'p1' || roundResult === 'p2') {
        const winnerIndex = roundResult === 'p1' ? 0 : 1;
        setPlayers(prev => {
          const updated = prev.map((p, idx) =>
            idx === winnerIndex ? { ...p, score: p.score + 1 } : p
          ) as [Player, Player];

          // match win check
          if (updated[winnerIndex].score >= MATCH_TARGET) {
            setMatchWinner(updated[winnerIndex]);
            playSound(winSoundRef);
          }

          return updated;
        });
      }

      setBgPulse(prev => prev + 1);
      setIsRevealing(false);
    }, 900);
  };

  // ---------- PvP ----------
  const handleChoicePvp = (playerId: 1 | 2, choice: Choice) => {
    if (isRevealing || matchWinner) return;

    playSound(clickSoundRef);

    setPlayers(prev => {
      const updated = prev.map(p =>
        p.id === playerId ? { ...p, currentChoice: choice } : p
      ) as [Player, Player];

      const [p1, p2] = updated;
      if (p1.currentChoice && p2.currentChoice && !isRevealing) {
        startReveal(p1.currentChoice as Choice, p2.currentChoice as Choice);
      }

      return updated;
    });
  };

  // ---------- PvE ----------
  const handleChoicePve = (playerId: 1 | 2, choice: Choice) => {
    if (playerId !== 1 || isRevealing || matchWinner) return;

    playSound(clickSoundRef);

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
    if (result || isRevealing || matchWinner) return;

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
    if (result || isRevealing || matchWinner) return;

    if (mode === 'pvp') {
      handleChoicePvp(playerId, choice);
    } else if (mode === 'pve') {
      handleChoicePve(playerId, choice);
    }
  };

  const nextRound = () => {
    if (isRevealing || matchWinner) return;

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
      <BackgroundFX pulseKey={bgPulse} />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
          zIndex: 1,
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
              {/* Logo */}
              <LogoJanKenPon />

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
                    !!players[0].isComputer ||
                    !!matchWinner
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
                    !!players[1].isComputer ||
                    !!matchWinner
                  }
                  isRevealing={isRevealing}
                  side="right"
                  outcome={getPlayerOutcome(2)}
                />
              </Box>

              {/* Summary + controls */}
              <Stack spacing={1.5} alignItems="center" sx={{ pb: 1 }}>
                {result && !isRevealing && !matchWinner && (
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
                      disabled={!!result || isRevealing || !!matchWinner}
                    >
                      Play round
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={nextRound}
                    disabled={!result || isRevealing || !!matchWinner}
                  >
                    Next round
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {/* Victory overlay */}
        {matchWinner && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              background:
                'radial-gradient(circle at center, rgba(15,23,42,0.92), rgba(15,23,42,0.98))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Box
              sx={{
                px: 4,
                py: 3,
                borderRadius: 4,
                bgcolor: 'rgba(15,23,42,0.98)',
                border: '1px solid rgba(94,234,212,0.7)',
                boxShadow: '0 25px 60px rgba(15,23,42,1)',
                textAlign: 'center',
                maxWidth: 420,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#38bdf8',
                }}
              >
                Match Winner
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mt: 1,
                  fontWeight: 800,
                  color: '#f9fafb',
                  textShadow: '0 0 18px rgba(34,197,94,0.9)',
                }}
              >
                {matchWinner.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: '#cbd5f5' }}
              >
                First to {MATCH_TARGET} points.
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 3 }}
              >
                <Button variant="outlined" color="info" onClick={resetMatch}>
                  Play again
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => resetForMode(mode)}
                >
                  Reset mode
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
