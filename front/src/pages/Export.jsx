import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
} from '@mui/material';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/imports';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentData = () => new Date().toISOString().split('T')[0];

function AddOrder({ imports, setImport, newImport, setNewImport }) {
  const handleAddOrder = () => {
    const { status, description } = newImport;
    if (!status) {
      alert("Please fill out required fields.");
      return;
    }

    const orderExists = imports.some(
      (order) => order.description && order.description.toLowerCase() === description.toLowerCase()
    );
    if (orderExists) {
      alert("Order already exists.");
      return;
    }

    const newImportData = { ...newImport, id: imports.length + 1, date: getCurrentData() };
    setImport([...imports, newImportData]);
    setNewImport({ date: '', status: '', description: '', check_import: false, user_1: '' });
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

const imports = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newImport, setNewImport] = useState({
    date: getCurrentData(),
    status: '',
    description: '',
    check_import: false,
    user_1: '',
  });
  const [imports, setImport] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const userOptions = ['JohnDoe', 'JaneSmith', 'AliceJohnson', 'BobBrown'];
  const checkImportOptions = [true, false];

  const fetchimports = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      console.log('Raw API Data:', data); // Log raw response
      const formattedData = data.map((order) => ({
        id: order.id,
        date: order.date || getCurrentData(),
        status: order.status || 'Pending',
        description: order.description || '',
        check_import: order.check_import ?? false,
        user_1: order.user_1 || 'Unknown',
      }));
      console.log('Formatted imports:', formattedData); // Log mapped data
      setImport(formattedData);
    } catch (err) {
      console.error('Error fetching imports:', err.response?.data?.error?.message || err.message);
    }
  };

  useEffect(() => {
    fetchimports();
  }, []);

  const handleEdit = (order) => {
    setEditId(order.id);
    setNewImport({ ...order, date: getCurrentData() });
  };

  const handleSaveEdit = () => {
    setImport(
      imports.map((order) =>
        order.id === editId ? { ...order, ...newImport, date: getCurrentData() } : order
      )
    );
    setEditId(null);
    setNewImport({ date: '', status: '', description: '', check_import: false, user_1: '' });
  };

  const handleDelete = (id) => {
    setImport(imports.filter((order) => order.id !== id));
  };

  const handleDetail = (orderId) => {
    navigate(`/order_details`);
  };

  const filteredimports = imports.filter((order) =>
    (order.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('Filtered imports:', filteredimports); // Log filtered data

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
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <ModernSelect
                value={newImport.status}
                label="Status"
                onChange={(e) => setNewImport({ ...newImport, status: e.target.value })}
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
                value={newImport.check_import}
                label="Check Import"
                onChange={(e) => setNewImport({ ...newImport, check_import: e.target.value })}
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
                value={newImport.user_1}
                label="User 1"
                onChange={(e) => setNewImport({ ...newImport, user_1: e.target.value })}
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
              value={newImport.description}
              onChange={(e) => setNewImport({ ...newImport, description: e.target.value })}
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
              <AddOrder imports={imports} setImport={setImport} newImport={newImport} setNewImport={setNewImport} />
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
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {imports.map((order) => (
              <ModernTableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell>{order.check_import.toString()}</TableCell>
                <TableCell>{order.user_1}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                    <Button onClick={() => handleEdit(order)} sx={{ padding: 0, minWidth: 'auto' }}>
                      <EditRoundedIcon />
                    </Button>
                    <Button onClick={() => handleDelete(order.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                      <DeleteRoundedIcon />
                    </Button>
                    <Button onClick={() => handleDetail(order.id)} sx={{ padding: 0, minWidth: 'auto' }}>
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
        count={filteredimports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
};

export default imports;