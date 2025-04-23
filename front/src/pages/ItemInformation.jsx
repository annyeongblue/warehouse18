import React, { useEffect, useState } from 'react';
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

const API_URL = 'http://localhost:1337/api/item-informations';
const ITEMS_API_URL = 'http://localhost:1337/api/items';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

// AddItem Component
function AddItem({ items, item, setItem, itemSerial, setItemSerial, description, setDescription, itemInfo, setItemInfo }) {
  const handleAddItem = async () => {
    if (!itemSerial || !description) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        {
          data: {
            serial: itemSerial,
            description,
            items: [item], // Send items as an array of IDs
          },
        },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      const newItemInfo = {
        id: response.data.data.id,
        serial: response.data.data.serial || itemSerial,
        item: response.data.data.items?.[0]?.name || 'N/A',
        description: response.data.data.description || description,
      };
      setItemInfo([newItemInfo, ...itemInfo]);
      setItemSerial('');
      setDescription('');
      setItem('');
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
  const [description, setDescription] = useState('');
  const [itemInfo, setItemInfo] = useState([]); // Fixed typo
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItemInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}?populate=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      console.log('Item info raw response:', data);

      const infosArray = Array.isArray(data)
        ? data.map((info) => ({
            id: info.id,
            serial: info.serial || 'N/A',
            item: info.items?.[0].name || 'N/ASS', // Adjust based on Strapi response
            description: info.description || 'N/A',
          }))
        : [];
      setItemInfo(infosArray);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message;
      setError(errorMessage);
      alert(`Failed to fetch item information: ${errorMessage}`);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(ITEMS_API_URL, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = response.data.data;
      console.log('Items raw response:', data);

      const itemsArray = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            name: item.name || 'N/A',
          }))
        : [];
      setItems(itemsArray);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message;
      setError(errorMessage);
      alert(`Failed to fetch items: ${errorMessage}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchItemInfo(), fetchItems()]);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
              sx={{ mb: 0.7 }}
            />

            {/* Uncomment to re-enable item selection */}
            <FormControl fullWidth margin="dense">
              <InputLabel>Item</InputLabel>
              <ModernSelect
                label="Item"
                variant="outlined"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                sx={{ mb: 0.3 }}
              >
                {items.map((i) => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.name}
                  </MenuItem>
                ))}
              </ModernSelect>
            </FormControl>

            <ModernTextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <AddItem
              items={items}
              item={item}
              setItem={setItem}
              itemSerial={itemSerial}
              setItemSerial={setItemSerial}
              description={description}
              setDescription={setDescription}
              itemInfo={itemInfo}
              setItemInfo={setItemInfo}
            />
          </ModernPaper>

          <Box sx={{ mt: 4 }}>
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
                  <TableCell>ID</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </ModernTableHead>
              <TableBody>
                {loading ? (
                  <ModernTableRow>
                    <TableCell colSpan={4} align="center">
                      Loading...
                    </TableCell>
                  </ModernTableRow>
                ) : error ? (
                  <ModernTableRow>
                    <TableCell colSpan={4} align="center">
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
                    <TableCell colSpan={4} align="center">
                      No serials found - add some above!
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