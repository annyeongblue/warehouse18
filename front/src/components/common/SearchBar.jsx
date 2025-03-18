import React from 'react';
import { TextField, Box, MenuItem } from '@mui/material';

const SearchBar = ({ search, setSearch, filterStatus, setFilterStatus, label }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        background: '#fff',
        // p: 2,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <TextField
        label={label}
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: '#ffffff',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748b',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3b82f6',
          },
        }}
      />
      {/* <TextField
        select
        label="Filter by Status"
        variant="outlined"
        value={filterStatus || ''}
        onChange={(e) => setFilterStatus(e.target.value)}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: '#fafafa',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748b',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3b82f6',
          },
        }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Returned">Returned</MenuItem>
        <MenuItem value="Overdue">Overdue</MenuItem>
      </TextField> */}
    </Box>
  );
};

export default SearchBar;