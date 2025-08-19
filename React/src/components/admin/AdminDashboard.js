// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DocumentViewer from '../ui/DocumentViewer';
import ChangeRole from './ChangeRole';
import axios from 'axios';
import Navbar from '../ui/Navbar';

export default function AdminDashboard() {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
    pendingApprovals: 0,
  });

  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // success-story form state
  const [storyForm, setStoryForm] = useState({
    updates: '',
    fundRaised: '',
    images: null,
  });

  const [stories, setStories] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  /* ---------- AUTH & INITIAL DATA ---------- */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchPendingCampaigns();
    fetchDashboardStats();
  }, [navigate]);

  /* ---------- SUCCESS STORY (TAB) ---------- */
  useEffect(() => {
    if (activeTab === 'manageStories') fetchSuccessStories();
  }, [activeTab]);

  const fetchSuccessStories = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:8080/api/successstories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load success stories.');
    }
  };

  const handleDeleteStory = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/successstories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories((prev) => prev.filter((s) => s.successId !== id));
      alert('Story deleted.');
    } catch {
      alert('Failed to delete story.');
    }
  };

    const [completedCampaigns, setCompletedCampaigns] = useState([]);
  // Fetch completed campaigns from backend
  useEffect(() => {
    if (activeTab === "stories") {
      axios.get("http://localhost:8080/api/SuccessStories/completed") // Make sure backend route matches
        .then((res) => {
          setCompletedCampaigns(res.data);
        })
        .catch((err) => {
          console.error("Error fetching completed campaigns", err);
        });
    }
  }, [activeTab]);

  /* ---------- PENDING CAMPAIGNS ---------- */
  const fetchPendingCampaigns = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:8080/api/campaign/admin/pending-campaigns', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        setPendingCampaigns(arr);
        setStats((s) => ({ ...s, pendingApprovals: arr.length }));
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired or unauthorised.');
          localStorage.clear();
          navigate('/login');
        }
      });
  };

  /* ---------- DASHBOARD STATS ---------- */
  const fetchDashboardStats = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:8080/api/campaign/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const d = res.data;
        setStats((prev) => ({
          ...prev,
          totalCampaigns: d.totalCampaigns || 0,
          activeCampaigns: d.activeCampaigns || 0,
          totalRaised: d.totalRaised || 0,
        }));
      })
      .catch((err) => console.error('Failed to load dashboard stats:', err));
  };

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  /* ---------- DOCUMENT MODAL ---------- */
  const handleViewDocuments = (campaign) => {
    // Backend returns:  campaign.documents = [{ name:'...', content:'BASE64' }, ...]
    const raw = campaign.documents || [];
    const parsedDocs = raw.map((d) => ({
      name: d.name || 'document.pdf',
      content: d.content,
    }));
    setSelectedCampaign({ ...campaign, parsedDocuments: parsedDocs });
    setShowDocumentViewer(true);
  };

  const handleCloseDocumentViewer = () => {
    setShowDocumentViewer(false);
    setSelectedCampaign(null);
  };

  const handleApproveCampaign = (notes) => {
    const token = localStorage.getItem('token');
    if (!token || !selectedCampaign) return;
    axios
      .put(
        `http://localhost:8080/api/admin/campaigns/${selectedCampaign.campaignId}/approve`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert(`✅ Campaign "${selectedCampaign.title}" approved.`);
        setPendingCampaigns((prev) =>
          prev.filter((c) => c.campaignId !== selectedCampaign.campaignId)
        );
        setStats((s) => ({ ...s, pendingApprovals: s.pendingApprovals - 1 }));
        handleCloseDocumentViewer();
      })
      .catch(() => alert('Failed to approve campaign.'));
  };

  const handleRejectCampaign = (notes) => {
    const token = localStorage.getItem('token');
    if (!token || !selectedCampaign) return;
    axios
      .put(
        `http://localhost:8080/api/admin/campaigns/${selectedCampaign.campaignId}/reject`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert(`❌ Campaign "${selectedCampaign.title}" rejected.`);
        setPendingCampaigns((prev) =>
          prev.filter((c) => c.campaignId !== selectedCampaign.campaignId)
        );
        setStats((s) => ({ ...s, pendingApprovals: s.pendingApprovals - 1 }));
        handleCloseDocumentViewer();
      })
      .catch(() => alert('❌ Failed to reject campaign.'));
  };

  /* ---------- CREATE SUCCESS STORY ---------- */
  const handleCreateStory = () => {
    if (!storyForm.campaignId) {
      alert("Please select a campaign");
      return;
    }

    const formData = new FormData();
    formData.append("campaignId", storyForm.campaignId);
    formData.append("updates", storyForm.updates);
    if (storyForm.images) {
      formData.append("images", storyForm.images);
    }

    axios
      .post("http://localhost:8080/api/successstories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Story saved successfully!");
        setStoryForm({ campaignId: "", updates: "", images: null });
      })
      .catch((err) => {
        console.error("Error saving story:", err);
        alert("Failed to save story");
      });
  };

  /* ---------- TABS ---------- */
  const tabs = [
    { key: 'overview', label: 'Overview & Approvals' },
    { key: 'users', label: 'User Management' },
    { key: 'stories', label: 'Create Success Story' },
    { key: 'manageStories', label: 'Manage All Stories' },
  ];

  /* ---------- RENDER ---------- */
  return (
    <>
      <Navbar />
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1>Admin Dashboard</h1>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '2rem',
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
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview & Approvals */}
        {activeTab === 'overview' && (
          <>
            <h2>Overview</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <StatCard title="Total Campaigns" value={stats.totalCampaigns} />
              <StatCard title="Active Campaigns" value={stats.activeCampaigns} />
              <StatCard
                title="Total Raised"
                value={`₹${stats.totalRaised.toLocaleString()}`}
              />
              <StatCard title="Pending Approvals" value={stats.pendingApprovals} />
            </div>

            <h2>Pending Campaign Approvals</h2>
            {pendingCampaigns.length > 0 ? (
              <div className="grid">
                {pendingCampaigns.map((c) => (
                  <div key={c.campaignId} className="card">
                    <div className="card-content">
                      <h3>{c.title}</h3>
                      <p>
                        <strong>Creator:</strong> {c.user?.fullName || c.user?.email}
                      </p>
                      <p>
                        <strong>Target:</strong> ₹{c.targetAmt}
                      </p>
                      <p>
                        <strong>Start:</strong> {c.startDate}
                      </p>
                      <p>
                        <strong>End:</strong> {c.endDate}
                      </p>
                      <p>
                        <strong>Status:</strong> {c.status}
                      </p>

                      <div style={{ marginTop: '1rem' }}>
                        <button
                          onClick={() => handleViewDocuments(c)}
                          className="btn-login"
                        >
                          📄 View Documents
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No pending campaign approvals.</p>
            )}
          </>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <>
            <h2>User Management</h2>
            <br />
            <ChangeRole />
          </>
        )}

{activeTab === 'stories' && (
  <>
    <div style={{ padding: "1rem" }}>
      <h2>Create Success Story</h2>
      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <div
          className="card-content"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Select Completed Campaign */}
          <label style={{ fontWeight: "bold" }}>Select Completed Campaign</label>
          <select
            required
            value={storyForm.campaignId}
            onChange={(e) =>
              setStoryForm({ ...storyForm, campaignId: e.target.value })
            }
          >
            <option value="">-- Select Campaign --</option>
            {completedCampaigns.map((campaign) => (
              <option key={campaign.campaignId} value={campaign.campaignId}>
                {campaign.title}
              </option>
            ))}
          </select>

          {/* Updates / Description */}
          <label style={{ fontWeight: "bold" }}>Updates / Description</label>
          <textarea
            required
            rows="5"
            value={storyForm.updates}
            onChange={(e) =>
              setStoryForm({ ...storyForm, updates: e.target.value })
            }
          />

          {/* Image Upload */}
          <label style={{ fontWeight: "bold" }}>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setStoryForm({ ...storyForm, images: e.target.files[0] })
            }
          />

          {/* Save Button */}
          <button type="submit" onClick={handleCreateStory} className="btn-login">
            Save Story
          </button>
        </div>
      </div>
    </div>
  </>
)}

        {/* Manage Stories */}
        {activeTab === 'manageStories' && (
          <>
            <h2>Manage All Success Stories</h2>
            {stories.length === 0 ? (
              <p>No stories found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{ width: '100%', borderCollapse: 'collapse' }}
                >
                  <thead>
                    <tr style={{ background: '#f7fafc' }}>
                      <th style={cellStyle}>ID</th>
                      <th style={cellStyle}>Updates</th>
                      <th style={cellStyle}>Amount Raised</th>
                      <th style={cellStyle}>Image</th>
                      <th style={cellStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((s) => (
                      <tr key={s.successId}>
                        <td style={cellStyle}>{s.successId}</td>
                        <td style={cellStyle}>{s.updates}</td>
                        <td style={cellStyle}>₹{s.fundRaised}</td>
                        <td style={cellStyle}>
                          {s.imageURL ? (
                            <img
                              src={`http://localhost:8080${s.imageURL}`}
                              alt="story"
                              style={{ height: 60 }}
                            />
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td style={cellStyle}>
                          <button
                            className="btn"
                            onClick={() => handleDeleteStory(s.successId)}
                            style={{
                              background: '#e53e3e',
                              color: 'white',
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Document Modal */}
        {showDocumentViewer && selectedCampaign && (
          <DocumentViewer
            documents={selectedCampaign.parsedDocuments || []}
            campaignName={selectedCampaign.title}
            onClose={handleCloseDocumentViewer}
            onApprove={handleApproveCampaign}
            onReject={handleRejectCampaign}
          />
        )}
      </div>
    </>
  );
}

/* ----------- helpers ----------- */
function StatCard({ title, value }) {
  return (
    <div className="card">
      <div className="card-content">
        <h3>{title}</h3>
        <p
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2c7a7b',
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};