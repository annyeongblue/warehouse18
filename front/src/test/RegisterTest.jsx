import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Link, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  InputAdornment, 
  IconButton,
  Fade 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const firstname = event.target.firstname.value;
    const lastname = event.target.lastname.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const gender = event.target.gender.value;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        firstname,
        lastname,
        email,
        password,
        gender,
      });

      if (response.status === 201) {
        alert(response.data.message || 'Registration successful!');
        event.target.reset();
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'An error occurred');
      } else if (error.request) {
        alert('No response from server, please try again later');
      } else {
        alert('Error in submitting form, please try again');
      }
      console.error('Error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // minHeight: '100vh',
        // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        // padding: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '480px',
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
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'text.secondary' }}
            >
              Join us today!
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  name="firstname"
                  type="text"
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(245, 245, 245, 0.5)',
                      transition: 'all 0.3s',
                      '&:hover': { background: 'rgba(245, 245, 245, 0.8)' },
                    },
                    '& .MuiInputLabel-root': { color: 'text.secondary' },
                  }}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  name="lastname"
                  type="text"
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(245, 245, 245, 0.5)',
                      transition: 'all 0.3s',
                      '&:hover': { background: 'rgba(245, 245, 245, 0.8)' },
                    },
                    '& .MuiInputLabel-root': { color: 'text.secondary' },
                  }}
                />
              </Box>

              <TextField
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(245, 245, 245, 0.5)',
                    transition: 'all 0.3s',
                    '&:hover': { background: 'rgba(245, 245, 245, 0.8)' },
                  },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                }}
              />

              <TextField
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(245, 245, 245, 0.5)',
                    transition: 'all 0.3s',
                    '&:hover': { background: 'rgba(245, 245, 245, 0.8)' },
                  },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
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

              <RadioGroup 
                row 
                name="gender"
                sx={{ 
                  justifyContent: 'center',
                  '& .MuiFormControlLabel-label': {
                    color: 'text.secondary',
                    fontWeight: 500
                  }
                }}
              >
                <FormControlLabel 
                  value="male" 
                  control={<Radio sx={{ color: 'primary.main' }} />} 
                  label="Male" 
                  required 
                />
                <FormControlLabel 
                  value="female" 
                  control={<Radio sx={{ color: 'primary.main' }} />} 
                  label="Female" 
                  required 
                />
              </RadioGroup>

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
                Create Account
              </Button>

              {/* <Typography 
                variant="body2" 
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              >
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { 
                      textDecoration: 'underline',
                      color: 'primary.dark' 
                    }
                  }}
                >
                  Sign In
                </Link>
              </Typography> */}
            </Box>
          </form>
        </Box>
      </Fade>
    </Box>
  );
};

export default SignUp;