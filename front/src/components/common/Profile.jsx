import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile = ({ open }) => {
  const navigate = useNavigate();
  
  // Retrieve and parse user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  // Get display name (firstname + lastname, or fallback)
  const displayName = user
    ? `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email || 'User'
    : 'Guest';

  // Get initials for Avatar (e.g., "JD" for John Doe)
  const getInitials = () => {
    if (!user) return 'G'; // Guest
    const first = user.firstname ? user.firstname[0] : '';
    const last = user.lastname ? user.lastname[0] : '';
    return (first + last).toUpperCase() || user.email[0].toUpperCase() || 'U';
  };

  // Handle click on Profile (e.g., navigate to /uprofile)
  const handleProfileClick = () => {
    if (user) {
      navigate('/uprofile'); // Navigate to profile page if logged in
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      ml={open ? 1.5 : 1.5}
      mt={2}
      mb={2}
      onClick={handleProfileClick}
      sx={{ cursor: 'pointer' }}
    >
      <Avatar
        alt={displayName}
        sx={{
          display: 'flex',
          width: 40,
          height: 40,
          marginRight: open ? 2 : 1,
          bgcolor: 'gray',
          fontSize: '1rem', // Smaller font for initials
        }}
      >
        {getInitials()}
      </Avatar>
      <Box
        sx={{
          display: 'flex',
          transition: 'opacity 0.3s ease',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <Typography sx={{ fontSize: '0.97rem' }}>
          {displayName}
        </Typography>
      </Box>
    </Box>
  );
};

export default Profile;