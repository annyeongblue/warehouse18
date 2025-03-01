import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, Snackbar, Alert } from '@mui/material';

const ImportForm = () => {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName && itemCategory && quantity && price) {
      setIsSubmitted(true);
      setOpenSnackbar(true);
      // Reset form fields
      setItemName('');
      setItemCategory('');
      setQuantity('');
      setPrice('');
    } else {
      alert("All fields are required!");
    }
  };

  return (
    <Box sx={{ padding: 0 }}>
      {/* <Paper sx={{ padding: 3 }}> */}
        <Typography variant="h4" gutterBottom>
          Import Item
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Category"
                variant="outlined"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                variant="outlined"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Import Item
              </Button>
            </Grid>
          </Grid>
        </form>
      {/* </Paper> */}

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Item Imported Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportForm;
