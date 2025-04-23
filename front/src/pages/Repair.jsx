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
  Box,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import SearchBar from '../components/common/SearchBar';
import { useNavigate } from 'react-router-dom';
import { ModernBox, ModernTextField, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernButton, ModernSelect } from '../styles/styles';

const API_URL = 'http://localhost:1337/api/repairs';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getCurrentDate = () => new Date().toISOString().split('T')[0];

function AddRepair({ repairs, setRepairs, newRepair, setNewRepair, editId, setEditId }) {
  const handleAddOrUpdateRepair = async () => {
    const { item, status, description, approver, return_date } = newRepair;
    if (!item || !status || !description || !approver) {
      alert('Please fill out all required fields.');
      return;
    }

    const repairData = {
      data: {
        repair_date: getCurrentDate(),
        repair_description: description,
        statas: status, // Use API field name
        repair_user: approver, // Map to user ID or handle as needed
        reapir_approver: approver, // Use API field name (typo)
        return_date: return_date || null,
        item, // Add item field (not in API, may need schema update)
      },
    };

    try {
      if (editId) {
        // Update existing repair
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify(repairData),
        });
        if (!response.ok) throw new Error('Failed to update repair');
        const updatedRepair = await response.json();
        setRepairs(
          repairs.map((repair) =>
            repair.id === editId ? mapApiRepairToFrontend(updatedRepair.data) : repair
          )
        );
        setEditId(null);
      } else {
        // Add new repair
        const repairExists = repairs.some(
          (repair) => repair.item.toLowerCase() === item.toLowerCase()
        );
        if (repairExists) {
          alert('Repair item already exists.');
          return;
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify(repairData),
        });
        if (!response.ok) throw new Error('Failed to add repair');
        const newRepairData = await response.json();
        setRepairs([...repairs, mapApiRepairToFrontend(newRepairData.data)]);
      }

      setNewRepair({
        repair_date: getCurrentDate(),
        item: '',
        description: '',
        status: '',
        approver: '',
        return_date: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the repair.');
    }
  };

  return (
    <ModernButton
      variant="outlined"
      onClick={handleAddOrUpdateRepair}
      sx={{ width: '160px', borderRadius: '13px', mt: 3 }}
    >
      {editId ? 'Update Repair' : 'Add Repair'}
    </ModernButton>
  );
}

// Map API response to frontend format
const mapApiRepairToFrontend = (apiRepair) => ({
  id: apiRepair.id,
  repair_date: apiRepair.repair_date,
  item: apiRepair.item || apiRepair.repair_description, // Fallback to description if item not in API
  description: apiRepair.repair_description,
  status: apiRepair.statas, // Use API field name
  user: apiRepair.repair_user?.firstname || '',
  approver: apiRepair.reapir_approver?.firstname || '',
  return_date: apiRepair.return_date || '',
});

const Repairs = () => {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [repairs, setRepairs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRepair, setNewRepair] = useState({
    repair_date: getCurrentDate(),
    item: '',
    description: '',
    status: '',
    approver: '',
    return_date: '',
  });
  const [editId, setEditId] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const statusOptions = ['Pending', 'Approved', 'In Progress', 'Completed', 'Rejected'];
  const approverOptions = ['loungfar', 'ning']; // Map from API user/approver names

  // Fetch repairs from API
  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const response = await fetch(`${API_URL}?populate=*`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch repairs');
        const { data, meta } = await response.json();
        setRepairs(data.map(mapApiRepairToFrontend));
        setTotalRecords(meta.pagination.total);
      } catch (error) {
        console.error('Error fetching repairs:', error);
        alert('Failed to load repairs.');
      }
    };
    fetchRepairs();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (repair) => {
    setEditId(repair.id);
    setNewRepair({ ...repair, description: repair.description });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete repair');
      setRepairs(repairs.filter((repair) => repair.id !== id));
      if (editId === id) {
        setEditId(null);
        setNewRepair({
          repair_date: getCurrentDate(),
          item: '',
          description: '',
          status: '',
          approver: '',
          return_date: '',
        });
      }
    } catch (error) {
      console.error('Error deleting repair:', error);
      alert('Failed to delete repair.');
    }
  };

  const handleDetail = (repairId) => {
    navigate(`/repair_detail/${repairId}`);
  };

  const filteredRepairs = repairs.filter((repair) =>
    repair.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox sx={{ maxWidth: '2100px', margin: '0 auto' }}>
      <ModernPaper sx={{ p: 3, mb: 4, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <ModernTextField
              sx={{ mt: 1 }}
              label="Repair Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newRepair.repair_date}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <ModernTextField
              // autoFocus
              margin="dense"
              label="Repair Item"
              fullWidth
              variant="outlined"
              value={newRepair.item}
              onChange={(e) => setNewRepair({ ...newRepair, item: e.target.value })}
            />
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <ModernSelect
                value={newRepair.status}
                label="Status"
                onChange={(e) => setNewRepair({ ...newRepair, status: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="dense">
              <InputLabel>User</InputLabel>
              <ModernSelect
                value={newRepair.approver}
                label="Approver"
                onChange={(e) => setNewRepair({ ...newRepair, approver: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {approverOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </ModernSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <ModernTextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={newRepair.description}
              onChange={(e) => setNewRepair({ ...newRepair, description: e.target.value })}
            />
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <ModernTextField
              margin="dense"
              label="Return Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newRepair.return_date}
              onChange={(e) => setNewRepair({ ...newRepair, return_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid> */}
          <Grid item xs={12}>
            <AddRepair
              repairs={repairs}
              setRepairs={setRepairs}
              newRepair={newRepair}
              setNewRepair={setNewRepair}
              editId={editId}
              setEditId={setEditId}
            />
          </Grid>
        </Grid>
      </ModernPaper>

      <SearchBar
        search={searchQuery}
        setSearch={setSearchQuery}
        label="Search for Repair Item"
      />

      <ModernTableContainer sx={{ mt: 3 }}>
        <Table>
          <ModernTableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Repair Date</TableCell>
              {/* <TableCell>Repair Item</TableCell> */}
              <TableCell>Status</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </ModernTableHead>
          <TableBody>
            {filteredRepairs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((repair) => (
                <ModernTableRow key={repair.id}>
                  <TableCell>{repair.id}</TableCell>
                  <TableCell>{repair.repair_date}</TableCell>
                  {/* <TableCell>{repair.item}</TableCell> */}
                  <TableCell>{repair.status}</TableCell>
                  <TableCell>{repair.approver}</TableCell>
                  <TableCell>{repair.description}</TableCell>
                  {/* <TableCell>{repair.return_date}</TableCell> */}
                  <TableCell sx={{ textAlign: 'center'}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                      <Button
                        onClick={() => handleEdit(repair)}
                        sx={{ minWidth: 'auto', p: 0 }}
                      >
                        <EditRoundedIcon />
                      </Button>
                      <Button
                        onClick={() => handleDelete(repair.id)}
                        sx={{ minWidth: 'auto', p: 0 }}
                      >
                        <DeleteRoundedIcon />
                      </Button>
                      <Button
                        onClick={() => handleDetail(repair.id)}
                        sx={{ minWidth: 'auto', p: 0 }}
                      >
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
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ModernBox>
  );
};

export default Repairs;