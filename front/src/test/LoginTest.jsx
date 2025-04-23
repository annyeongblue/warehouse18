import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  InputAdornment, 
  IconButton,
  Fade
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        alert('Login successful!');
        event.target.reset();
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error?.message || 'Login failed. Please try again.');
      } else if (error.request) {
        alert('No response from server. Please check if Strapi is running.');
      } else {
        alert('Error in submitting form. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
      }}
    >
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            padding: 4,
            transition: 'transform 0.3s ease-in-out',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '20px',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'text.secondary' }}
            >
              Sign in to continue!
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(245, 245, 245, 0.5)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'rgba(245, 245, 245, 0.8)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
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
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(245, 245, 245, 0.5)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'rgba(245, 245, 245, 0.8)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleTogglePassword} 
                        edge="end"
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: '12px',
                  padding: '12px',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1EB3D2 90%)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Sign In
              </Button>

              {/* <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center', 
                  color: 'text.secondary' 
                }}
              >
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { 
                      textDecoration: 'underline',
                      color: 'primary.dark' 
                    }
                  }}
                >
                  Sign Up
                </Link>
              </Typography> */}
            </Box>
          </form>
        </Box>
      </Fade>
    </Box>
  );
};

export default SignIn;