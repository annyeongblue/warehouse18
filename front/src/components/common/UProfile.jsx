import React, { useState } from 'react';
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Custom styled components
const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: '#fff',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(14),
  height: theme.spacing(14),
  margin: '0 auto',
  border: `4px solid ${theme.palette.grey[200]}`,
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ProfileManagement = () => {
  const [user, setUser] = useState({
    name: 'Loungfar Thammavisan',
    username: '@bleuu',
    email: 'loungfar.tham@gmail.com',
    password: '', // Initial password is empty (for demo purposes)
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({ ...user });
  const [avatarFile, setAvatarFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleEdit = () => {
    setIsEditing(true);
    setEditUser({ ...user });
  };

  const handleSave = () => {
    setUser({ ...editUser });
    setIsEditing(false);
    setSnackbar({ open: true, message: 'Profile updated successfully!' });
    // Simulate API call
    console.log('Saving user data:', editUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditUser({ ...user });
    setAvatarFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="" sx={{ minHeight: '100vh' }}>
      <ProfilePaper elevation={0}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: '#1e1e2f', letterSpacing: '-0.5px' }}
          >
            Profile Management
          </Typography>
          {!isEditing ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                borderRadius: '12px',
                borderColor: '#3b82f6',
                color: '#3b82f6',
                textTransform: 'none',
                '&:hover': {
                  background: '#eff6ff',
                  borderColor: '#2563eb',
                },
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#fef2f2',
                    borderColor: '#dc2626',
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Avatar Section */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <ProfileAvatar
              alt={user.name}
              src={avatarFile || 'https://via.placeholder.com/150'}
            />
            {isEditing && (
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                    sx={{
                      borderRadius: '12px',
                      borderColor: '#64748b',
                      color: '#64748b',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        color: '#3b82f6',
                      },
                    }}
                  >
                    Change Photo
                  </Button>
                </label>
              </Box>
            )}
            {!isEditing && (
              <Typography sx={{ mt: 2, color: '#64748b', fontWeight: 500 }}>
                {user.username}
              </Typography>
            )}
          </Grid>

          {/* Editable Fields Section */}
          <Grid item xs={12} md={8}>
            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={isEditing ? editUser.name : user.name}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: isEditing ? '#fafafa' : '#fff',
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isEditing ? '#e2e8f0' : 'transparent',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={isEditing ? editUser.username : user.username}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: isEditing ? '#fafafa' : '#fff',
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isEditing ? '#e2e8f0' : 'transparent',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={isEditing ? editUser.email : user.email}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: isEditing ? '#fafafa' : '#fff',
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isEditing ? '#e2e8f0' : 'transparent',
                  },
                }}
              />
              {isEditing && (
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  value={editUser.password || ''}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  helperText="Leave blank to keep current password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: '#fafafa',
                    },
                    '& .MuiInputLabel-root': { color: '#64748b' },
                    '& .MuiFormHelperText-root': { color: '#64748b' },
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </ProfilePaper>

      {/* Snackbar for Success Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileManagement;