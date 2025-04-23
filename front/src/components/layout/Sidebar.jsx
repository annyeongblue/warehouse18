import * as React from 'react';
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
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import Return from '@mui/icons-material/AssignmentReturnedOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import Logo from '../logo';
import { Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


const drawerWidth = 270;

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

export default function SidebarComponent({ open, handleDrawerToggle, activePage, setActivePage }) {
  const theme = useTheme();
  const [inventoryOpen, setInventoryOpen] = React.useState(false);

  const handleInventoryClick = () => {
    setInventoryOpen(!inventoryOpen);
  }

  return (
    <Drawer variant="permanent" open={open} sx={{ [`& .MuiDrawer-paper`]: { backgroundColor: '#e3f2fd' } }}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          {open ? ( <ChevronLeftIcon /> ) :  (<MenuIcon sx={{mr: 0.5, color:'black'}} />)  }
        </IconButton>
      </DrawerHeader>

      <Box textAlign='center' mb={open ? 5 : 1} mt={3}>
        {/* <Logo width={open ? 200 : 70} height={open ? 80 : 32} /> */}
        <Avatar
          alt='User'
          sx={{
            width: open ? 130 : 40,
            height: open ? 130 : 40,
            margin: '10px auto',
            bgcolor: 'gray',
            transition: 'all 0.5s ease',
          }}
        />
        {open && (
          <Typography variant='subtitle1' sx={{ mt: 5, transition: 'all 0.5 ease' }}>
            Loungfar Thammavisan
          </Typography>
        )}
      </Box>
      <Divider sx={{ borderColor: 'white', borderWidth: 1.2, mb: 3 }} />

      <List sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',  // Center the list items vertically
          alignItems: 'flex-start',   // Align items to the left
          textAlign: 'center',
          ml: open ? 2 : 0.5,
          }}
        >
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={() => setActivePage('Dashboard')} >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/inventory" onClick={() => setActivePage('Inventory')}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding onClick={handleInventoryClick}>
          <ListItemButton>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
            {inventoryOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
        <Box sx={{ mr: 4}}>
        <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/inventory/products"
              sx={{ pl: 4}}
              onClick={() => setActivePage('Products')}
            >
              <ListItemText primary="Products" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/inventory/categories"
              sx={{ pl: 4 }}
              onClick={() => setActivePage('Categories')}
            >
              <ListItemText primary="Categories" />
            </ListItemButton>
          </List>
        </Box>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/history" onClick={() => setActivePage('History')}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="History" />
          </ListItemButton>
        </ListItem>

        {/* <ListItem disablePadding>
          <ListItemButton component={Link} to="/requests" onClick={() => setActivePage('Requests')}>
            <ListItemIcon>
              <Return />
            </ListItemIcon>
            <ListItemText primary="Requests" />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Drawer>
  );
}
