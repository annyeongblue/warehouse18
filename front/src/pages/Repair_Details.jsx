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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { ModernBox, ModernButton, ModernTableContainer, ModernTableHead, ModernTableRow, ModernTextField, MultiSelect } from '../styles/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const OrderDetail = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDetail, setNewDetail] = useState({
    itemNames: [], // Array to hold multiple items
    quantity: '',
    description: '',
  }); // State for new detail input

  // Available items for the multi-select dropdown
  const availableItems = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
  ];

  // Fetch order details from the API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:1337/api/order-details`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();
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
    if (!newDetail.itemNames.length || !newDetail.quantity) {
      alert('Please fill out all fields.');
      return;
    }

    const newDetailItem = {
      id: orderDetails.details.length + 1, // Simple ID generation
      itemNames: newDetail.itemNames,
      quantity: parseInt(newDetail.quantity, 10),
      description: parseFloat(newDetail.description),
    };

    setOrderDetails({
      ...orderDetails,
      details: [...orderDetails.details, newDetailItem],
    });

    // Reset the input fields
    setNewDetail({ itemNames: [], quantity: '', description: '' });
  };

  const handleBack = () => {
    navigate('/order'); // Navigate back to the Orders page
  };

  return (
    <ModernBox sx={{ maxWidth: '1200px', margin: '0 auto', mt: 6, mb: 6, p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
        Order Detail - ID: {orderId}
      </Typography>

      {loading ? (
        <Typography variant="h6" sx={{ py: 4 }}>Loading...</Typography>
      ) : error ? (
        <Typography variant="h6" color="error" sx={{ py: 4 }}>{error}</Typography>
      ) : orderDetails ? (
        <>
          {/* Order Summary */}
          <Box sx={{ mb: 6, p: 4, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>ID:</strong> {orderDetails.id}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Date:</strong> {orderDetails.date}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Status:</strong> {orderDetails.status}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Description:</strong> {orderDetails.description}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>User:</strong> {orderDetails.user_1}</Typography>
          </Box>

          {/* Add Detail Form */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Add New Detail
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="item-name-label">Item Name</InputLabel>
                  <MultiSelect
                    multiple
                    value={newDetail.itemNames}
                    onChange={(e) => setNewDetail({ ...newDetail, itemNames: e.target.value })}
                    input={<OutlinedInput label="Item Name" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        },
                      },
                    }}
                    sx={{ minHeight: '56px' }} // Ensures consistent height with text fields
                  >
                    {availableItems.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </MultiSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Quantity"
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={newDetail.quantity}
                  onChange={(e) => setNewDetail({ ...newDetail, quantity: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }} // Consistent height
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Description"
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={newDetail.description}
                  onChange={(e) => setNewDetail({ ...newDetail, description: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }} // Consistent height
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <ModernButton
                  variant="contained"
                  onClick={handleAddDetail}
                  sx={{
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                    color: '#fff',
                    '&:hover': { background: 'linear-gradient(45deg, #2e7d32, #4caf50)' },
                    padding: '12px 24px', // Larger button
                  }}
                >
                  Add Detail
                </ModernButton>
              </Grid>
            </Grid>
          </Box>

          {/* Details Table */}
          <ModernTableContainer sx={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff', mb: 6 }}>
            <Table>
              <ModernTableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Item Names</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Description</TableCell>
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {orderDetails.details.length > 0 ? (
                  orderDetails.details.map((detail) => (
                    <ModernTableRow key={detail.id}>
                      <TableCell sx={{ py: 2.5 }}>{detail.id}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.itemNames.join(', ')}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.quantity}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.description}</TableCell>
                    </ModernTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      No details available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModernTableContainer>
        </>
      ) : (
        <Typography variant="h6" sx={{ py: 4 }}>No details available.</Typography>
      )}

      <ModernButton
        variant="contained"
        onClick={handleBack}
        sx={{
          mt: 4,
          borderRadius: '20px',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          color: '#fff',
          '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
          padding: '12px 24px', // Larger button
        }}
      >
        Back to Orders
      </ModernButton>
    </ModernBox>
  );
};

export default OrderDetail;