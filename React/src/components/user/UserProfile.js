import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [userContributions, setUserContributions] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    totalContributed: 0,
    campaignsCreated: 0,
    activeCampaigns: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  /* Helpers */
  const userId = localStorage.getItem('userId');
  const isLoggedIn = localStorage.getItem('userLoggedIn');

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      /* Profile summary */
      const profileRes = await fetch(
        `http://localhost:8080/api/user/profile/${userId}`
      );
      if (!profileRes.ok) throw new Error('Profile fetch failed');
      const profile = await profileRes.json();
      setUserProfile(profile);

      /* My campaigns – NEW endpoint */
      const campaignsRes = await fetch(
        `http://localhost:8080/api/user/${userId}/campaigns`
      );
      if (!campaignsRes.ok) throw new Error('Campaigns fetch failed');
      const campaigns = await campaignsRes.json();
      setUserCampaigns(
        campaigns.map((c) => ({
          id: c.campaignId,
          name: c.title,
          description: c.description || 'No description provided.',
          balance: c.wallet?.amount || 0,
          target: c.targetAmt || 0,
          status: c.status?.toLowerCase() || 'unknown',
          contributors: c.donations?.length || 0,
          requests: c.withdrawalRequests?.length || 0,
          createdAt: new Date(c.createdAt).toLocaleDateString(),
          endAt: new Date(c.endAt).toLocaleDateString(),
        }))
      );

      /* Contributions (already wired) */
      const contribRes = await fetch(
        `http://localhost:8080/api/user/${userId}/contributions`
      );
      if (!contribRes.ok) throw new Error('Contributions fetch failed');
      const contributions = await contribRes.json();
      setUserContributions(
        contributions.map((d) => ({
          id: d.donationId,
          campaignName: d.campaign?.title || 'Campaign',
          amount: d.amount,
          date: new Date(d.donatedAt).toLocaleDateString(),
          status: 'completed',
          campaignId: d.campaign?.campaignId
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    ['userLoggedIn', 'userEmail', 'userType', 'userId'].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate('/login');
  };

  const handleCreateCampaign = () => navigate('/campaign/new');

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
    );
  }

  // tabs  
  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'campaigns', label: 'My Campaigns' },
    // { key: 'contributions', label: 'My Contributions' }
  ];

  return (
    <div className="container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}
      >
        <h1>My Profile</h1>
        <div>
          <Link to="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
            Back to Home
          </Link>
          <button onClick={handleLogout} className="btn-login">
            Logout
          </button>
        </div>
      </div>

      {/* tab buttons */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '2rem'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: activeTab === tab.key ? '#2c7a7b' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#4a5568',
              cursor: 'pointer',
              borderBottom:
                activeTab === tab.key ? '2px solid #2c7a7b' : 'none',
              marginBottom: '-2px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* tab bodies */}
      {activeTab === 'profile' && <ProfileTab profile={userProfile} onCreate={handleCreateCampaign} />}
      {activeTab === 'campaigns' && <CampaignsTab campaigns={userCampaigns} onCreate={handleCreateCampaign} />}
      {/* {activeTab === 'contributions' && <ContributionsTab contributions={userContributions} />} */}
    </div>
  );
}

// sub-components 
function ProfileTab({ profile, onCreate }) {
  return (
    <>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <h2>Profile Information</h2>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, 200px)',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {/* <StatCard title="Total Contributed" value={`₹${profile.totalContributed.toLocaleString()}`} /> */}
        <StatCard title="Campaigns Created" value={profile.campaignsCreated} />
        <StatCard title="Active Campaigns" value={profile.activeCampaigns} />
      </div>

      <div>
        <button onClick={onCreate} className="btn-login">
          Create New Campaign
        </button>
      </div>
    </>
  );
}

function CampaignsTab({ campaigns, onCreate }) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <h2>My Campaigns</h2>
        <button onClick={onCreate} className="btn">
          Create New Campaign
        </button>
      </div>

      {campaigns.length ? (
        <div className="grid">
          {campaigns.map((c) => (
            <div key={c.id} className="card">
              <div className="card-content">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <h3>{c.name}</h3>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      background: c.status === 'active' ? '#d4edda' : '#fff3cd',
                      color: c.status === 'active' ? '#155724' : '#856404'
                    }}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
                  {c.description}
                </p>
                <p>
                  <strong>Raised:</strong> ₹{c.balance.toLocaleString()} / ₹
                  {c.target.toLocaleString()}
                </p>
                <p>
                  <strong>Start Date:</strong> {c.createdAt}
                </p>
                <p>
                  <strong>End Date:</strong> {c.endAt}
                </p>

                <div style={{ marginTop: '1rem' }}>
                  <Link to={`/campaign/${c.id}`} className="btn" style={{ marginRight: '0.5rem' }}>
                    View Details
                  </Link>
                  <Link to={`/campaign/${c.id}/requests`} className="btn btn-secondary">
                    Manage Requests
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>You haven't created any campaigns yet.</p>
          <button onClick={onCreate} className="btn">
            Create your first campaign
          </button>
        </div>
      )}
    </>
  );
}

function ContributionsTab({ contributions }) {
  return (
    <>
      <h2>My Contributions</h2>
      {contributions.length ? (
        <div className="grid">
          {contributions.map((c) => (
            <div key={c.id} className="card">
              <div className="card-content">
                <h3>{c.campaignName}</h3>
                <p>
                  <strong>Amount:</strong> ₹{c.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Date:</strong> {c.date}
                </p>
                <p>
                  <strong>Status:</strong> {c.status}
                </p>
                <Link to={`/campaign/${c.campaignId}`} className="btn">
                  View Campaign
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>You haven't made any contributions yet.</p>
          <Link to="/" className="btn">
            Browse campaigns
          </Link>
        </div>
      )}
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="card">
      <div className="card-content">
        <h3>{title}</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
          {value}
        </p>
      </div>
    </div>
  );
}