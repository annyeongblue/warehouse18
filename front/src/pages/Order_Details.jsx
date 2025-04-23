import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
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
import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const [orders, setOrders] = useState([]);
  // const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDetail, setNewDetail] = useState({
    item: [],
    qty: '',
    description: '',
  });

  const availableItems = ['Computer', 'Pen', 'A4 Paper', 'Notebook'];
  const approverOptions = ['Loungfar', 'Tockky', 'Nana'];

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/order-details?populate=*');
      if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status}`);
      const orderDetailData = await response.json();
      console.log('Order Details raw response:', orderDetailData);
      const orderDetailsArray = orderDetailData.data.map((orderDetail) => ({
        id: orderDetail.id,
        item: orderDetail.item?.name || 'None',
        qty: orderDetail.qty ?? 'None',
        description: orderDetail.description || '',
      }));
      setOrderDetails(orderDetailsArray);
    } catch (err) {
      console.error('Fetch error:', err);
      alert(`Failed to fetch orders: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      await fetchOrderDetails();
      try {
        const response = await axios.get(`${API_URL}/orders?filters[id][$eq]=${orderId}&populate=*`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });

        console.log(' Orders API Response:', response.data);
        
        const items = response.data.data; // <-- proper extraction
        if (!items || items.length === 0) {
          throw new Error(`No order record found for ID ${orderId}`);
        }

        const order = items[0]; // get the first item

        setOrders({
          id: order.id || 0,
          order_date: order.date || '',
          status: order.statas || 'Pending', // Note: 'statas' is a typo in API
          user: order.order_user?.username || 'Unknown', // Fallback for missing user_1
          details: order.details || [], // Fallback for missing details
        });
      } catch (err) {
        console.error('Fetch error:', err);
        const message = err.response?.status === 404
          ? `Order record with ID ${orderId} not found`
          : err.response?.data?.error?.message || `Failed to fetch orders: ${err.message}`;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleAddDetail = async () => {
    if (!newDetail.item.length || !newDetail.qty || !newDetail.return_date) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!orderDetails.id) {
      alert('Order details not loaded. Please try again.');
      return;
    }

    const newDetailItem = {
      id: (orderDetails.details.length || 0) + 1,
      item: newDetail.item,
      qty: parseInt(newDetail.qty, 10),
      description: newDetail.description,
    };

    try {
      const response = await axios.put(
        `${API_URL}/orders/${orderId}`,
        {
          data: {
            date: orders.order_date,
            statas: orders.status, // Use API's field name
            user_1: orders.user,
            details: [...orders.details, newDetailItem],
          },
        },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      const data = response.data;
      setOrderDetails({
        id: data.id || 0,
        order_date: data.date || '',
        status: data.statas || 'Pending',
        user: data.user_1 || 'Unknown',
        details: data.details || [],
      });

      setNewDetail({
        item: [],
        qty: '',
        return_date: '',
        borrow_approver: '',
        return_comment: '',
        return_approver: '',
        description: '',
      });
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error?.message || 'Failed to update order details');
    }
  };

  const handleBack = () => {
    navigate('/order');
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
      ) : (
        <>
          <Box sx={{ mb: 6, p: 4, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>ID:</strong> {orders.id || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Order Date:</strong> {orders.order_date || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Status:</strong> {orders.status || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>User:</strong> {orders.user || 'N/A'}</Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Add New Detail
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Items</InputLabel>
                  <ModernSelect
                    multiple
                    value={newDetail.item}
                    onChange={(e) => setNewDetail({ ...newDetail, item: e.target.value })}
                    input={<OutlinedInput label="Items" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    sx={{ height: '56px' }}
                  >
                    {availableItems.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
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
                  value={newDetail.qty}
                  onChange={(e) => setNewDetail({ ...newDetail, qty: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Return Date"
                  fullWidth
                  variant="outlined"
                  type="date"
                  value={newDetail.return_date}
                  onChange={(e) => setNewDetail({ ...newDetail, return_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Borrow Approver</InputLabel>
                  <ModernSelect
                    value={newDetail.borrow_approver}
                    label="Borrow Approver"
                    onChange={(e) => setNewDetail({ ...newDetail, borrow_approver: e.target.value })}
                    sx={{ height: '56px' }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {approverOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Description"
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={newDetail.description}
                  onChange={(e) => setNewDetail({ ...newDetail, description: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Return Approver</InputLabel>
                  <ModernSelect
                    value={newDetail.return_approver}
                    label="Return Approver"
                    onChange={(e) => setNewDetail({ ...newDetail, return_approver: e.target.value })}
                    sx={{ height: '56px' }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {approverOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Return Comment"
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={newDetail.return_comment}
                  onChange={(e) => setNewDetail({ ...newDetail, return_comment: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid> */}
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <ModernButton
                  variant="contained"
                  onClick={handleAddDetail}
                  disabled={loading || !orders.id}
                  sx={{
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                    color: '#fff',
                    '&:hover': { background: 'linear-gradient(45deg, #2e7d32, #4caf50)' },
                    padding: '12px 24px',
                  }}
                >
                  Add Detail
                </ModernButton>
              </Grid>
            </Grid>
          </Box>

          <ModernTableContainer sx={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff', mb: 6 }}>
            <Table>
              <ModernTableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Description</TableCell>
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {orderDetails.length > 0 ? (
                  orderDetails.map((detail) => (
                    <ModernTableRow key={detail.id}>
                      <TableCell sx={{ py: 2.5 }}>{detail.id}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.item || 'None'}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.qty || 'None'}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.description || 'None'}</TableCell>
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
          padding: '12px 24px',
        }}
      >
        Back to Orders
      </ModernButton>
    </ModernBox>
  );
};

export default OrderDetail;