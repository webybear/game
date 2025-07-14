import React, { useState, useCallback } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  EmojiEvents,
  PlayArrow,
  RestartAlt,
  Cancel,
} from '@mui/icons-material';
import { Tournament, BattleResult } from '../types/game';
import { ResourceType } from '../types/generated';

interface TournamentModeProps {
  onStartTournament: (resourceType: ResourceType, rounds: number) => void;
  onPlayTournamentRound: (tournament: Tournament, roundIndex: number) => Promise<BattleResult>;
  currentTournament: Tournament | null;
  isLoading: boolean;
}

const TOURNAMENT_TYPES = [
  { rounds: 3, name: 'Quick Championship', description: 'Best of 3 rounds' },
  { rounds: 5, name: 'Galactic Cup', description: 'Best of 5 rounds' },
  { rounds: 7, name: 'Emperor\'s Tournament', description: 'Best of 7 rounds' },
  { rounds: 10, name: 'Force Master Challenge', description: 'Best of 10 rounds' },
];

const TournamentMode: React.FC<TournamentModeProps> = ({
  onStartTournament,
  onPlayTournamentRound,
  currentTournament,
  isLoading,
}) => {
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [selectedRounds, setSelectedRounds] = useState(3);
  const [selectedResource, setSelectedResource] = useState<ResourceType>(ResourceType.People);
  const [roundResults, setRoundResults] = useState<BattleResult[]>([]);

  const handleStartTournament = useCallback(() => {
    onStartTournament(selectedResource, selectedRounds);
    setSetupDialogOpen(false);
    setRoundResults([]);
  }, [onStartTournament, selectedResource, selectedRounds]);

  const handlePlayRound = useCallback(async (tournament: Tournament, roundIndex: number) => {
    try {
      const result = await onPlayTournamentRound(tournament, roundIndex);
      setRoundResults(prev => [...prev, result]);
    } catch (error) {
      console.error('Error playing tournament round:', error);
    }
  }, [onPlayTournamentRound]);

  const calculateScore = (results: BattleResult[]): { left: number; right: number } => {
    return results.reduce(
      (acc, result) => {
        if (result.winnerPosition === 'left') acc.left++;
        else if (result.winnerPosition === 'right') acc.right++;
        return acc;
      },
      { left: 0, right: 0 }
    );
  };

  const isComplete = currentTournament && roundResults.length >= currentTournament.rounds.length;
  const score = calculateScore(roundResults);
  const winner = isComplete ? (score.left > score.right ? 'left' : score.right > score.left ? 'right' : 'tie') : null;

  const getTournamentProgress = () => {
    if (!currentTournament) return 0;
    return (roundResults.length / currentTournament.rounds.length) * 100;
  };

  const getWinnerTitle = () => {
    if (!winner) return '';
    if (winner === 'tie') return 'It\'s a Tie!';
    return `${winner === 'left' ? 'Left' : 'Right'} Player Wins!`;
  };

  const getWinnerIcon = () => {
    if (!winner) return null;
    if (winner === 'tie') return '🤝';
    return winner === 'left' ? '🏆' : '🥇';
  };

  if (!currentTournament) {
    return (
      <>
        <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <EmojiEvents />
            Tournament Mode
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Compete in multi-round tournaments and prove your mastery of the Force!
          </Typography>

          <Grid container spacing={3}>
            {TOURNAMENT_TYPES.map((type) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={type.rounds}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      boxShadow: 3,
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => {
                    setSelectedRounds(type.rounds);
                    setSetupDialogOpen(true);
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      {type.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {type.description}
                    </Typography>
                    <Chip
                      label={`${type.rounds} Rounds`}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Tournament Setup Dialog */}
        <Dialog open={setupDialogOpen} onClose={() => setSetupDialogOpen(false)}>
          <DialogTitle>Setup Tournament</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Tournament: {TOURNAMENT_TYPES.find(t => t.rounds === selectedRounds)?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedRounds} rounds tournament
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Choose Battle Type:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  variant={selectedResource === ResourceType.People ? 'contained' : 'outlined'}
                  onClick={() => setSelectedResource(ResourceType.People)}
                  startIcon={<span>👥</span>}
                >
                  People
                </Button>
                <Button
                  variant={selectedResource === ResourceType.Starships ? 'contained' : 'outlined'}
                  onClick={() => setSelectedResource(ResourceType.Starships)}
                  startIcon={<span>🚀</span>}
                >
                  Starships
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSetupDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStartTournament} variant="contained">
              Start Tournament
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEvents />
          {currentTournament.name}
        </Typography>
        <Chip
          label={`${currentTournament.resourceType} Tournament`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Tournament Progress */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Tournament Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={getTournamentProgress()}
          sx={{ height: 8, borderRadius: 4, mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {roundResults.length} / {currentTournament.rounds.length} rounds completed
        </Typography>
      </Box>

      {/* Current Score */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Card variant="outlined" sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {score.left} - {score.right}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Left vs Right
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tournament Winner */}
      {isComplete && (
        <Alert
          severity={winner === 'tie' ? 'info' : 'success'}
          sx={{ mb: 3, textAlign: 'center' }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {getWinnerIcon()} {getWinnerTitle()} {getWinnerIcon()}
          </Typography>
        </Alert>
      )}

      {/* Round Stepper */}
      <Stepper activeStep={roundResults.length} alternativeLabel sx={{ mb: 3 }}>
        {currentTournament.rounds.map((round, index) => (
          <Step key={round.id}>
            <StepLabel>
              Round {index + 1}
              {roundResults[index] && (
                <Typography variant="caption" display="block" color="text.secondary">
                  {roundResults[index].winnerPosition === 'left' ? 'Left' : 
                   roundResults[index].winnerPosition === 'right' ? 'Right' : 'Tie'}
                </Typography>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Round Results */}
      {roundResults.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Round Results
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {roundResults.map((result, index) => (
              <Chip
                key={index}
                label={`R${index + 1}: ${result.winnerPosition === 'left' ? 'Left' : 
                      result.winnerPosition === 'right' ? 'Right' : 'Tie'}`}
                color={result.winnerPosition === 'left' ? 'primary' : 
                       result.winnerPosition === 'right' ? 'secondary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!isComplete && (
          <Button
            variant="contained"
            size="large"
            onClick={() => handlePlayRound(currentTournament, roundResults.length)}
            disabled={isLoading}
            startIcon={<PlayArrow />}
          >
            {isLoading ? 'Playing...' : `Play Round ${roundResults.length + 1}`}
          </Button>
        )}
        
        {isComplete && (
          <Button
            variant="contained"
            size="large"
            onClick={() => setSetupDialogOpen(true)}
            startIcon={<RestartAlt />}
          >
            New Tournament
          </Button>
        )}
        
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          startIcon={<Cancel />}
        >
          End Tournament
        </Button>
      </Box>
    </Paper>
  );
};

export default TournamentMode; 