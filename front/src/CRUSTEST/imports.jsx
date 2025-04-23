// pages/Imports.jsx
import React from 'react';
import { Container } from '@mui/material';
import CRUD from './crud'

const importFields = [
  { name: 'date', label: 'Date', type: 'date', disabled: true },
  { name: 'total', label: 'Total', type: 'number', required: true },
  // { name: 'user', label: 'User', type: 'select', options: ['Loungfar', 'Tockky', 'Nana'] },
];

const Imports = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <CRUD
      apiEndpoint="imports"
      fields={importFields}
      title="Import"
      apiToken={import.meta.env.VITE_API_TOKEN}
      detailPath="/import_detail"
    />
  </Container>
);

export default Imports;