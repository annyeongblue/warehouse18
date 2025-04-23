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
      '/order': 'Order',
      '/import': 'Import',
      '/borrow': 'Borrow',
      '/export': 'Export',
      '/repair': 'Repair',
      // '/requests': 'Requests',
      '/history': 'History',
      '/users': 'Users',
      '/order_detail/:id': 'Order Detail',
    };

    // Dynamic route patterns
    const dynamicRoutes = [
      { pattern: /^\/order_detail\/[^/]+$/, title: 'Order Detail' },
      { pattern: /^\/import_detail\/[^/]+$/, title: 'Import Detail' },
      { pattern: /^\/borrow_detail\/[^/]+$/, title: 'Borrow Detail' },
      { pattern: /^\/export_detail\/[^/]+$/, title: 'Export Detail' },
      { pattern: /^\/repair_detail\/[^/]+$/, title: 'Repair Detail' },
    ];

    // Check dynamic routes first
    const matchedDynamicRoute = dynamicRoutes.find(route => route.pattern.test(location.pathname));
    if (matchedDynamicRoute) {
      setActivePage(matchedDynamicRoute.title);
    } else {
      // Fallback to static routes or default to 'Dashboard'
      setActivePage(pathToTitle[location.pathname] || 'Dashboard');
    }
  }, [location]);

  return (
    <Box>
      <CssBaseline />
      <Navbar open={open} handleDrawerToggle={handleDrawerToggle} activePage={activePage} />
      <SidebarComponent open={open} handleDrawerToggle={handleDrawerToggle} activePage={activePage} setActivePage={setActivePage} />
    </Box>
  );
}
