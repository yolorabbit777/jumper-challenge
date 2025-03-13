'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAppKitAccount } from "@reown/appkit/react";

interface JWTContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authenticatedAddress: string | null;
  clearSession: () => void;
}

const JWTContext = createContext<JWTContextType>({
  isAuthenticated: false,
  isLoading: true,
  authenticatedAddress: null,
  clearSession: () => {},
});

export const JWTContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticatedAddress, setAuthenticatedAddress] = useState<string | null>(null);
  const { address, isConnected } = useAppKitAccount();

  const verifySession = async () => {
    try {
      // If not connected or no address, clear authentication
      if (!isConnected || !address) {
        setIsAuthenticated(false);
        setAuthenticatedAddress(null);
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/api/session/verify', 
        { address },
        { withCredentials: true }
      );

      if (response.data.status === 'Success' && response.data.data.isValid && response.data.data.address) {
        setIsAuthenticated(true);
        setAuthenticatedAddress(response.data.data.address);
      } else {
        setIsAuthenticated(false);
        setAuthenticatedAddress(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to verify session:', error.response?.data?.message || error.message);
      } else {
        console.error('Failed to verify session:', error);
      }
      setIsAuthenticated(false);
      setAuthenticatedAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    setIsAuthenticated(false);
    setAuthenticatedAddress(null);
  };

  useEffect(() => {
    verifySession();
  }, [address, isConnected]); // Re-verify when address or connection status changes

  return (
    <JWTContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        authenticatedAddress,
        clearSession,
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

export const useJWT = () => useContext(JWTContext); 