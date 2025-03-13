'use client';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { formatAddress } from '@/utils';
import { toast } from 'react-toastify';

export const Header = () => {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

    const handleConnect = () => {
        try {
            open();
        } catch (error) {
            toast.error('Failed to open wallet connection');
        }
    }
    
    return (
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              ERC20 Token Dashboard
            </Typography>
            <Button 
              variant='outlined' 
              onClick={handleConnect}
            >
              {!isConnected ? "Connect Wallet" : formatAddress(address!)}
            </Button>
          </Toolbar>
        </AppBar>
    );
};