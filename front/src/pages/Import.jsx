import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/imports';
const USER_API_URL = 'http://localhost:1337/api/user-1s';
const ORDER_API_URL = 'http://localhost:1337/api/orders';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentDate = () => new Date().toISOString().split('T')[0];

function AddImport({
  date, setDate,
  total, setTotal,
  orders, setOrders,
  imports, setImports,
  isEditing, editingImport, setIsEditing, setEditingImport,
  user_1, setUser_1,
  users,
  fetchImports,
}) {
  const handleAddImport = async () => {
    // Log input values for debugging
    console.log('Input values:', { date, total, user_1, orders });

    // Validate inputs
    const missingFields = [];
    if (!date) missingFields.push('date');
    if (!total || isNaN(total) || parseFloat(total) <= 0) missingFields.push('total');
    if (!user_1) missingFields.push('user');
    if (!orders || isNaN(orders)) missingFields.push('order');

    if (missingFields.length > 0) {
      alert(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Find user ID
    const selectedUser = users.find((user) => user.firstname === user_1);
    const userId = selectedUser?.id;

    if (!userId) {
      alert('Selected user not found.');
      return;
    }

    // Prepare API payload
    const importData = {
      data: {
        date,
        total: parseFloat(total),
        user_1: { connect: [{ id: userId }] },
        order: { connect: [{ id: parseInt(orders) }] },
      },
    };

    console.log('API payload:', importData);

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `${API_URL}/${editingImport.id}`,
          importData,
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );
        console.log('Update response:', response.data);
        alert('Import updated successfully!');
        } else {
        response = await axios.post(
          API_URL,
          importData,
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );
        console.log('Add response:', response.data);
        alert('Import added successfully!');
      }

      await fetchImports();

      setDate(getCurrentDate());
      setTotal('');
      setOrders('');
      setUser_1('');
      setIsEditing(false);
      setEditingImport(null);
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error?.message || 'Failed to add/update import';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <ModernButton
      variant="contained"
      onClick={handleAddImport}
      sx={{
        width: '160px',
        borderRadius: '20px',
        mt: 2,
        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        color: '#fff',
        '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
      }}
    >
      {isEditing ? 'Update Import' : 'Add Import'}
    </ModernButton>
  );
}

function Imports() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newImport, setNewImport] = useState({
    date: getCurrentDate(),
    total: '',
    user_1: '',
    order: '',
  });
  const [imports, setImports] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImport, setEditingImport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchImports = async () => {
    try {
      const response = await fetch(`${API_URL}?populate=*`);
      if (!response.ok) throw new Error(`Failed to fetch imports: ${response.status}`);
      const importData = await response.json();
      console.log('Imports raw response:', importData);
      const importsArray = importData.data.map((imp) => {
        console.log('Import ID:', imp.id, 'Order:', imp.order);
        return {
          id: imp.id,
          date: imp.date || getCurrentDate(),
          total: imp.total || 0,
          user_1: imp.user_1?.[0]?.firstname || 'Unknown',
          order: imp.order?.id || 'No Order',
        };
      });
      setImports(importsArray);
    } catch (err) {
      console.error('Fetch error:', err);
      alert(`Failed to fetch imports: ${err.message}`);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${ORDER_API_URL}?populate=*`);
      if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status}`);
      const orderData = await response.json();
      console.log('Full order API response:', orderData);
      const ordersArray = orderData.data.map((order) => ({
        id: order.id,
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
        await Promise.all([fetchImports(), fetchOrders()]);

        const userResponse = await fetch(USER_API_URL);
        if (!userResponse.ok) throw new Error('Failed to fetch users');
        const userData = await userResponse.json();
        const usersArray = userData.data.map((user) => ({
          id: user.id,
          firstname: user.firstname || 'Unknown',
        }));
        setUsers(usersArray);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (imp) => {
    setIsEditing(true);
    setEditingImport(imp);
    setNewImport({ ...imp });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      setImports(imports.filter((imp) => imp.id !== id));
    } catch (err) {
      console.error('Error deleting import:', err.response?.data?.error?.message || err.message);
      alert('Failed to delete import.');
    }
  };

  const handleDetail = (importId) => {
    navigate(`/import_detail/${importId}`);
  };

  const filteredImports = imports.filter((imp) =>
    (imp.total || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    (imp.user_1 || '').toLowerCase().includes(searchQuery.toLowerCase())
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
              value={newImport.date}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Total"
              fullWidth
              type="number"
              variant="outlined"
              value={newImport.total}
              onChange={(e) => setNewImport({ ...newImport, total: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <ModernSelect
                value={newImport.user_1}
                label="User"
                onChange={(e) => setNewImport({ ...newImport, user_1: e.target.value })}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.firstname}>
                    {user.firstname}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Order Bill</InputLabel>
              <ModernSelect
                value={newImport.order}
                label="Order Bill"
                onChange={(e) => setNewImport({ ...newImport, order: e.target.value })}
              >
                {orders.map((bill) => (
                  <MenuItem key={bill.id} value={bill.id}>
                    {bill.id}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} className="text-right">
            <AddImport
              date={newImport.date}
              setDate={(value) => setNewImport({ ...newImport, date: value })}
              total={newImport.total}
              setTotal={(value) => setNewImport({ ...newImport, total: value })}
              user_1={newImport.user_1}
              setUser_1={(value) => setNewImport({ ...newImport, user_1: value })}
              orders={newImport.order}
              setOrders={(value) => setNewImport({ ...newImport, order: value })}
              imports={imports}
              setImports={setImports}
              isEditing={isEditing}
              editingImport={editingImport}
              setIsEditing={setIsEditing}
              setEditingImport={setEditingImport}
              users={users}
              fetchImports={fetchImports}
            />
          </Grid>
        </Grid>
      </ModernPaper>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label="Search for Import by Total or User"
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
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order Bill</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredImports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((imp) => (
                <ModernTableRow key={imp.id}>
                  <TableCell>{imp.id}</TableCell>
                  <TableCell>{imp.date}</TableCell>
                  <TableCell>{imp.total}</TableCell>
                  <TableCell>{imp.user_1}</TableCell>
                  <TableCell>{imp.order || 'No Order'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                      <Button onClick={() => handleEdit(imp)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <EditRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDelete(imp.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <DeleteRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDetail(imp.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <EyeOutlinedIcon />
                      </Button>
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
        count={filteredImports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
}

export default Imports;