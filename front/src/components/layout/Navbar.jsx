import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
// import { Search } from '@mui/icons-material';
import Search from '../common/Search';
import Notifications from '../common/Notification';
import Setting from '../common/Setting';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? 270 : 65,
  width: `calc(100% - ${open ? 270 : 65}px)`,
}));

export default function AppBarComponent({ open, handleDrawerToggle, activePage }) {
  return (
    <AppBar position="fixed" open={open} sx={{ boxShadow: 'none', backgroundColor: 'transparent', color:'black'  }}>
      <Toolbar>
        {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton> */}

        <Typography fontSize={'1.5rem'} noWrap sx={{ flexGrow: 1 }}>
          {activePage}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 0 }}>
          <Search />
          <Notifications />
          <Setting />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
