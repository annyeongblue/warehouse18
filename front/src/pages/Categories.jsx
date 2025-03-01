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

function AddCategories({ categoryName, setCategoryName, categoryDescription, setCategoryDescription, categories, setCategories }) {
  const handleAddCategory = () => {
    if (!categoryName || !categoryDescription) {
      alert("Please fill out all fields.");
      return;
    }

    const categoryExists = categories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (categoryExists) {
      alert("Category already exists.");
      return;
    }

    const newCategory = {
      id: categories.length + 1,
      name: categoryName,
      des: categoryDescription,
    };

    setCategories([...categories, newCategory]);
    setCategoryName('');
    setCategoryDescription('');
  };

  return (
    <Button variant='outlined' onClick={handleAddCategory} sx={{ width: '160px', borderRadius: '13px', mb: 3, mt: 3 }}>
      Add Category
    </Button>
  );
}

const Categories = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Laptop', des: 10 },
    { id: 2, name: 'Keyboard', des: 50 },
    // Example categories
  ]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter categories based on the search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Pass searchQuery and setSearchQuery to SearchBar */}
      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Category" />

      <Box>
        <TextField
          autoFocus
          margin="dense"
          label="Category"
          fullWidth
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
        />
        <AddCategories
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          categoryDescription={categoryDescription}
          setCategoryDescription={setCategoryDescription}
          categories={categories}
          setCategories={setCategories}/>
      </Box>

      {/* Categories Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.des}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Categories;