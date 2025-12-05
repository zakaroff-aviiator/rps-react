export type Choice = 'rock' | 'paper' | 'scissors';

export interface Player {
  id: 1 | 2;
  name: string;
  score: number;
  currentChoice?: Choice | null;
}

export type Result = 'p1' | 'p2' | 'draw' | null;
