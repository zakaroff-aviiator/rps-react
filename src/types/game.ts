export type Choice = 'rock' | 'paper' | 'scissors';

export type GameMode = 'pvp' | 'pve';

export interface Player {
  id: 1 | 2;
  name: string;
  score: number;
  currentChoice?: Choice | null;
  isComputer?: boolean;
}

export type Result = 'p1' | 'p2' | 'draw' | null;
