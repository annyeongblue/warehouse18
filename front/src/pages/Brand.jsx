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

function AddBrand({ brandName, setBrandName, brandDescription, setBrandDescription, brands, setBrands }) {
  const handleAddBrand = () => {
    if (!brandName || !brandDescription) {
      alert("Please fill out all fields.");
      return;
    }

    const brandExists = brands.some(
      (brand) => brand.name.toLowerCase() === brandName.toLowerCase()
    );
    if (brandExists) {
      alert("Brand already exists.");
      return;
    }

    const newBrand = {
      id: brands.length + 1,
      name: brandName,
      des: brandDescription,
    };

    setBrands([...brands, newBrand]);
    setBrandName('');
    setBrandDescription('');
  };

  return (
    <Button variant='outlined' onClick={handleAddBrand} sx={{ width: '160px', borderRadius: '13px', mb: 3, mt: 3 }}>
      Add Brand
    </Button>
  );
}

const Brands = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [brands, setBrands] = useState([
    { id: 1, name: 'Apple', des: 'Premium electronics' },
    { id: 2, name: 'Samsung', des: 'Innovative tech' },
    // Example brands
  ]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter brands based on the search query
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Pass searchQuery and setSearchQuery to SearchBar */}
      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Brand" />

      <Box>
        <TextField
          autoFocus
          margin="dense"
          label="Brand"
          fullWidth
          variant="outlined"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <TextField
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
      </Box>

      {/* Brands Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrands
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.des}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
};

export default Brands;
