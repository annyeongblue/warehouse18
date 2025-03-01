import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SidebarComponent from './SidebarTest';
import Navbar from './Navbar'
import { useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function SideTest() {
  const isSmallScreen = useMediaQuery('(max-width: 850px)');
  const [open, setOpen] = React.useState(!isSmallScreen);
  const [activePage, setActivePage] = React.useState('Dashboard');
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  React.useEffect(() => {
    const pathToTitle = {
      '/dashboard': 'Dashboard',
      '/inventory': 'Inventory',
      '/inventory/items' : 'Items',
      '/inventory/categories' : 'Categories',
      '/inventory/unit' : 'Unit',
      '/inventory/brand' : 'Brand',
      '/inventory/iteminformation' : 'Item Information',
      '/import': 'Import',
      '/requests': 'Requests',
      '/history': 'History',
      '/users': 'Users',
    };
    setActivePage(pathToTitle[location.pathname] || 'Dashboard');
  }, [location]);

  return (
    <Box>
      <CssBaseline />
      <Navbar open={open} handleDrawerToggle={handleDrawerToggle} activePage={activePage} />
      <SidebarComponent open={open} handleDrawerToggle={handleDrawerToggle} activePage={activePage} setActivePage={setActivePage} />
    </Box>
  );
}
