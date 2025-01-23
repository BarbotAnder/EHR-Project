import React from 'react';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import '../../css/App.css';

const Reports = () => {
    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="reports">
                    <Typography variant="h4" gutterBottom>
                        Reports Dashboard
                    </Typography>

                    {/* Summary Section */}
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Total Reports</Typography>
                                <Typography variant="h4" color="primary.main">150</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Reports Reviewed</Typography>
                                <Typography variant="h4" color="success.main">120</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Reports Table Section */}
                    <TableContainer component={Paper} elevation={3}>
                        <Typography variant="h6" style={{ padding: '10px' }}>Recent Reports</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Report ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Date Generated</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Placeholder Rows */}
                                <TableRow>
                                    <TableCell>REP-001</TableCell>
                                    <TableCell>Annual Summary</TableCell>
                                    <TableCell>2023-11-05</TableCell>
                                    <TableCell style={{ color: '#27ae60' }}>Reviewed</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="success">Download</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>REP-002</TableCell>
                                    <TableCell>Monthly Overview</TableCell>
                                    <TableCell>2023-11-01</TableCell>
                                    <TableCell style={{ color: '#e74c3c' }}>Pending</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="success">Download</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>REP-003</TableCell>
                                    <TableCell>Client Feedback</TableCell>
                                    <TableCell>2023-10-20</TableCell>
                                    <TableCell style={{ color: '#27ae60' }}>Reviewed</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="success">Download</Button>
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

export default Reports;
