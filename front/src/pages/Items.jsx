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
  Grid
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import TypeSelected from '../components/common/TypeSelected'

const borrowOptions = [
    { id: 1, name: 'ເບີກເຄື່ອງໃຊ້ທົ່ວໄປ' },
    { id: 2, name: 'ຢືມອຸປະກອນ' }
];

function BorrowPage({ itemType, setItemType }) {
    return (
        <TypeSelected itemType={itemType} setItemType={setItemType} options={borrowOptions} />
    );
}

function AddItem({ itemName, setItemName, itemType, setItemType, itemQuantity, setItemQuantity, items, setItems, description, setDescription }) {
    const handleAddItem = () => {
        if (!itemName || !itemType || !itemQuantity || !description) {
            alert("Please fill out all fields.");
            return;
        };
    
        if (parseInt(itemQuantity, 10) <= 0) {
            alert("Quantity must be greater than zero.");
            return;
        };
    
        const itemExists = items.some((item) => item.name.toLowerCase() === itemName.toLowerCase());
        if (itemExists) {
            alert("Item already existed");
            return;
        };
    
        const newItem = {
            id: items.length + 1,
            name: itemName,
            type: itemType,
            quantity: parseInt(itemQuantity, 10),
            des: description,
        };
    
        setItems([...items, newItem]);
        setItemName('');
        setItemType('');
        setItemQuantity('');
        setDescription('');
    };

    return(
        <Button variant='outlined' onClick={handleAddItem} sx={{ width: '130px', borderRadius: '10px', mt: 3, mb: 3}}>
            Add Item
        </Button>
    );
}

const InventoryTest = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [viewMode, setViewMode] = useState('export'); // 'export' or 'borrow'
  const [items, setItems] = useState([
    { id: 1, name: 'Laptop', type: 'export', quantity: 10, des: 'Dell' },
    { id: 2, name: 'Projector', type: 'borrow', quantity: 5, des: 'Epson' },
    { id: 3, name: 'Tablet', type: 'export', quantity: 8, des: 'Samsung' },
    { id: 4, name: 'Camera', type: 'borrow', quantity: 3, des: 'Canon' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Filter items based on the selected type and search query
  const filteredItems = items.filter((item) => 
    item.type === viewMode && item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <Box>
      {/* Search Bar */}
      <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Item" />
      
      {/* Buttons to Switch Views */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant={viewMode === 'export' ? 'contained' : 'outlined'} 
          color="primary" 
          onClick={() => setViewMode('export')}
        >
          Export Items
        </Button>
        <Button 
          variant={viewMode === 'borrow' ? 'contained' : 'outlined'} 
          color="secondary" 
          onClick={() => setViewMode('borrow')}
        >
          Borrow Items
        </Button>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.des}</TableCell>
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
    </Box>
  );
};



export default InventoryTest;
