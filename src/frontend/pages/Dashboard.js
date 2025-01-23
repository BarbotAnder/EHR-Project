import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NewPatientForm from '../patient/NewPatientForm';
import PatientSearch from '../patient/PatientSearch';
import PatientDetails from '../patient/PatientDetails';
import PatientDashboard from '../patient/PatientDashboard';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';

const localizer = momentLocalizer(moment);

// Helper function to get query parameters
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const cookies = new Cookies();
const Dashboard = () => {
    const query = useQuery();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [username, setUsername] = useState('Guest'); // Default to 'Guest'
    const [email, setEmail] = useState(''); // State for the email
    const account_type = cookies.get('account_type');

    useEffect(() => {
        
        const isLoggedIn = localStorage.getItem('loggedIn');
        if (!isLoggedIn) {
            navigate('/', { replace: true }); // Redirect to login if not logged in
            return;
        }

        const usernameFromQuery = query.get('username');
        const emailFromQuery = query.get('email');

        if (usernameFromQuery) {
            setUsername(usernameFromQuery);
            localStorage.setItem('username', usernameFromQuery);
        } else {
            const usernameFromStorage = localStorage.getItem('username');
            if (usernameFromStorage) {
                setUsername(usernameFromStorage);
            }
        }

        if (emailFromQuery) {
            setEmail(emailFromQuery);
            localStorage.setItem('email', emailFromQuery);
        } else {
            const emailFromStorage = localStorage.getItem('email');
            if (emailFromStorage) {
                setEmail(emailFromStorage);
            }
        }

        // Add a history state to prevent navigating back to the dashboard
        window.history.pushState(null, null, window.location.href);
        const handlePopState = () => {
            navigate('/', { replace: true });
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [query, navigate]); // Make sure navigate is included in the dependencies

    const [isPatientInfoFormVisible, setIsPatientInfoFormVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const generateHourlyEvents = () => {
        const events = [];
        const startOfDay = moment().startOf('day').add(8, 'hours');
        const endOfDay = moment().startOf('day').add(17, 'hours');
        let currentTime = startOfDay;

        while (currentTime.isBefore(endOfDay)) {
            if (![10, 12, 15].includes(currentTime.hour())) {
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

    const events = generateHourlyEvents();

    const handlePatientInfoClick = () => {
        setIsPatientInfoFormVisible(true);
        setIsFormVisible(false);
        setIsSearchVisible(false);
    };

    const handleNewPatientClick = () => {
        setIsFormVisible(true);
        setIsSearchVisible(false);
        setIsPatientInfoFormVisible(false);
    };

    const handleSearchClick = () => {
        setIsSearchVisible(true);
        setIsFormVisible(false);
        setIsPatientInfoFormVisible(false);
    };

    const handleFormClose = () => {
        setIsPatientInfoFormVisible(false);
        setIsFormVisible(false);
        setIsSearchVisible(false);
    };

    return (
        <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
            {/* Dashboard view */}
            {!isPatientInfoFormVisible && !isFormVisible && !isSearchVisible && (
                <div id="dashboard">
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                        Welcome,{' '}
                        <Link to={`/profile?email=${username}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                            {username}
                        </Link>
                        !
                    </h3>
                    <hr />
                    <div className="dashboard-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        { (account_type === 'patient') && 
                        <button type="button" 
                                id="patient-info-button"
                                className="dashboard-btn patient-page-btn"
                                onClick={handlePatientInfoClick}>
                            Patient Info
                        </button>}
                        
                        { (account_type === "admin" || account_type === "practitioner" || account_type === "office") && (
                        <button
                            type="button"
                            id="new-patient-button"
                            className="dashboard-btn new-patient-btn"
                            onClick={handleNewPatientClick}
                        >
                            New Patient
                        </button>)}

                        { (account_type === "admin" || account_type === "practitioner" || account_type === "office") && (
                        <button
                            type="button"
                            id="patient-search-button"
                            className="dashboard-btn search-patient-btn"
                            onClick={handleSearchClick}
                        >
                            Search Patient
                        </button>)}
                        
                        {/* These should navigate to different pages or display differently based on account type */}
                        <button type="button" className="dashboard-btn appointments-btn">Appointments</button>
                        <button type="button" className="dashboard-btn medical-records-btn">Medical Records</button>
                        <button type="button" className="dashboard-btn billing-btn">Billing</button>
                        <button type="button" className="dashboard-btn reports-btn">Reports</button>
                        { (account_type === 'patient') && <button type="button" className="dashboard-btn book-appointment-btn">Book an appointment</button>}
                    </div>

                    {/* Schedule Section */}
                    { (account_type === "practitioner" || account_type === "office") && (
                    <div className="daily-schedule" style={{ marginTop: '40px' }}>
                        <h4>Today's Schedule</h4>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            defaultView={Views.DAY}
                            views={['day', 'week', 'month']}
                            style={{ height: '70vh', marginTop: '20px' }}
                            min={new Date(1970, 1, 1, 6, 0, 0)}
                            max={new Date(1970, 1, 1, 21, 0, 0)}
                        />
                    </div>)}
                </div>
            )}

            {/* Patient Details Form */}
            {isPatientInfoFormVisible && <PatientDetails patientId={cookies.get('patient_id')} />}

            {/* New Patient Form */}
            {isFormVisible && <NewPatientForm onFormClose={handleFormClose} />}

            {/* Patient Search */}
            {isSearchVisible && <PatientSearch onFormClose={handleFormClose} />}

            {/* Patient Dashboard */}
            { !isPatientInfoFormVisible && (account_type === 'patient') && (
                <PatientDashboard />
            )}
        </div>
    );
};

export default Dashboard;
