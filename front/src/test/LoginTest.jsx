import React, { useState } from 'react';
import { Box, Typography, TextField, Link, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';


const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      console.log('Server Response:', response.data); // Log to see the structure

      if (response.status === 200) {
        alert(response.data.message || 'Login successful!');
        event.target.reset();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error Response:', error.response); // Log any error details
      alert('An error occurred, please try again.');
    }
  };

  return (
    <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    width: '100%', // Ensure it takes full width of its container
    maxWidth: { xs: '100%', sm: '600px', md: '700px' }, // Adjust based on screen size
    borderRadius: '12px',
    boxShadow: 3,
    overflow: 'hidden',
  }}
>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <Box sx={{ display: 'grid', gap: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '3vh' }}>
            Sign in
          </Typography>
          <Typography>
            To continue!
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 4, textAlign: 'center' }}>
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 4 }
                }}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 4 }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                sx={{ '&:hover': { backgroundColor: 'lightblue' } }}
              >
                Login
              </Button>
            </Box>
          </form>

          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            Don't have an account?{' '}
            {/* <Link href="/register"underline="hover" color="primary">
              Sign Up
            </Link> */}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
