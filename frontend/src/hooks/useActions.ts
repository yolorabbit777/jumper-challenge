import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { createAccount as createAccountService } from '@/services/createAccount';
import { Eip1193Provider } from 'ethers';

export const useActions = () => {
  const { walletProvider } : { walletProvider: Eip1193Provider} = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();

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
      // Refresh the page to update JWT context
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }, [address, signMessage]);

  return {
    address,
    isConnected,
    getSigner,
    signMessage,
    createAccount
  };
};