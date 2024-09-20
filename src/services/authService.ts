// src/services/authService.ts

export const login = async (username: string, password: string): Promise<void> => {
  const API_URL = process.env.REACT_APP_API_URL;
  console.log("API_URL",API_URL)
  try {
    const response = await fetch(API_URL+'/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Save token to localStorage
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; 
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
  
};
