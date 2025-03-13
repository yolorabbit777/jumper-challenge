import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { createAccount as createAccountService } from '@/services/createAccount';
import { Eip1193Provider } from 'ethers';
import { useJWT } from '@/context/JWTContext';
import axios from 'axios';

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  network: string;
}

export const useActions = () => {
  const { walletProvider } : { walletProvider: Eip1193Provider} = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();
  const { setIsUpdateSession, isUpdateSession, clearSession } = useJWT();

  const getSigner = useCallback(async () => {
    if (!isConnected) return null;
    
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      return signer;
    } catch (error) {
      console.error('Failed to get signer:', error);
      return null;
    }
  }, [isConnected]);

  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    try {
      const signer = await getSigner();
      if (!signer) return null;
      
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      return null;
    }
  }, [getSigner]);

  const createAccount = useCallback(async () => {
    if (!address) return false;

    try {
      const signature = await signMessage(process.env.NEXT_PUBLIC_SIGN_MESSAGE!);
      if (!signature) {
        throw new Error('Failed to get signature');
      }

      await createAccountService(address, signature);
      setIsUpdateSession(!isUpdateSession);
      return true;
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }, [address, signMessage]);

  const fetchTokens = useCallback(async (): Promise<Token[]> => {
    try {
      const response = await axios.get('/api/tokens', {
        params: { address },
        withCredentials: true
      });

      if (response.data.success && response.data.responseObject) {
        return response.data.responseObject;
      }
      return [];
    } catch (error) {
      setIsUpdateSession(!isUpdateSession);
      console.error('Failed to fetch tokens:', error);
      throw error;
    }
  }, [address]);

  return {
    address,
    isConnected,
    getSigner,
    signMessage,
    createAccount,
    fetchTokens
  };
};