import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Skeleton,
} from '@mui/material';
import { Person, Starship } from '../types/generated';

interface GameCardProps {
  entity: Person | Starship | null;
  isWinner?: boolean;
  isLoading?: boolean;
  position: 'left' | 'right';
}

const GameCard: React.FC<GameCardProps> = ({
  entity,
  isWinner = false,
  isLoading = false,
  position,
}) => {
  if (isLoading) {
    return (
      <Card
        sx={{
          minHeight: 300,
          maxWidth: 350,
          mx: 'auto',
          position: 'relative',
        }}
      >
        <Skeleton variant="rectangular" width="100%" height={120} />
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </CardContent>
      </Card>
    );
  }

  if (!entity) {
    return (
      <Card
        sx={{
          minHeight: 300,
          maxWidth: 350,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          border: '2px dashed',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Click Play to Start
        </Typography>
      </Card>
    );
  }

  const isPerson = entity.__typename === 'Person';
  const isStarship = entity.__typename === 'Starship';

  const getAttributeValue = () => {
    if (isPerson) {
      return (entity as Person).mass;
    } else if (isStarship) {
      return (entity as Starship).crew;
    }
    return 0;
  };

  const getAttributeLabel = () => {
    if (isPerson) {
      return 'Mass';
    } else if (isStarship) {
      return 'Crew';
    }
    return 'Attribute';
  };

  const getCardGradient = () => {
    if (isWinner) {
      return 'linear-gradient(45deg, #FFE81F 30%, #FFF566 90%)';
    }
    return isPerson
      ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
      : 'linear-gradient(45deg, #FF6B6B 30%, #FF9999 90%)';
  };

  return (
    <Card
      sx={{
        minHeight: 300,
        maxWidth: 350,
        mx: 'auto',
        position: 'relative',
        background: getCardGradient(),
        transform: isWinner ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: isWinner ? 4 : 1,
        '&:hover': {
          transform: isWinner ? 'scale(1.08)' : 'scale(1.02)',
        },
      }}
    >
      {/* Card Header with Type */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      >
        <Chip
          label={isPerson ? 'Person' : 'Starship'}
          color={isPerson ? 'primary' : 'secondary'}
          size="small"
        />
      </Box>

      {/* Winner Badge */}
      {isWinner && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        >
          <Chip
            label="WINNER!"
            color="success"
            size="small"
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
      )}

      {/* Card Image Placeholder */}
      <CardMedia
        sx={{
          height: 120,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 'bold',
          }}
        >
          {isPerson ? '👤' : '🚀'}
        </Typography>
      </CardMedia>

      <CardContent>
        {/* Entity Name */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {entity.name}
        </Typography>

        {/* Main Attribute (Mass or Crew) */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            p: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
            {getAttributeLabel()}:
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            {getAttributeValue()}
          </Typography>
        </Box>

        {/* Additional Details */}
        <Box sx={{ mt: 2 }}>
          {isPerson && (
            <>
              {(entity as Person).height && (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Height: {(entity as Person).height}
                </Typography>
              )}
              {(entity as Person).gender && (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Gender: {(entity as Person).gender}
                </Typography>
              )}
              {(entity as Person).homeworld && (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Homeworld: {(entity as Person).homeworld}
                </Typography>
              )}
            </>
          )}

          {isStarship && (
            <>
              {(entity as Starship).model && (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Model: {(entity as Starship).model}
                </Typography>
              )}
              {(entity as Starship).manufacturer && (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Manufacturer: {(entity as Starship).manufacturer}
                </Typography>
              )}
              {(entity as Starship).passengers && (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Passengers: {(entity as Starship).passengers}
                </Typography>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GameCard; 