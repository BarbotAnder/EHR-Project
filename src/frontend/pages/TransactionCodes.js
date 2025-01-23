import React from 'react';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import '../../css/App.css';

const TransactionCodes = () => {
    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="transaction-codes">
                    <Typography variant="h4" gutterBottom>
                        Transaction Codes Dashboard
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Manage and view all transaction codes here.
                    </Typography>

                    {/* Summary Section */}
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Total Transaction Codes</Typography>
                                <Typography variant="h4" color="primary.main">320</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Active Codes</Typography>
                                <Typography variant="h4" color="success.main">295</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Transaction Codes Table Section */}
                    <TableContainer component={Paper} elevation={3}>
                        <Typography variant="h6" style={{ padding: '10px' }}>Transaction Codes List</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Code ID</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Last Updated</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Placeholder Rows */}
                                <TableRow>
                                    <TableCell>TC-001</TableCell>
                                    <TableCell>General Transaction</TableCell>
                                    <TableCell style={{ color: '#27ae60' }}>Active</TableCell>
                                    <TableCell>2023-11-05</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="secondary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>TC-002</TableCell>
                                    <TableCell>Refund Transaction</TableCell>
                                    <TableCell style={{ color: '#e74c3c' }}>Inactive</TableCell>
                                    <TableCell>2023-11-03</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="secondary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>TC-003</TableCell>
                                    <TableCell>Payment Processing</TableCell>
                                    <TableCell style={{ color: '#27ae60' }}>Active</TableCell>
                                    <TableCell>2023-10-25</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="secondary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default TransactionCodes;
