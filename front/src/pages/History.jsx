import React, { useState } from 'react';
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
  Typography,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import Button from '../components/common/Button';

const BorrowingHistory = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const borrowingHistory = [
    { id: 1, item: 'Laptop', quantity: 1, borrowDate: '2024-12-01', returnDate: '2024-12-10', status: 'Returned' },
    { id: 2, item: 'Chair', quantity: 2, borrowDate: '2024-12-05', returnDate: '2024-12-12', status: 'Overdue' },
    { id: 3, item: 'Projector', quantity: 1, borrowDate: '2024-11-20', returnDate: '2024-11-30', status: 'Returned' },
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredHistory = borrowingHistory.filter(
    (entry) =>
      entry.item.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? entry.status === filterStatus : true)
  );

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  return (
    <Box sx={{ minHeight: '100vh' }}>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 5 }}>
        <TextField
          label="Search by Item"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: '#fff',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            },
            '& .MuiInputLabel-root': { color: '#64748b' },
          }}
        />
        <TextField
          select
          label="Filter by Status"
          variant="outlined"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: '#fff',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            },
            '& .MuiInputLabel-root': { color: '#64748b' },
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Returned">Returned</MenuItem>
          <MenuItem value="Overdue">Overdue</MenuItem>
        </TextField>
      </Box>

      {/* Borrowing History Table */}
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
              <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Borrow Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#1e1e2f', py: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry) => (
                  <TableRow
                    key={entry.id}
                    sx={{
                      '&:hover': { background: '#f1f5f9' },
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ color: '#1e1e2f', fontWeight: 500 }}>{entry.item}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{entry.quantity}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{entry.borrowDate}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{entry.returnDate}</TableCell>
                    <TableCell
                      sx={{
                        color: entry.status === 'Overdue' ? '#ef4444' : '#10b981',
                        fontWeight: 500,
                      }}
                    >
                      {entry.status}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => setSnackbar({ open: true, message: `${entry.item} marked as returned.` })}
                        sx={{
                          borderRadius: '8px',
                          borderColor: '#3b82f6',
                          color: '#3b82f6',
                          textTransform: 'none',
                          '&:hover': {
                            background: '#eff6ff',
                            borderColor: '#2563eb',
                          },
                        }}
                      >
                        Mark as Returned
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          mt: 2,
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          '& .MuiTablePagination-toolbar': { color: '#64748b' },
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BorrowingHistory;