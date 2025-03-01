import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:1337/api/user-1s"; // Your Strapi API

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ firstname: "", lastname: "", email: "" });
  const [editingUser, setEditingUser] = useState(null); // Track user being edited

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(API_URL)
      .then(response => {
        setUsers(response.data.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  // Add new user
  const addUser = () => {
    axios.post(API_URL, { data: newUser })
      .then(() => {
        fetchUsers();
        setNewUser({ firstname: "", lastname: "", email: "" });
      })
      .catch(error => console.error("Error adding user:", error));
  };

  // Update user
  const updateUser = () => {
    if (!editingUser) return;
  
    axios.put(`${API_URL}/${editingUser.id}`, {
      data: {
        firstname: editingUser.firstname,
        lastname: editingUser.lastname,
        email: editingUser.email,
      }
    })
    .then(() => {
      fetchUsers();
      setEditingUser(null);
    })
    .catch(error => console.error("Error updating user:", error.response?.data || error));
  };
  

  // Delete user
  const deleteUser = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchUsers())
      .catch(error => console.error("Error deleting user:", error));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>User List</h2>

      {/* Add User */}
      <h3>Add User</h3>
      <input 
        type="text" 
        placeholder="First Name" 
        value={newUser.firstname} 
        onChange={e => setNewUser({ ...newUser, firstname: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Last Name" 
        value={newUser.lastname} 
        onChange={e => setNewUser({ ...newUser, lastname: e.target.value })} 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={newUser.email} 
        onChange={e => setNewUser({ ...newUser, email: e.target.value })} 
      />
      <button onClick={addUser}>Add</button>

      {/* Edit User */}
      {editingUser && (
        <>
          <h3>Edit User</h3>
          <input 
            type="text" 
            value={editingUser.firstname} 
            onChange={e => setEditingUser({ ...editingUser, firstname: e.target.value })} 
          />
          <input 
            type="text" 
            value={editingUser.lastname} 
            onChange={e => setEditingUser({ ...editingUser, lastname: e.target.value })} 
          />
          <input 
            type="email" 
            value={editingUser.email} 
            onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} 
          />
          <button onClick={updateUser}>Update</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </>
      )}

      {/* User List */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>Name:</strong> {user.firstname} {user.lastname} <br />
            <strong>Email:</strong> {user.email}
            <br />
            <button onClick={() => setEditingUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
