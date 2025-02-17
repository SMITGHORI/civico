import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
const apiurl = import.meta.env.VITE_API_URL
// Hook to check if the user is an admin
const useAdminAuth = async () => {
  try {
    const response = await axios.get(`${apiurl}/auth/check-admin`, {
      withCredentials: true, // Send cookies
    });
    // Check if the authenticated user is an admin
    return response.data.user && response.data.user.role === 'admin';
  } catch (error) {
    console.log(error);
    return false; // In case of any error, return false (not authenticated)
  }
};

const AdminProtected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await useAdminAuth();
      setIsAuthenticated(auth); // Set auth state based on the check
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>; // Show loading while checking

  // If the user is an admin, show the admin content, else redirect to a different page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtected;