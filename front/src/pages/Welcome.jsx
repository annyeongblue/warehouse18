import React, { useState } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import LoginTest from '../test/LoginTest';
import RegisterTest from '../test/RegisterTest';

const Welcome = () => {
  const [openForm, setOpenForm] = useState(null); // 'login', 'signup', or null

  const handleToggleForm = (formType) => {
    setOpenForm((prev) => (prev === formType ? null : formType));
  };

  return (
    <Box
      sx={{
        minHeight: '80vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // background: 'linear-gradient(45deg, #f5f7fa 30%, #c3cfe2 90%)', // Optional subtle background
      }}
    >
      {/* Header Section (Outside of centered content) */}
      <Box sx={{ width: '100%', maxWidth: '1200px', mt: -5, px: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', md: '1.7rem' },
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Warehouse
        </Typography>
      </Box>

      {/* Centered Main Content (Logo and Forms) */}
      <Box
        sx={{
          flex: 1, // Take up remaining space to center vertically
          display: 'flex',
          alignItems: 'center', // Center vertically
          justifyContent: 'center', // Center horizontally
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto', // Center the container horizontally
          px: 2, // Padding for smaller screens
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens, row on larger
            alignItems: 'center', // Center items vertically
            justifyContent: 'center', // Center items horizontally
            gap: { xs: 5, sm: 6, md: 9, lg: 12 }, // Responsive spacing
            flexWrap: 'wrap', // Allow wrapping if needed
            textAlign: 'center',
            width: '100%',
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              maxWidth: { xs: '100%', md: '50%' }, // Full width on small, half on larger
              display: 'flex',
              justifyContent: 'center', // Center logo horizontally
            }}
          >
            <img
              src="img/logo.png"
              alt="Warehouse Logo"
              style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
            />
          </Box>

          {/* Forms Section */}
          <Box
            sx={{
              maxWidth: { xs: '100%', md: '50%' }, // Full width on small, half on larger
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Center form content horizontally
              justifyContent: 'center', // Center form content vertically
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 500,
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Welcome to Your Inventory!
            </Typography>

            {/* Login Toggle */}
            <Typography
              variant="h6"
              onClick={() => handleToggleForm('login')}
              sx={{
                cursor: 'pointer',
                color: openForm === 'login' ? 'primary.main' : 'blue',
                fontWeight: 600,
                mb: 3,
                transition: 'color 0.3s',
                '&:hover': { color: 'primary.dark' },
                display: openForm === 'signup' ? 'none' : 'block',
              }}
            >
              {openForm === 'login' ? 'Close' : 'Login'}
            </Typography>

            <Collapse in={openForm === 'login'} timeout={500}>
              <Box sx={{ width: '100%', maxWidth: '420px', mx: 'auto', mb: 2 }}>
                <LoginTest />
                <Typography
                  sx={{
                    mt: 1,
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => handleToggleForm('signup')}
                >
                  Need an account? Sign Up
                </Typography>
              </Box>
            </Collapse>

            {/* Sign Up Toggle */}
            <Typography
              variant="h6"
              onClick={() => handleToggleForm('signup')}
              sx={{
                cursor: 'pointer',
                color: openForm === 'signup' ? 'primary.main' : 'blue',
                fontWeight: 600,
                mb: 1,
                transition: 'color 0.3s',
                '&:hover': { color: 'primary.dark' },
                display: openForm === 'login' ? 'none' : 'block',
              }}
            >
              {openForm === 'signup' ? 'Close' : 'Sign Up'}
            </Typography>

            <Collapse in={openForm === 'signup'} timeout={500}>
              <Box sx={{ width: '100%', maxWidth: '480px', mx: 'auto' }}>
                <RegisterTest />
                <Typography
                  sx={{
                    mt: 1,
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => handleToggleForm('login')}
                >
                  Already have an account? Sign In
                </Typography>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;