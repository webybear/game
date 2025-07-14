import { useState, useEffect, useCallback } from 'react';
import { BattleResult, GameHistoryStats, PlayerProfile } from '../types/game';
import { ResourceType } from '../types/generated';

const STORAGE_KEYS = {
  BATTLES: 'star-wars-game-battles',
  PLAYER_PROFILE: 'star-wars-game-player-profile',
} as const;

const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  id: 'default-player',
  name: 'Padawan',
  avatar: '👤',
  createdAt: new Date(),
  favoriteResource: ResourceType.People,
  totalBattles: 0,
  wins: 0,
  winStreak: 0,
  bestWinStreak: 0,
};

export const useGameHistory = () => {
  const [battles, setBattles] = useState<BattleResult[]>([]);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(DEFAULT_PLAYER_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        // Load battles
        const savedBattles = localStorage.getItem(STORAGE_KEYS.BATTLES);
        if (savedBattles) {
          const parsedBattles = JSON.parse(savedBattles);
          // Convert timestamp strings back to Date objects
          const battlesWithDates = parsedBattles.map((battle: BattleResult) => ({
            ...battle,
            timestamp: new Date(battle.timestamp),
          }));
          setBattles(battlesWithDates);
        }

        // Load player profile
        const savedProfile = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setPlayerProfile({
            ...parsedProfile,
            createdAt: new Date(parsedProfile.createdAt),
          });
        }
      } catch (error) {
        console.error('Error loading game history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save battles to localStorage
  const saveBattles = useCallback((battlesToSave: BattleResult[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BATTLES, JSON.stringify(battlesToSave));
    } catch (error) {
      console.error('Error saving battles:', error);
    }
  }, []);

  // Save player profile to localStorage
  const savePlayerProfile = useCallback((profile: PlayerProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving player profile:', error);
    }
  }, []);

  // Add a new battle to history
  const addBattle = useCallback((battle: BattleResult) => {
    setBattles(prev => {
      const updated = [battle, ...prev].slice(0, 1000); // Keep only last 1000 battles
      saveBattles(updated);
      return updated;
    });

    // Update player profile
    setPlayerProfile(prev => {
      const isWin = battle.winner !== null;
      const newWinStreak = isWin ? prev.winStreak + 1 : 0;
      const updated = {
        ...prev,
        totalBattles: prev.totalBattles + 1,
        wins: prev.wins + (isWin ? 1 : 0),
        winStreak: newWinStreak,
        bestWinStreak: Math.max(prev.bestWinStreak, newWinStreak),
      };
      savePlayerProfile(updated);
      return updated;
    });
  }, [saveBattles, savePlayerProfile]);

  // Update player profile
  const updatePlayerProfile = useCallback((updates: Partial<PlayerProfile>) => {
    setPlayerProfile(prev => {
      const updated = { ...prev, ...updates };
      savePlayerProfile(updated);
      return updated;
    });
  }, [savePlayerProfile]);

  // Get battle statistics
  const getStats = useCallback((): GameHistoryStats => {
    const totalBattles = battles.length;
    const totalWins = battles.filter(b => b.winner !== null).length;
    const winRate = totalBattles > 0 ? (totalWins / totalBattles) * 100 : 0;
    
    const averageBattleDuration = totalBattles > 0 
      ? battles.reduce((sum, b) => sum + b.battleDuration, 0) / totalBattles 
      : 0;

    const battlesByResource = battles.reduce((acc, battle) => {
      acc[battle.resourceType] = (acc[battle.resourceType] || 0) + 1;
      return acc;
    }, {} as Record<ResourceType, number>);

    const winsByResource = battles
      .filter(b => b.winner !== null)
      .reduce((acc, battle) => {
        acc[battle.resourceType] = (acc[battle.resourceType] || 0) + 1;
        return acc;
      }, {} as Record<ResourceType, number>);

    const favoriteResource = Object.entries(battlesByResource).reduce(
      (a, b) =>
        battlesByResource[a[0] as ResourceType] >
        battlesByResource[b[0] as ResourceType]
          ? a
          : b,
      [ResourceType.People, 0],
    )[0] as ResourceType;

    return {
      totalBattles,
      totalWins,
      winRate,
      averageBattleDuration,
      favoriteResource,
      longestWinStreak: playerProfile.bestWinStreak,
      recentBattles: battles.slice(0, 10),
      battlesByResource,
      winsByResource,
    };
  }, [battles, playerProfile.bestWinStreak]);

  // Get battles by resource type
  const getBattlesByResource = useCallback((resourceType: ResourceType): BattleResult[] => {
    return battles.filter(battle => battle.resourceType === resourceType);
  }, [battles]);

  // Get recent battles
  const getRecentBattles = useCallback((limit = 10): BattleResult[] => {
    return battles.slice(0, limit);
  }, [battles]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setBattles([]);
    setPlayerProfile(DEFAULT_PLAYER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.BATTLES);
    localStorage.removeItem(STORAGE_KEYS.PLAYER_PROFILE);
  }, []);

  // Export history as JSON
  const exportHistory = useCallback(() => {
    const exportData = {
      battles,
      playerProfile,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `star-wars-game-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [battles, playerProfile]);

  return {
    battles,
    playerProfile,
    isLoading,
    addBattle,
    updatePlayerProfile,
    getStats,
    getBattlesByResource,
    getRecentBattles,
    clearHistory,
    exportHistory,
  };
}; 