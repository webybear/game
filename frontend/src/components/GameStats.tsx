import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Analytics,
  Timer,
  EmojiEvents,
} from '@mui/icons-material';

interface GameStatsProps {
  leftScore: number;
  rightScore: number;
  totalGames: number;
  averageGameTime?: number;
  bestStreak?: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  leftScore,
  rightScore,
  totalGames,
  averageGameTime = 0,
  bestStreak = 0,
}) => {
  const leftWinRate = totalGames > 0 ? (leftScore / totalGames) * 100 : 0;
  const rightWinRate = totalGames > 0 ? (rightScore / totalGames) * 100 : 0;
  const isLeftDominating = leftWinRate > 70;
  const isRightDominating = rightWinRate > 70;
  const isBalanced = Math.abs(leftWinRate - rightWinRate) <= 10;

  const getPerformanceMessage = () => {
    if (totalGames === 0) return 'Ready to start your journey!';
    if (isBalanced) return 'Perfectly balanced battles!';
    if (isLeftDominating) return 'Left side dominance!';
    if (isRightDominating) return 'Right side supremacy!';
    return 'The Force is strong in this battle!';
  };

  if (totalGames === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mt: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          🌟 Your galactic battle stats will appear here after your first game!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Analytics sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" component="h3">
          Battle Analytics
        </Typography>
        <Chip
          label={getPerformanceMessage()}
          size="small"
          color="primary"
          sx={{ ml: 'auto' }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Win Rates */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Left Player Win Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={leftWinRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  flex: 1,
                  mr: 1,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2196F3',
                  },
                }}
              />
              <Typography variant="body2" sx={{ minWidth: 50 }}>
                {leftWinRate.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Right Player Win Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinearProgress
                variant="determinate"
                value={rightWinRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  flex: 1,
                  mr: 1,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#FF6B6B',
                  },
                }}
              />
              <Typography variant="body2" sx={{ minWidth: 50 }}>
                {rightWinRate.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Additional Stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiEvents sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                Total Battles: <strong>{totalGames}</strong>
              </Typography>
            </Box>

            {averageGameTime > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Timer sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Avg. Game Time: <strong>{averageGameTime.toFixed(1)}s</strong>
                </Typography>
              </Box>
            )}

            {bestStreak > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Best Streak: <strong>{bestStreak}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Battle Summary */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          {totalGames === 1 
            ? 'Your first battle is complete! The journey begins...' 
            : `${totalGames} epic battles fought in this galactic arena!`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default GameStats; 