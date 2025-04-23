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
  CircularProgress,
} from '@mui/material';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/borrows';
const USERS_API_URL = 'http://localhost:1337/api/users';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentDate = () => new Date().toISOString().split('T')[0];

// AddBorrow component remains unchanged for brevity
function AddBorrow({ borrows, setBorrows, newBorrow, setNewBorrow }) {
  const handleAddBorrow = async () => {
    const { status, user } = newBorrow;
    if (!status || !user) {
      alert('Please select a status and user.');
      return;
    }

    const borrowExists = borrows.some(
      (borrow) => borrow.borrower && borrow.borrower.toLowerCase() === user.toLowerCase()
    );
    if (borrowExists) {
      alert('Borrow record already exists for this user.');
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { data: { date: getCurrentDate(), statas: status, borrow_user: { username: user }, comment: newBorrow.comment } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setBorrows([...borrows, {
        id: response.data.data.id,
        borrow_date: response.data.data.date,
        borrower: response.data.data.borrow_user?.username || '',
        status: response.data.data.statas || 'Pending',
        comment: response.data.data.comment || '',
      }]);
      setNewBorrow({ borrow_date: getCurrentDate(), status: '', user: '', comment: '' });
    } catch (err) {
      console.error('Error adding borrow:', err.response?.data?.error?.message || err.message);
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
    borrow_date: getCurrentDate(),
    status: '',
    user: '',
    comment: '',
  });
  const [borrows, setBorrows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const statusOptions = ['Pending', 'Approved', 'Reject'];
  const userOptions = ['loungfar', 'ning'];

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USERS_API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      console.log('User API respose:', response.data); 
      const users = response.data.map(user => {
        return user.firstname || null;
      }). filter(Boolean);
      setUsers(users.length ? users: ['N/A']);
      } catch (err) {
        console.error('Error fetching users:', err.response?.data?.error?.message || err.message);
        alert('Failed to fetch users.');
        setUsers([]);
      }
    };

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?populate=borrow_user`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      console.log('Raw API response:', response.data); 
      const data = response.data.data;
      const formattedData = data.map((borrow) => {
        console.log('Borrow record:', borrow);
        return {
          id: borrow.id,
          borrow_date: borrow.date || getCurrentDate(),
          borrower: borrow.borrow_user?.username || 'N/A',
          status: borrow.statas || 'Pending',
          comment: borrow.comment || '',
        };
      });
      setBorrows(formattedData);
    } catch (err) {
      console.error('Error fetching borrows:', err.response?.data?.error?.message || err.message);
      alert('Failed to fetch borrow records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
    fetchUsers();
  }, []);

  const handleEdit = (borrow) => {
    setEditId(borrow.id);
    setNewBorrow({
      borrow_date: borrow.borrow_date,
      status: borrow.status,
      user: borrow.borrower === 'N/A' ? '' : borrow.borrower, // Handle 'N/A' case
      comment: borrow.comment,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${editId}`,
        { data: { date: getCurrentDate(), statas: newBorrow.status, borrow_user: { username: newBorrow.user }, comment: newBorrow.comment } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setBorrows(
        borrows.map((borrow) =>
          borrow.id === editId
            ? {
                id: response.data.data.id,
                borrow_date: response.data.data.date,
                borrower: response.data.data.borrow_user?.username || 'N/A',
                status: response.data.data.statas || 'Pending',
                comment: response.data.data.comment || '',
              }
            : borrow
        )
      );
      setEditId(null);
      setNewBorrow({ borrow_date: getCurrentDate(), status: '', user: '', comment: '' });
    } catch (err) {
      console.error('Error updating borrow:', err.response?.data?.error?.message || err.message);
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
      console.error('Error deleting borrow:', err.response?.data?.error?.message || err.message);
      alert('Failed to delete borrow record.');
    }
  };

  const handleDetail = (borrowId) => {
    navigate(`/borrow_detail/${borrowId}`);
  };

  const filteredBorrows = borrows.filter((borrow) =>
    (borrow.borrower || 'N/A').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Borrow Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newBorrow.borrow_date}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <ModernSelect
                value={newBorrow.user}
                label="User"
                onChange={(e) => setNewBorrow({ ...newBorrow, user: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map((option) => (
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
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ModernTextField
              label="Comment"
              fullWidth
              variant="outlined"
              value={newBorrow.comment}
              onChange={(e) => setNewBorrow({ ...newBorrow, comment: e.target.value })}
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

      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label="Search for User"
          sx={{ maxWidth: '400px', borderRadius: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Borrow Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {filteredBorrows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((borrow) => (
                    <ModernTableRow key={borrow.id}>
                      <TableCell>{borrow.id}</TableCell>
                      <TableCell>{borrow.borrow_date}</TableCell>
                      <TableCell>{borrow.borrower}</TableCell> {/* Display borrower directly */}
                      <TableCell>{borrow.status}</TableCell>
                      <TableCell>{borrow.comment || 'None'}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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
              setPage(0);
            }}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </ModernBox>
  );
}

export default Borrow;