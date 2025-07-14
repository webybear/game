import { GameEntity, ResourceType } from './generated';

export interface BattleResult {
  id: string;
  timestamp: Date;
  resourceType: ResourceType;
  leftEntity: GameEntity;
  rightEntity: GameEntity;
  winner: GameEntity | null;
  winnerPosition: 'left' | 'right' | null;
  winningAttribute: string | null;
  battleDuration: number; // in milliseconds
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  favoriteResource: ResourceType;
  totalBattles: number;
  wins: number;
  winStreak: number;
  bestWinStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  category: 'battles' | 'wins' | 'streak' | 'special';
  requirement: number;
  progress: number;
}

export interface Tournament {
  id: string;
  name: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'cancelled';
  rounds: TournamentRound[];
  winner: 'left' | 'right' | null;
  resourceType: ResourceType;
}

export interface TournamentRound {
  id: string;
  roundNumber: number;
  battle: BattleResult;
  completed: boolean;
}

export interface GameHistoryStats {
  totalBattles: number;
  totalWins: number;
  winRate: number;
  averageBattleDuration: number;
  favoriteResource: ResourceType;
  longestWinStreak: number;
  recentBattles: BattleResult[];
  battlesByResource: Record<ResourceType, number>;
  winsByResource: Record<ResourceType, number>;
} 