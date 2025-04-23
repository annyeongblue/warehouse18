// src/components/CrudComponent.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TablePagination,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const getCurrentDate = () => new Date().toISOString().split('T')[0];

const CrudComponent = ({
  apiUrl,
  entityName,
  fields,
  tableColumns,
  detailPath,
  initialData,
  options = {},
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState(initialData);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      const formattedData = data.map((item) => ({
        id: item.id,
        ...Object.keys(initialData).reduce((acc, key) => {
          acc[key] = item.attributes?.[key] ?? item[key] ?? initialData[key];
          return acc;
        }, {}),
      }));
      setItems(formattedData);
    } catch (err) {
      console.error(`Error fetching ${entityName}s:`, err.response?.data?.error?.message || err.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
    if (requiredFields.some((field) => !newItem[field])) {
      alert(`Please fill out all required fields for ${entityName}.`);
      return;
    }

    try {
      const response = await axios.post(
        apiUrl,
        { data: { ...newItem, date: getCurrentDate() } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const newItemData = {
        id: response.data.data.id,
        ...Object.keys(initialData).reduce((acc, key) => {
          acc[key] = response.data.data.attributes?.[key] ?? newItem[key];
          return acc;
        }, {}),
      };
      setItems([...items, newItemData]);
      setNewItem(initialData);
    } catch (err) {
      console.error(`Error adding ${entityName}:`, err.response?.data?.error?.message || err.message);
      alert(`Failed to add ${entityName}.`);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNewItem({ ...item });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/${editId}`,
        { data: { ...newItem, date: getCurrentDate() } },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const updatedItem = {
        id: response.data.data.id,
        ...Object.keys(initialData).reduce((acc, key) => {
          acc[key] = response.data.data.attributes?.[key] ?? newItem[key];
          return acc;
        }, {}),
      };
      setItems(items.map((item) => (item.id === editId ? updatedItem : item)));
      setEditId(null);
      setNewItem(initialData);
    } catch (err) {
      console.error(`Error updating ${entityName}:`, err.response?.data?.error?.message || err.message);
      alert(`Failed to update ${entityName}.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error(`Error deleting ${entityName}:`, err.response?.data?.error?.message || err.message);
      alert(`Failed to delete ${entityName}.`);
    }
  };

  const handleDetail = (id) => {
    navigate(`${detailPath}/${id}`);
  };

  const filteredItems = items.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      {/* Form Section */}
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={field.gridSize || 6} key={field.name}>
              {field.type === 'select' ? (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <ModernSelect
                    value={newItem[field.name]}
                    label={field.label}
                    onChange={(e) => setNewItem({ ...newItem, [field.name]: e.target.value })}
                    disabled={field.disabled}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {(options[field.name] || []).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              ) : (
                <ModernTextField
                  label={field.label}
                  type={field.type || 'text'}
                  fullWidth
                  variant="outlined"
                  value={newItem[field.name]}
                  onChange={(e) => setNewItem({ ...newItem, [field.name]: e.target.value })}
                  disabled={field.disabled}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                />
              )}
            </Grid>
          ))}
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            {editId ? (
              <ModernButton
                variant="contained"
                onClick={handleSaveEdit}
                sx={{
                  borderRadius: '20px',
                  background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(45deg, #2e7d32, #4caf50)' },
                }}
              >
                Save Edit
              </ModernButton>
            ) : (
              <ModernButton
                variant="contained"
                onClick={handleAdd}
                sx={{
                  width: '160px',
                  borderRadius: '20px',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
                }}
              >
                Add {entityName}
              </ModernButton>
            )}
          </Grid>
        </Grid>
      </ModernPaper>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          search={searchQuery}
          setSearch={setSearchQuery}
          label={`Search for ${entityName}`}
          sx={{ maxWidth: '400px', borderRadius: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
      </Box>

      {/* Table Section */}
      <ModernTableContainer sx={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff' }}>
        <Table>
          <ModernTableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              {tableColumns.map((col) => (
                <TableCell key={col.field} sx={{ fontWeight: 'bold' }}>
                  {col.headerName}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <ModernTableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  {tableColumns.map((col) => (
                    <TableCell key={col.field}>{item[col.field]}</TableCell>
                  ))}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                      <Button onClick={() => handleEdit(item)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <EditRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDelete(item.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <DeleteRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDetail(item.id)} sx={{ padding: 0, minWidth: 'auto' }}>
                        <EyeOutlinedIcon />
                      </Button>
                    </Box>
                  </TableCell>
                </ModernTableRow>
              ))}
          </TableBody>
        </Table>
      </ModernTableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        sx={{ mt: 2 }}
      />
    </ModernBox>
  );
};

export default CrudComponent;