'use client';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { TokensList } from '@/components/Tokens/TokensList';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          mt: 5,
          mb: { xs: 2, sm: 4 },
          color: 'text.primary',
        }}
      >
        Your Token Balances
      </Typography>
      <TokensList />
    </Box>
  );
}
