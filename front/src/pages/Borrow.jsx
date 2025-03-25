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
import SearchBar from '../components/common/SearchBar'; // Assuming this exists
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/borrows';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentDate = () => new Date().toISOString().split('T')[0];

function AddBorrow({ borrows, setBorrows, newBorrow, setNewBorrow }) {
  const handleAddBorrow = async () => {
    const { status, borrower } = newBorrow;
    if (!status || !borrower) {
      alert("Please fill out required fields.");
      return;
    }

    const borrowExists = borrows.some(
      (borrow) => borrow.borrower && borrow.borrower.toLowerCase() === borrower.toLowerCase()
    );
    if (borrowExists) {
      alert("Borrow record already exists for this borrower.");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { data: { ...newBorrow, date: getCurrentDate() } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setBorrows([...borrows, response.data.data]);
      setNewBorrow({ date: '', status: '', borrower: '', item: '', return_date: '' });
    } catch (err) {
      console.error('Error adding borrow:', err);
      alert('Failed to add borrow record.');
    }
  };

  return (
    <ModernButton
      variant="contained"
      onClick={handleAddBorrow}
      sx={{
        width: '160px',
        borderRadius: '20px',
        mt: 2,
        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        color: '#fff',
        '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
      }}
    >
      Add Borrow
    </ModernButton>
  );
}

function Borrow() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBorrow, setNewBorrow] = useState({
    date: getCurrentDate(),
    status: '',
    borrower: '',
    item: '',
    return_date: '',
  });
  const [borrows, setBorrows] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const statusOptions = ['Pending', 'Borrowed', 'Returned', 'Overdue'];
  const borrowerOptions = ['Loungfar', 'Tockky', 'Nana'];
  const itemOptions = ['Book', 'Laptop', 'Tool', 'Camera'];

  const fetchBorrows = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      console.log('Raw API Data:', data);
      const formattedData = data.map((borrow) => ({
        id: borrow.id,
        date: borrow.attributes?.date || getCurrentDate(),
        status: borrow.attributes?.status || 'Pending',
        borrower: borrow.attributes?.borrower || 'Unknown',
        item: borrow.attributes?.item || '',
        return_date: borrow.attributes?.return_date || '',
      }));
      console.log('Formatted borrows:', formattedData);
      setBorrows(formattedData);
    } catch (err) {
      console.error('Error fetching borrows:', err.response?.data?.error?.message || err.message);
      alert('Failed to fetch borrow records.');
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleEdit = (borrow) => {
    setEditId(borrow.id);
    setNewBorrow({ ...borrow });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${editId}`,
        { data: { ...newBorrow, date: getCurrentDate() } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setBorrows(
        borrows.map((borrow) =>
          borrow.id === editId ? response.data.data : borrow
        )
      );
      setEditId(null);
      setNewBorrow({ date: '', status: '', borrower: '', item: '', return_date: '' });
    } catch (err) {
      console.error('Error updating borrow:', err);
      alert('Failed to update borrow record.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      setBorrows(borrows.filter((borrow) => borrow.id !== id));
    } catch (err) {
      console.error('Error deleting borrow:', err);
      alert('Failed to delete borrow record.');
    }
  };

  const handleDetail = (borrowId) => {
    navigate(`/borrow-details/${borrowId}`);
  };

  const filteredBorrows = borrows.filter((borrow) =>
    (borrow.borrower || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      {/* Form Section */}
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Borrow Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newBorrow.date}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Borrower</InputLabel>
              <ModernSelect
                value={newBorrow.borrower}
                label="Borrower"
                onChange={(e) => setNewBorrow({ ...newBorrow, borrower: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {borrowerOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <ModernSelect
                value={newBorrow.status}
                label="Status"
                onChange={(e) => setNewBorrow({ ...newBorrow, status: e.target.value })}
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
              <InputLabel>Item</InputLabel>
              <ModernSelect
                value={newBorrow.item}
                label="Item"
                onChange={(e) => setNewBorrow({ ...newBorrow, item: e.target.value })}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Approver</InputLabel>
              <ModernSelect
                value={newBorrow.borrower}
                label="Borrower"
                onChange={(e) => setNewBorrow({ ...newBorrow, borrower: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {borrowerOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Comment</InputLabel>
              <ModernSelect
                value={newBorrow.borrower}
                label="Borrower"
                onChange={(e) => setNewBorrow({ ...newBorrow, borrower: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {borrowerOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Return Approver</InputLabel>
              <ModernSelect
                value={newBorrow.borrower}
                label="Borrower"
                onChange={(e) => setNewBorrow({ ...newBorrow, borrower: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {borrowerOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <ModernTextField
              label="Return Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newBorrow.return_date}
              onChange={(e) => setNewBorrow({ ...newBorrow, return_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
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
              <AddBorrow borrows={borrows} setBorrows={setBorrows} newBorrow={newBorrow} setNewBorrow={setNewBorrow} />
            )}
          </Grid>
        </Grid>
      </ModernPaper>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label="Search for Borrower"
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
              <TableCell sx={{ fontWeight: 'bold' }}>Borrower</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredBorrows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((borrow) => (
                <ModernTableRow key={borrow.id}>
                  <TableCell>{borrow.id}</TableCell>
                  <TableCell>{borrow.date}</TableCell>
                  <TableCell>{borrow.status}</TableCell>
                  <TableCell>{borrow.borrower}</TableCell>
                  <TableCell>{borrow.item}</TableCell>
                  <TableCell>{borrow.return_date || 'Not Set'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                      <Button onClick={() => handleEdit(borrow)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <EditRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDelete(borrow.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <DeleteRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDetail(borrow.id)} sx={{ padding: 0, minWidth: 'auto' }}>
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
        count={filteredBorrows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // Reset to first page on rows per page change
        }}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
}

export default Borrow;