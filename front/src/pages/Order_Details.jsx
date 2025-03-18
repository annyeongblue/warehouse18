import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
} from '@mui/material';
import { ModernBox, ModernButton, ModernTableContainer, ModernTableHead, ModernTableRow } from '../styles/styles';

const OrderDetail = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDetail, setNewDetail] = useState({
    itemName: '',
    quantity: '',
    price: '',
  }); // State for new detail input

  // Fetch order details from the API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:1337/api/order-details`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authorization headers here
          },
        });
        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();
        // Assuming the API returns a single order object with a details array
        setOrderDetails({
          ...data,
          details: data.details || [], // Default to empty array if no details
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle adding a new detail
  const handleAddDetail = () => {
    if (!newDetail.itemName || !newDetail.quantity || !newDetail.price) {
      alert('Please fill out all fields.');
      return;
    }

    const newDetailItem = {
      id: (orderDetails.details.length + 1), // Simple ID generation (replace with API if needed)
      itemName: newDetail.itemName,
      quantity: parseInt(newDetail.quantity, 10),
      price: parseFloat(newDetail.price),
    };

    setOrderDetails({
      ...orderDetails,
      details: [...orderDetails.details, newDetailItem],
    });

    // Reset the input fields
    setNewDetail({ itemName: '', quantity: '', price: '' });

    // Optionally, send this to the API to persist (example below)
    // await fetch(`http://localhost:1337/api/order-details/${orderId}/add-detail`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newDetailItem),
    // });
  };

  const handleBack = () => {
    navigate('/order'); // Navigate back to the Orders page
  };

  return (
    <ModernBox sx={{ maxWidth: '1000px', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        Order Detail - ID: {orderId}
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orderDetails ? (
        <>
          {/* Order Summary */}
          <Box sx={{ mb: 4, p: 3, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <Typography><strong>Date:</strong> {orderDetails.date}</Typography>
            <Typography><strong>Status:</strong> {orderDetails.status}</Typography>
            <Typography><strong>Description:</strong> {orderDetails.description}</Typography>
            <Typography><strong>User:</strong> {orderDetails.user_1}</Typography>
          </Box>

          {/* Add Detail Form */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Add New Detail
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Item Name"
                  fullWidth
                  variant="outlined"
                  value={newDetail.itemName}
                  onChange={(e) => setNewDetail({ ...newDetail, itemName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={newDetail.quantity}
                  onChange={(e) => setNewDetail({ ...newDetail, quantity: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Price"
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={newDetail.price}
                  onChange={(e) => setNewDetail({ ...newDetail, price: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <ModernButton
                  variant="contained"
                  onClick={handleAddDetail}
                  sx={{
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                    color: '#fff',
                    '&:hover': { background: 'linear-gradient(45deg, #2e7d32, #4caf50)' },
                  }}
                >
                  Add Detail
                </ModernButton>
              </Grid>
            </Grid>
          </Box>

          {/* Details Table */}
          <ModernTableContainer sx={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <Table>
              <ModernTableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {orderDetails.details.length > 0 ? (
                  orderDetails.details.map((detail) => (
                    <ModernTableRow key={detail.id}>
                      <TableCell>{detail.id}</TableCell>
                      <TableCell>{detail.itemName}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{detail.price}</TableCell>
                    </ModernTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No details available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModernTableContainer>
        </>
      ) : (
        <Typography>No details available.</Typography>
      )}

      <ModernButton
        variant="contained"
        onClick={handleBack}
        sx={{
          mt: 3,
          borderRadius: '20px',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          color: '#fff',
          '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
        }}
      >
        Back to Orders
      </ModernButton>
    </ModernBox>
  );
};

export default OrderDetail;