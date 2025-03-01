import React, { useState } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import LoginTest from '../test/LoginTest';
import RegisterTest from '../test/RegisterTest';

const Welcome = () => {
  const [openForm, setOpenForm] = useState(null); // 'login', 'signup', or null

  const handleToggleForm = (formType) => {
    setOpenForm((prev) => (prev === formType ? null : formType)); // Toggle while ensuring only one is open
  };

  return (
    <Box sx={{ mt: -5 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontSize: '1.7rem', fontWeight: 'bold' }}>
          Warehouse
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '78vh', gap: { xs: 5, sm: 6, md: 9, lg: 20 }, flexWrap: 'wrap', textAlign: 'center' }}>
        {/* Logo Section */}
        <Box sx={{ maxWidth: '50%' }}>
          <img
            src="img/logo.png"
            alt="Warehouse Logo"
            style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
          />
        </Box>

        {/* Forms Section */}
        <Box sx={{ maxWidth: '50%' }}>
          <Typography sx={{ display: 'flex', flexDirection: 'column', fontSize: '1.3em', mb: 2 }} onClick={() => handleToggleForm('login')}>Welcome to an inventory!</Typography>

          {/* Login Toggle */}
          {openForm !== 'signup' && ( // Hide Login text when Sign Up is open
          <>
            <Typography
              variant="h6"
              onClick={() => handleToggleForm('login')}
              sx={{ cursor: 'pointer', color: 'blue', mt: openForm === 'login' ? 2 : 2 }}
            >
              {openForm === 'login' ? '' : 'Login'}
            </Typography>
            </>
          )}

          <Collapse in={openForm === 'login'}>
            <Box sx={{ mt: 2, width: '100%', maxWidth: '400px' }}>
              <LoginTest />

              <Typography sx={{ overflow: 'hidden', mt: -5 }} onClick={() => handleToggleForm('signup')}>
                Sign up
              </Typography>
            </Box>
          </Collapse>

          {/* Sign Up Toggle */}
          {openForm !== 'login' && ( // Hide Sign Up text when Login is open
            <Typography
              variant="h6"
              onClick={() => handleToggleForm('signup')}
              sx={{ cursor: 'pointer', color: 'blue', mt: openForm === 'signup' ? 0 : 2 }}

            >
              {openForm === 'signup' ? '' : 'Sign Up'}
            </Typography>
          )}

          <Collapse in={openForm === 'signup'}>
            <Box sx={{ mt: 2 }}>
              <RegisterTest />

              <Typography sx={{ overflow: 'hidden', mt: -5 }} onClick={() => handleToggleForm('login')}>
                Sign In
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;