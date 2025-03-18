import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async (response) => {
    const token = response.credential;  // This should be the token from Google OAuth
    console.log('Google Token:', token);  // Debugging line to ensure the token is correct
  
    // Send the token to Strapi for verification
    fetch('http://localhost:1337/api/connect/google/callback', {
      method: 'GET', // Use GET for the callback route
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Authenticated user data
      })
      .catch((error) => console.error('Error:', error));
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId="112296741986-89e0pq0c0cat277c7bg1g6csnbgl0sq5.apps.googleusercontent.com">
      <div>
        <h1>Google Login with Strapi</h1>

        {!user ? (
          <GoogleLogin onSuccess={handleLogin} onError={() => console.log('Login Failed')} />
        ) : (
          <>
            <p>Welcome, {user.username}!</p> {/* Assuming user data includes a 'username' */}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
