  import React, { useState } from 'react';
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
    const handleAddOrUpdateRepair = () => {
      const { item, status, description } = newRepair;
      if (!item || !status || !description) {
        alert("Please fill out all required fields.");
        return;
      }

      if (editId) {
        // Update existing repair
        setRepairs(
          repairs.map((repair) =>
            repair.id === editId ? { ...newRepair, id: editId } : repair
          )
        );
        setEditId(null);
      } else {
        // Add new repair
        const repairExists = repairs.some(
          (repair) => repair.item.toLowerCase() === item.toLowerCase() && repair.id !== editId
        );
        if (repairExists) {
          alert("Repair item already exists.");
          return;
        }

        const repairData = {
          id: repairs.length + 1,
          repair_date: getCurrentDate(),
          description: description,
          status: status,
          approver: newRepair.approver,
          return_date: newRepair.return_date || '',
          item: item,
        };
        setRepairs([...repairs, repairData]);
      }

      setNewRepair({ 
        repair_date: getCurrentDate(), 
        item: '', 
        description: '', 
        status: '', 
        approver: '', 
        return_date: '' 
      });
    };

    return (
      <ModernButton 
        variant='outlined' 
        onClick={handleAddOrUpdateRepair} 
        sx={{ width: '160px', borderRadius: '13px', mt: 3 }}
      >
        {editId ? 'Update Repair' : 'Add Repair'}
      </ModernButton>
    );
  }

  const Repairs = () => {
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [repairs, setRepairs] = useState([
      { 
        id: 1, 
        repair_date: '2025-03-20', 
        item: 'Laptop Screen', 
        description: 'Cracked screen replacement', 
        status: 'Pending', 
        approver: 'JohnDoe', 
        return_date: '2025-03-25' 
      },
      { 
        id: 2, 
        repair_date: '2025-03-21', 
        item: 'Keyboard', 
        description: 'Sticky keys repair', 
        status: 'Approved', 
        approver: 'JaneSmith', 
        return_date: '' 
      },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newRepair, setNewRepair] = useState({
      repair_date: getCurrentDate(),
      item: '',
      description: '',
      status: '',
      approver: '',
      return_date: ''
    });
    const [editId, setEditId] = useState(null);

    const statusOptions = ['Pending', 'Approved', 'In Progress', 'Completed', 'Rejected'];
    const approverOptions = ['JohnDoe', 'JaneSmith', 'AliceJohnson', 'BobBrown'];

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

    const handleEdit = (repair) => {
      setEditId(repair.id);
      setNewRepair({ ...repair });
    };

    const handleDelete = (id) => {
      setRepairs(repairs.filter((repair) => repair.id !== id));
      if (editId === id) {
        setEditId(null);
        setNewRepair({
          repair_date: getCurrentDate(),
          item: '',
          description: '',
          status: '',
          approver: '',
          return_date: ''
        });
      }
    };

    const handleDetail = (repairId) => {
      navigate(`/repair_detail/${repairId}`)
    }

    const filteredRepairs = repairs.filter((repair) =>
      repair.item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <ModernBox>
        <ModernPaper sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <ModernTextField
                label="Repair Date"
                type="date"
                fullWidth
                variant="outlined"
                value={newRepair.repair_date}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ModernTextField
                autoFocus
                margin="dense"
                label="Repair Item"
                fullWidth
                variant="outlined"
                value={newRepair.item}
                onChange={(e) => setNewRepair({ ...newRepair, item: e.target.value })}
              />
            </Grid>
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
              <ModernTextField
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                value={newRepair.description}
                onChange={(e) => setNewRepair({ ...newRepair, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Approver</InputLabel>
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
            <Grid item xs={12} sm={4}>
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
            </Grid>
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
                <TableCell>Item</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approver</TableCell>
                <TableCell>Return Date</TableCell>
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
                    <TableCell>{repair.item}</TableCell>
                    <TableCell>{repair.description}</TableCell>
                    <TableCell>{repair.status}</TableCell>
                    <TableCell>{repair.approver}</TableCell>
                    <TableCell>{repair.return_date}</TableCell>
                    <TableCell align="center">
                      <Button 
                        onClick={() => handleEdit(repair)} 
                        sx={{ minWidth: 0, p: 1 }}
                      >
                        <EditRoundedIcon />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(repair.id)} 
                        sx={{ minWidth: 0, p: 1 }}
                      >
                        <DeleteRoundedIcon />
                      </Button>
                      <Button
                        onClick={() => handleDetail(repair.id)}>
                        <EyeOutlinedIcon />
                      </Button>
                    </TableCell>
                  </ModernTableRow>
                ))}
            </TableBody>
          </Table>
        </ModernTableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRepairs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ModernBox>
    );
  };

  export default Repairs;