import React from 'react';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import '../../css/App.css';

const Billing = () => {
    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="billing">
                    <Typography variant="h4" gutterBottom>
                        Billing Dashboard
                    </Typography>

                    {/* Summary Section */}
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Total Outstanding</Typography>
                                <Typography variant="h4" color="warning.main">$4,200.00</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Total Paid</Typography>
                                <Typography variant="h4" color="success.main">$18,600.00</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Invoice Table Section */}
                    <TableContainer component={Paper} elevation={3}>
                        <Typography variant="h6" style={{ padding: '10px' }}>Invoices</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Invoice #</TableCell>
                                    <TableCell>Patient Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Placeholder Rows */}
                                <TableRow>
                                    <TableCell>INV-001</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>2023-11-01</TableCell>
                                    <TableCell>$1,200.00</TableCell>
                                    <TableCell style={{ color: '#e74c3c' }}>Outstanding</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="success">Pay</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>INV-002</TableCell>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell>2023-10-25</TableCell>
                                    <TableCell>$2,000.00</TableCell>
                                    <TableCell style={{ color: '#27ae60' }}>Paid</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary">View</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>INV-003</TableCell>
                                    <TableCell>Mark Wilson</TableCell>
                                    <TableCell>2023-10-15</TableCell>
                                    <TableCell>$1,000.00</TableCell>
                                    <TableCell style={{ color: '#e74c3c' }}>Outstanding</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="success">Pay</Button>
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

export default Billing;
