import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grow,
  Zoom,
  Fade,
  Slide,
  Paper,
} from '@mui/material';
import {
  EmojiEvents,
  Stars,
  Celebration,
  LocalFireDepartment,
} from '@mui/icons-material';

interface VictoryAnimationProps {
  winner: 'left' | 'right';
  winnerName: string;
  winningAttribute: string;
  onAnimationComplete?: () => void;
}

const VictoryAnimation: React.FC<VictoryAnimationProps> = ({
  winner,
  winnerName,
  winningAttribute,
  onAnimationComplete,
}) => {
  const [showTrophy, setShowTrophy] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTrophy(true), 200);
    const timer2 = setTimeout(() => setShowStars(true), 400);
    const timer3 = setTimeout(() => setShowMessage(true), 600);
    const timer4 = setTimeout(() => setShowCelebration(true), 800);
    const timer5 = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onAnimationComplete]);

  const isLeftWinner = winner === 'left';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
      }}
    >
      {/* Floating Stars */}
      {showStars && (
        <>
          {[...Array(8)].map((_, i) => (
            <Zoom
              key={i}
              in={showStars}
              style={{
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <Stars
                sx={{
                  position: 'absolute',
                  color: '#FFE81F',
                  fontSize: 40,
                  left: `${20 + i * 10}%`,
                  top: `${10 + (i % 3) * 20}%`,
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${i * 0.5}s`,
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(180deg)' },
                  },
                }}
              />
            </Zoom>
          ))}
        </>
      )}

      {/* Victory Paper */}
      <Grow in={showTrophy} timeout={800}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            textAlign: 'center',
            background: `linear-gradient(45deg, ${
              isLeftWinner ? '#2196F3' : '#FF6B6B'
            } 30%, #FFE81F 90%)`,
            borderRadius: 4,
            maxWidth: 400,
            mx: 2,
            transform: showTrophy ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          }}
        >
          {/* Trophy Icon */}
          <Zoom in={showTrophy} timeout={1000}>
            <Box sx={{ mb: 2 }}>
              <EmojiEvents
                sx={{
                  fontSize: 80,
                  color: 'white',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}
              />
            </Box>
          </Zoom>

          {/* Victory Message */}
          <Slide direction="up" in={showMessage} timeout={600}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  mb: 1,
                }}
              >
                VICTORY!
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  mb: 2,
                }}
              >
                {isLeftWinner ? 'Left' : 'Right'} Player Wins!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  opacity: 0.9,
                }}
              >
                {winnerName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  opacity: 0.8,
                  mt: 1,
                }}
              >
                Victorious by {winningAttribute}!
              </Typography>
            </Box>
          </Slide>

          {/* Celebration Icons */}
          <Fade in={showCelebration} timeout={800}>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Celebration
                sx={{
                  color: 'white',
                  fontSize: 32,
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }}
              />
              <LocalFireDepartment
                sx={{
                  color: 'white',
                  fontSize: 32,
                  animation: 'pulse 1.5s infinite 0.5s',
                }}
              />
            </Box>
          </Fade>
        </Paper>
      </Grow>

      {/* Floating Victory Text */}
      <Zoom in={showMessage} timeout={1000}>
        <Typography
          variant="h4"
          sx={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#FFE81F',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            animation: 'glow 2s infinite alternate',
            '@keyframes glow': {
              '0%': { textShadow: '0 0 5px #FFE81F, 0 0 10px #FFE81F' },
              '100%': { textShadow: '0 0 10px #FFE81F, 0 0 20px #FFE81F, 0 0 30px #FFE81F' },
            },
          }}
        >
          May the Force be with you!
        </Typography>
      </Zoom>
    </Box>
  );
};

export default VictoryAnimation; 