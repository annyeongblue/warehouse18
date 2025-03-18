import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleAuthCallback = () => {
  const [auth, setAuth] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Callback URL:", window.location.href); // Log the full URL
    const query = location.search;
    const params = new URLSearchParams(query);
    console.log("Query params:", Object.fromEntries(params)); // Log all params

    if (params.get("error")) {
      setError(params.get("error"));
      return;
    }

    axios
      .get(`http://localhost:1337/api/auth/google/callback${query}`, { withCredentials: true })
      .then((res) => {
        setAuth(res.data);
        localStorage.setItem("jwt", res.data.jwt);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      })
      .catch((err) => {
        console.error("Axios error:", err.response?.data || err.message);
        setError("Authentication failed");
      });
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {error ? (
        <h2>Error: {error}</h2>
      ) : (
        <h2>{auth ? "Authentication Successful" : "Processing..."}</h2>
      )}
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