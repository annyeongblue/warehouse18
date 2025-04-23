import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
} from '@mui/material';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/orders';
const USER_API_URL = 'http://localhost:1337/api/users';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentDate = () => new Date().toISOString().split('T')[0];

function AddOrder({
  date, setDate,
  statas, setStatas,
  checkimport, setCheckImport,
  description, setDescription,
  user_1, setUsers,
  isEditing, editingOrder, setIsEditing, setEditingOrder,
  orders, setOrders,
  users, // Add users prop to get user IDs
  fetchOrders,
}) {
  const handleAddOrder = async () => {
    // console.log('Debugging required fields:');
    // console.log('user_1:', user_1);
    // console.log('date:', date);
    // console.log('statas:', statas);
    // console.log('description:', description);
    // console.log('check_import:', checkimport);
    // if (isEditing) {
    //   console.log('Editing order ID:', editingOrder.id); // Add this
    // }

    const missingFields = [];
    if (!user_1) missingFields.push('user_1');
    if (!date) missingFields.push('date');
    if (!statas) missingFields.push('status');

    if (missingFields.length > 0) {
      alert(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Find the user ID based on the selected firstname
    const selectedUser = users.find((user) => user.firstname === user_1);
    const userId = selectedUser?.id;

    if (!userId) {
      alert('Selected user not found in the users list.');
      return;
    }

    const newOrder = {
      date,
      statas,
      check_import: checkimport,
      description,
      user_1: { connect: [{ id: userId }] }, // Send ID for new orders, keep string for edits temporarily
    };

    try {
      if (isEditing) {
          const response = await axios.put(
              `${API_URL}/${editingOrder.id}`,
              newOrder,
              { headers: { Authorization: `Bearer ${API_TOKEN}` } }
          );
          await fetchOrders();
          alert('Order updated successfully!');
      } else {
          const response = await axios.post(
              API_URL,
              newOrder,
              { headers: { Authorization: `Bearer ${API_TOKEN}` } }
          );
          setOrders(prev => [...prev, {
              id: response.data.data.id,
              date,
              status,
              check_import: checkimport,
              description,
              user_1: user_1
          }]);
          alert('Order added successfully!');
      }

      // Reset form
      setDate(getCurrentDate());
      setStatas('Pending');
      setCheckImport(false);
      setDescription('');
      setUsers('');
      setIsEditing(false);
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to add/update order');
  }
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
      {isEditing ? 'Update Order' : 'Add Order'}
    </ModernButton>
  );
}

const Orders = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOrder, setNewOrder] = useState({
    date: getCurrentDate(),
    statas: 'Pending',
    description: '',
    check_import: false,
    user_1: '',
  });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const navigate = useNavigate();

  const statusOptions = ['Pending', 'Approved', 'Reject'];
  const checkImportOptions = [true, false];

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}?populate=*`);
      if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status}`);
      const orderData = await response.json();
      console.log('Orders raw response:', orderData);
      const ordersArray = orderData.data.map((order) => ({
        id: order.id,
        date: order.date || getCurrentDate(),
        statas: order.statas || 'Pending',
        description: order.description || '',
        check_import: order.check_import ?? false,
        user_1: order.order_user?.username || 'Unknown',
      }));
      setOrders(ordersArray);
    } catch (err) {
      console.error('Fetch error:', err);
      alert(`Failed to fetch orders: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchOrders();
    
        const userResponse = await fetch(`${USER_API_URL}?populate=*`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });
        if (!userResponse.ok) throw new Error(`Failed to fetch users: ${userResponse.status}`);
        const userData = await userResponse.json();
        console.log('User API response:', userData);
    
        // Map over userData directly, as it's a flat array
        const usersArray = Array.isArray(userData)
          ? userData.map((user) => ({
              id: user.id,
              firstname: user.username || 'Unknown', // Use username instead of firstname
            }))
          : [];
        setUsers(usersArray);
      } catch (err) {
        console.error('Fetch error:', err);
        alert(`Failed to fetch users: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (order) => {
    setIsEditing(true);
    setEditingOrder(order);
    setNewOrder({
      date: order.date,
      status: order.status,
      check_import: order.check_import,
      description: order.description,
      user_1: order.user_1
    });
};

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
        });
        setOrders(prev => prev.filter(order => order.id !== id));
        alert('Order deleted successfully!');
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete order');
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order ${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              color: #333;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              background: #fff;
            }
            .invoice-header {
              text-align: center;
              border-bottom: 2px solid #1976d2;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .invoice-header h1 {
              margin: 0;
              color: #1976d2;
              font-size: 24px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .invoice-details div {
              width: 45%;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .invoice-table th, .invoice-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .invoice-table th {
              background: #f5f5f5;
              font-weight: bold;
            }
            .invoice-footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .print-button {
              display: block;
              margin: 20px auto;
              padding: 10px 20px;
              background: #1976d2;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            @media print {
              .print-button {
                display: none;
              }
              body {
                margin: 0;
              }
              .invoice-container {
                border: none;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>LaoItDev</h1>
              <h2>Order Report</h2>
              <p>Invoice No: ORD-${order.id} | Issue Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="invoice-details">
              <div>
                <strong>Billed To:</strong><br />
                ${order.user_1}<br />
                [Customer Address Here]
              </div>
              <div>
                <strong>From:</strong><br />
                LaoItDev<br />
                123 Business St, City, Country<br />
                contact@yourcompany.com
              </div>
            </div>
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check Import</th>
                  <th>User</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${order.id}</td>
                  <td>${order.date}</td>
                  <td>${order.status}</td>
                  <td>${order.check_import.toString()}</td>
                  <td>${order.user_1}</td>
                  <td>${order.description || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
            <div class="invoice-footer">
              <p>Generated on ${new Date().toLocaleDateString()}</p>
              <p>Thank you for your business! Contact us at contact@yourcompany.com</p>
            </div>
          </div>
          <button class="print-button" onclick="window.print()">Print Invoice</button>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const filteredOrders = orders.filter((order) =>
    (order.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Date"
              type="date"
              disabled
              fullWidth
              variant="outlined"
              value={newOrder.date}
              onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Statas</InputLabel>
              <ModernSelect
                value={newOrder.statas}
                label="Statas"
                disabled
                onChange={(e) => setNewOrder({ ...newOrder, statas: e.target.value })}
              >
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
                disabled
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
              <InputLabel>User</InputLabel>
              <ModernSelect
                value={newOrder.user_1}
                label="User"
                onChange={(e) => setNewOrder({ ...newOrder, user_1: e.target.value })}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.firstname}>
                    {user.firstname}
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
          <Grid item xs={12} className="text-right">
            <AddOrder
              date={newOrder.date}
              setDate={(value) => setNewOrder({ ...newOrder, date: value })}
              status={newOrder.status}
              setStatus={(value) => setNewOrder({ ...newOrder, status: value })}
              checkImport={newOrder.check_import}
              setCheckImport={(value) => setNewOrder({ ...newOrder, check_import: value })}
              description={newOrder.description}
              setDescription={(value) => setNewOrder({ ...newOrder, description: value })}
              user_1={newOrder.user_1}
              setUsers={(value) => setNewOrder({ ...newOrder, user_1: value })}
              isEditing={isEditing}
              editingOrder={editingOrder}
              setIsEditing={setIsEditing}
              orders={orders}
              setOrders={setOrders}
              users={users}
              fetchOrders={fetchOrders}
            />
          </Grid>
        </Grid>
      </ModernPaper>

      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label="Search for Order"
          sx={{ maxWidth: '400px', borderRadius: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
      </Box>

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
              <TableCell sx={{ fontWeight: 'bold' }}>Statas</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Check Import</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <ModernTableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.statas}</TableCell>
                <TableCell>{order.check_import.toString()}</TableCell>
                <TableCell>{order.user_1}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                    <Button onClick={() => handleEdit(order)} sx={{ padding: 0, minWidth: 'auto' }}>
                      <EditRoundedIcon />
                    </Button>
                    <Button onClick={() => handleDelete(order.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                      <DeleteRoundedIcon />
                    </Button>
                    <Button onClick={() => navigate(`/order_detail/${order.id}`)} sx={{ padding: 0, minWidth: 'auto' }}>
                      <EyeOutlinedIcon />
                    </Button>
                    {/* <Button onClick={() => handlePrintInvoice(order)} sx={{ padding: 0, minWidth: 'auto' }}>
                      <ReceiptOutlinedIcon />
                    </Button> */}
                  </Box>
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
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
};

export default Orders