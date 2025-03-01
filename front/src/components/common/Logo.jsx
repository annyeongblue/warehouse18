import React from 'react';
import { Box } from '@mui/material';

const Logo = ({ width = 150, height = 60 }) => {
  return (
    <Box component="img" src="img/laoitdev.png" alt="logo" sx={{ width, height, mb: 2 }} />
  );
};

export default Logo;
