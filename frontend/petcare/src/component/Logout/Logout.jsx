import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('http://localhost:3001/logout');
        // Redirect to the login page after successful logout
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Handle logout failure (optional)
        // For example, display an error message to the user
      }
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
