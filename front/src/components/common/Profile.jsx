import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const Profile = ({ open }) => {
  return (
    <Box
      display="flex"
      alignItems={'center'}
      ml={open ? 1.5 : 1.5}
      mt={2}
      mb={2}
    >
      <Avatar
        alt="User Avatar"
        sx={{
          display: 'flex',
          width: 40,
          height: 40,
          marginRight: open ? 2 : 1, // Adjust space dynamically
          bgcolor: 'gray',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          transition: 'opacity 0.3s ease', // Smooth fade effect
          opacity: open ? 1 : 0,          // Controls the fading in and out
          pointerEvents: open ? 'auto' : 'none', // Disable interaction when hidden
        }}
      >
        <Typography sx={{ fontSize: '0.97rem' }}>
          Loungfar Thammavisan
        </Typography>
      </Box>
    </Box>
  );
};

export default Profile;
