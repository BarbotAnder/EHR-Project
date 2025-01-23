import React from 'react';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import '../../css/App.css';

const Documents = () => {
    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="documents">
                    <Typography variant="h4" gutterBottom>
                        Documents Dashboard
                    </Typography>

                    {/* Summary Section */}
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Total Documents</Typography>
                                <Typography variant="h4" color="primary.main">320</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6">Recent Uploads</Typography>
                                <Typography variant="h4" color="success.main">25</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Document Table Section */}
                    <TableContainer component={Paper} elevation={3}>
                        <Typography variant="h6" style={{ padding: '10px' }}>Recent Documents</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Document ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Upload Date</TableCell>
                                    <TableCell>Uploaded By</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Placeholder Rows */}
                                <TableRow>
                                    <TableCell>DOC-001</TableCell>
                                    <TableCell>Patient Intake Form</TableCell>
                                    <TableCell>2023-11-05</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="success">Download</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>DOC-002</TableCell>
                                    <TableCell>Treatment Consent</TableCell>
                                    <TableCell>2023-11-03</TableCell>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '5px' }}>View</Button>
                                        <Button variant="contained" color="success">Download</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>DOC-003</TableCell>
                                    <TableCell>Medical History</TableCell>
                                    <TableCell>2023-10-29</TableCell>
                                    <TableCell>Mark Wilson</TableCell>
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

export default Documents;
