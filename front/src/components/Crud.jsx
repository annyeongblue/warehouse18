// src/components/Crud.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar'; // Adjust path
import { ModernBox, ModernButton, ModernTextField, ModernTableContainer, ModernTableHead, ModernTableRow, ModernPaper } from '../styles/styles';

const Crud = ({ apiUrl, apiToken, entityName, fields, displayFields }) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  // Initialize form data
  useEffect(() => {
    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
  }, [fields]);

  // Fetch items (Read)
  const fetchItems = async () => {
    try {
      const response = await axios.get(apiUrl, { // Line ~32
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      console.log('Fetch Response:', response.data);
      const data = response.data.data || [];
      const formattedData = data.map((item) => { // Line ~36
        const formattedItem = { id: item.id };
        fields.forEach((field) => { // Line ~37
          formattedItem[field.name] = item.attributes[field.name] || ''; // Line ~37:44 (error here)
        });
        return formattedItem;
      });
      console.log('Formatted Data:', formattedData);
      setItems(formattedData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [apiUrl, apiToken]);

  // Create or Update
  const handleCreate = async () => {
    const hasEmptyRequiredField = fields.some((field) => field.required && !formData[field.name]);
    if (hasEmptyRequiredField) {
      alert(`Please fill out all required ${entityName.toLowerCase()} fields.`);
      return;
    }
    try {
      if (formData.id) {
        // Update existing item
        await axios.put(
          `${apiUrl}/${formData.id}`,
          { data: formData },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
      } else {
        // Create new item
        const response = await axios.post(
          apiUrl,
          { data: formData },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        console.log('POST Response:', response.data); // Debug
      }
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
      setSearchQuery(''); // Reset search
      setPage(0); // Reset to first page
      await fetchItems(); // Refresh table
    } catch (err) {
      alert(`Error ${formData.id ? 'updating' : 'adding'} ${entityName.toLowerCase()}: ${err.response?.data?.error?.message || err.message}`);
      console.error('Create/Update Error:', err);
    }
  };

  // Edit (populate form)
  const handleEdit = (item) => {
    setFormData(item);
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      await fetchItems();
    } catch (err) {
      alert(`Error deleting ${entityName.toLowerCase()}: ${err.response?.data?.error?.message || err.message}`);
      console.error('Delete Error:', err);
    }
  };

  const handleInputChange = (fieldName) => (e) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  console.log('Filtered Items:', filteredItems); // Debug

  return (
    <ModernBox>
      {/* Form */}
      <ModernPaper sx={{ padding: 3, borderRadius: '16px', background: '#fff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', mb: 3 }}>
        {fields.map((field) => (
          <ModernTextField
            key={field.name}
            autoFocus={field.name === fields[0].name}
            margin="dense"
            label={field.label}
            fullWidth
            variant="outlined"
            value={formData[field.name] || ''}
            onChange={handleInputChange(field.name)}
          />
        ))}
        <ModernButton
          variant="outlined"
          onClick={handleCreate}
          sx={{ width: '160px', borderRadius: '13px', mb: 3, mt: 3 }}
        >
          {formData.id ? `Update ${entityName}` : `Add ${entityName}`}
        </ModernButton>
      </ModernPaper>

      {/* Search */}
      <SearchBar search={searchQuery} setSearch={setSearchQuery} label={`Search for ${entityName}`} />

      {/* Table */}
      <ModernTableContainer>
        <Table>
          <ModernTableHead>
            <ModernTableRow>
              {displayFields.map((field) => (
                <TableCell key={field}>
                  {field === 'id' ? 'ID' : fields.find((f) => f.name === field)?.label || field}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </ModernTableRow>
          </ModernTableHead>
          <TableBody>
            {error ? (
              <ModernTableRow>
                <TableCell colSpan={displayFields.length + 1} align="center">
                  Error: {error}
                </TableCell>
              </ModernTableRow>
            ) : filteredItems.length > 0 ? (
              filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <ModernTableRow key={item.id}>
                    {displayFields.map((field) => (
                      <TableCell key={field}>{item[field]}</TableCell>
                    ))}
                    <TableCell>
                      <ModernButton onClick={() => handleEdit(item)}>Edit</ModernButton>
                      <ModernButton onClick={() => handleDelete(item.id)} color="error">
                        Delete
                      </ModernButton>
                    </TableCell>
                  </ModernTableRow>
                ))
            ) : (
              <ModernTableRow>
                <TableCell colSpan={displayFields.length + 1} align="center">
                  No {entityName.toLowerCase()}s found - add some above!
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
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ModernBox>
  );
};

export default Crud;