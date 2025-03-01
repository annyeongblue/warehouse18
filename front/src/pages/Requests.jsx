import React, { useState } from 'react';
import { Box, TextField, Grid, Typography, Card, CardContent } from '@mui/material';
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
    setRequests([...requests, { id: requests.length + 1, item, quantity, reason, status: 'Pending' }]);
  };

  return (
    <Box>
      {/* <Typography variant="h4" gutterBottom>Request Items</Typography> */}
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={item}
            onChange={(e) => setItem(e.target.value)}
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
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Reason"
            variant="outlined"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleRequestSubmit} sx={{ width: '180px', borderRadius: '10px' }}>Submit Request</Button>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5">Pending Requests</Typography>
        {requests.map(request => (
          <Card sx={{ marginBottom: 2 }} key={request.id}>
            <CardContent>
              <Typography variant="h6">{request.item} - {request.quantity}</Typography>
              <Typography>{request.reason}</Typography>
              <Typography color={request.status === 'Pending' ? 'orange' : 'green'}>{request.status}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default RequestManagement;
