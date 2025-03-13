'use client';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { formatAddress } from '@/utils';
import { toast } from 'react-toastify';

export const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { open } = useAppKit();
    const { isConnected, address } = useAppKitAccount();

    const handleConnect = async () => {
        try {
            await open();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to connect wallet';
            toast.error(message);
        }
    }
    
    return (
        <AppBar position="static" color="default">
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        noWrap
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        ERC20 Dashboard
                    </Typography>

                    {isConnected ? (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: theme.palette.action.hover,
                                borderRadius: '20px',
                                padding: isMobile ? '4px 8px' : '6px 16px',
                            }}
                        >
                            <Typography 
                                variant={isMobile ? "body2" : "body1"}
                                sx={{ fontWeight: 500 }}
                            >
                                {formatAddress(address || '')}
                            </Typography>
                        </Box>
                    ) : (
                        <Button
                            onClick={handleConnect}
                            variant="contained"
                        >
                            Connect Wallet
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};