import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  TextField,
  TablePagination,
} from '@mui/material';

const API_URL = 'http://localhost:1337/api/users?populate=*';

const AuthorizePage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'Public',
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
      const userData = await response.json();
      console.log('User raw response:', userData);
      
      const usersArray = userData.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role?.name || 'Public',
        status: user.confirmed ? 'Approved' : 'Pending',
      }));
      setUsers(usersArray);
    } catch (err) {
      console.error('Fetch error:', err);
      alert(`Failed to fetch users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: { name: newRole } }),
      });
      if (!response.ok) throw new Error('Failed to update role');
      setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
    } catch (err) {
      console.error('Update role error:', err);
      alert('Failed to update role');
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed: true }),
      });
      if (!response.ok) throw new Error('Failed to approve user');
      setUsers(users.map((user) => (user.id === id ? { ...user, status: 'Approved' } : user)));
    } catch (err) {
      console.error('Approve user error:', err);
      alert('Failed to approve user');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to reject user');
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Reject user error:', err);
      alert('Failed to reject user');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username) {
      alert('Username is required');
      return;
    }
    if (!isValidEmail(newUser.email)) {
      alert('Invalid email format');
      return;
    }
    if (users.some((user) => user.email === newUser.email)) {
      alert('Email already exists');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          role: { name: newUser.role },
          confirmed: false,
        }),
      });
      if (!response.ok) throw new Error('Failed to create user');
      const createdUser = await response.json();
      setUsers([
        ...users,
        {
          id: createdUser.data.id,
          username: createdUser.data.username,
          email: createdUser.data.email,
          role: createdUser.data.role?.name || newUser.role,
          status: createdUser.data.confirmed ? 'Approved' : 'Pending',
        },
      ]);
      setNewUser({ username: '', email: '', role: 'Public' });
    } catch (err) {
      console.error('Create user error:', err);
      alert('Failed to create user');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <TextField
        label="Search by username or email"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          maxWidth: 'fullWidth',
          mb: 5,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: '#fff',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          },
          '& .MuiInputLabel-root': { color: '#64748b' },
        }}
      />

      <Paper
        sx={{
          padding: 3,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          background: '#fff',
          mb: 5,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: '#fafafa',
              },
              '& .MuiInputLabel-root': { color: '#64748b' },
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            sx={{
              '& .muioutlinedinput-root': {
                borderRadius: '12px',
                background: '#fafafa',
              },
              '& .MuiInputLabel-root': { color: '#64748b' },
            }}
          />
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            sx={{
              borderRadius: '12px',
              background: '#fafafa',
              '& .MuiSelect-select': { py: 1.5 },
            }}
          >
            <MenuItem value="Public">Public</MenuItem>
            <MenuItem value="Authenticated">Authenticated</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            sx={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            Create User
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              background: '#fff',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:hover': { background: '#f1f5f9' },
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ color: '#1e1e2f', fontWeight: 500 }}>{user.username}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        sx={{
                          borderRadius: '8px',
                          background: '#fafafa',
                          '& .MuiSelect-select': { py: 1 },
                          minWidth: '100px',
                        }}
                      >
                        <MenuItem value="Public">Public</MenuItem>
                        <MenuItem value="Authenticated">Authenticated</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: user.status === 'Approved' ? '#10b981' : '#f59e0b',
                        fontWeight: 500,
                      }}
                    >
                      {user.status}
                    </TableCell>
                    <TableCell>
                      {user.status === 'Pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            onClick={() => handleApprove(user.id)}
                            sx={{
                              borderRadius: '8px',
                              borderColor: '#10b981',
                              color: '#10b981',
                              textTransform: 'none',
                              '&:hover': {
                                background: '#ecfdf5',
                                borderColor: '#10b981',
                              },
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleReject(user.id)}
                            sx={{
                              borderRadius: '8px',
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              textTransform: 'none',
                              '&:hover': {
                                background: '#fef2f2',
                                borderColor: '#ef4444',
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default AuthorizePage;