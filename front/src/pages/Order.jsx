import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button as MuiButton,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
  Menu,
  ListItemIcon,
  Button
} from '@mui/material';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';

const getCurrentData = () => {
  return new Date().toISOString().split('T')[0];
};

function AddOrder({ orders, setOrders, newOrder, setNewOrder }) {
  const handleAddOrder = () => {
    const { date, status, description, check_import, user_1 } = newOrder;
    if (!status) {
      alert("Please fill out required fields.");
      return;
    }

    const orderExists = orders.some(
      (orderItem) => orderItem.date === date && orderItem.description.toLowerCase() === description.toLowerCase()
    );
    if (orderExists) {
      alert("Order already exists.");
      return;
    }

    const newOrderData = {
      id: orders.length + 1,
      date: getCurrentData(),
      status,
      description,
      check_import,
      user_1,
    };

    setOrders([...orders, newOrderData]);
    setNewOrder({ date: '', status: '', description: '', check_import: false, user_1: '' });
  };

  return (
    <ModernButton
      variant="contained"
      onClick={handleAddOrder}
      sx={{
        width: '160px',
        borderRadius: '20px',
        mt: 2,
        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        color: '#fff',
        '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
      }}
    >
      Add Order
    </ModernButton>
  );
}

const Orders = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOrder, setNewOrder] = useState({
    date: getCurrentData(),
    status: '',
    description: '',
    check_import: false,
    user_1: '',
  });
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: '2025-03-01',
      status: 'Pending',
      description: 'Laptop order',
      check_import: true,
      user_1: 'JohnDoe',
    },
    {
      id: 2,
      date: '2025-03-02',
      status: 'Shipped',
      description: 'Keyboard order',
      check_import: false,
      user_1: 'JaneSmith',
    },
  ]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const userOptions = ['JohnDoe', 'JaneSmith', 'AliceJohnson', 'BobBrown'];
  const checkImportOptions = [true, false];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  const handleEdit = (order) => {
    setEditId(order.id);
    setNewOrder({ ...order, date: getCurrentData() });
  };

  const handleSaveEdit = () => {
    setOrders(
      orders.map((order) =>
        order.id === editId ? { ...order, ...newOrder, date: getCurrentData() } : order
      )
    );
    setEditId(null);
    setNewOrder({ date: '', status: '', description: '', check_import: false, user_1: '' });
  };

  const handleDelete = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleDetail = (orderId) => {
    navigate(`/order_details`); // Navigate to the order detail page
  };
  // const handleDetail = (orderId) => {
  //   navigate(`/order_details/${orderId}`); // Navigate to the order detail page
  // };

  const filteredOrders = orders.filter((orderItem) =>
    orderItem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      {/* Form Section */}
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newOrder.date}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <ModernSelect
                value={newOrder.status}
                label="Status"
                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Check Import</InputLabel>
              <ModernSelect
                value={newOrder.check_import}
                label="Check Import"
                onChange={(e) => setNewOrder({ ...newOrder, check_import: e.target.value })}
              >
                {checkImportOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.toString()}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>User 1</InputLabel>
              <ModernSelect
                value={newOrder.user_1}
                label="User 1"
                onChange={(e) => setNewOrder({ ...newOrder, user_1: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {userOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <ModernTextField
              label="Description"
              fullWidth
              variant="outlined"
              value={newOrder.description}
              onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            {editId ? (
              <ModernButton
                variant="contained"
                onClick={handleSaveEdit}
                sx={{
                  borderRadius: '20px',
                  background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(45deg, #2e7d32, #4caf50)' },
                }}
              >
                Save Edit
              </ModernButton>
            ) : (
              <AddOrder orders={orders} setOrders={setOrders} newOrder={newOrder} setNewOrder={setNewOrder} />
            )}
          </Grid>
        </Grid>
      </ModernPaper>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label="Search for Order"
          sx={{ maxWidth: '400px', borderRadius: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
      </Box>

      {/* Table Section */}
      <ModernTableContainer
        sx={{
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          background: '#fff',
        }}
      >
        <Table>
          <ModernTableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Check Import</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User 1</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign:'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((orderItem) => (
                <ModernTableRow key={orderItem.id}>
                  <TableCell>{orderItem.id}</TableCell>
                  <TableCell>{orderItem.date}</TableCell>
                  <TableCell>{orderItem.status}</TableCell>
                  <TableCell>{orderItem.description}</TableCell>
                  <TableCell>{orderItem.check_import.toString()}</TableCell>
                  <TableCell>{orderItem.user_1}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      onClick={() => handleEdit(orderItem)}
                    >
                      <ListItemIcon sx={{ color: '#388e3c'}}>
                        <EditRoundedIcon />
                      </ListItemIcon>
                    </Button>
                    <Button
                      onClick={() => handleDelete(orderItem.id)}
                      >
                      <ListItemIcon sx={{ color: 'red'}}>
                        <DeleteRoundedIcon />
                      </ListItemIcon>
                    </Button>
                    <Button
                      onClick={() => handleDetail(orderItem.id)} // Navigate using order ID
                    >
                      <ListItemIcon sx={{ color: '#4dabf5' }}>
                        <EyeOutlinedIcon />
                      </ListItemIcon>
                    </Button>
                  </TableCell>
                </ModernTableRow>
              ))}
          </TableBody>
        </Table>
      </ModernTableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
};

export default Orders;