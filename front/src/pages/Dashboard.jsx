import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { Search, Notifications, Settings } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/common/Button';

// Sample data for the graph
const data = [
  { name: '01 Jan', clicks: 200, impressions: 400 },
  { name: '07 Jan', clicks: 300, impressions: 600 },
  { name: '14 Jan', clicks: 180, impressions: 540 },
  { name: '21 Jan', clicks: 260, impressions: 350 },
  { name: '28 Jan', clicks: 320, impressions: 450 },
];

const Dashboard = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* <Typography variant="h5" fontWeight="bold">
          Dashboard Analytics
        </Typography> */}
      </Box>

      {/* Cards */}
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#7b8ef7', color: 'white', borderRadius: 7 }}>
            <CardContent>
              <Typography variant="h6">Total Clicks</Typography>
              <Typography variant="h3">250</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#ff9b9b', color: 'white', borderRadius: 7 }}>
            <CardContent>
              <Typography variant="h6">Total Impressions</Typography>
              <Typography variant="h3">32k</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#60d2f0', color: 'white', borderRadius: 7 }}>
            <CardContent>
              <Typography variant="h6">Total Enquiries</Typography>
              <Typography variant="h3">512</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box mt={4} p={2} pt={5} bgcolor="white" boxShadow={1} borderRadius={7}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="impressions" stroke="#ff6f61" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
