import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Link, FormControlLabel, Radio, RadioGroup, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../components/common/Logo';
import Test from './GoogleAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';


const SignUp = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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
        // Make sure you access the message or a specific property you need from response.data
        alert(response.data.message || 'Registration successful!'); // Show the message returned by backend
  
        event.target.reset(); // Reset the form fields
  
        // Optionally, redirect to login page or wherever after successful registration
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
        // Check if error.response.data contains a message to show
        alert(error.response.data.message || 'An error occurred');
      } else if (error.request) {
        console.error('Error Request:', error.request);
        alert('No response from server, please try again later');
      } else {
        console.error('Error Message:', error.message);
        alert('Error in submitting form, please try again');
      }
    }
  };

  return(

  // <Container
  //   maxWidth="lg"
  //   sx={{
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     minHeight: '90vh',
  //     padding: '20px',
  //   }}
  // >
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens
        width: '100%',
        maxWidth: '1000px',
        borderRadius: '12px',
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      {/* Left Section */}
      {/* <Box
        sx={{
          flex: 1,
          backgroundColor: '#bbdefb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '40px',
        }}
      >
        <Logo width={240} height={90}/>
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
          Welcome to InventoryPro
        </Typography>
        <img
          src="/img/warehouse.png"
          alt="Warehouse"
          style={{ width: '80%', maxWidth: '300px', marginTop: '20px', marginBottom: '30px' }}
        />
        <Test />
      </Box> */}

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

        <Box sx={{ textAlign: 'center', display: 'grid', gap: 4}}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '3vh'}}>
            Sign Up
          </Typography>
          <Typography>
            Create your account!
          </Typography>

          <form onSubmit={handleSubmit}>
              <Box sx={{ textAlign: 'center', display: 'grid', gap: 4 }}>
                <TextField
                  label="Firstname"
                  variant="outlined"
                  name="firstname"
                  type="text"
                  required
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                />

                <TextField
                  label="Lastname"
                  variant="outlined"
                  name="lastname"
                  type="text"
                  required
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                />

                <TextField
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  required
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                />

                {/* Password Field with Show/Hide Toggle */}
                <TextField
                  label="Password"
                  variant="outlined"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
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

                <RadioGroup row name="gender">
                  <FormControlLabel value="male" control={<Radio />} label="Male" required />
                  <FormControlLabel value="female" control={<Radio />} label="Female" required />
                </RadioGroup>

                {/* <Button
                  type='submit'
                  variant="outlined"
                  disableElevation
                  fullWidth
                  sx={{ borderRadius: 4, '&:hover': {bgcolor: '#e3f2fd'} }}
                  >
                    Create Account
                </Button> */}
                <Button type='submit' variant='outlined'  sx={{ ':hover': {backgroundColor: 'lightblue'} }}>Create account</Button>
              </Box>
            </form>

            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              Already have an account?{' '}
              {/* <Link href="/login" underline="hover" color="primary">
                Sign In
              </Link> */}
            </Typography>
            
        </Box>
      </Box>
    </Box>
  // </Container>
  )
};

export default SignUp;
