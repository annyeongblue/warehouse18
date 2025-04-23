import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ModernBox, ModernButton, ModernTableContainer, ModernTableHead, ModernTableRow, ModernTextField, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const ImportDetail = () => {
  const { importId } = useParams();
  const navigate = useNavigate();
  const [importDetails, setImportDetails] = useState({ details: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDetail, setNewDetail] = useState({
    itemNames: [],
    quantity: '',
    return_date: '',
    borrow_approver: '',
    return_comment: '',
    return_approver: '',
    borrow_description: '',
  });

  const availableItems = ['Computer', 'Pen', 'A4 Paper', 'Notebook'];
  const approverOptions = ['Loungfar', 'Tockky', 'Nana'];

  useEffect(() => {
    const ImportDetails = async () => {
      if (!importId) {
        setError('No import ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/imports/${importId}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });

        // Log response for debugging
        console.log('API Response:', response.data);

        // Handle flat response structure
        const data = response.data;

        if (!data || !data.id) {
          throw new Error(`No import record found for ID ${importId}`);
        }

        setImportDetails({
          id: data.id || 0,
          date: data.date || '',
          status: data.statas || 'Pending', // Note: 'statas' is a typo in API
          user: data.user_1 || 'Unknown', // Fallback for missing user_1
          details: data.details || [], // Fallback for missing details
        });
      } catch (err) {
        console.error('Fetch error:', err);
        const message = err.response?.status === 404
          ? `Import record with ID ${importId} not found`
          : err.response?.data?.error?.message || `Failed to fetch Import details: ${err.message}`;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    ImportDetails();
  }, [importId]);

  const handleAddDetail = async () => {
    if (!newDetail.itemNames.length || !newDetail.quantity || !newDetail.return_date) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!importDetails.id) {
      alert('Import details not loaded. Please try again.');
      return;
    }

    const newDetailItem = {
      id: (importDetails.details.length || 0) + 1,
      itemNames: newDetail.itemNames,
      quantity: parseInt(newDetail.quantity, 10),
      return_date: newDetail.return_date,
      borrow_approver: newDetail.borrow_approver,
      return_comment: newDetail.return_comment,
      return_approver: newDetail.return_approver,
      borrow_description: newDetail.borrow_description,
    };

    try {
      const response = await axios.put(
        `${API_URL}/imports/${importId}`,
        {
          data: {
            date: importDetails.date,
            statas: importDetails.statas, // Use API's field name
            user_1: importDetails.user,
            details: [...importDetails.details, newDetailItem],
          },
        },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      const data = response.data;
      setImportDetails({
        id: data.id || 0,
        date: data.date || '',
        status: data.statas || 'Pending',
        user: data.user_1 || 'Unknown',
        details: data.details || [],
      });

      setNewDetail({
        itemNames: [],
        quantity: '',
        return_date: '',
        borrow_approver: '',
        return_comment: '',
        return_approver: '',
        borrow_description: '',
      });
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error?.message || 'Failed to update Import details');
    }
  };

  const handleBack = () => {
    navigate('/import');
  };

  return (
    <ModernBox sx={{ maxWidth: '1200px', margin: '0 auto', mt: 6, mb: 6, p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
        Import Detail - ID: {importId}
      </Typography>

      {loading ? (
        <Typography variant="h6" sx={{ py: 4 }}>Loading...</Typography>
      ) : error ? (
        <Typography variant="h6" color="error" sx={{ py: 4 }}>{error}</Typography>
      ) : (
        <>
          <Box sx={{ mb: 6, p: 4, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>ID:</strong> {importDetails.id || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Import Date:</strong> {importDetails.date || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Status:</strong> {importDetails.status || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>User:</strong> {importDetails.user || 'N/A'}</Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Add New Detail
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Items</InputLabel>
                  <ModernSelect
                    multiple
                    value={newDetail.itemNames}
                    onChange={(e) => setNewDetail({ ...newDetail, itemNames: e.target.value })}
                    input={<OutlinedInput label="Items" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    sx={{ height: '56px' }}
                  >
                    {availableItems.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Quantity"
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={newDetail.quantity}
                  onChange={(e) => setNewDetail({ ...newDetail, quantity: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Amount"
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={newDetail.quantity}
                  onChange={(e) => setNewDetail({ ...newDetail, quantity: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Return Date"
                  fullWidth
                  variant="outlined"
                  type="date"
                  value={newDetail.return_date}
                  onChange={(e) => setNewDetail({ ...newDetail, return_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Borrow Approver</InputLabel>
                  <ModernSelect
                    value={newDetail.borrow_approver}
                    label="Borrow Approver"
                    onChange={(e) => setNewDetail({ ...newDetail, borrow_approver: e.target.value })}
                    sx={{ height: '56px' }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {approverOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Borrow Description"
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={newDetail.borrow_description}
                  onChange={(e) => setNewDetail({ ...newDetail, borrow_description: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Return Approver</InputLabel>
                  <ModernSelect
                    value={newDetail.return_approver}
                    label="Return Approver"
                    onChange={(e) => setNewDetail({ ...newDetail, return_approver: e.target.value })}
                    sx={{ height: '56px' }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {approverOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <ModernTextField
                  label="Return Comment"
                  fullWidth
                  variant="outlined"
                  type="text"
                  value={newDetail.return_comment}
                  onChange={(e) => setNewDetail({ ...newDetail, return_comment: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                />
              </Grid> */}
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <ModernButton
                  variant="contained"
                  onClick={handleAddDetail}
                  disabled={loading || !importDetails.id}
                  sx={{
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                    color: '#fff',
                    '&:hover': { background: 'linear-gradient(45deg, #2e7d32, #4caf50)' },
                    padding: '12px 24px',
                  }}
                >
                  Add Detail
                </ModernButton>
              </Grid>
            </Grid>
          </Box>

          <ModernTableContainer sx={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff', mb: 6 }}>
            <Table>
              <ModernTableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Amount</TableCell>
                  {/* <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Return Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Borrow Approver</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Return Comment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Return Approver</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 3 }}>Borrow Description</TableCell> */}
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {importDetails.details && importDetails.details.length > 0 ? (
                  importDetails.details.map((detail) => (
                    <ModernTableRow key={detail.id}>
                      <TableCell sx={{ py: 2.5 }}>{detail.id}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.itemNames.join(', ') || 'None'}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.quantity || 'None'}</TableCell>
                      {/* <TableCell sx={{ py: 2.5 }}>{detail.return_date || 'Not Set'}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.borrow_approver || 'None'}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.return_comment || 'None'}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.return_approver || 'None'}</TableCell>
                      <TableCell sx={{ py: 2.5 }}>{detail.borrow_description || 'None'}</TableCell> */}
                    </ModernTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      No details available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModernTableContainer>
        </>
      )}

      <ModernButton
        variant="contained"
        onClick={handleBack}
        sx={{
          mt: 4,
          borderRadius: '20px',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          color: '#fff',
          '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
          padding: '12px 24px',
        }}
      >
        Back to Imports
      </ModernButton>
    </ModernBox>
  );
};

export default ImportDetail;