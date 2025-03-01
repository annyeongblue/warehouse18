// GoogleLogin.jsx
import React from "react";
// import { auth, googleProvider, signInWithPopup } from "../firebase";

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User:", result.user);
      alert(`Welcome, ${result.user.displayName}`);
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
};

export default GoogleLogin;
