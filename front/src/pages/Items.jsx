import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Typography,
  Button as MuiButton,
  Fade,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernTextField, ModernButton, ModernPaper, ModernTableContainer, ModernTableRow, ModernTableHead, ModernSelect } from '../styles/styles';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';

const ItemType = [
  { id: 1, name: 'Export' },
  { id: 2, name: 'Borrow' },
];

function AddItem({
  itemName, setItemName,
  itemType, setItemType,
  itemQuantity, setItemQuantity,
  items, setItems,
  description, setDescription,
  category, setCategory,
  unit, setUnit,
  brand, setBrand,
  serial, setSerial,
  units, brands, categories,
  isEditing, editingItem, setIsEditing, setEditingItem
}) {
  const handleAddOrUpdateItem = async () => {
    if (!itemName || !itemType || !itemQuantity) {
      alert("Please fill out all required fields.");
      return;
    }

    const quantity = parseInt(itemQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    if (itemType === 'Borrow' && !serial) {
      alert("Serial number is required for Borrow items.");
      return;
    }

    if (!Array.isArray(items)) {
      console.error('Items is not an array:', items);
      alert("Inventory data is not properly initialized.");
      return;
    }

    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeUnits = Array.isArray(units) ? units : [];
    const safeBrands = Array.isArray(brands) ? brands : [];

    const newItem = {
      name: itemName,
      type: itemType === 'Export' ? 'ເຄື່ອງໃຊ້ທົ່ວໄປ' : 'ຢືມອຸປະກອນ',
      qty: quantity,
      description: description || null,
      publishedAt: new Date().toISOString(),
      ...(category && safeCategories.length > 0 && { category: { connect: [{ id: safeCategories.find(c => c?.name === category)?.id }] } }),
      ...(unit && safeUnits.length > 0 && { unit: { connect: [{ id: safeUnits.find(u => u?.name === unit)?.id }] } }),
      ...(brand && safeBrands.length > 0 && { brand: { connect: [{ id: safeBrands.find(b => b?.name === brand)?.id }] } }),
      ...(serial && { item_information: { create: [{ serial }] } }),
    };

    try {
      let response;
      let addedItem;

      if (isEditing) {
        response = await fetch(`http://localhost:1337/api/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: newItem }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update item: ${response.status} - ${errorText}`);
        }
        addedItem = await response.json();
        setItems((prevItems) => prevItems.map(item => item.id === editingItem.id ? { ...item, ...newItem } : item));
        alert("Item updated successfully!");
      } else {
        response = await fetch('http://localhost:1337/api/items?populate=*', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: newItem }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add item: ${response.status} - ${errorText}`);
        }
        addedItem = await response.json();
        const formattedItem = {
          id: addedItem.data?.id || 'unknown',
          name: addedItem.data?.name || itemName,
          type: addedItem.data?.type || newItem.type,
          quantity: addedItem.data?.qty || quantity,
          des: addedItem.data?.description || description || '',
          category: addedItem.data?.category?.name || category || '',
          unit: addedItem.data?.unit?.name || unit || '',
          brand: addedItem.data?.brand?.name || brand || '',
          serial: addedItem.data?.item_information?.serial || null,
        };
        setItems((prevItems) => [...prevItems, formattedItem]);
        alert("Item added successfully!");
      }

      setItemName('');
      setItemType('');
      setItemQuantity('');
      setDescription('');
      setCategory('');
      setUnit('');
      setBrand('');
      setSerial('');
      setIsEditing(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error adding/updating item:', error);
      alert(`Failed to add/update item: ${error.message}`);
    }
  };

  return (
    <ModernButton
      variant="contained"
      onClick={handleAddOrUpdateItem}
      sx={{
        background: 'linear-gradient(45deg, #6C63FF 30%, #897CFF 90%)',
        '&:hover': { background: 'linear-gradient(45deg, #5A54E6 30%, #7369E6 90%)' },
      }}
    >
      {isEditing ? 'Update Item' : 'Add Item'}
    </ModernButton>
  );
}

const Items = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [brand, setBrand] = useState('');
  const [serial, setSerial] = useState('');
  const [viewMode, setViewMode] = useState('export');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refetch, setRefetch] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const itemResponse = await fetch('http://localhost:1337/api/items?populate=*');
        
        if (!itemResponse.ok) {
          const errorText = await itemResponse.text();
          throw new Error(`Failed to fetch items: ${itemResponse.status} - ${errorText}`);
        }
        const itemData = await itemResponse.json();
        console.log('Raw item data:', itemData);

        const itemsArray = itemData.data.map((item, index) => ({
          id: item.id || `unknown-${index}`,
          name: item.name || 'Unknown',
          type: item.type || '',
          quantity: item.qty || 0,
          des: item.description || '',
          category: item.category?.name || '',
          unit: item.unit?.name || '',
          brand: item.brand?.name || '',
          serial: item.item_information?.[0]?.serial || null,
          item_information: item.item_information || null,
        }));
        console.log('Fetched items:', itemsArray);
        setItems(itemsArray);

        const unitsResponse = await fetch('http://localhost:1337/api/units');
        if (!unitsResponse.ok) throw new Error('Failed to fetch units');
        const unitsData = await unitsResponse.json();
        setUnits(unitsData.data.map((unit, index) => ({
          id: unit?.id || `unit-${index}`,
          name: unit?.name || 'Unknown',
        })));

        const brandsResponse = await fetch('http://localhost:1337/api/brands');
        if (!brandsResponse.ok) throw new Error('Failed to fetch brands');
        const brandsData = await brandsResponse.json();
        setBrands(brandsData.data.map((brand, index) => ({
          id: brand?.id || `brand-${index}`,
          name: brand?.name || 'Unknown',
        })));

        const categoriesResponse = await fetch('http://localhost:1337/api/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data.map((category, index) => ({
          id: category?.id || `category-${index}`,
          name: category?.name || 'Unknown',
        })));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refetch]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item?.name?.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesViewMode = viewMode === 'export'
      ? item.type === 'ເຄື່ອງໃຊ້ທົ່ວໄປ'
      : item.type === 'ຢືມອຸປະກອນ';
    return matchesSearch && matchesViewMode;
  });

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingItem(item);
    setItemName(item.name);
    setItemType(item.type === 'ເຄື່ອງໃຊ້ທົ່ວໄປ' ? 'Export' : 'Borrow');
    setItemQuantity(item.quantity.toString());
    setDescription(item.des);
    setCategory(item.category);
    setUnit(item.unit);
    setBrand(item.brand);
    setSerial(item.serial);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/items/${itemToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete item: ${response.status} - ${errorText}`);
      }
      setItems(items.filter(item => item.id !== itemToDelete));
      setOpenDeleteDialog(false);
      setItemToDelete(null);
      alert("Item deleted successfully!");
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Failed to delete item: ${error.message}`);
    }
  };

  return (
    <ModernBox>
      <Fade in={true} timeout={800}>
        <Box>
          <ModernPaper elevation={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ModernTextField
                  fullWidth
                  label="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Type</InputLabel>
                  <ModernSelect
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    label="Type"
                  >
                    {ItemType.map((type) => (
                      <MenuItem key={type.id} value={type.name}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <ModernSelect
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                  >
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Brand</InputLabel>
                  <ModernSelect
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    label="Brand"
                  >
                    {brands.map((b) => (
                      <MenuItem key={b.id} value={b.name}>
                        {b.name}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Unit</InputLabel>
                  <ModernSelect
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    label="Unit"
                  >
                    {units.map((u) => (
                      <MenuItem key={u.id} value={u.name}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </ModernSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <ModernTextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              {itemType === 'Borrow' && (
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Serial Number (Required)"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <ModernTextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2}}>
                  <ModernButton
                    variant={viewMode === 'export' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('export')}
                    sx={{
                      background: viewMode === 'export' ? 'linear-gradient(45deg, #6C63FF 30%, #897CFF 90%)' : 'transparent',
                      color: viewMode === 'export' ? '#fff' : '#6C63FF',
                      borderColor: '#6C63FF',
                      '&:hover': { background: 'linear-gradient(45deg, #5A54E6 30%, #7369E6 90%)' },
                    }}
                  >
                    Export
                  </ModernButton>
                  <ModernButton
                    variant={viewMode === 'borrow' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('borrow')}
                    sx={{
                      background: viewMode === 'borrow' ? 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)' : 'transparent',
                      color: viewMode === 'borrow' ? '#fff' : '#FF6B6B',
                      borderColor: '#FF6B6B',
                      '&:hover': { background: 'linear-gradient(45deg, #E65A5A 30%, #E67979 90%)' },
                    }}
                  >
                    Borrow
                  </ModernButton>
                </Box>
              </Grid>
            </Grid>
          </ModernPaper>

          <Box>
            <Grid item xs={12} sx={{ mb: 3, mt: 3 }}>
            <AddItem
                itemName={itemName}
                setItemName={setItemName}
                itemType={itemType}
                setItemType={setItemType}
                itemQuantity={itemQuantity}
                setItemQuantity={setItemQuantity}
                description={description}
                setDescription={setDescription}
                items={items}
                setItems={setItems}
                category={category}
                setCategory={setCategory}
                brand={brand}
                setBrand={setBrand}
                unit={unit}
                setUnit={setUnit}
                serial={serial}
                setSerial={setSerial}
                units={units}
                brands={brands}
                categories={categories}
                isEditing={isEditing}
                editingItem={editingItem}
                setIsEditing={setIsEditing}
                setEditingItem={setEditingItem}
              />
            </Grid>
            <SearchBar
              search={searchQuery}
              setSearch={setSearchQuery}
              label="Search Items"
              sx={{ mb: 4, '& .MuiInputBase-root': { borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' } }}
            />
            <ModernTableContainer component={Paper}>
              <Table>
                <ModernTableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    {viewMode === 'borrow' && <TableCell>Serial</TableCell>}
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </ModernTableHead>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.slice(page * rowsPerPage, page * rowsPerPage +    rowsPerPage).map((item) => (
                      <ModernTableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        {viewMode === 'borrow' && <TableCell>{item.serial || '-'}</TableCell>}
                        <TableCell>{item.des}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleDelete(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </ModernTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={viewMode === 'borrow' ? 9 : 8} align="center">
                        <Typography sx={{ py: 3, color: '#999', fontStyle: 'italic', fontSize: '1.1rem' }}>
                          No {viewMode === 'export' ? 'export' : 'borrow'} items found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ModernTableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mt: 2, '& .MuiTablePagination-toolbar': { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' } }}
            />
          </Box>
        </Box>
      </Fade>
    </ModernBox>
  );
};

export default Items;