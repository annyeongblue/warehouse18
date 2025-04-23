import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernButton, ModernTableContainer, ModernTableHead, ModernTableRow } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/categories'
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function AddCategories({
  categoryName,
  setCategoryName,
  categoryDescription,
  setCategoryDescription,
  categories,
  setCategories,
  fetchCategories,
}) {
  const handleAddCategory = async () => {
    if (!categoryName) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { data: { name: categoryName }},
        { headers: { Authorization: `Bearer ${API_TOKEN}`}}
      );
      console.log('API_TOKEN:', API_TOKEN); // for debugging

      const newCategory = {
        id: response.data.data.id,
        name: response.data.data.name || categoryName,
      }
      setCategories([newCategory, ...categories]);
      setCategoryName('');
      setCategoryDescription('');
    } catch (err) {
      alert(`Error adding category: ${err.response?.data?.error?.message || err.message}`);
    }
  };

  return (
    <ModernButton
      variant="contained"
      onClick={handleAddCategory}
    >
      Add Category
    </ModernButton>
  );
}

const Categories = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}`},
      });
      const data = response.data.data;
      const formattedData = data.map((categories) => ({
        id: categories.id,
        name: categories.name,
      }));
      setCategories(formattedData);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ minHeight: '100vh' }}>

      {/* Form */}
      <Paper
        sx={{
          padding: 3,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          background: '#fff',
          mb: 4,
        }}
      >
        <ModernTextField
          autoFocus
          margin="dense"
          label="Category Name"
          fullWidth
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: '#fafafa',
            },
            '& .MuiInputLabel-root': { color: '#64748b' },
          }}
        />
        <ModernTextField
          margin="dense"dxf
          label="Description"
          fullWidth
          variant="outlined"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: '#fafafa',
            },
            '& .MuiInputLabel-root': { color: '#64748b' },
          }}
        />
        <AddCategories
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          categoryDescription={categoryDescription}
          setCategoryDescription={setCategoryDescription}
          categories={categories}
          setCategories={setCategories}
        />
      </Paper>

      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label="Search for Category"
          sx={{
            maxWidth: '400px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          }}
        />
      </Box>

      {/* Categories Table */}
      <ModernTableContainer>
        <Table>
          <ModernTableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category</TableCell>
              {/* <TableCell>Description</TableCell> */}
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {error ? (
              <ModernTableRow>
                <TableCell colSpan={3} align='center'>
                  Error: {error}
                </TableCell>
              </ModernTableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <ModernTableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    {/* <TableCell>{category.des}</TableCell> */}
                  </ModernTableRow>
                ))
              ) : (
                <ModernTableRow>
                  <TableCell>
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
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          mt: 2,
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          '& .MuiTablePagination-toolbar': { color: '#64748b' },
        }}
      />
    </ModernBox>
  );
};

export default Categories;