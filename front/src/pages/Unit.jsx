import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';

function AddUnit({ unitName, setUnitName, unitDescription, setUnitDescription, units, setUnits }) {
  const handleAddUnit = () => {
    if (!unitName || !unitDescription) {
      alert("Please fill out all fields.");
      return;
    }

    const unitExists = units.some(
      (unit) => unit.name.toLowerCase() === unitName.toLowerCase()
    );
    if (unitExists) {
      alert("Unit already exists.");
      return;
    }

    const newUnit = {
      id: units.length + 1,
      name: unitName,
      description: unitDescription,
    };

    setUnits([...units, newUnit]);
    setUnitName('');
    setUnitDescription('');
  };

  return (
    <Button variant='outlined' onClick={handleAddUnit} sx={{ width: '160px', borderRadius: '13px', mb: 3, mt: 3 }}>
      Add Unit
    </Button>
  );
}

const Units = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [unitName, setUnitName] = useState('');
  const [unitDescription, setUnitDescription] = useState('');
  const [units, setUnits] = useState([
    { id: 1, name: 'Laptop', description: 10 },
    { id: 2, name: 'Keyboard', description: 50 },
    // Example units
  ]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter units based on the search query
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Pass searchQuery and setSearchQuery to SearchBar */}
      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Unit" />

      <Box>
        <TextField
          autoFocus
          margin="dense"
          label="Unit"
          fullWidth
          variant="outlined"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={unitDescription}
          onChange={(e) => setUnitDescription(e.target.value)}
        />
        <AddUnit
          unitName={unitName}
          setUnitName={setUnitName}
          unitDescription={unitDescription}
          setUnitDescription={setUnitDescription}
          units={units}
          setUnits={setUnits}
        />
      </Box>

      {/* Units Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUnits
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.id}</TableCell>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.description}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUnits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Units;
