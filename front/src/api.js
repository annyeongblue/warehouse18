// src/services/apiService.js
export const fetchTests = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/tests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error; // Remove console.error to let the caller handle it
    }
  };

export const createTest = async (name) => {
  try {
    const response = await fetch('http://localhost:1337/api/tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { name } }),
    });
    if (!response.ok) {
      throw new Error('Failed to create test');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating test:', error);
    throw error;
  }
};

export const updateTest = async (id, name) => {
  try {
    const response = await fetch(`http://localhost:1337/api/tests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { name } }),
    });
    if (!response.ok) {
      throw new Error('Failed to update test');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating test:', error);
    throw error;
  }
};

export const deleteTest = async (id) => {
  try {
    const response = await fetch(`http://localhost:1337/api/tests/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete test');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};