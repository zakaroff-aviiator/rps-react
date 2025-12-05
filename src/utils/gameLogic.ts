import type { Choice, Result } from '../types/game';

export const getRoundResult = (p1: Choice, p2: Choice): Result => {
  if (p1 === p2) return 'draw';

  const winsAgainst: Record<Choice, Choice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  if (winsAgainst[p1] === p2) return 'p1';
  return 'p2';
};
