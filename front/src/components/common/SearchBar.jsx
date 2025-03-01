import React from 'react';
import { TextField, Box } from '@mui/material';

const SearchBar = ({ search, setSearch, filterStatus, setFilterStatus, label }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
      <TextField
        label={label}
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      {/* <TextField
        select
        label="Filter by Status"
        variant="outlined"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        fullWidth
      >
        <option value="">All</option>
        <option key="returned" value="Returned">Returned</option>
        <option key="overdue" value="Overdue">Overdue</option>

      </TextField> */}
    </Box>
  );
};

export default SearchBar;
