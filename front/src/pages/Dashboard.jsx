import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AuthProvider from '../components/ProtectedRoute';

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
    <Box sx={{ minHeight: '100vh' }}>
      {/* Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #7b8ef7 0%, #5a67d8 100%)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(123, 142, 247, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(123, 142, 247, 0.4)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                Total Items
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                120
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ff9b9b 0%, #f56565 100%)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(255, 155, 155, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(255, 155, 155, 0.4)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                Total Export Items
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                45
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #60d2f0 0%, #38b2ac 100%)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(96, 210, 240, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(96, 210, 240, 0.4)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                Total Borrow Items
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                75
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box
        mt={5}
        p={3}
        bgcolor="white"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
        borderRadius="16px"
        sx={{ overflow: 'hidden' }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          color="#1e1e2f"
          mb={2}
          sx={{ paddingLeft: 2 }}
        >
          Performance Overview
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e2f',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
              }}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#7b8ef7"
              strokeWidth={3}
              dot={{ r: 4, fill: '#7b8ef7' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="impressions"
              stroke="#ff9b9b"
              strokeWidth={3}
              dot={{ r: 4, fill: '#ff9b9b' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;