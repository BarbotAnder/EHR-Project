import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Documents from './pages/Documents';
import PersonsInstitutions from './pages/PersonsInstitutions';
import Reports from './pages/Reports';
import Scheduler from './pages/Scheduler';
import System from './pages/System';
import About from './pages/About';
import TransactionCodes from './pages/TransactionCodes';
import PatientSearch from './patient/PatientSearch';
import PatientPage from './patient/PatientPage';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import UserManagement from './user/UserManagement';
import UserDetails from './user/UserDetails';
import '../css/App.css';

function App() {
    const location = useLocation();
    const [sidebarWidth, setSidebarWidth] = useState(280);

    // Define routes that should hide the sidebar
    const noSidebarRoutes = ['/', '/signup'];

    // Determine if the current route is in the no-sidebar list
    const shouldRenderSidebar = !noSidebarRoutes.includes(location.pathname);

    return (
        <div style={{ display: 'flex' }}>
            {/* Conditionally render the sidebar */}
            {shouldRenderSidebar && <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />}

            <main style={{ flexGrow: 1, marginLeft: shouldRenderSidebar ? `${sidebarWidth}px` : '0' }}>
                <AnimatePresence mode="wait">
                    <div className="backdrop" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)' }} />
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >

                        <Routes location={location}>
                            <Route path="/" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/billing" element={<Billing />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route path="/persons-institutions" element={<PersonsInstitutions />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/scheduler" element={<Scheduler />} />
                            <Route path="/system" element={<System />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/transaction-codes" element={<TransactionCodes />} />
                            <Route path="/user-management" element={<UserManagement />} />
                            <Route path="/patient-search" element={<PatientSearch />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/patient/:id" element={<PatientPage />} />
                            <Route path="/users/:id" element={<UserDetails />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
