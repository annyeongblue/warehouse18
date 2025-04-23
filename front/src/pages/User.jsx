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
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ModernSelect } from '../styles/styles';

const API_URL = 'http://localhost:1337/api/users?populate=role';

const AuthorizePage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'Pending',
    password: '',
  });
  const [editingUser, setEditingUser] = useState(null); // For edit mode
  const [detailUser, setDetailUser] = useState(null); // For detail modal
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
      const usersArray = userData.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role?.name || 'Pending',
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOUR_JWT_TOKEN}`,
        },
        body: JSON.stringify({ confirmed: true }),
      });
      if (!response.ok) throw new Error('Failed to approve user');
      setUsers(users.map((user) => (user.id === id ? { ...user, status: 'Approved' } : user)));
    } catch (err) {
      console.error('Approve user error:', err);
      alert('Failed to approve user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser.username) {
      alert('Username is required');
      return;
    }
    if (!isValidEmail(editingUser.email)) {
      alert('Invalid email format');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editingUser.username,
          email: editingUser.email,
          role: { name: editingUser.role },
        }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...editingUser } : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error('Update user error:', err);
      alert('Failed to update user');
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
          password: newUser.password,
          role: { name: newUser.role },
          confirmed: false,
        }),
      });
      if (!response.ok) throw new Error('Failed to create user');
      const createdUser = await response.json();
      setUsers([
        ...users,
        {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role?.name || newUser.role,
          status: createdUser.confirmed ? 'Approved' : 'Pending',
        },
      ]);
      setNewUser({ username: '', email: '', role: 'User', password: '' });
    } catch (err) {
      console.error('Create user error:', err);
      alert('Failed to create user');
    }
  };

  const handleViewDetails = (user) => {
    setDetailUser(user);
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
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: '#fafafa',
              },
              '& .MuiInputLabel-root': { color: '#64748b' },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: '#fafafa',
              },
              '& .MuiInputLabel-root': { color: '#64748b' },
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <ModernSelect
              value={newUser.role}
              label="Role"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="Owner">Owner</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </ModernSelect>
          </FormControl>
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
                    <TableCell sx={{ color: '#1e1e2f', fontWeight: 500 }}>
                      {editingUser?.id === user.id ? (
                        <TextField
                          value={editingUser.username || ''}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, username: e.target.value })
                          }
                          size="small"
                          fullWidth
                          variant="outlined"
                          sx={{ minWidth: '150px' }}
                        />
                      ) : (
                        user.username
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {editingUser?.id === user.id ? (
                        <TextField
                          value={editingUser.email || ''}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, email: e.target.value })
                          }
                          size="small"
                          fullWidth
                          variant="outlined"
                          sx={{ minWidth: '200px' }}
                        />
                      ) : (
                        user.email
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser?.id === user.id ? (
                        <Select
                          value={editingUser.role || 'User'}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, role: e.target.value })
                          }
                          size="small"
                          fullWidth
                          sx={{ minWidth: '120px' }}
                        >
                          <MenuItem value="Owner">Owner</MenuItem>
                          <MenuItem value="Admin">Admin</MenuItem>
                          <MenuItem value="Staff">Staff</MenuItem>
                          <MenuItem value="User">User</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                        </Select>
                      ) : (
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
                          <MenuItem value="Owner">Owner</MenuItem>
                          <MenuItem value="Admin">Admin</MenuItem>
                          <MenuItem value="Staff">Staff</MenuItem>
                          <MenuItem value="User">User</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                        </Select>
                      )}
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
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {editingUser?.id === user.id ? (
                          <>
                            <Button
                              variant="outlined"
                              onClick={handleSaveEdit}
                              sx={{
                                borderRadius: '8px',
                                borderColor: '#10b981',
                                color: '#10b981',
                                textTransform: 'none',
                                '&:hover': {
                                  background: '#ecfdff',
                                  borderColor: '#10b981',
                                },
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => setEditingUser(null)}
                              sx={{
                                borderRadius: '8px',
                                borderColor: '#64748b',
                                color: '#64748b',
                                textTransform: 'none',
                                '&:hover': {
                                  background: '#f1f5f9',
                                  borderColor: '#64748b',
                                },
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outlined"
                              onClick={() => handleEdit(user)}
                              sx={{
                                borderRadius: '8px',
                                borderColor: '#3b82f6',
                                color: '#3b82f6',
                                textTransform: 'none',
                                '&:hover': {
                                  background: '#eff6ff',
                                  borderColor: '#3b82f6',
                                },
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => handleDelete(user.id)}
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
                              Delete
                            </Button>
                            {/* <Button
                              variant="outlined"
                              onClick={() => handleViewDetails(user)}
                              sx={{
                                borderRadius: '8px',
                                borderColor: '#8b5cf6',
                                color: '#8b5cf6',
                                textTransform: 'none',
                                '&:hover': {
                                  background: '#f5f3ff',
                                  borderColor: '#8b5cf6',
                                },
                              }}
                            >
                              Details
                            </Button> */}
                            {user.status === 'Pending' && (
                              <>
                                <Button
                                  variant="outlined"
                                  onClick={() => handleApprove(user.id)}
                                  sx={{
                                    borderRadius: '8px',
                                    borderColor: '#10b981',
                                    color: '#10b981',
                                    textTransform: 'none',
                                    '&:hover': {
                                      background: '#ecfdff',
                                      borderColor: '#10b981',
                                    },
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => handleDelete(user.id)}
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
                              </>
                            )}
                          </>
                        )}
                      </Box>
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

      {/* Detail Modal */}
      {/* <Dialog open={!!detailUser} onClose={() => setDetailUser(null)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {detailUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>ID:</strong> {detailUser.id}</Typography>
              <Typography><strong>Username:</strong> {detailUser.username}</Typography>
              <Typography><strong>Email:</strong> {detailUser.email}</Typography>
              <Typography><strong>Role:</strong> {detailUser.role}</Typography>
              <Typography><strong>Status:</strong> {detailUser.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailUser(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default AuthorizePage;