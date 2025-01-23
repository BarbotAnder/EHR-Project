import React from 'react';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import '../../css/App.css';

const PersonsInstitutions = () => {
    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="persons-institutions">
                    <Typography variant="h4" gutterBottom>
                        Persons & Institutions Dashboard
                    </Typography>

                    {/* Summary Section */}
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Total Persons</Typography>
                                <Typography variant="h4" color="primary.main">450</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Total Institutions</Typography>
                                <Typography variant="h4" color="success.main">75</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Persons & Institutions Table Section */}
                    <TableContainer component={Paper} elevation={3}>
                        <Typography variant="h6" style={{ padding: '10px' }}>Recent Entries</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Entry ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Last Updated</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Placeholder Rows */}
                                <TableRow>
                                    <TableCell>ENT-001</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>Person</TableCell>
                                    <TableCell>2023-11-05</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="secondary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>ENT-002</TableCell>
                                    <TableCell>Health Clinic</TableCell>
                                    <TableCell>Institution</TableCell>
                                    <TableCell>2023-11-03</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="secondary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>ENT-003</TableCell>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell>Person</TableCell>
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

export default PersonsInstitutions;
