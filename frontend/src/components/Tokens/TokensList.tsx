'use client';
import { useEffect, useState, useCallback } from "react";
import { 
  Box, 
  TableContainer, 
  Typography, 
  Paper, 
  Table, 
  TableHead, 
  TableCell, 
  TableBody, 
  TableRow, 
  Button,
  CircularProgress,
  useTheme,
  Chip
} from '@mui/material';
import { useActions } from "@/hooks/useActions";
import { useJWT } from '@/context/JWTContext';
import { formatAddress } from '@/utils';
import { toast } from 'react-toastify';

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  network: string;
}

export const TokensList = () => {
  const theme = useTheme();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, isLoading: isAuthLoading } = useJWT();
  const { isConnected, createAccount, fetchTokens } = useActions();

  const handleFetchTokens = useCallback(async () => {
    if(!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const fetchedTokens = await fetchTokens();
      setTokens(fetchedTokens);
      if (fetchedTokens.length === 0) {
        toast.info('No tokens found for this address');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tokens';
    //   toast.error(message);
      setError(message);
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchTokens]);

  const handleCreateAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await createAccount();
      toast.success('Account created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchTokens();
  }, [handleFetchTokens]);

  if (isAuthLoading || isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
        sx={{ color: 'text.primary' }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: 1200,
      mx: 'auto',
      width: '100%'
    }}>
      {!isAuthenticated && isConnected && (
        <Button 
          onClick={handleCreateAccount}
          variant="contained"
          size="large"
        >
          Create Account
        </Button>
      )}

      {isAuthenticated && (
        <TableContainer component={Paper} sx={{ mt: 2, minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Name</TableCell>
                <TableCell align='center'>Symbol</TableCell>
                <TableCell align='center'>Balance</TableCell>
                <TableCell align='center'>Network</TableCell>
                <TableCell align='center'>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.length > 0 ? (
                tokens.map((token) => (
                  <TableRow key={token.address}>
                    <TableCell align="center">{token.name}</TableCell>
                    <TableCell align="center">{token.symbol}</TableCell>
                    <TableCell align="center">{token.balance}</TableCell>
                    <TableCell align="center">
                      <Chip label={token.network} />
                    </TableCell>
                    <TableCell align="center">
                      {formatAddress(token.address)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={5} 
                    align="center"
                    sx={{ 
                      py: 8,
                      color: 'text.secondary',
                      fontSize: '1rem'
                    }}
                  >
                    No Token Balances
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TokensList;