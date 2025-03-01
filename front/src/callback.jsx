import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STRAPI_URL = "http://localhost:1337"; // Update if needed

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");

      if (accessToken) {
        try {
          // Fetch user info from Strapi’s default users API
          const response = await axios.get(`${STRAPI_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("token", accessToken);

          navigate("/");
        } catch (error) {
          console.error("Auth error:", error);
        }
      }
    };

    fetchUser();
  }, [navigate]);

  return <h2>Authenticating...</h2>;
};

export default Callback;
