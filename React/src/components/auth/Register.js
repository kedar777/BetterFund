import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        aadhar: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const { name, email, password, confirmPassword, phone, aadhar } = formData;

        // Regex patterns
        const nameRegex = /^[A-Za-z\s]{3,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^.{6,}$/; // Min 6 chars
        const phoneRegex = /^\d{10}$/;
        const aadharRegex = /^\d{12}$/;

        // Validation checks
        if (!name || !email || !password || !confirmPassword || !phone || !aadhar) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }
        if (!nameRegex.test(name)) {
            setError('Name must be 3-50 characters, letters and spaces only');
            setLoading(false);
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        if (!phoneRegex.test(phone)) {
            setError('Phone must be exactly 10 digits');
            setLoading(false);
            return;
        }
        if (!aadharRegex.test(aadhar)) {
            setError('Aadhaar must be exactly 12 digits');
            setLoading(false);
            return;
        }

        // Submit to backend
        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: name,
                    email: email,
                    password: password,
                    adharNo: aadhar,
                    phoneNo: phone
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Registration failed');

            const user = data.user;
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.username);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userId', user.id.toString());
            localStorage.setItem('adminLoggedIn', user.isAdmin ? 'true' : 'false');
            localStorage.setItem('userType', user.isAdmin ? 'admin' : 'user');

            window.dispatchEvent(new Event('loginStatusChanged'));
            alert('Registration successful');
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '14px',
                        marginBottom: '1.5rem',
                    }}>
                        <img src='/BetterFundLogo.png' alt="Website Logo" width="50" height="50" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(44, 122, 123, 0.12)' }} />
                        <span style={{
                            fontWeight: 700,
                            fontSize: '1.7rem',
                            color: '#2c7a7b',
                            letterSpacing: '1px',
                            textShadow: '0 1px 4px rgba(44,122,123,0.15)'
                        }}>BetterFund</span>
                    </div>
                </Link>
                <h2 style={{ color: '#2c7a7b', fontWeight: 700 }}>Create Account</h2>
                <p style={{ color: '#718096', marginBottom: '2rem', fontWeight: 500 }}>
                    Join BetterFund and start making a difference in your community.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your full name"
                            required
                            pattern="^[A-Za-z\s]{3,50}$"
                            title="3-50 characters, letters and spaces only"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your email"
                            required
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            title="Enter a valid email address"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your phone number"
                            maxLength="10"
                            pattern="\d{10}"
                            title="10-digit phone number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="aadhar" className="form-label">Aadhaar Number</label>
                        <input
                            type="text"
                            id="aadhar"
                            name="aadhar"
                            value={formData.aadhar}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter 12-digit Aadhaar number"
                            maxLength="12"
                            pattern="\d{12}"
                            title="12-digit Aadhaar number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Create a password"
                            required
                            pattern=".{6,}"
                            title="At least 6 characters"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Confirm your password"
                            required
                            pattern=".{6,}"
                            title="At least 6 characters"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button
                        type="submit"
                        className="btn-register"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: '#718096' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#2c7a7b', textDecoration: 'none' }}>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
