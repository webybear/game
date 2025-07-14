'use client';

import { Container, Typography, Box, Grid, Alert, Snackbar, useMediaQuery, useTheme, Paper } from '@mui/material';
import { useState, useCallback } from 'react';
import { useGetRandomPairQuery } from '../types/generated';
import { useGameState } from '../hooks/useGameState';
import { determineWinner } from '../utils/gameLogic';
import GameCard from '../components/GameCard';
import ResourceSelector from '../components/ResourceSelector';
import Scoreboard from '../components/Scoreboard';
import PlayButton from '../components/PlayButton';
import VictoryAnimation from '../components/VictoryAnimation';
import GameStats from '../components/GameStats';
import { GamePageSkeleton } from '../components/GameLoadingSkeleton';
import TieAnimation from '../components/TieAnimation';

export default function StarWarsCardGame() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { gameState, setSelectedResource, setCurrentRound, resetScores } = useGameState();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);
  const [showTieAnimation, setShowTieAnimation] = useState(false);
  const [victoryData, setVictoryData] = useState<{
    winner: 'left' | 'right';
    winnerName: string;
    winningAttribute: string;
  } | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { loading, error, refetch } = useGetRandomPairQuery({
    variables: { resource: gameState.selectedResource },
    skip: true, // We'll manually trigger the query
  });

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleResourceChange = useCallback((resource: typeof gameState.selectedResource) => {
    setSelectedResource(resource);
  }, [gameState, setSelectedResource]);

  const handlePlay = useCallback(async () => {
    try {
      const result = await refetch();
      
      if (result.data?.getRandomPair) {
        const gameRound = result.data.getRandomPair;
        const entities = gameRound.entities;
        
        if (entities.length >= 2) {
          // Use our own winner logic to be sure
          const winnerData = determineWinner(entities);
          
          setCurrentRound({
            entities: entities,
            winner: winnerData.winner,
            winnerPosition: winnerData.winnerPosition,
            winningAttribute: winnerData.winningAttribute,
          });

          // Delay showing victory animation to allow user to see cards
          setTimeout(() => {
            if (winnerData.winner && winnerData.winnerPosition) {
              setVictoryData({
                winner: winnerData.winnerPosition,
                winnerName: winnerData.winner.name,
                winningAttribute:
                  winnerData.winningAttribute || 'superior power',
              });
              setShowVictoryAnimation(true);
            } else {
              // It's a tie
              setShowTieAnimation(true);
            }
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Error fetching random pair:', err);
      setAlertMessage('Failed to fetch battle data. Please try again.');
      setShowAlert(true);
    }
  }, [refetch, setCurrentRound]);

  const handleVictoryAnimationComplete = useCallback(() => {
    setShowVictoryAnimation(false);
    setVictoryData(null);
  }, []);

  const handleTieAnimationComplete = useCallback(() => {
    setShowTieAnimation(false);
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const leftEntity = gameState.currentRound?.entities[0] || null;
  const rightEntity = gameState.currentRound?.entities[1] || null;

  // Show loading skeleton on first load
  if (!gameStarted) {
    return (
      <Container maxWidth="lg">
        <GamePageSkeleton
          playButton={
            <PlayButton
              onPlay={handleStartGame}
              isLoading={false}
              hasPlayed={false}
              disabled={false}
            />
          }
        />
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ py: isMobile ? 2 : 4 }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ mb: isMobile ? 2 : 4 }}
          >
            Star Wars Card Game
          </Typography>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="h2" 
            gutterBottom 
            align="center" 
            color="text.secondary" 
            sx={{ mb: isMobile ? 2 : 4 }}
          >
            People vs Starships Battle Arena
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error loading data: {error.message}. Make sure your backend is running!
            </Alert>
          )}

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box>
              <ResourceSelector
                selectedResource={gameState.selectedResource}
                onResourceChange={handleResourceChange}
                disabled={loading}
              />

              <Scoreboard
                leftScore={gameState.leftScore}
                rightScore={gameState.rightScore}
                onResetScores={resetScores}
                totalGames={gameState.totalGames}
              />

              <PlayButton 
                onPlay={handlePlay} 
                isLoading={loading}
                hasPlayed={gameState.hasPlayed}
                disabled={loading} 
              />

              {/* Game Cards */}
              <Grid container spacing={isMobile ? 2 : 4} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <GameCard 
                    entity={leftEntity}
                    isWinner={!!leftEntity && !!gameState.currentRound?.winner && gameState.currentRound.winner.id === leftEntity.id}
                    isLoading={loading}
                    position="left"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4" component="p">VS</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <GameCard 
                    entity={rightEntity}
                    isWinner={!!rightEntity && !!gameState.currentRound?.winner && gameState.currentRound.winner.id === rightEntity.id}
                    isLoading={loading}
                    position="right"
                  />
                </Grid>
              </Grid>

              {/* Game Stats */}
              <Box sx={{ mt: 4 }}>
                <GameStats 
                  leftScore={gameState.leftScore}
                  rightScore={gameState.rightScore}
                  totalGames={gameState.totalGames}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>

      {showVictoryAnimation && victoryData && (
        <VictoryAnimation
          winner={victoryData.winner}
          winnerName={victoryData.winnerName}
          winningAttribute={victoryData.winningAttribute}
          onAnimationComplete={handleVictoryAnimationComplete}
        />
      )}

      {showTieAnimation && (
        <TieAnimation onAnimationComplete={handleTieAnimationComplete} />
      )}
      
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
