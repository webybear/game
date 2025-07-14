import { useState, useCallback } from 'react';
import { Tournament, BattleResult } from '../types/game';
import { ResourceType } from '../types/generated';

export const useTournament = () => {
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startTournament = useCallback((resourceType: ResourceType, rounds: number) => {
    const tournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: getTournamentName(rounds),
      createdAt: new Date(),
      status: 'active',
      resourceType,
      winner: null,
      rounds: Array.from({ length: rounds }, (_, index) => ({
        id: `round-${index + 1}`,
        roundNumber: index + 1,
        battle: {} as BattleResult, // Will be filled when played
        completed: false,
      })),
    };

    setCurrentTournament(tournament);
  }, []);

  const playTournamentRound = useCallback(async (
    tournament: Tournament,
    roundIndex: number,
    playBattleFunction: () => Promise<BattleResult>
  ): Promise<BattleResult> => {
    setIsLoading(true);
    
    try {
      const battleResult = await playBattleFunction();
      
      // Update tournament with battle result
      const updatedTournament = {
        ...tournament,
        rounds: tournament.rounds.map((round, index) => {
          if (index === roundIndex) {
            return {
              ...round,
              battle: battleResult,
              completed: true,
            };
          }
          return round;
        }),
      };

      // Check if tournament is complete
      const completedRounds = updatedTournament.rounds.filter(r => r.completed).length;
      if (completedRounds >= updatedTournament.rounds.length) {
        // Calculate overall winner
        const results = updatedTournament.rounds.map(r => r.battle);
        const score = calculateTournamentScore(results);
        
        updatedTournament.status = 'completed';
        updatedTournament.winner = score.left > score.right ? 'left' : 
                                  score.right > score.left ? 'right' : null;
      }

      setCurrentTournament(updatedTournament);
      return battleResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const endTournament = useCallback(() => {
    setCurrentTournament(null);
  }, []);

  const getTournamentStats = useCallback(() => {
    if (!currentTournament) return null;

    const completedRounds = currentTournament.rounds.filter(r => r.completed);
    const results = completedRounds.map(r => r.battle);
    const score = calculateTournamentScore(results);

    return {
      totalRounds: currentTournament.rounds.length,
      completedRounds: completedRounds.length,
      score,
      winner: currentTournament.winner,
      isComplete: currentTournament.status === 'completed',
    };
  }, [currentTournament]);

  return {
    currentTournament,
    isLoading,
    startTournament,
    playTournamentRound,
    endTournament,
    getTournamentStats,
  };
};

// Helper functions
const getTournamentName = (rounds: number): string => {
  switch (rounds) {
    case 3: return 'Quick Championship';
    case 5: return 'Galactic Cup';
    case 7: return 'Emperor\'s Tournament';
    case 10: return 'Force Master Challenge';
    default: return `${rounds}-Round Tournament`;
  }
};

const calculateTournamentScore = (results: BattleResult[]): { left: number; right: number } => {
  return results.reduce(
    (acc, result) => {
      if (result.winnerPosition === 'left') acc.left++;
      else if (result.winnerPosition === 'right') acc.right++;
      return acc;
    },
    { left: 0, right: 0 }
  );
}; 