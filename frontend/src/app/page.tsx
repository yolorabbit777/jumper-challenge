import { Box, Typography } from "@mui/material";
import { TokensList } from '@/components/Tokens/TokensList';
import Image from "next/image";

export default function Home() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography sx={{ mt: '50px' }} variant="h1">Tokens List</Typography>

      <Box sx={{ maxWidth: 800, margin: '100px auto' }}>
        <TokensList />
      </Box>
    </Box>
  );
}
