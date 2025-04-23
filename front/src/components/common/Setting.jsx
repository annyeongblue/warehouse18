import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import React, { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../Controllers/AuthContext';

export default function Setting() {
  const navigate = useNavigate();
  // const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    // localStorage.removeItem('token');
    // logout();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/uprofile');
    handleMenuClose();
  };

  const renderMobileMenu = (
    <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={handleMenuClose}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    >
      <MenuItem onClick={handleProfile}>
      <IconButton
      size='large'
      aria-label='view profile'
      color='inherit'
      >
        <AccountCircleIcon />
      </IconButton>
      Profile
      </MenuItem>

      <MenuItem onClick={handleLogOut}>
      <IconButton
      size='large'
      aria-label='log out'
      color='inherit'
      >
        <LogoutRoundedIcon />
      </IconButton>
      Log Out
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