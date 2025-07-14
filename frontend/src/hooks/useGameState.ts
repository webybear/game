import { useState, useCallback } from 'react';
import { ResourceType, GameEntity } from '../types/generated';

interface GameState {
  leftScore: number;
  rightScore: number;
  totalGames: number;
  selectedResource: ResourceType;
  currentRound: {
    entities: GameEntity[];
    winner: GameEntity | null;
    winnerPosition: 'left' | 'right' | null;
    winningAttribute: string | null;
  } | null;
  hasPlayed: boolean;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    leftScore: 0,
    rightScore: 0,
    totalGames: 0,
    selectedResource: ResourceType.People,
    currentRound: null,
    hasPlayed: false,
  });

  const setSelectedResource = useCallback((resource: ResourceType) => {
    setGameState(prev => ({
      ...prev,
      selectedResource: resource,
    }));
  }, []);

  const setCurrentRound = useCallback((round: GameState['currentRound']) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        currentRound: round,
        hasPlayed: true,
      };

      // Update scores if there's a winner
      if (round && round.winner && round.winnerPosition) {
        if (round.winnerPosition === 'left') {
          newState.leftScore = prev.leftScore + 1;
        } else if (round.winnerPosition === 'right') {
          newState.rightScore = prev.rightScore + 1;
        }
        newState.totalGames = prev.totalGames + 1;
      }

      return newState;
    });
  }, []);

  const resetScores = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      leftScore: 0,
      rightScore: 0,
      totalGames: 0,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      leftScore: 0,
      rightScore: 0,
      totalGames: 0,
      currentRound: null,
      hasPlayed: false,
    }));
  }, []);

  return {
    gameState,
    setSelectedResource,
    setCurrentRound,
    resetScores,
    resetGame,
  };
}; 