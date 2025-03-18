import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernButton, ModernTextField, ModernTableContainer, ModernTableHead, ModernTableRow } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/brands';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function AddBrand({ brandName, setBrandName, brandDescription, setBrandDescription, fetchBrands, brands, setBrands }) {
  const handleAddBrand = async () => {
    if (!brandName) {
      alert("Please fill out the brand.");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { data: { name: brandName } },
        { headers: { Authorization: `Bearer ${API_TOKEN}`}}
      );

      const newBrand = {
        id: response.data.data.id,
        name: response.data.data.name || brandName,
      }
      setBrands([newBrand, ...brands]);
      setBrandName('');
      setBrandDescription('');
    } catch (err) {
      alert(`Error adding brand: ${err.response?.data?.error?.message || err.message}`);
    }
  };

  return (
    <ModernButton variant='outlined' onClick={handleAddBrand} sx={{ width: '160px', borderRadius: '13px', mb: 3, mt: 3 }}>
      Add Brand
    </ModernButton>
  );
}

const Brands = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const fetchBrands = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}`},
      });
      console.log('API Response:', response.data);
      const data = response.data.data;
      const formattedData = data.map((brand) => ({
        id: brand.id || 'N/A',
        name: brand.name || 'Unknown',
      }));
      setBrands(formattedData);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter brands based on the search query
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox>
      <Paper sx={{ padding: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', background: '#fff', mb: 3 }}>
        <ModernTextField
          autoFocus
          margin="dense"
          label="Brand"
          fullWidth
          variant="outlined"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <ModernTextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={brandDescription}
          onChange={(e) => setBrandDescription(e.target.value)}
        />
        <AddBrand
          brandName={brandName}
          setBrandName={setBrandName}
          brandDescription={brandDescription}
          setBrandDescription={setBrandDescription}
          brands={brands}
          setBrands={setBrands}
        />
      </Paper>

      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Brand" />

      {/* Brands Table */}
      <ModernTableContainer>
        <Table>
          <ModernTableHead>
            <ModernTableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
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
            ) : filteredBrands.length > 0 ? (
              filteredBrands
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((brand) => (
                <ModernTableRow key={brand.id}>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell>{brand.name}</TableCell>
                  {/* <TableCell>{brand.des}</TableCell> */}
                </ModernTableRow>
              ))
            ) : (
              <ModernTableRow>
                <TableCell colSpan={3} align='center'>
                  No brands found-add some above!
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
        count={filteredBrands.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ModernBox>
  );
};

export default Brands;
