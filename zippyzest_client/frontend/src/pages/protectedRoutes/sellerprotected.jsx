import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
const apiurl = import.meta.env.VITE_API_URL
// Hook to check if seller is authenticated
const useAuth = async () => {
  try {
    const response = await axios.get(`${apiurl}/seller/check-auth`, {
      withCredentials: true, // Ensure cookies are sent
    });
    return response.data.success; // Check if seller is authenticated
  } catch (error) {
    console.log(error);
    
    return false;
  }
};

const SellerProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await useAuth();
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>; // Loading state

  // If seller is authenticated, show the protected content
  return isAuthenticated ? <Outlet /> : <Navigate to="/sellersigin" />;
};

export default SellerProtectedRoute;
