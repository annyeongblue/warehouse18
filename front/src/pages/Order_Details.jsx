import React, { useState } from 'react';
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
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ModernBox, ModernButton, ModernTableContainer, ModernTableHead, ModernTableRow, ModernTextField, ModernSelect } from '../styles/styles';

// Static data
const DetailInfor = [
  { id: 4, date: '2025-02-26', status: 'Pending', description: 'Sample Order', user_1: 'Loungfar', details: [] },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Use static data as the initial state, filter by orderId if needed
  const [orderDetails, setOrderDetails] = useState(() => {
    const order = DetailInfor.find((item) => item.id === parseInt(orderId)) || DetailInfor[0]; // Default to first item if no match
    return { ...order, details: order.details || [] }; // Ensure details is an array
  });

  const [newDetail, setNewDetail] = useState({
    itemNames: [],
    quantity: '',
    description: '',
  });

  const availableItems = ['Computer', 'Pen', 'A4 Paper', 'Notebook'];

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
      description: newDetail.description,
    };

    setOrderDetails({
      ...orderDetails,
      details: [...orderDetails.details, newDetailItem],
    });

    setNewDetail({ itemNames: [], quantity: '', description: '' });
  };

  const handleBack = () => {
    navigate('/order');
  };

  return (
    <ModernBox sx={{ maxWidth: '1200px', margin: '0 auto', mt: 6, mb: 6, p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
        Order Detail - ID: {orderId}
      </Typography>

      {orderDetails ? (
        <>
          {/* Order Summary */}
          <Box sx={{ mb: 6, p: 4, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <Typography variant="body1"><strong>ID:</strong> {orderDetails.id}</Typography>
            <Typography variant="body1"><strong>Date:</strong> {orderDetails.date}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {orderDetails.status}</Typography>
            <Typography variant="body1"><strong>Description:</strong> {orderDetails.description || 'N/A'}</Typography>
            <Typography variant="body1"><strong>User:</strong> {orderDetails.user_1 || 'Unknown'}</Typography>
          </Box>

          {/* Add Detail Form */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Add New Detail
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Item Name</InputLabel>
                  <ModernSelect
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
                        style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP },
                      },
                    }}
                  >
                    {availableItems.map((item) => (
                      <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                  </ModernSelect>
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
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Description"
                  fullWidth
                  variant="outlined"
                  value={newDetail.description}
                  onChange={(e) => setNewDetail({ ...newDetail, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <ModernButton variant="contained" onClick={handleAddDetail}>
                  Add Detail
                </ModernButton>
              </Grid>
            </Grid>
          </Box>

          {/* Details Table */}
          <ModernTableContainer>
            <Table>
              <ModernTableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Item Names</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {orderDetails.details.length > 0 ? (
                  orderDetails.details.map((detail) => (
                    <ModernTableRow key={detail.id}>
                      <TableCell>{detail.id}</TableCell>
                      <TableCell>{detail.itemNames.join(', ')}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{detail.description}</TableCell>
                    </ModernTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No details available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModernTableContainer>
        </>
      ) : (
        <Typography variant="h6" sx={{ py: 4 }}>No order details found.</Typography>
      )}

      <ModernButton variant="contained" onClick={handleBack} sx={{ mt: 4 }}>
        Back to Orders
      </ModernButton>
    </ModernBox>
  );
};

export default OrderDetail;