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
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentDate = () => new Date().toISOString().split('T')[0];

function AddImport({ imports, setImports, newImport, setNewImport }) {
  const handleAddImport = async () => {
    const { total } = newImport;
    if (!total) {
      alert("Please fill out the total and user fields.");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { data: { date: getCurrentDate(), total: parseFloat(total) } }, // Parse total as a number
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const newImportData = {
        id: response.data.data.id,
        date: response.data.data.attributes?.date || getCurrentDate(),
        total: response.data.data.attributes?.total || total,
        user: response.data.data.attributes?.user || user,
      };
      setImports([...imports, newImportData]);
      setNewImport({ date: getCurrentDate(), total: '', user: '' });
    } catch (err) {
      console.error('Error adding import:', err.response?.data?.error?.message || err.message);
      alert('Failed to add import.');
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
      Add Import
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
    user: '',
  });
  const [imports, setImports] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const userOptions = ['Loungfar', 'Tockky', 'Nana'];

  const fetchImports = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      console.log('Raw API Data:', data);
      const formattedData = data.map((imp) => ({
        id: imp.id,
        date: imp.attributes?.date || getCurrentDate(),
        total: imp.attributes?.total || 'N/A',
        user: imp.attributes?.user || 'Unknown',
      }));
      console.log('Formatted imports:', formattedData);
      setImports(formattedData);
    } catch (err) {
      console.error('Error fetching imports:', err.response?.data?.error?.message || err.message);
      alert('Failed to fetch imports. Check the server.');
    }
  };

  useEffect(() => {
    fetchImports();
  }, []);

  const handleEdit = (imp) => {
    setEditId(imp.id);
    setNewImport({ ...imp });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${editId}`,
        { data: { date: getCurrentDate(), total: parseFloat(newImport.total), user: newImport.user } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const updatedImport = {
        id: response.data.data.id,
        date: response.data.data.attributes?.date || getCurrentDate(),
        total: response.data.data.attributes?.total || newImport.total,
        user: response.data.data.attributes?.user || newImport.user,
      };
      setImports(
        imports.map((imp) => (imp.id === editId ? updatedImport : imp))
      );
      setEditId(null);
      setNewImport({ date: getCurrentDate(), total: '', user: '' });
    } catch (err) {
      console.error('Error updating import:', err.response?.data?.error?.message || err.message);
      alert('Failed to update import.');
    }
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
    (imp.user || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      {/* Form Section */}
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <ModernTextField
              label="Total"
              fullWidth
              type="number"
              variant="outlined"
              value={newImport.total}
              onChange={(e) => setNewImport({ ...newImport, total: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <ModernSelect
                value={newImport.user}
                label="User"
                onChange={(e) => setNewImport({ ...newImport, user: e.target.value })}
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
              <AddImport imports={imports} setImports={setImports} newImport={newImport} setNewImport={setNewImport} />
            )}
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
                  <TableCell>{imp.user}</TableCell>
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