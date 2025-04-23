import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
import SidebarControl from './components/layout/SidebarControl';
import Search from './components/common/Search';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Items from './pages/Items';
import Requests from './pages/Requests';
import Navbar from './components/layout/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchBar from './components/common/SearchBar';
import User from './pages/User';
import Register from './forms/Register';
import Login from './forms/Login';
import Profile from './components/common/Profile';
import Categories from './pages/Categories';
import Users from './pages/Users';
import ItemInfo from './pages/ItemInformation';
import Welcome from './pages/Welcome';
import Import from './pages/Import';
import TypeSelected from './components/common/TypeSelected'
import Brand from './pages/Brand'
import Unit from './pages/Unit'
import Order from './pages/Order'
import UProfile from './components/common/UProfile'
import OrderDetails from './pages/Order_Details';
import ImportDetails from './pages/Import_Details';
import Repair from './pages/Repair';
import RepairDetails from './pages/Repair_Details';
import Borrow from './pages/Borrow';
import BorrowDetails from './pages/Borrow_Details';
import Export from './pages/Export';
import ExportDetails from './pages/Export_Details';
import OrderReport from './pages/ReportOrder';

import Test from './CRUSTEST/crud'

import GoogleAuth from '../src/test/GoogleAuth'

import SideTest from './components/layout/SidebarTest';

import GoogleAuthCallback from './callback';

//Test Form
import LogT from './test/LoginTest';
import ReT from './test/RegisterTest';

import Callback from './callback';

import CRUD from './CRUSTEST/crud'
import Orders from './CRUSTEST/orders'
import Imports from './CRUSTEST/imports'

const Layout = ({ children }) => {
  const location = useLocation();

  // Define routes where the Sidebar should NOT appear
  const noSidebarRoutes = ['/login', '/register', '/test', '/sidebar', '/navbar', '/logt', 'ret' ,'/'];

  // Check if current route matches any route in the noSidebarRoutes array
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {/* Render Sidebar only if hideSidebar is false */}
      {!hideSidebar && open && <SidebarControl />}

      {/* Main Content Area */}
      <div
        style={{
          width: hideSidebar ? '0%' : '100%', // Adjusts the width dynamically
          marginLeft: hideSidebar ? '0%' : '0%', // Aligns content appropriately
          padding: '50px',
          marginTop: '30px',
          flexGrow: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const theme = createTheme ({
  typography: {
    allVariants: {
      fontFamily: 'Poppins, sans-serif',
      textTransform: 'none',
      fontSize: 17,
    },
  },
});

const App = () => {
  const [open, setOpen] = React.useState(true); // Default state for sidebar

  return (
    <ThemeProvider theme={theme}>
      <Router>
      <Layout open={open} setOpen={setOpen}> {/* Pass open and setOpen here */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/auth/callback/google" element={<GoogleAuthCallback />} />

          {/* <Route path="/requests" element={<Requests />} /> */}
          <Route path="/search" element={<Search />} />
          <Route path="/sidetest" element={<SideTest />} />
          <Route path="/navbar" element={<Navbar open={open} setOpen={setOpen} />} /> Pass props to Navbar

          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/reportorder" element={<OrderReport />} />
          <Route path="/searchbar" element={<SearchBar />} />
          <Route path="/user" element={<User />} />
          <Route path="/logt" element={<LogT />} />
          <Route path="/ret" element={<ReT />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/import" element={<Import />} />
          <Route path="/import_detail/:importId" element={<ImportDetails />} />
          <Route path="/type" element={<TypeSelected />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order_detail/:orderId" element={<OrderDetails />} />
          <Route path="/google" element={<GoogleAuth />} />
          <Route path="/uprofile" element={<UProfile />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/repair_detail/:repairId" element={<RepairDetails />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/borrow_detail/:borrowId" element={<BorrowDetails />} />
          <Route path="/export" element={<Export />} />
          <Route path="/export_detail/:exportId" element={<ExportDetails />} />

          <Route path="/crud" element={<CRUD />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/imports" element={<Imports />} />
          {/* <Route path="/test" element={<Test />} /> */}

          <Route path='/auth/google/callback' element={<Callback />} />
          
          <Route path="/LogT" element={<LogT />} />
          <Route path="/ReT" element={<ReT />} />

          <Route path="/inventory/items" element={<Items/>} />
          <Route path="/inventory/unit" element={<Unit/>} />
          <Route path="/inventory/brand" element={<Brand/>} />
          <Route path="/inventory/categories" element={<Categories />} />
          <Route path="/inventory/iteminformation" element={<ItemInfo />} />
        </Routes>
      </Layout>
    </Router>
    </ThemeProvider>    
  );
};


export default App;