import { useState, useEffect } from "react";
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
} from "@mui/material";

// Sample user data
const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Pending" },
  { id: 2, name: "Alice Smith", email: "alice@example.com", role: "Admin", status: "Approved" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Staff", status: "Approved" },
];

const AuthorizePage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  // Handle Role Change
  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(user => (user.id === id ? { ...user, role: newRole } : user)));
  };

  // Approve User
  const handleApprove = (id) => {
    setUsers(users.map(user => (user.id === id ? { ...user, status: "Approved" } : user)));
  };

  // Reject User
  const handleReject = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Authorization Management
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by name/email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 5 }}
      />

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  
                  {/* Role Selection */}
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <MenuItem value="User">User</MenuItem>
                      <MenuItem value="Staff">Staff</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>{user.status}</TableCell>

                  {/* Actions */}
                  <TableCell>
                    {user.status === "Pending" && (
                      <>
                        <Button color="primary" onClick={() => handleApprove(user.id)}>Approve</Button>
                        <Button color="error" onClick={() => handleReject(user.id)}>Reject</Button>
                      </>
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
