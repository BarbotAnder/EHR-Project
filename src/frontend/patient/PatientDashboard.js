import React from 'react';

const PatientDashboard = () => {
    // get patient_id from cookies

    return (
        <div>
            <h4>Upcoming Appointments</h4>
            <hr />
            <div className="card note-card">
                <div className="card-content">
                    <p>Day of week, date, time</p>
                    <p>Practitioner's full name</p>
                    <p>Location</p>
                    <p>Links to intake forms</p>
                </div>
            </div>

            <h4>Past Appointments & Visit Summary</h4>
            <hr />
            <div className="card note-card">
                <div className="card-content">
                    <p>Day of week, date, time</p>
                    <p>Practitioner's full name</p>
                    <p>Location</p>
                    <p>Link to view summary</p>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;