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
  Card,
  CardContent,
  MenuItem,
  Snackbar,
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
    // More history entries...
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  const filteredHistory = borrowingHistory.filter(
    (entry) =>
      entry.item.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? entry.status === filterStatus : true)
  );

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  return (
    <Box sx={{ }}>
      {/* <Typography variant="h4" gutterBottom>
        Borrowing History
      </Typography> */}

      {/* Filter section */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 5 }}>
        <TextField
          label="Search by Item"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Filter by Status"
          variant="outlined"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          fullWidth
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Returned">Returned</MenuItem>
          <MenuItem value="Overdue">Overdue</MenuItem>
        </TextField>
      </Box>

      {/* Borrowing History Table */}
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.item}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>{entry.borrowDate}</TableCell>
                <TableCell>{entry.returnDate}</TableCell>
                <TableCell
                  sx={{
                    color: entry.status === 'Overdue' ? 'red' : 'green',
                    fontWeight: 'bold',
                  }}
                >
                  {entry.status}
                </TableCell>
                <TableCell>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => setSnackbar({ open: true, message: `${entry.item} marked as returned.` })}
                >
                  Mark as Returned
                </Button>

                {/* // Snackbar Component */}
                <Snackbar
                  open={snackbar.open}
                  autoHideDuration={3000}
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  message={snackbar.message}
                />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => (
                <TableRow key={entry.id}>
                  {/* Row content */}
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
      />
    </Box>
  );
};

export default BorrowingHistory;
