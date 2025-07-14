import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00f, 0 0 40px #00f; }
  100% { text-shadow: 0 0 20px #fff, 0 0 30px #ff0, 0 0 40px #ff0, 0 0 50px #ff0; }
`;

interface TieAnimationProps {
  onAnimationComplete: () => void;
}

const TieAnimation: React.FC<TieAnimationProps> = ({
  onAnimationComplete,
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 2000,
        animation: `${fadeIn} 0.5s ease-in-out forwards`,
      }}
      onClick={onAnimationComplete}
    >
      <Typography
        variant="h1"
        component="div"
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          animation: `${textGlow} 1.5s ease-in-out infinite alternate`,
          fontSize: { xs: '6rem', md: '10rem' },
          WebkitTextStroke: '2px #ff0',
        }}
      >
        TIE
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          mt: 2,
          animation: `${fadeIn} 2s ease-in-out`,
        }}
      >
        The battle resulted in a draw!
      </Typography>
    </Box>
  );
};

export default TieAnimation; 