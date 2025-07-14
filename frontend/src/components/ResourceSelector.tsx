import React from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { Person, Rocket } from '@mui/icons-material';
import { ResourceType } from '../types/generated';

interface ResourceSelectorProps {
  selectedResource: ResourceType;
  onResourceChange: (resource: ResourceType) => void;
  disabled?: boolean;
}

const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  selectedResource,
  onResourceChange,
  disabled = false,
}) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newResource: ResourceType,
  ) => {
    if (newResource !== null) {
      onResourceChange(newResource);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        align="center"
        sx={{ mb: 2 }}
      >
        Choose Your Battle
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={selectedResource}
          exclusive
          onChange={handleChange}
          disabled={disabled}
          size="large"
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1.5,
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'black',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
              '&:hover': {
                backgroundColor: 'primary.light',
                borderColor: 'primary.light',
              },
            },
          }}
        >
          <ToggleButton
            value={ResourceType.People}
            aria-label="people"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Person sx={{ fontSize: 32 }} />
            <Typography variant="body1" sx={{ fontWeight: 'inherit' }}>
              People
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Battle by Mass
            </Typography>
          </ToggleButton>
          
          <ToggleButton
            value={ResourceType.Starships}
            aria-label="starships"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Rocket sx={{ fontSize: 32 }} />
            <Typography variant="body1" sx={{ fontWeight: 'inherit' }}>
              Starships
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Battle by Crew
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 2 }}
      >
        {selectedResource === ResourceType.People
          ? 'Compare characters by their mass - heavier wins!'
          : 'Compare starships by their crew size - bigger crew wins!'}
      </Typography>
    </Paper>
  );
};

export default ResourceSelector; 