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
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/exports';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentDate = () => new Date().toISOString().split('T')[0];

function AddExport({ exports, setExports, newExport, setNewExport }) {
  const handleAddExport = async () => {
    const { status, user } = newExport;
    if (!status || !user) {
      alert("Please fill out required fields.");
      return;
    }

    const exportExists = exports.some(
      (exp) => exp.user && exp.user.toLowerCase() === user.toLowerCase()
    );
    if (exportExists) {
      alert("Export record already exists for this user.");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { data: { ...newExport, export_date: getCurrentDate() } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setExports([...exports, response.data.data]);
      setNewExport({ export_date: '', status: '', user: '', item: '', qty: '', comment: '' });
    } catch (err) {
      console.error('Error adding export:', err);
      alert('Failed to add export record.');
    }
  };

  return (
    <ModernButton
      variant="contained"
      onClick={handleAddExport}
      sx={{
        width: '160px',
        borderRadius: '20px',
        mt: 2,
        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        color: '#fff',
        '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
      }}
    >
      Add Export
    </ModernButton>
  );
}

function Export() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newExport, setNewExport] = useState({
    export_date: getCurrentDate(),
    status: '',
    user: '',
    item: '',
    qty: '',
    comment: '',
  });
  const [exports, setExports] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const statusOptions = ['Pending', 'Exported', 'Received', 'Overdue']; // Adjusted status options
  const userOptions = ['Loungfar', 'Tockky', 'Nana'];
  const itemOptions = ['Book', 'Laptop', 'Tool', 'Camera'];

  const fetchExports = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      const formattedData = data.map((exp) => ({
        id: exp.id,
        export_date: exp.attributes?.export_date || getCurrentDate(),
        status: exp.attributes?.status || 'Pending',
        user: exp.attributes?.user || 'Unknown',
        item: exp.attributes?.item || '',
        qty: exp.attributes?.qty || '1',
        comment: exp.attributes?.comment || '',
      }));
      setExports(formattedData);
    } catch (err) {
      console.error('Error fetching exports:', err.response?.data?.error?.message || err.message);
      alert('Failed to fetch export records.');
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleEdit = (exp) => {
    setEditId(exp.id);
    setNewExport({ ...exp });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${editId}`,
        { data: { ...newExport, export_date: getCurrentDate() } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setExports(
        exports.map((exp) =>
          exp.id === editId ? response.data.data : exp
        )
      );
      setEditId(null);
      setNewExport({ export_date: '', status: '', user: '', item: '', qty: '', comment: '' });
    } catch (err) {
      console.error('Error updating export:', err);
      alert('Failed to update export record.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      setExports(exports.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error('Error deleting export:', err);
      alert('Failed to delete export record.');
    }
  };

  const handleDetail = (exportId) => {
    navigate(`/export_detail/${exportId}`);
  };

  const filteredExports = exports.filter((exp) =>
    (exp.user || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <ModernTextField
              label="Export Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newExport.export_date}
              disabled
            />
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Item</InputLabel>
              <ModernSelect
                value={newExport.item}
                label="Item"
                onChange={(e) => setNewExport({ ...newExport, item: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {itemOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <ModernSelect
                value={newExport.user}
                label="User"
                onChange={(e) => setNewExport({ ...newExport, user: e.target.value })}
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
          <Grid item xs={12} sm={4}>
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
          {/* <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={newExport.qty}
              onChange={(e) => setNewExport({ ...newExport, qty: e.target.value })}
            />
          </Grid> */}
          <Grid item xs={12} sm={12}>
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
              <AddExport exports={exports} setExports={setExports} newExport={newExport} setNewExport={setNewExport} />
            )}
          </Grid>
        </Grid>
      </ModernPaper>

      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label="Search for User"
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
              <TableCell sx={{ fontWeight: 'bold' }}>Export Date</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell> */}
              {/* <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell> */}
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredExports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((exp) => (
                <ModernTableRow key={exp.id}>
                  <TableCell>{exp.id}</TableCell>
                  <TableCell>{exp.export_date}</TableCell>
                  {/* <TableCell>{exp.item}</TableCell> */}
                  {/* <TableCell>{exp.qty}</TableCell> */}
                  <TableCell>{exp.user}</TableCell>
                  <TableCell>{exp.status}</TableCell>
                  <TableCell>{exp.comment || 'None'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                      <Button onClick={() => handleEdit(exp)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <EditRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDelete(exp.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <DeleteRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDetail(exp.id)} sx={{ padding: 0, minWidth: 'auto' }}>
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
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
}

export default Export;