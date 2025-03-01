import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import MoveToInboxRoundedIcon from '@mui/icons-material/MoveToInboxRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import { Link, useLocation } from 'react-router-dom';
import Profile from '../common/Profile';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';


const drawerWidth = 270;

// Styled components for the drawer's opened and closed states
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  '& .MuiDrawer-paper': open ? openedMixin(theme) : closedMixin(theme),
}));

export default function Sidebar({ open, handleDrawerToggle }) {
  const theme = useTheme();
  const location = useLocation(); // Access current route
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const [selected, setSelected] = useState(0);

  // Update `selected` state based on current route
  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard':
        setSelected(0);
        break;
      case '/inventory':
      case '/inventory/items':
      case '/inventory/unit':
      case '/inventory/brand':
      case '/inventory/categories':
      case '/inventory/iteminformation':
        setSelected(1);
        setInventoryOpen(true); // Ensure submenu is open for inventory paths
        break;
      case '/import':
        setSelected(4);
        break;
      case '/requests':
        setSelected(5);
        break;
      case '/history':
        setSelected(6);
        break;
      case '/users':
        setSelected(7);
        break;
      default:
        setSelected(-1); // Fallback for untracked paths
        break;
    }
  }, [location.pathname]);

  const handleInventoryToggle = () => {
    setInventoryOpen((prev) => !prev);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        '& .MuiDrawer-paper': {},
      }}
    >
      {/* Drawer Header */}
      <DrawerHeader sx={{ position: 'absolute', bottom: 0, display: 'flex', width: '100%', justifyContent: 'center' }}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ArrowLeftRoundedIcon /> : <ArrowRightRoundedIcon />}
        </IconButton>
      </DrawerHeader>

      {/* Profile Section */}
      <Profile open={open} />

      {/* <Divider
        sx={{
          borderColor: 'black',
          width: open ? '80%' : '50%',
          margin: '0 auto',
          transition: 'width 0.3s ease',
        }}
      /> */}

      {/* Navigation List */}
      <List sx={{padding: 1, ml: open ? 0 : 0, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        {/* Dashboard */}
        <ListItem disablePadding sx={{ ml:0}}>
          <ListItemButton
            selected={selected === 0}
            component={Link}
            to="/dashboard"
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: '#bbdefb' },
            }}
          >
            <ListItemIcon>
              <SpaceDashboardRoundedIcon sx={{ color: 'black', ml: -0.5 }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Inventory */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 1}
            onClick={handleInventoryToggle}
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: '#bbdefb' },
            }}
          >
            <ListItemIcon>
              <InventoryIcon sx={{ color: 'black', ml: -0.5  }} />
            </ListItemIcon>
            <ListItemText primary="Inventory" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
            {inventoryOpen ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />}
          </ListItemButton>
        </ListItem>

        {/* Inventory Submenu */}
        <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              selected={location.pathname === '/inventory/items'}
              component={Link}
              to="/inventory/items"
              sx={{
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between', // Push icon to the right
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              <ListItemText primary="Items" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}> {/* Ensure the icon is not too spaced out */}
                <PostAddRoundedIcon sx={{ color: 'black', ml: -0.5  }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/unit'}
              component={Link}
              to="/inventory/unit"
              sx={{
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between', // Push icon to the right
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              <ListItemText primary="Unit" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}> {/* Ensure the icon is not too spaced out */}
                <PostAddRoundedIcon sx={{ color: 'black', ml: -0.5  }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/brand'}
              component={Link}
              to="/inventory/brand"
              sx={{
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between', // Push icon to the right
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              <ListItemText primary="Brand" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}> {/* Ensure the icon is not too spaced out */}
                <PostAddRoundedIcon sx={{ color: 'black', ml: -0.5  }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/categories'}
              component={Link}
              to="/inventory/categories"
              sx={{
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              <ListItemText primary="Categories" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <CategoryRoundedIcon sx={{ color: 'black', ml: -0.5  }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/iteminformation'}
              component={Link}
              to="/inventory/iteminformation"
              sx={{
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              <ListItemText primary="Item Information" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <DescriptionRoundedIcon sx={{ color: 'black', ml: -0.5  }} />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Collapse>


        {/* Import */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 4}
            component={Link}
            to="/import"
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: '#bbdefb' },
            }}
          >
            <ListItemIcon>
              <CreateRoundedIcon sx={{ color: 'black', ml: -0.5 }} />
            </ListItemIcon>
            <ListItemText primary="Import" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Requests */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 5}
            component={Link}
            to="/requests"
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: '#bbdefb' },
            }}
          >
            <ListItemIcon>
              <MoveToInboxRoundedIcon sx={{ color: 'black', ml: -0.5  }} />
            </ListItemIcon>
            <ListItemText primary="Requests" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* History */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 6}
            component={Link}
            to="/history"
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: '#bbdefb' },
            }}
          >
            <ListItemIcon>
              <HistoryIcon sx={{ color: 'black', ml: -0.5  }} />
            </ListItemIcon>
            <ListItemText primary="History" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Users */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 7}
            component={Link}
            to="/users"
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: '#bbdefb' },
            }}
          >
            <ListItemIcon>
              <PersonRoundedIcon sx={{ color: 'black', ml: -0.5   }} />
            </ListItemIcon>
            <ListItemText primary="Users" sx={{ color: 'black', transition: 'opacity 0.5s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
