import React, { useState } from 'react';
import { Box, TextField, Grid, Typography, Paper, Chip } from '@mui/material';
import Button from '../components/common/Button';

const RequestManagement = () => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([
    { id: 1, item: 'Laptop', quantity: 1, reason: 'For Project', status: 'Pending' },
    { id: 2, item: 'Chair', quantity: 2, reason: 'New Office Setup', status: 'Approved' },
  ]);

  const handleRequestSubmit = () => {
    if (!item || !quantity || !reason) return; // Simple validation
    setRequests([...requests, { id: requests.length + 1, item, quantity, reason, status: 'Pending' }]);
    setItem('');
    setQuantity('');
    setReason('');
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>

      {/* Request Form */}
      <Paper
        sx={{
          padding: 3,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          background: '#fff',
          mb: 5,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={item}
              onChange={(e) => setItem(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: '#fafafa',
                },
                '& .MuiInputLabel-root': { color: '#64748b' },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: '#fafafa',
                },
                '& .MuiInputLabel-root': { color: '#64748b' },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Reason"
              variant="outlined"
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: '#fafafa',
                },
                '& .MuiInputLabel-root': { color: '#64748b' },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleRequestSubmit}
              sx={{
                width: '180px',
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
              Submit Request
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Pending Requests */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#1e1e2f',
            mb: 3,
          }}
        >
          Pending Requests
        </Typography>
        {requests.length === 0 ? (
          <Typography sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
            No requests found.
          </Typography>
        ) : (
          requests.map((request) => (
            <Paper
              key={request.id}
              sx={{
                mb: 2,
                padding: 2.5,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                background: '#fff',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: '#1e1e2f' }}>
                    {request.item} - {request.quantity}
                  </Typography>
                  <Typography sx={{ color: '#64748b', mt: 0.5 }}>{request.reason}</Typography>
                </Box>
                <Chip
                  label={request.status}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    background:
                      request.status === 'Pending'
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    px: 1,
                  }}
                />
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default RequestManagement;