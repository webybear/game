import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Star,
  EmojiEvents,
  TrendingUp,
} from '@mui/icons-material';
import { PlayerProfile as PlayerProfileType } from '../types/game';

interface PlayerProfileProps {
  profile: PlayerProfileType;
  onUpdateProfile: (updates: Partial<PlayerProfileType>) => void;
}

const AVATAR_OPTIONS = [
  '👤', '🧑', '👨', '👩', '🧔', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱',
  '🧑‍🦲', '👨‍🦲', '👩‍🦲', '🧑‍🦳', '👨‍🦳', '👩‍🦳', '🧑‍🚀', '👨‍🚀', '👩‍🚀',
  '🤖', '👽', '🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🎭', '🎪'
];

const PlayerProfile: React.FC<PlayerProfileProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  const handleStartEdit = () => {
    setEditName(profile.name);
    setEditAvatar(profile.avatar);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateProfile({
      name: editName,
      avatar: editAvatar,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(profile.name);
    setEditAvatar(profile.avatar);
    setIsEditing(false);
  };

  const handleAvatarSelect = (avatar: string) => {
    setEditAvatar(avatar);
    setAvatarDialogOpen(false);
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWinRate = () => {
    if (profile.totalBattles === 0) return '0';
    return ((profile.wins / profile.totalBattles) * 100).toFixed(1);
  };

  const getRankTitle = () => {
    const winRate = parseFloat(getWinRate());
    if (winRate >= 80) return 'Jedi Master';
    if (winRate >= 70) return 'Jedi Knight';
    if (winRate >= 60) return 'Jedi Padawan';
    if (winRate >= 50) return 'Force Sensitive';
    if (winRate >= 40) return 'Rebel Fighter';
    if (winRate >= 30) return 'Smuggler';
    if (winRate >= 20) return 'Stormtrooper';
    return 'Youngling';
  };

  const getRankColor = () => {
    const winRate = parseFloat(getWinRate());
    if (winRate >= 70) return 'success';
    if (winRate >= 50) return 'primary';
    if (winRate >= 30) return 'warning';
    return 'default';
  };

  type RankColor = 'success' | 'primary' | 'warning' | 'default';

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                fontSize: '2rem',
                bgcolor: 'primary.main',
                border: '3px solid',
                borderColor: 'primary.light',
              }}
              onClick={() => isEditing && setAvatarDialogOpen(true)}
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
            >
              {isEditing ? editAvatar : profile.avatar}
            </Avatar>
            <Box>
              {isEditing ? (
                <TextField
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="small"
                  inputProps={{ maxLength: 20 }}
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography variant="h5" component="h2">
                  {profile.name}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  label={getRankTitle()}
                  size="small"
                  color={getRankColor() as RankColor}
                  icon={<Star />}
                />
                <Typography variant="caption" color="text.secondary">
                  Joined {formatJoinDate(profile.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box>
            {isEditing ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveEdit}
                  startIcon={<Save />}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelEdit}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Tooltip title="Edit Profile">
                <IconButton onClick={handleStartEdit}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <EmojiEvents sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  {profile.totalBattles}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Battles
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  {getWinRate()}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Win Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  {profile.bestWinStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Best Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Person sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  {profile.favoriteResource}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Favorite Type
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {profile.winStreak > 0 
              ? `🔥 Current win streak: ${profile.winStreak} battles!`
              : 'Ready to start your winning streak!'}
          </Typography>
        </Box>
      </Paper>

      {/* Avatar Selection Dialog */}
      <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)}>
        <DialogTitle>Choose Your Avatar</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {AVATAR_OPTIONS.map((avatar) => (
              <Grid size={{ xs: 3 }} key={avatar}>
                <Button
                  variant={editAvatar === avatar ? 'contained' : 'outlined'}
                  onClick={() => handleAvatarSelect(avatar)}
                  sx={{
                    width: '100%',
                    height: 60,
                    fontSize: '1.5rem',
                    minWidth: 0,
                  }}
                >
                  {avatar}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlayerProfile; 