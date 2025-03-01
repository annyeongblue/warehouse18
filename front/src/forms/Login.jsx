import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Typography, Box, Avatar } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const STRAPI_URL = "http://localhost:1337"; // Change this in production

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login...");
        // Redirect to login page or show a login prompt
        return;
      }
  
      try {
        const response = await axios.get(`${STRAPI_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (error.response?.status === 401) {
          console.log("Token is invalid or expired, redirecting to login...");
          localStorage.removeItem("token"); // Remove invalid token
          // Redirect to login page or show a login prompt
        }
      }
    };
  
    fetchUser();
  }, []);

  // Google Login
  const handleLogin = () => {
    window.open(`${STRAPI_URL}/api/connect/google`, "_self");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Google Auth with Strapi
        </Typography>

        {user ? (
          <Box>
            <Avatar src={user.picture} sx={{ width: 80, height: 80, mx: "auto" }} />
            <Typography variant="h6">{user.username}</Typography>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            color="primary"
            onClick={handleLogin}
          >
            Login with Google
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default App;
