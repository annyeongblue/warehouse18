import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Grid,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import { ModernBox, ModernButton, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernTextField } from '../styles/styles';

function AddImport({ importName, setImportName, importDescription, setImportDescription, imports, setImports }) {
  const handleAddImport = () => {
    if (!importName || !importDescription) {
      alert("Please fill out all fields.");
      return;
    }

    const importExists = imports.some(
      (importItem) => importItem.name.toLowerCase() === importName.toLowerCase()
    );
    if (importExists) {
      alert("Import already exists.");
      return;
    }

    const newImport = {
      id: imports.length + 1,
      name: importName,
      description: importDescription,
    };

    setImports([...imports, newImport]);
    setImportName('');
    setImportDescription('');
  };

  return (
    <ModernButton variant='outlined' onClick={handleAddImport} sx={{ width: '160px', borderRadius: '13px', mt: 3 }}>
      Add Import
    </ModernButton>
  );
}

const Imports = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [importName, setImportName] = useState('');
  const [importDescription, setImportDescription] = useState('');
  const [newImport, setNewImport] = useState({
      date: '',
      status: '',
      description: '',
      check_import: false,
      user_1: '',
      import: '',
      order_detail: '',
    });
  const [imports, setImports] = useState([
    { id: 1, name: 'Laptop', description: 10 },
    { id: 2, name: 'Keyboard', description: 50 },
    // Example imports
  ]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter imports based on the search query
  const filteredImports = imports.filter((importItem) =>
    importItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <ModernPaper sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <ModernTextField
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newImport.date}
            onChange={(e) => setNewImport({ ...newImport, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
          />
        </Grid>

        <ModernTextField
          autoFocus
          margin="dense"
          label="Import"
          fullWidth
          variant="outlined"
          value={importName}
          onChange={(e) => setImportName(e.target.value)}
        />
        <ModernTextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={importDescription}
          onChange={(e) => setImportDescription(e.target.value)}
        />
        <AddImport
          importName={importName}
          setImportName={setImportName}
          importDescription={importDescription}
          setImportDescription={setImportDescription}
          imports={imports}
          setImports={setImports}
        />
      </ModernPaper>

      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Import" />

      {/* Imports Table */}
      <ModernTableContainer>
        <Table>
          <ModernTableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Import</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredImports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((importItem) => (
                <ModernTableRow key={importItem.id}>
                  <TableCell>{importItem.id}</TableCell>
                  <TableCell>{importItem.name}</TableCell>
                  <TableCell>{importItem.description}</TableCell>
                </ModernTableRow>
              ))}
          </TableBody>
        </Table>
      </ModernTableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredImports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Imports;