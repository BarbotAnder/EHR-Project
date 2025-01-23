import React, { useState } from 'react';
import { Grid, Paper, Typography, Button, Switch, FormControlLabel } from '@mui/material';
import '../../css/App.css';

const System = () => {
    // State to control the switches
    const [autoUpdates, setAutoUpdates] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [dataSync, setDataSync] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    // Handlers to toggle each switch
    const handleAutoUpdatesChange = () => setAutoUpdates((prev) => !prev);
    const handleNotificationsChange = () => setNotifications((prev) => !prev);
    const handleDataSyncChange = () => setDataSync((prev) => !prev);
    const handleMaintenanceModeChange = () => setMaintenanceMode((prev) => !prev);

    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="system">
                    <Typography variant="h4" gutterBottom>
                        System Dashboard
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        View and manage system settings.
                    </Typography>

                    {/* System Overview Section */}
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Typography variant="h6">System Status</Typography>
                                <Typography variant="body1" color="success.main">
                                    Online
                                </Typography>
                                <Button variant="contained" color="secondary" style={{ marginTop: '15px' }}>
                                    Restart System
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Typography variant="h6">Last Backup</Typography>
                                <Typography variant="body1">2023-11-01 02:00 AM</Typography>
                                <Button variant="contained" color="primary" style={{ marginTop: '15px' }}>
                                    Start Backup
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Settings Section */}
                    <Typography variant="h6" style={{ marginBottom: '10px' }}>
                        System Settings
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Typography variant="subtitle1" gutterBottom>Auto-Updates</Typography>
                                <FormControlLabel
                                    control={<Switch checked={autoUpdates} onChange={handleAutoUpdatesChange} color="primary" />}
                                    label="Enable Auto-Updates"
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Typography variant="subtitle1" gutterBottom>Notifications</Typography>
                                <FormControlLabel
                                    control={<Switch checked={notifications} onChange={handleNotificationsChange} color="primary" />}
                                    label="Enable Notifications"
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Typography variant="subtitle1" gutterBottom>Data Sync</Typography>
                                <FormControlLabel
                                    control={<Switch checked={dataSync} onChange={handleDataSyncChange} color="primary" />}
                                    label="Enable Data Sync"
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Typography variant="subtitle1" gutterBottom>Maintenance Mode</Typography>
                                <FormControlLabel
                                    control={<Switch checked={maintenanceMode} onChange={handleMaintenanceModeChange} color="primary" />}
                                    label="Enable Maintenance Mode"
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default System;
