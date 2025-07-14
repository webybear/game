import React from 'react';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
} from '@mui/material';

export const GameCardSkeleton: React.FC = () => (
  <Card
    sx={{
      minHeight: 300,
      maxWidth: 350,
      mx: 'auto',
      position: 'relative',
    }}
  >
    <CardMedia>
      <Skeleton variant="rectangular" width="100%" height={120} />
    </CardMedia>
    <CardContent>
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
      <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);

export const ScoreboardSkeleton: React.FC = () => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      mb: 3,
      backgroundColor: 'background.paper',
      borderRadius: 2,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Skeleton variant="text" width={150} />
      <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <Skeleton variant="rectangular" height={100} sx={{ flex: 1, borderRadius: 2 }} />
      <Skeleton variant="text" width={40} />
      <Skeleton variant="rectangular" height={100} sx={{ flex: 1, borderRadius: 2 }} />
    </Box>
  </Paper>
);

export const ResourceSelectorSkeleton: React.FC = () => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      mb: 3,
      backgroundColor: 'background.paper',
      borderRadius: 2,
    }}
  >
    <Skeleton variant="text" width={200} sx={{ mx: 'auto', mb: 2 }} />
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Skeleton variant="rectangular" width={120} height={80} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" width={120} height={80} sx={{ borderRadius: 2 }} />
    </Box>
  </Paper>
);

export const GamePageSkeleton: React.FC<{ playButton?: React.ReactNode }> = ({ playButton }) => (
  <Box sx={{ py: 4 }}>
    <Skeleton variant="text" sx={{ fontSize: '3rem', mb: 2, mx: 'auto', width: '60%' }} />
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 4, mx: 'auto', width: '40%' }} />
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      {playButton || <Skeleton variant="rectangular" width={200} height={56} sx={{ mx: 'auto', borderRadius: 3 }} />}
    </Box>
    
    <ResourceSelectorSkeleton />
    <ScoreboardSkeleton />
    
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <GameCardSkeleton />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <GameCardSkeleton />
      </Grid>
    </Grid>
    
  </Box>
);

export default GamePageSkeleton; 