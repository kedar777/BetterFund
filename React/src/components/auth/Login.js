import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthAPI } from './auth';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        console.log(' Login form submitted');

        try {
            const responseData = await AuthAPI.login(formData.email, formData.password);
            console.log(' Login API response:', responseData);

            if (responseData.success) {
                const user = responseData.user;
                const token = responseData.token;

                // Store token and user info
                localStorage.setItem('token', token);
                
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userName', user.username);
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userId', user.id.toString());
                localStorage.setItem('adminLoggedIn', user.isAdmin ? 'true' : 'false');
                localStorage.setItem('userType', user.isAdmin ? 'admin' : 'user');
          

                window.dispatchEvent(new Event('loginStatusChanged'));
                alert(' Login successful!');

                navigate(user.isAdmin ? '/admin/dashboard' : '/');
            } else {
                setError(responseData.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error(' Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
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


                <h2 style={{ color: '#2c7a7b', fontWeight: 700 }}>Login</h2>
                <br/>
                {/* <p>Sign in to access your BetterFund account or admin panel.</p> */}

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn-login"  disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

             
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p>Don't have an account? <Link to="/register" style={{ color: '#2c7a7b', textDecoration: 'none' }}>Sign Up</Link></p>
                </div>
            </div>
                
        </div>
    );
}
