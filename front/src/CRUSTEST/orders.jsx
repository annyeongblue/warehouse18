// pages/Orders.jsx
import React from 'react';
import { Container } from '@mui/material';
import CRUD from './crud'

const orderFields = [
    { name: 'date', label: 'Date', type: 'date', disabled: true },
    { name: 'statas', label: 'Status', type: 'select', options: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], required: true },
    { name: 'check_import', label: 'Check Import', type: 'select', options: [true, false], defaultValue: false },
    // { name: 'user_1', label: 'User', type: 'select', options: ['Loungfar', 'Tockky', 'Nana'] },
    { name: 'description', label: 'Description', type: 'text' },
];

const Orders = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <CRUD
      apiEndpoint="orders"
      fields={orderFields}
      title="Order"
      apiToken={import.meta.env.VITE_API_TOKEN}
      detailPath="/order_detail"
    />
  </Container>
);

export default Orders;