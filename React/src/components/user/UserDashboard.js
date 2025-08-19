import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [userContributions, setUserContributions] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('userLoggedIn');
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // Load user data
        loadUserData();
    }, [navigate]);

    const loadUserData = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            const response = await fetch(`http://localhost:8080/api/user/profile/${userEmail}`);
            const data = await response.json();

            setUserProfile({
                name: data.uname,
                email: data.email,
                totalContributed: data.totalContributed || 0,
                campaignsCreated: data.campaignsCreated || 0
            });

            setUserCampaigns(data.campaigns || []);
            setUserContributions(data.contributions || []);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        navigate('/login');
    };

    const handleCreateCampaign = () => {
        navigate('/campaign/new');
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>User Dashboard</h1>
                <div>
                    <Link to="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
                        View Site
                    </Link>
                    <button onClick={handleLogout} className="btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* User Profile */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-content">
                    <h2>Welcome, {userProfile.name}!</h2>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <h3>Total Contributed</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                                ₹{userProfile.totalContributed.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3>Campaigns Created</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                                {userProfile.campaignsCreated}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '2rem' }}>
                <h2>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handleCreateCampaign} className="btn">
                        Create New Campaign
                    </button>
                    <Link to="/" className="btn btn-secondary">
                        Browse Campaigns
                    </Link>
                    <Link to="/report-issues" className="btn btn-secondary">
                        Report Issue
                    </Link>
                </div>
            </div>

            {/* User's Campaigns */}
            <div style={{ marginBottom: '2rem' }}>
                <h2>My Campaigns</h2>
                {userCampaigns.length > 0 ? (
                    <div className="grid">
                        {userCampaigns.map(campaign => (
                            <div key={campaign.id} className="card">
                                <div className="card-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <h3>{campaign.name}</h3>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: campaign.status === 'active' ? '#d4edda' : '#fff3cd',
                                            color: campaign.status === 'active' ? '#155724' : '#856404'
                                        }}>
                                            {campaign.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p><strong>Raised:</strong> ₹{campaign.balance.toLocaleString()} / ₹{campaign.target.toLocaleString()}</p>
                                    <p><strong>Contributors:</strong> {campaign.contributors}</p>
                                    <p><strong>Requests:</strong> {campaign.requests}</p>
                                    <p><strong>Created:</strong> {campaign.createdAt}</p>
                                    <div style={{ marginTop: '1rem' }}>
                                        <Link to={`/campaign/${campaign.id}`} className="btn" style={{ marginRight: '0.5rem' }}>
                                            View Details
                                        </Link>
                                        <Link to={`/campaign/${campaign.id}/requests`} className="btn btn-secondary">
                                            Manage Requests
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You haven't created any campaigns yet. <button onClick={handleCreateCampaign} className="btn" style={{ marginLeft: '0.5rem' }}>Create your first campaign</button></p>
                )}
            </div>

            {/* User's Contributions */}
            <div>
                <h2>My Contributions</h2>
                {userContributions.length > 0 ? (
                    <div className="grid">
                        {userContributions.map(contribution => (
                            <div key={contribution.id} className="card">
                                <div className="card-content">
                                    <h3>{contribution.campaignName}</h3>
                                    <p><strong>Amount:</strong> ₹{contribution.amount.toLocaleString()}</p>
                                    <p><strong>Date:</strong> {contribution.date}</p>
                                    <p><strong>Status:</strong>
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: '#d4edda',
                                            color: '#155724'
                                        }}>
                                            {contribution.status.toUpperCase()}
                                        </span>
                                    </p>
                                    <Link to={`/campaign/${contribution.campaignId}`} className="btn">
                                        View Campaign
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You haven't made any contributions yet. <Link to="/" className="btn" style={{ marginLeft: '0.5rem' }}>Browse campaigns</Link></p>
                )}
            </div>
        </div>
    );
} 