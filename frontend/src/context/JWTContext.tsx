'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from 'react-toastify';

interface JWTContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authenticatedAddress: string | null;
  isUpdateSession: boolean;
  setIsUpdateSession: (isUpdateSession: boolean) => void;
  clearSession: () => void;
}

const JWTContext = createContext<JWTContextType>({
  isAuthenticated: false,
  isLoading: true,
  authenticatedAddress: null,
  isUpdateSession: false,
  setIsUpdateSession: () => {},
  clearSession: () => {},
});

export const JWTContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateSession, setIsUpdateSession] = useState(false);
  const [authenticatedAddress, setAuthenticatedAddress] = useState<string | null>(null);
  const { address, isConnected } = useAppKitAccount();

  const verifySession = useCallback(async () => {
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
 
      if (response.data.success === true && response.data.responseObject.isValid && response.data.responseObject.address) {
        setIsAuthenticated(true);
        setAuthenticatedAddress(response.data.responseObject.address);
      } else {
        setIsAuthenticated(false);
        setAuthenticatedAddress(null);
        toast.info('Please create an account to view tokens');
      }
    } catch (error) {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message
        : 'Failed to verify session';
      toast.error(message);
      setIsAuthenticated(false);
      setAuthenticatedAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  const clearSession = () => {
    setIsAuthenticated(false);
    setAuthenticatedAddress(null);
  };

  // Verify session on mount and when address/connection changes
  useEffect(() => {
    verifySession();
  }, [isUpdateSession, verifySession]);

  return (
    <JWTContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        authenticatedAddress,
        clearSession,
        isUpdateSession,
        setIsUpdateSession,
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

export const useJWT = () => useContext(JWTContext); 