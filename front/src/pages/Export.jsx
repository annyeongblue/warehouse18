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

const API_URL = 'http://localhost:1337/api/exports';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentData = () => new Date().toISOString().split('T')[0];

function AddOrder({ exports, setExport, newExport, setNewExport }) {
  const handleAddOrder = () => {
    const { status, comment } = newExport;
    if (!status) {
      alert("Please fill out required fields.");
      return;
    }

    const orderExists = exports.some(
      (order) => order.comment && order.comment.toLowerCase() === comment.toLowerCase()
    );
    if (orderExists) {
      alert("Order already exists.");
      return;
    }

    const newExportData = { ...newExport, id: exports.length + 1, date: getCurrentData() };
    setExport([...exports, newExportData].sort((a, b) => a.id - b.id)); // Added sorting by ID
    setNewExport({ date: '', status: '', comment: '', export_approver: '', export_user: '' });
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

const Exports = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newExport, setNewExport] = useState({
    date: getCurrentData(),
    status: '',
    comment: '',
    export_approver: '',
    export_user: '',
  });
  const [exports, setExport] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const userOptions = ['JohnDoe', 'JaneSmith', 'AliceJohnson', 'BobBrown'];

  const fetchExports = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      const formattedData = data.map((order) => ({
        id: order.id,
        date: order.date || getCurrentData(),
        status: order.status || 'Pending',
        comment: order.comment || '',
        export_approver: order.export_approver || '',
        export_user: order.export_user || '',
      })).sort((a, b) => a.id - b.id); // Added sorting by ID
      setExport(formattedData);
    } catch (err) {
      console.error('Error fetching exports:', err.response?.data?.error?.message || err.message);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleEdit = (order) => {
    setEditId(order.id);
    setNewExport({ ...order, date: getCurrentData() });
  };

  const handleSaveEdit = () => {
    setExport(
      exports.map((order) =>
        order.id === editId ? { ...order, ...newExport, date: getCurrentData() } : order
      ).sort((a, b) => a.id - b.id) // Added sorting by ID
    );
    setEditId(null);
    setNewExport({ date: '', status: '', comment: '', export_approver: '', export_user: '' });
  };

  const handleDelete = (id) => {
    setExport(exports.filter((order) => order.id !== id).sort((a, b) => a.id - b.id)); // Added sorting by ID
  };

  const handleDetail = (orderId) => {
    navigate(`/export_detail`);
  };

  const filteredExports = exports.filter((order) =>
    (order.comment || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newExport.date}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <ModernSelect
                value={newExport.status}
                label="Status"
                onChange={(e) => setNewExport({ ...newExport, status: e.target.value })}
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
              <InputLabel>Export Approver</InputLabel>
              <ModernSelect
                value={newExport.export_approver}
                label="Export Approver"
                onChange={(e) => setNewExport({ ...newExport, export_approver: e.target.value })}
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Export User</InputLabel>
              <ModernSelect
                value={newExport.export_user}
                label="Export User"
                onChange={(e) => setNewExport({ ...newExport, export_user: e.target.value })}
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
              label="Comment"
              fullWidth
              variant="outlined"
              value={newExport.comment}
              onChange={(e) => setNewExport({ ...newExport, comment: e.target.value })}
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
              <AddOrder
                exports={exports}
                setExport={setExport}
                newExport={newExport}
                setNewExport={setNewExport}
              />
            )}
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
              <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Export Approver</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Export User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {exports.map((order) => (
              <ModernTableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.comment}</TableCell>
                <TableCell>{order.export_approver}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.export_user}</TableCell>
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
        count={filteredExports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
};

export default Exports;