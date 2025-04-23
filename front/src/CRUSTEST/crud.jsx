// components/CRUDComponent.jsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ModernBox,
  ModernTextField,
  ModernPaper,
  ModernTableContainer,
  ModernTableHead,
  ModernTableRow,
  ModernButton,
  ModernSelect,
} from '../styles/styles';

const getCurrentDate = () => new Date().toISOString().split('T')[0];

const CRUDComponent = ({
  apiEndpoint,
  fields,
  title,
  baseUrl = 'http://localhost:1337/api',
  apiToken,
  detailPath = '',
}) => {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialFormData = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue ?? (field.type === 'date' ? getCurrentDate() : field.type === 'boolean' ? false : ''),
    }), {});
    setNewItem(initialFormData);
    fetchItems();
  }, [fields]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/${apiEndpoint}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      console.log('Raw API Response:', response.data);
      const data = response.data.data || [];
      const formattedData = data.map((item) => ({
        id: item.id,
        ...fields.reduce((acc, field) => ({
          ...acc,
          [field.name]: item[field.name] ?? (field.defaultValue ?? (field.type === 'date' ? getCurrentDate() : field.type === 'boolean' ? false : '')),
        }), {}),
      }));
      console.log('Formatted Data:', formattedData);z
      setItems(formattedData);
    } catch (err) {
      console.error('Fetch Error:', err.response?.data?.error || err.message);
      setError(`Failed to fetch ${title.toLowerCase()}s: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const field = fields.find(f => f.name === name);
    let newValue = type === 'checkbox' ? checked : value;
    if (field.type === 'number') newValue = value === '' ? '' : parseFloat(value);
    if (field.type === 'select' && field.options.some(opt => typeof opt === 'boolean')) {
      newValue = value === 'true' ? true : value === 'false' ? false : value;
    }
    setNewItem({
      ...newItem,
      [name]: newValue,
    });
  };

  const handleAddOrUpdateItem = async () => {
    const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
    if (requiredFields.some((field) => !newItem[field] && newItem[field] !== false)) {
      alert('Please fill out all required fields.');
      return;
    }
  
    setLoading(true);
    setError(null);
    try {
      const payload = fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: newItem[field.name] === '' ? null : newItem[field.name], // Convert empty strings to null
      }), {});
      console.log('Payload being sent:', JSON.stringify(payload, null, 2));
      if (editId) {
        await axios.put(
          `${baseUrl}/${apiEndpoint}/${editId}`,
          { data: payload },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setItems(items.map((item) => (item.id === editId ? { ...newItem, id: editId } : item)));
        setEditId(null);
      } else {
        const response = await axios.post(
          `${baseUrl}/${apiEndpoint}`,
          { data: payload },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setItems([...items, { id: response.data.data.id, ...newItem }]);
      }
      setNewItem(fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.defaultValue ?? (field.type === 'date' ? getCurrentDate() : field.type === 'boolean' ? false : ''),
      }), {}));
    } catch (err) {
      console.error('Add/Update Error Details:', err.response?.data || err.message);
      setError(`Failed to ${editId ? 'update' : 'add'} ${title.toLowerCase()}: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNewItem({ ...item });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${baseUrl}/${apiEndpoint}/${id}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setItems(items.filter((item) => item.id !== id));
      if (editId === id) {
        setEditId(null);
        setNewItem(fields.reduce((acc, field) => ({
          ...acc,
          [field.name]: field.defaultValue ?? (field.type === 'date' ? getCurrentDate() : field.type === 'boolean' ? false : ''),
        }), {}));
      }
    } catch (err) {
      console.error('Delete Error:', err.response?.data?.error || err.message);
      setError(`Failed to delete ${title.toLowerCase()}: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (id) => {
    if (detailPath) {
      navigate(`${detailPath}/${id}`);
    }
  };

  const filteredItems = items.filter((item) =>
    fields.some((field) =>
      (item[field.name]?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <ModernPaper sx={{ mb: 3, p: 2, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={field.type === 'text' && field.name === 'description' ? 12 : 6} key={field.name}>
              {field.type === 'select' ? (
                <FormControl fullWidth margin="dense">
                  <InputLabel>{field.label}</InputLabel>
                  <ModernSelect
                    value={newItem[field.name] ?? ''}
                    label={field.label}
                    onChange={handleInputChange}
                    name={field.name}
                    disabled={loading}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {field.options?.map((option) => (
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
                  value={newItem[field.name] || ''}
                  onChange={handleInputChange}
                  name={field.name}
                  disabled={field.disabled || loading}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                  margin="dense"
                />
              )}
            </Grid>
          ))}
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <ModernButton
              variant="contained"
              onClick={handleAddOrUpdateItem}
              sx={{
                width: '160px',
                borderRadius: '20px',
                mt: 2,
                background: editId
                  ? 'linear-gradient(45deg, #388e3c, #66bb6a)'
                  : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: '#fff',
                '&:hover': {
                  background: editId
                    ? 'linear-gradient(45deg, #2e7d32, #4caf50)'
                    : 'linear-gradient(45deg, #1565c0, #2196f3)',
                },
              }}
              disabled={loading}
            >
              {editId ? `Save ${title}` : `Add ${title}`}
            </ModernButton>
          </Grid>
        </Grid>
      </ModernPaper>

      <TextField
        label={`Search ${title}s`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ mb: 4, maxWidth: '400px', borderRadius: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        disabled={loading}
      />

      <ModernTableContainer sx={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff' }}>
        <Table>
          <ModernTableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              {fields.map((field) => (
                <TableCell key={field.name} sx={{ fontWeight: 'bold' }}>
                  {field.label}
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
                  {fields.map((field) => (
                    <TableCell key={field.name}>{item[field.name]}</TableCell>
                  ))}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                      <Button onClick={() => handleEdit(item)} sx={{ padding: 0, minWidth: 'auto' }} disabled={loading}>
                        <EditRoundedIcon />
                      </Button>
                      <Button onClick={() => handleDelete(item.id)} sx={{ padding: 0, minWidth: 'auto' }} disabled={loading}>
                        <DeleteRoundedIcon />
                      </Button>
                      {detailPath && (
                        <Button onClick={() => handleDetail(item.id)} sx={{ padding: 0, minWidth: 'auto' }} disabled={loading}>
                          <EyeOutlinedIcon />
                        </Button>
                      )}
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

export default CRUDComponent;