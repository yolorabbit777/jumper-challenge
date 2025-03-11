'use client';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export const Header = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          ERC20 Token Dashboard
        </Typography>
        <Button variant='outlined' sx={{ color: 'white', borderColor: '#0062cc', ":hover": { borderColor: '#0063cc', borderWidth: '2px' }}}>Connect Wallet</Button>
      </Toolbar>
    </AppBar>
  );
};