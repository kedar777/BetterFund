import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [userType, setUserType] = useState(null);
    const location = useLocation();

    // Re-compute role every time the navbar is rendered
    useEffect(() => {
        const admin = localStorage.getItem('adminLoggedIn') === 'true';
        const user = localStorage.getItem('userLoggedIn') === 'true';

        if (admin) {
            setUserType('admin');
        } else if (user) {
            setUserType('user');
        } else {
            // purge any stale data
            ['adminLoggedIn', 'userLoggedIn', 'userEmail', 'userName', 'userRole', 'userId', 'userType']
                .forEach(k => localStorage.removeItem(k));
            setUserType(null);
        }
    }, [location]);   // also run on route change

    // Listen for login/logout events
    useEffect(() => {
        const onStatus = () => {
            const admin = localStorage.getItem('adminLoggedIn') === 'true';
            const user = localStorage.getItem('userLoggedIn') === 'true';
            setUserType(admin ? 'admin' : user ? 'user' : null);
        };
        window.addEventListener('loginStatusChanged', onStatus);
        return () => window.removeEventListener('loginStatusChanged', onStatus);
    }, []);

    const handleLogout = () => {
        ['adminLoggedIn', 'userLoggedIn', 'userEmail', 'userName', 'userRole', 'userId', 'userType']
            .forEach(k => localStorage.removeItem(k));
        setUserType(null);
        window.location.href = '/';   // hard reload to reset all state
    };

    return (
        <nav className="navbar">
            <div className="nav-container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img src='/BetterFundLogo.png' alt="Website Logo" width="70" height="70" style={{ verticalAlign: 'middle' }} />
                        <span style={{ marginLeft: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: '#2c7a7b' }}>BetterFund</span>
                    </Link>
                </div>

                <div className="nav-links">
                    {location.pathname !== '/' && (
                        <Link to="/" className="nav-link" style={{marginRight: '1rem'}}>Home</Link>
                    )}
                    {location.pathname !== '/campaign/new' && (
                        <Link to="/campaign/new" className="btn-login">Create Campaign</Link>
                    )}

                    {userType === 'admin' ? (
                        <>
                            {location.pathname !== '/admin/dashboard' && (
                                <Link to="/admin/dashboard" className="btn-login">Admin Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="btn-login">Logout</button>
                        </>
                    ) : userType === 'user' ? (
                        <>
                            {location.pathname !== '/profile' && (
                                <Link to="/profile" className="btn-login">My Profile</Link>
                            )}
                            <button onClick={handleLogout} className="btn-login">Logout</button>
                        </>
                    ) : (
                        <>
                            {location.pathname !== '/login' && (
                                <Link to="/login" className="btn-login">Login</Link>
                            )}
                            {location.pathname !== '/register' && (
                                <Link to="/register" className="btn-register">Sign Up</Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}