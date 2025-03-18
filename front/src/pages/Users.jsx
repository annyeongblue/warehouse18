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
} from '@mui/material';

// Sample user data
const initialUsers = [
  { id: 1, username: 'loungfar', email: 'loungfar.tham@gmail.com', role: 'User', status: 'Pending' },
  { id: 2, username: 'blue', email: 'loungfar27@gmail.com', role: 'Admin', status: 'Approved' },
];

const AuthorizePage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'User',
  });

  // Handle Role Change
  const handleRoleChange = (id, newRole) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
  };

  // Approve User
  const handleApprove = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: 'Approved' } : user)));
  };

  // Reject User
  const handleReject = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Add new user
  const handleCreateUser = () => {
    if (newUser.username && newUser.email) {
      const newUserObject = {
        id: users.length + 1,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: 'Pending',
      };
      setUsers([...users, newUserObject]);
      setNewUser({ username: '', email: '', role: 'User' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Search Bar */}
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

      {/* Create User Form */}
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
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            sx={{
              borderRadius: '12px',
              background: '#fafafa',
              '& .MuiSelect-select': { py: 1.5 },
            }}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
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

      {/* User Table */}
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
            {users
              .filter(
                (user) =>
                  (user.username && user.username.toLowerCase().includes(search.toLowerCase())) ||
                  (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
              )
              .map((user) => (
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
                      <MenuItem value="User">User</MenuItem>
                      <MenuItem value="Staff">Staff</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
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
    </Box>
  );
};

export default AuthorizePage;