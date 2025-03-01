import React, { useState } from 'react';
import {
  Box,
  Button,
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
import SearchBar from '../components/SearchBar';

function AddItem({ itemName, setItemName, itemQuantity, setItemQuantity, items, setItems }) {
    const handleAddItem = () => {

        if(!itemName || !itemQuantity) {
            alert("Please fill out all fields.");
            return;
        };

        if(parseInt(itemQuantity, 10) <= 0){
            alert("Quantity must be greater than zero.");
            return;
        };

        const itemExists = items.some((item) => item.name.toLowerCase() === itemName.toLowerCase());
        if(itemExists) {
            alert("Item already existed");
            return;
        };

        const newItem = {
            id: items.length + 1,
            name: itemName,
            quantity: parseInt(itemQuantity, 10),
        };

        setItems([...items, newItem]);
        setItemName('');
        setItemQuantity('');
    }
    return(
        <Button onClick={handleAddItem} color="primary">
            Add Item
        </Button>
    );
}

const InventoryTest = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [items, setItems] = useState([  
    { id: 1, name: 'Laptop', quantity: 10 },
    { id: 2, name: 'Keyboard', quantity: 50 },
    // Example inventoryTest items
  ]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter items based on the search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
            InventoryTest
            {/* Pass searchQuery and setSearchQuery to SearchBar */}
            <SearchBar search={searchQuery} setSearch={setSearchQuery} />
        </Typography>

        <Box>
        <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
        />
        <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
        />
        </Box>

        {/* InventoryTest Table */}
        <TableContainer>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Quantity</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

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

        <AddItem
            itemName={itemName}
            setItemName={setItemName}
            itemQuantity={itemQuantity}
            setItemQuantity={setItemQuantity}
            items={items}
            setItems={setItems}
        />
        </Box>
  );
};


export default InventoryTest;
