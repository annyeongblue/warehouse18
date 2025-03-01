import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, variant = 'contained', color = 'primary', fullWidth = true, sx, ...props }) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      sx={{ borderRadius: 4, ...sx }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;