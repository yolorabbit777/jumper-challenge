'use client';
import { useEffect, useState } from "react";
import { Box, TableContainer, Typography, Paper, Table, TableHead, TableCell, TableBody, TableRow, Button } from '@mui/material';
import { useActions } from "@/hooks/useActions";
import { useJWT } from '@/context/JWTContext';

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  network: string;
}

export const TokensList = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, authenticatedAddress, isLoading: isAuthLoading } = useJWT();
  const { isConnected, createAccount } = useActions();

  const fetchTokens = async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tokens/${address}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      
      const data = await response.json();
      setTokens(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await createAccount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authenticatedAddress) {
      fetchTokens(authenticatedAddress);
    }
  }, [isAuthenticated, authenticatedAddress]);

  if (isAuthLoading || isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {!isAuthenticated && isConnected && (
        <Button onClick={handleCreateAccount}>Create Account</Button>
      )}
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {isAuthenticated && (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 2, overflowX: 'auto' }}>
          <Table sx={{ width: '800px' }}>
            <TableHead sx={{ backgroundColor: '#1976D2' }}>
              <TableRow>
                <TableCell align='center'>
                  <Typography variant="subtitle1" color="white" fontWeight='bold'>
                    Name
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography variant="subtitle1" color="white" fontWeight='bold'>
                    Symbol
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography variant="subtitle1" color="white" fontWeight='bold'>
                    Balance
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography variant="subtitle1" color="white" fontWeight='bold'>
                    Network
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography variant="subtitle1" color="white" fontWeight='bold'>
                    Address
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.address}>
                  <TableCell align="center">{token.name}</TableCell>
                  <TableCell align="center">{token.symbol}</TableCell>
                  <TableCell align="center">{token.balance}</TableCell>
                  <TableCell align="center">{token.network}</TableCell>
                  <TableCell align="center">{token.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TokensList;