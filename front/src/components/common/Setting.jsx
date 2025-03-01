import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import React, { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Setting() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMobileMenu = (
    <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={handleMenuClose}
    >
      <MenuItem>
      <IconButton size='large' aria-label='show 17 new settings' color='inherit'>
        {/* <Badge badgeContent={17} color='error'> */}
          <AccountCircleIcon />
        {/* </Badge> */}
      </IconButton>
      <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  return(
    <div>
      <IconButton
      size="large"
      aria-label="show 17 new Settings"
      color="inherit"
      onClick={handleMenuOpen}
      >
        <Badge badgeContent={17} color="error">
          <SettingsIcon />
        </Badge>
      </IconButton>
      {renderMobileMenu}
    </div>
  )
}