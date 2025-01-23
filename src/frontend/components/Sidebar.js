import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Sidebar = ({ sidebarWidth, setSidebarWidth }) => {
    const account_type = cookies.get('account_type');
    const navigate = useNavigate();
    const [isResizing, setIsResizing] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const COLLAPSED_WIDTH = 80; // Fixed width when collapsed
    const MIN_WIDTH_EXPANDED = 200; // Minimum width for expanded sidebar
    const MAX_WIDTH_EXPANDED = 400; // Maximum width for expanded sidebar
    const DEFAULT_EXPANDED_WIDTH = 280; // Default width for expanded sidebar

    // Toggle collapse state
    const toggleCollapse = () => {
        const newCollapsedState = !collapsed;
        setCollapsed(newCollapsedState);

        // Lock width based on collapse state
        if (newCollapsedState) {
            setSidebarWidth(COLLAPSED_WIDTH); // Fixed collapsed width
        } else {
            setSidebarWidth(DEFAULT_EXPANDED_WIDTH); // Default expanded width
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
            if (cookies.get('account_type') === 'patient') { cookies.remove('patient_id'); }
            cookies.remove('user_id');
            cookies.remove('username');
            cookies.remove('account_type');
            cookies.remove('email');
            cookies.remove('session_token');
            localStorage.removeItem('loggedIn');
            window.history.replaceState(null, null, '/');
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
            setErrorMessage('Failed to log out. Please try again.');
        }
    };

    // Handle Refresh
    const handleRefresh = () => {
        window.location.reload();
    };

    // Resize functionality
    const handleMouseMove = useCallback(
        (e) => {
            if (isResizing && !collapsed) { // Allow resizing only if not collapsed
                const newWidth = e.clientX;
                if (newWidth >= MIN_WIDTH_EXPANDED && newWidth <= MAX_WIDTH_EXPANDED) {
                    setSidebarWidth(newWidth);
                }
            }
        },
        [isResizing, collapsed, setSidebarWidth]
    );

    const handleMouseUp = () => {
        if (isResizing) {
            setIsResizing(false);
        }
    };

    const handleMouseDown = () => {
        if (!collapsed) { // Prevent resizing if collapsed
            setIsResizing(true);
        }
    };

    // Add event listeners for resizing
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove]);

    return (
        <div
            style={{
                ...sidebarStyles,
                width: collapsed ? COLLAPSED_WIDTH : sidebarWidth, // Enforce fixed width on collapse
            }}>
            {/* Collapse Button */}
            <button onClick={toggleCollapse} style={collapseButtonStyle}>
                {collapsed ? '>' : '<'}
            </button>

            {/* Navigation Links */}
            <div className="nav-section" style={navSectionStyles}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">dashboard</i>
                    {!collapsed && "Dashboard"}
                </NavLink>
                <NavLink to="/billing" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">receipt</i>
                    {!collapsed && "Billing"}
                </NavLink>
                <NavLink to="/documents" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">folder</i>
                    {!collapsed && "Documents"}
                </NavLink>
                <NavLink to="/persons-institutions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">account_balance</i>
                    {!collapsed && "Persons & Institutions"}
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">layers</i>
                    {!collapsed && "Reports"}
                </NavLink>
                <NavLink to="/scheduler" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">event</i>
                    {!collapsed && "Scheduler"}
                </NavLink>
                <NavLink to="/system" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">settings</i>
                    {!collapsed && "System"}
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">info</i>
                    {!collapsed && "About"}
                </NavLink>
                {account_type === 'admin' && (
                <NavLink to="/user-management" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">manage_accounts</i>
                    {!collapsed && "User Management"}
                </NavLink>
                )}
                {(account_type === "admin" || account_type === "practitioner" || account_type === "office") && (
                <NavLink to="/transaction-codes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navItemStyles}>
                    <i className="material-icons">code</i>
                    {!collapsed && "Transaction Codes"}
                </NavLink>
                )}
            </div>

            {/* Refresh and Logout */}
            <div className="refresh-logout-container" style={bottomContainerStyles}>
                {errorMessage && <p id='errMessage' style={errMessageStyles}>{errorMessage}</p>}
                <div className="refresh-button" style={refreshButtonStyles} onClick={handleRefresh}>
                    <i className="material-icons">refresh</i>
                    {!collapsed && "Refresh"}
                </div>
                <div className="logout-button" style={logoutButtonStyles} onClick={handleLogout}>
                    <i className="material-icons">logout</i>
                    {!collapsed && "Log out"}
                </div>
            </div>

            {/* Resizable Handle */}
            {!collapsed && ( // Hide resize handle if collapsed
                <div
                    className="resize-handle"
                    style={resizeHandleStyles}
                    onMouseDown={handleMouseDown}
                ></div>
            )}
        </div>
    );
};

// Styles
const sidebarStyles = {
    backgroundColor: '#2b4f60',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1000',
};

const navSectionStyles = {
    borderBottom: '1px solid #3f697e',
};

const navItemStyles = {
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const collapseButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '-15px',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#3f697e',
    borderRadius: '50%',
    color: 'white',
    border: '2px solid #2b4f60',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: '1100',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
};

const bottomContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto',
};

const errMessageStyles = {
    textAlign: 'center',
    color: '#ff9900'
};

const refreshButtonStyles = {
    padding: '10px 20px',
    backgroundColor: '#3f697e',
    color: 'white',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const logoutButtonStyles = {
    padding: '10px 20px',
    backgroundColor: '#ff9900',
    color: 'white',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const resizeHandleStyles = {
    width: '5px',
    height: '100%',
    backgroundColor: '#2b4f60',
    cursor: 'ew-resize',
    position: 'absolute',
    top: '0',
    right: '0',
};

export default Sidebar;
