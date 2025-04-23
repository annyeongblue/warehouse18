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

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: 'hidden',
  background: '#1e1e2f', // Modern dark background
  color: '#d1d5db', // Soft gray text
  boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  background: '#1e1e2f',
  color: '#d1d5db',
  boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
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
  const location = useLocation();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selected, setSelected] = useState(0);

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
        setInventoryOpen(true);
        break;
      case '/order':
        setSelected(4);
        break;
      case '/import':
        setSelected(5);
        break;
      case '/borrow':
        setSelected(6);
        break;
      case '/export':
        setSelected(7);
        break;
      case 'repair':
        setSelected(8);
        break;
      case '/requests':
        setSelected(9);
        break;
      case '/history':
        setSelected(10);
        break;
      case '/users':
        setSelected(11);
        break;
      default:
        setSelected(-1);
        break;
    }
  }, [location.pathname]);

  const handleInventoryToggle = () => {
    setInventoryOpen((prev) => !prev);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader sx={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center' }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#d1d5db' }}>
          {open ? <ArrowLeftRoundedIcon /> : <ArrowRightRoundedIcon />}
        </IconButton>
      </DrawerHeader>

      <Profile open={open} />

      <Divider
        sx={{
          borderColor: '#ffffff', // Softer divider color
          width: open ? '80%' : '50%',
          margin: '0 auto',
          transition: 'width 0.3s ease',
          
        }}
      />

      <List sx={{ padding: 1, ml: open ? 0 : 0, display: 'flex', flexDirection: 'column' }}>
        {/* Dashboard */}
        <ListItem disablePadding sx={{ ml: 0 }}>
          <ListItemButton
            selected={selected === 0}
            component={Link}
            to="/dashboard"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 0 ? '#3b82f6' : 'transparent', // Modern blue for selected
              color: selected === 0 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 0 ? '#3b82f6' : '#2a2a3f' }, // Subtle hover
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <SpaceDashboardRoundedIcon sx={{ color: selected === 0 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Inventory */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 1}
            onClick={handleInventoryToggle}
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 1 ? '#3b82f6' : 'transparent',
              color: selected === 1 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 1 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <InventoryIcon sx={{ color: selected === 1 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Inventory" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
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
                borderRadius: '12px',
                margin: '4px 16px',
                backgroundColor: location.pathname === '/inventory/items' ? '#3b82f6' : 'transparent',
                color: location.pathname === '/inventory/items' ? '#fff' : '#d1d5db',
                '&:hover': { backgroundColor: location.pathname === '/inventory/items' ? '#3b82f6' : '#2a2a3f' },
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <ListItemText primary="Items" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <PostAddRoundedIcon sx={{ color: location.pathname === '/inventory/items' ? '#fff' : '#d1d5db', ml: -1.46 }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/unit'}
              component={Link}
              to="/inventory/unit"
              sx={{
                borderRadius: '12px',
                margin: '4px 16px',
                backgroundColor: location.pathname === '/inventory/unit' ? '#3b82f6' : 'transparent',
                color: location.pathname === '/inventory/unit' ? '#fff' : '#d1d5db',
                '&:hover': { backgroundColor: location.pathname === '/inventory/unit' ? '#3b82f6' : '#2a2a3f' },
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <ListItemText primary="Unit" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <PostAddRoundedIcon sx={{ color: location.pathname === '/inventory/unit' ? '#fff' : '#d1d5db', ml: -1.46 }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/brand'}
              component={Link}
              to="/inventory/brand"
              sx={{
                borderRadius: '12px',
                margin: '4px 16px',
                backgroundColor: location.pathname === '/inventory/brand' ? '#3b82f6' : 'transparent',
                color: location.pathname === '/inventory/brand' ? '#fff' : '#d1d5db',
                '&:hover': { backgroundColor: location.pathname === '/inventory/brand' ? '#3b82f6' : '#2a2a3f' },
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <ListItemText primary="Brand" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <PostAddRoundedIcon sx={{ color: location.pathname === '/inventory/brand' ? '#fff' : '#d1d5db', ml: -1.46 }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/categories'}
              component={Link}
              to="/inventory/categories"
              sx={{
                borderRadius: '12px',
                margin: '4px 16px',
                backgroundColor: location.pathname === '/inventory/categories' ? '#3b82f6' : 'transparent',
                color: location.pathname === '/inventory/categories' ? '#fff' : '#d1d5db',
                '&:hover': { backgroundColor: location.pathname === '/inventory/categories' ? '#3b82f6' : '#2a2a3f' },
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <ListItemText primary="Categories" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <CategoryRoundedIcon sx={{ color: location.pathname === '/inventory/categories' ? '#fff' : '#d1d5db', ml: -1.46 }} />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === '/inventory/iteminformation'}
              component={Link}
              to="/inventory/iteminformation"
              sx={{
                borderRadius: '12px',
                margin: '4px 16px',
                backgroundColor: location.pathname === '/inventory/iteminformation' ? '#3b82f6' : 'transparent',
                color: location.pathname === '/inventory/iteminformation' ? '#fff' : '#d1d5db',
                '&:hover': { backgroundColor: location.pathname === '/inventory/iteminformation' ? '#3b82f6' : '#2a2a3f' },
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <ListItemText primary="Item Information" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <DescriptionRoundedIcon sx={{ color: location.pathname === '/inventory/iteminformation' ? '#fff' : '#d1d5db', ml: -1.46 }} />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Collapse>

        {/* Order */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 4}
            component={Link}
            to="/order"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 4 ? '#3b82f6' : 'transparent',
              color: selected === 4 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 4 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <CreateRoundedIcon sx={{ color: selected === 4 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Order" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Import */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 5}
            component={Link}
            to="/import"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 5 ? '#3b82f6' : 'transparent',
              color: selected === 5 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 5 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <CreateRoundedIcon sx={{ color: selected === 5 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Import" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Borrow */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 6}
            component={Link}
            to="/borrow"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 6 ? '#3b82f6' : 'transparent',
              color: selected === 6 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 6 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <CreateRoundedIcon sx={{ color: selected === 6 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Borrow" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Export */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 7}
            component={Link}
            to="/export"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 7 ? '#3b82f6' : 'transparent',
              color: selected === 7 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 7 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <CreateRoundedIcon sx={{ color: selected === 7 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Export" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Repair */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 8}
            component={Link}
            to="/repair"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 8 ? '#3b82f6' : 'transparent',
              color: selected === 8 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 8 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <CreateRoundedIcon sx={{ color: selected === 8 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Repair" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Requests */}
        {/* <ListItem disablePadding>
          <ListItemButton
            selected={selected === 9}
            component={Link}
            to="/requests"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 9 ? '#3b82f6' : 'transparent',
              color: selected === 9 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 9 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <MoveToInboxRoundedIcon sx={{ color: selected === 9 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Requests" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem> */}

        {/* History */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 10}
            component={Link}
            to="/history"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 10? '#3b82f6' : 'transparent',
              color: selected === 10 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 10 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <HistoryIcon sx={{ color: selected === 10 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="History" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        {/* Users */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selected === 11}
            component={Link}
            to="/users"
            sx={{
              borderRadius: '12px',
              margin: '4px 8px',
              backgroundColor: selected === 11 ? '#3b82f6' : 'transparent',
              color: selected === 11 ? '#fff' : '#d1d5db',
              '&:hover': { backgroundColor: selected === 11 ? '#3b82f6' : '#2a2a3f' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon>
              <PersonRoundedIcon sx={{ color: selected === 11 ? '#fff' : '#d1d5db', ml: -1.46 }} />
            </ListItemIcon>
            <ListItemText primary="Users" sx={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}