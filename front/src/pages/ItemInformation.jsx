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
  Typography,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';

function AddItem({ itemInfo, setitemInfo, itemInfor, setitemInfor }) {
    const handleAddItem = () => {

        if(!itemInfo) {
            alert("Please fill out all fields.");
            return;
        };

        const itemExists = itemInfor.some((item) => item.name.toLowerCase() === itemInfo.toLowerCase());
        if(itemExists) {
            alert("Item already existed");
            return;
        };

        const newItem = {
            id: itemInfor.length + 1,
            name: itemInfo,
        };

        setitemInfor([...itemInfor, newItem]);
        setitemInfo('');
    }
    return(
        <Button variant='outlined' onClick={handleAddItem} sx={{ width: '230px', borderRadius: '10px', mt: 3, mb: 3}}>
            Add Item Information
        </Button>
    );
}

const InventoryTest = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [itemInfo, setitemInfo] = useState('');
  const [itemInfor, setitemInfor] = useState([  
    { id: 1, name: 'Laptop'},
    { id: 2, name: 'Keyboard'},
    // Example inventoryTest itemInfor
  ]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter itemInfor based on the search query
  const filtereditemInfor = itemInfor.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
        {/* Pass searchQuery and setSearchQuery to SearchBar */}
        <SearchBar search={searchQuery} setSearch={setSearchQuery} label='Search for Item Detail'/>

        <Box>
        <TextField
            autoFocus
            margin="dense"
            label="Item Info"
            fullWidth
            variant="outlined"
            value={itemInfo}
            onChange={(e) => setitemInfo(e.target.value)}
        />
        </Box>

        <AddItem
            itemInfo={itemInfo}
            setitemInfo={setitemInfo}
            itemInfor={itemInfor}
            setitemInfor={setitemInfor}
        />

        {/* InventoryTest Table */}
        <TableContainer>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Item Name</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filtereditemInfor.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtereditemInfor.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Box>
  );
};


export default InventoryTest;
