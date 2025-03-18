import React, { use, useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernButton, ModernPaper, ModernTableContainer, ModernTableHead, ModernTableRow, ModernTextField, ModernSelect } from '../styles/styles';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/item-informations?populate=item';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

// AddItem Component
function AddItem({ items, item, setItem, itemSerial, setItemSerial, description, setDescription, itemInfo, setItemInfo }) {
  const handleAddItem = async () => {
    if (!itemSerial) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // const selectedItem = items.find((i) => i.name === item);
      const response = await axios.post(
        API_URL,
        { data: { serial: itemSerial, description: description }}, // , item: selectedItem?.id
        { headers: { Authorization: `Bearer ${API_TOKEN}`}}
      );

      const newItemInfo = {
        id: response.data.data.id,
        serial: response.data.data.serial || itemSerial,
        // item: itemInfo.item?.data?.name || 'N/A',
        description: response.data.data.description,
      }
      setItemInfo([newItemInfo, ...itemInfo]);
      setItemSerial('');
      // setItem('');
      setDescription('');
    } catch (err) {
      alert(`Error adding item serial: ${err.response?.data?.error?.message || err.message}`);
    }
  };

  return (
    <ModernButton variant="outlined" onClick={handleAddItem}>
      Add Item Information
    </ModernButton>
  );
}

const InventoryTest = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [itemSerial, setItemSerial] = useState('');
  const [description, setDescription] = useState(''); // Added state for item name
  const [itemInfo, setitemInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  const fetchItemInfo = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN} `},
      });
      const data = response.data.data;
      const formattedData = data.map((itemInfo) => ({
        id: itemInfo.id,
        serial: itemInfo.serial || 'N/A',
        item: itemInfo.item?.name || 'N/A',
        description: itemInfo.description || 'N/A',
      }));
      setitemInfo(formattedData);
      console.log('Formatted intemInfo:', formattedData);

      const itemsResponse = await fetch ('http://localhost:1337/api/items');
      if (!itemsResponse.ok) {
        const errorText = await itemsResponse.text();
        throw new Error(`Failed to fetch items: ${itemsResponse.status} - ${errorText}`);
      }
      const itemsData = await itemsResponse.json();
      console.log('Raw items response:', itemsData);

      const itemsArray = itemsData.data.map((item, index) => ({
        id: item?.id || `item-${index}`,
        name: item?.name || 'Unknown',
      }));
      setItems(itemsArray);

    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    }
  };

  useEffect(() => {
    fetchItemInfo();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredItemInfo = itemInfo.filter((item) =>
    item.serial.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModernBox>
      <Fade in={true} timeout={800}>       
        <Box>
          {/* Form */}
          <ModernPaper>
            <ModernTextField
            autoFocus
              margin="dense"
              label="Serial Number"
              fullWidth
              variant="outlined"
              value={itemSerial}
              onChange={(e) => setItemSerial(e.target.value)}
              sx={{mb: 0.7}}
            />

            {/* <FormControl fullWidth margin="dense">
              <InputLabel>Item</InputLabel>
              <ModernSelect
                label="Item"
                variant="outlined"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                sx={{mb: 0.3}}
              >
                {items.map((i) => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.name}
                  </MenuItem>
                ))}
                Add MenuItems here
              </ModernSelect>
            </FormControl> */}

            <ModernTextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <AddItem
                itemSerial={itemSerial}
                setItemSerial={setItemSerial}
                description={description}
                setDescription={setDescription}
                itemInfo={itemInfo}
                setItemInfo={setitemInfo}
              />
          </ModernPaper>

          <Box sx={{mt: 4}}>
            <SearchBar
              search={searchQuery}
              setSearch={setSearchQuery}
              label="Search for Item Serial"
              sx={{
                maxWidth: '400px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              }}
            />
          </Box>

          <ModernTableContainer>
            <Table sx={{ minWidth: 500 }} aria-label="inventory table">
              <ModernTableHead>
                <TableRow>
                  {/* <TableCell>Item</TableCell> */}
                  <TableCell>ID</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {error ? (
                  <ModernTableRow>
                    <TableCell colSpan={3} align='center'>
                      Error: {error}
                    </TableCell>
                  </ModernTableRow>
                ) : filteredItemInfo.length > 0 ? (
                  filteredItemInfo
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((itemInfo) => (
                      <ModernTableRow key={itemInfo.id}>
                        <TableCell>{itemInfo.id}</TableCell>
                        <TableCell>{itemInfo.serial}</TableCell>
                        <TableCell>{itemInfo.item}</TableCell>
                        <TableCell>{itemInfo.description}</TableCell>
                      </ModernTableRow>
                    ))
                  ) : (
                    <ModernTableRow>
                      <TableCell colSpan={3} align='center'>
                        No serials found-add some above!
                      </TableCell>
                    </ModernTableRow>
                  )}
              </TableBody>
            </Table>
          </ModernTableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredItemInfo.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              mt: 2,
              '& .MuiTablePagination-toolbar': {
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              },
            }}
          />
        </Box>
      </Fade>
    </ModernBox>
  );
};

export default InventoryTest;