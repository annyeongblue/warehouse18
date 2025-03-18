import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernButton, ModernTextField, ModernTableContainer, ModernTableHead, ModernTableRow, ModernPaper } from '../styles/styles';

const API_URL = 'http://localhost:1337/api/units';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function AddUnit({ unitName, setUnitName, unitDescription, setUnitDescription, fetchUnits, units, setUnits }) {
  const handleAddUnit = async () => {
    if (!unitName) {
      alert("Please fill out the unit.");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { data: { name: unitName, description: unitDescription } }, // Strapi expects "data" wrapper
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      const newUnit = {
        id: response.data.data.id,
        name: response.data.data.name || unitName,
        description: response.data.data.description || unitDescription,
      };
      setUnits([newUnit, ...units]);
      setUnitName('');
      setUnitDescription('');
      // fetchUnits(); // Refresh the list
    } catch (err) {
      alert(`Error adding unit: ${err.response?.data?.error?.message || err.message}`);
    }
  };

  return (
    <ModernButton variant='outlined' onClick={handleAddUnit} sx={{ width: '160px', borderRadius: '13px', mb: 3, mt: 3 }}>
      Add Unit
    </ModernButton>
  );
}

// function

const Units = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [unitName, setUnitName] = useState('');
  const [unitDescription, setUnitDescription] = useState('');
  const [error, setError] = useState(null);
  const [units, setUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const fetchUnits = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}`},
      });
      const data = response.data.data;
      const formattedData = data.map((unit) => ({
        id: unit.id,
        name: unit.name,
        description: unit.description,
      }));
      setUnits(formattedData);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter units based on the search query
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox>
      <ModernPaper sx={{ padding: 3, borderRadius: '16px', background: '#fff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', mb: 3 }}>
        <ModernTextField
          autoFocus
          margin="dense"
          label="Unit"
          fullWidth
          variant="outlined"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />
        <ModernTextField
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
          // fetchUnits={fetchUnits}
        />
      </ModernPaper>

      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Unit" />

      {/* Units Table */}
      <ModernTableContainer>
        <Table>
          <ModernTableHead>
            <ModernTableRow>
              <TableCell>ID</TableCell>
              <TableCell>Unit</TableCell>
              {/* <TableCell>Description</TableCell> */}
            </ModernTableRow>
          </ModernTableHead>
          <TableBody>
            {error ? (
              <ModernTableRow>
                <TableCell colSpan={3} align='center'>
                  Error: {error}
                </TableCell>
              </ModernTableRow>
            ) : filteredUnits.length > 0 ? (
              filteredUnits
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((unit) => (
                  <ModernTableRow key={unit.id}>
                    <TableCell>{unit.id}</TableCell>
                    <TableCell>{unit.name}</TableCell>
                    {/* <TableCell>{unit.description}</TableCell> */}
                  </ModernTableRow>
                ))
              ) : (
                <ModernTableRow>
                  <TableCell colSpan={3} align='center'>
                    No units found-add some above!
                  </TableCell>
                </ModernTableRow>
              )}
          </TableBody>
        </Table>
      </ModernTableContainer>

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
    </ModernBox>
  );
};

export default Units;
