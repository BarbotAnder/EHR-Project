import React from 'react';
import { Typography } from '@mui/material';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/App.css';

const localizer = momentLocalizer(moment);

const generateHourlyEvents = () => {
    const events = [];
    const startOfDay = moment().startOf('day').add(8, 'hours');
    const endOfDay = moment().startOf('day').add(17, 'hours');

    let currentTime = startOfDay;

    while (currentTime.isBefore(endOfDay)) {
        if (![10, 12, 15].includes(currentTime.hour())) { // Exclude 10 AM, 12 PM, 3 PM
            events.push({
                title: `Patient at ${currentTime.format('hh:mm A')}`,
                start: currentTime.toDate(),
                end: currentTime.clone().add(1, 'hour').toDate(),
            });
        }
        currentTime = currentTime.add(1, 'hour');
    }
    return events;
};

const Scheduler = () => {
    const events = generateHourlyEvents();

    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="scheduler">
                    <Typography variant="h4" gutterBottom>
                        Scheduler
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        View and manage your schedule below.
                    </Typography>

                    {/* Calendar Section */}
                    <div className="calendar-container" style={{ marginTop: '20px' }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            defaultView={Views.WEEK}
                            views={['day', 'week', 'month']}
                            style={{ height: '70vh' }}
                            min={new Date(1970, 1, 1, 6, 0, 0)}
                            max={new Date(1970, 1, 1, 21, 0, 0)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
