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
  Paper,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton } from '../styles/styles'

function AddOrder({ orderName, setOrderName, orderDescription, setOrderDescription, orders, setOrders }) {
  const handleAddOrder = () => {
    if (!orderName || !orderDescription) {
      alert("Please fill out all fields.");
      return;
    }

    const orderExists = orders.some(
      (orderItem) => orderItem.name.toLowerCase() === orderName.toLowerCase()
    );
    if (orderExists) {
      alert("Order already exists.");
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      name: orderName,
      description: orderDescription,
    };

    setOrders([...orders, newOrder]);
    setOrderName('');
    setOrderDescription('');
  };

  return (
    <ModernButton variant='outlined' onClick={handleAddOrder} sx={{ width: '160px', borderRadius: '13px', mt: 3 }}>
      Add Order
    </ModernButton>
  );
}

const Orders = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [orderName, setOrderName] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [orders, setOrders] = useState([
    { id: 1, name: 'Laptop', description: 10 },
    { id: 2, name: 'Keyboard', description: 50 },
    // Example orders
  ]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter orders based on the search query
  const filteredOrders = orders.filter((orderItem) =>
    orderItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox>
      <ModernPaper sx={{ mb: 3 }}>
        <ModernTextField
          autoFocus
          margin="dense"
          label="Order"
          fullWidth
          variant="outlined"
          value={orderName}
          onChange={(e) => setOrderName(e.target.value)}
        />
        <ModernTextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={orderDescription}
          onChange={(e) => setOrderDescription(e.target.value)}
        />
        <AddOrder
          orderName={orderName}
          setOrderName={setOrderName}
          orderDescription={orderDescription}
          setOrderDescription={setOrderDescription}
          orders={orders}
          setOrders={setOrders}
        />
      </ModernPaper>

      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Order" />

      {/* Orders Table */}
      <ModernTableContainer sx={{ mt: 3 }}>
        <Table>
          <ModernTableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((orderItem) => (
                <ModernTableRow key={orderItem.id}>
                  <TableCell>{orderItem.id}</TableCell>
                  <TableCell>{orderItem.name}</TableCell>
                  <TableCell>{orderItem.description}</TableCell>
                </ModernTableRow>
              ))}
          </TableBody>
        </Table>
      </ModernTableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ModernBox>
  );
};

export default Orders;