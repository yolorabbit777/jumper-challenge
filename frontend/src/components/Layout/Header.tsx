'use client';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { formatAddress } from '@/utils';

export const Header = () => {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

    const handleConnect = () => {
        open();
    }
    
    return (
        <AppBar position='static'>
        <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            ERC20 Token Dashboard
            </Typography>
            <Button variant='outlined' sx={{ color: 'white', borderColor: '#0062cc', ":hover": { borderColor: '#0063cc', borderWidth: '2px' }}} onClick={handleConnect}>{ !isConnected? "Connect Wallet" : formatAddress(address!) }</Button>
        </Toolbar>
        </AppBar>
    );
};