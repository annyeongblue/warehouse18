import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleAuthCallback = () => {
  const [auth, setAuth] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = location.search;
    axios
      .get(`http://localhost:1337/api/auth/google/callback${query}`)
      .then((res) => {
        setAuth(res.data);
        localStorage.setItem("jwt", res.data.jwt); // Store JWT in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard"); // Redirect to home
      })
      .catch((err) => console.error("Error:", err));
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{auth ? "Authentication Successful" : "Processing..."}</h2>
      {auth && (
        <>
          <p>JWT: {auth.jwt}</p>
          <p>User: {auth.user.email}</p>
        </>
      )}
    </div>
  );
};

export default GoogleAuthCallback;