import React from 'react';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Fade,
} from '@mui/material';
import {
  PlayArrow,
  Replay,
  Casino,
} from '@mui/icons-material';

interface PlayButtonProps {
  onPlay: () => void;
  isLoading: boolean;
  hasPlayed: boolean;
  disabled?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  onPlay,
  isLoading,
  hasPlayed,
  disabled = false,
}) => {
  const getButtonText = () => {
    if (isLoading) return 'Drawing Cards...';
    if (hasPlayed) return 'Play Again';
    return 'Start Battle';
  };

  const getButtonIcon = () => {
    if (isLoading) return <CircularProgress size={20} color="inherit" />;
    if (hasPlayed) return <Replay />;
    return <PlayArrow />;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 3,
      }}
    >
      <Fade in={true} timeout={800}>
        <Button
          variant="contained"
          size="large"
          onClick={onPlay}
          disabled={disabled || isLoading}
          startIcon={getButtonIcon()}
          sx={{
            px: 4,
            py: 2,
            borderRadius: 3,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FFE81F 30%, #FFF566 90%)',
            color: 'black',
            boxShadow: '0 3px 5px 2px rgba(255, 232, 31, .3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #FFF566 30%, #FFE81F 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px 2px rgba(255, 232, 31, .4)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&:disabled': {
              background: 'rgba(255, 232, 31, 0.3)',
              color: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          {getButtonText()}
        </Button>
      </Fade>

      {!hasPlayed && (
        <Fade in={true} timeout={1200}>
          <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <Casino sx={{ verticalAlign: 'middle', mr: 1 }} />
              Random matchups from a galaxy far, far away
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Choose your resource type above, then click to start the battle!
            </Typography>
          </Box>
        </Fade>
      )}

      {hasPlayed && (
        <Fade in={true} timeout={600}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Ready for another round? The Force is strong with this one!
          </Typography>
        </Fade>
      )}
    </Box>
  );
};

export default PlayButton; 