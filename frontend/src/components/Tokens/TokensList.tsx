'use client';
import { useEffect, useState } from "react";
import { Box, TableContainer, Typography, Paper, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';

export const TokensList = () => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6">Address</Typography>
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
                        <TableRow>
                            <TableCell align="center">ADA</TableCell>
                            <TableCell align="center">ADA</TableCell>
                            <TableCell align="center">1000</TableCell>
                            <TableCell align="center">Ethereum</TableCell>
                            <TableCell align="center">Address</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">ADA</TableCell>
                            <TableCell align="center">ADA</TableCell>
                            <TableCell align="center">1000</TableCell>
                            <TableCell align="center">BSC</TableCell>
                            <TableCell align="center">Address</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}