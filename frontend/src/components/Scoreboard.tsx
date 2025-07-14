import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import {
  RestartAlt,
  EmojiEvents,
  PersonOutline,
  RocketLaunch,
} from '@mui/icons-material';

interface ScoreboardProps {
  leftScore: number;
  rightScore: number;
  onResetScores: () => void;
  totalGames: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  leftScore,
  rightScore,
  onResetScores,
  totalGames,
}) => {
  const isLeftLeading = leftScore > rightScore;
  const isRightLeading = rightScore > leftScore;
  const isTied = leftScore === rightScore;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEvents sx={{ color: 'primary.main' }} />
          Battle Score
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${totalGames} Games`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <IconButton
            onClick={onResetScores}
            size="small"
            color="primary"
            title="Reset Scores"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            <RestartAlt />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Left Player */}
        <Box
          sx={{
            flex: 1,
            textAlign: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: isLeftLeading ? 'success.main' : 'background.default',
            color: isLeftLeading ? 'white' : 'text.primary',
            transition: 'all 0.3s ease',
            transform: isLeftLeading ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {leftScore}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <PersonOutline />
            Left Player
          </Typography>
          {isLeftLeading && (
            <Chip
              label="LEADING"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>

        {/* VS Divider */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            VS
          </Typography>
          <Divider
            orientation="vertical"
            sx={{
              height: 40,
              borderWidth: 2,
              borderColor: 'primary.main',
            }}
          />
          {isTied && totalGames > 0 && (
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                color: 'text.secondary',
                fontWeight: 'bold',
              }}
            >
              TIED
            </Typography>
          )}
        </Box>

        {/* Right Player */}
        <Box
          sx={{
            flex: 1,
            textAlign: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: isRightLeading ? 'success.main' : 'background.default',
            color: isRightLeading ? 'white' : 'text.primary',
            transition: 'all 0.3s ease',
            transform: isRightLeading ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {rightScore}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <RocketLaunch />
            Right Player
          </Typography>
          {isRightLeading && (
            <Chip
              label="LEADING"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Win Percentage */}
      {totalGames > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Win Rate: {Math.round((leftScore / totalGames) * 100)}% - {Math.round((rightScore / totalGames) * 100)}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Scoreboard; 