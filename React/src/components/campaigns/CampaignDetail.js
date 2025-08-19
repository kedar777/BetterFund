import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CampaignComments from '../campaigns/CampaignComments';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CampaignDetail() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contributionAmount, setContributionAmount] = useState('');
    const [showContributionForm, setShowContributionForm] = useState(false);
    const [contributing, setContributing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadCampaign();
    }, [id]);

    const loadCampaign = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`http://localhost:8080/api/campaign/${id}`);
            if (!res.ok) throw new Error('Campaign not found');
            const data = await res.json();

            let daysLeft = 0;
            if (data.endDate) {
                const end = new Date(data.endDate);
                const today = new Date();
                end.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
            }

            const mappedCampaign = {
                id: data.campaignId,
                name: data.title,
                description: data.description || "No description provided.",
                image: data.imageUrl || "https://via.placeholder.com/600x300",
                target: data.targetAmt,
                raised: data.wallet?.amount || 0,
                category: data.category?.cname || "Uncategorized",
                creatorId: data.user?.username || "Unknown",
                status: data.status,
                createdAt: data.startDate,
                endAt: data.endDate,
                daysLeft: daysLeft
            };

            setCampaign(mappedCampaign);
        } catch (err) {
            setError(err.message);
            setCampaign(null);
        }
        setLoading(false);
    };

    const handleContribute = async (e) => {
        e.preventDefault();
        setContributing(true);
        setError('');
        setSuccess('');

        try {
            const amount = parseFloat(contributionAmount);
            if (!amount || amount <= 0) throw new Error('Please enter a valid amount');
            if (campaign.raised + amount > campaign.target) throw new Error('Donation exceeds campaign target amount');

            const isLoggedIn = localStorage.getItem('userLoggedIn');
            if (!isLoggedIn) throw new Error('Please login to contribute');

            const res = await fetch(`http://localhost:8080/api/donate/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });

            if (!res.ok) throw new Error('Failed to process donation');

            setSuccess(`Thank you for your contribution of ₹${amount}!`);
            setContributionAmount('');
            setShowContributionForm(false);
            setTimeout(() => setSuccess(''), 3000);
            loadCampaign();
        } catch (err) {
            setError(err.message);
        } finally {
            setContributing(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);

    const getProgressPercentage = (raised, target) =>
        Math.min((raised / target) * 100, 100);

    const getCategoryColor = (category) => {
        const colors = {
            'Medical': '#e53e3e',
            'Education': '#3182ce',
            'Personal': '#805ad5',
            'Community': '#38a169',
            'Natural Disaster': '#d69e2e'
        };
        return colors[category] || '#718096';
    };
    

    if (loading) {
        return <div className="container text-center py-5">Loading campaign details...</div>;
    }

    if (error && !campaign) {
        return (
            <div className="container text-center py-5">
                <h2>Campaign Not Found</h2>
                <p>{error}</p>
                <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>
        );
    }

    const isTargetReached = campaign.raised >= campaign.target;

    return (
        <div className="container py-4">
            {campaign && (
                <div className="card shadow-lg mb-4">
                    {/* <img src={campaign.image} className="card-img-top" alt={campaign.name} /> */}
                    <div className="card-body">
                        <h2 className="card-title">{campaign.name}</h2>
                        <p className="badge" style={{
                            backgroundColor: getCategoryColor(campaign.category),
                            color: '#fff',
                            fontSize: '1rem'
                        }}>
                            {campaign.category}
                        </p>
                        <p className="text-muted">by {campaign.creatorId}</p>

                        <div className="row text-center my-3">
                            <div className="col">
                                <h5>Raised</h5>
                                <p>{formatCurrency(campaign.raised)}</p>
                            </div>
                            <div className="col">
                                <h5>Target</h5>
                                <p>{formatCurrency(campaign.target)}</p>
                            </div>
                            <div className="col">
                                <h5>Days Left</h5>
                                <p>{campaign.daysLeft}</p>
                            </div>
                        </div>

                        <div className="progress mb-3" style={{ height: '20px' }}>
                            <div className="progress-bar" role="progressbar"
                                style={{ width: `${getProgressPercentage(campaign.raised, campaign.target)}%` }}>
                                {getProgressPercentage(campaign.raised, campaign.target).toFixed(0)}%
                            </div>
                        </div>

                        {isTargetReached ? (
                            <div className="alert alert-success mt-3">Target Reached! No more donations accepted.</div>
                        ) : showContributionForm ? (
                            <div className="mt-3">
                                <h4>Contribute</h4>
                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">{success}</div>}
                                <form onSubmit={handleContribute} className="row g-2">
                                    <div className="col-md-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter amount"
                                            value={contributionAmount}
                                            onChange={(e) => setContributionAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-auto">
                                        <button className="btn btn-success" disabled={contributing}>
                                            {contributing ? 'Processing...' : 'Donate'}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowContributionForm(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <button className="btn-login" onClick={() => setShowContributionForm(true)}>
                                Contribute Now
                            </button>
                        )}

                        <div className="mt-4">
                            <h5>About</h5>
                            <p>{campaign.description}</p>
                        </div>

                        <div className="mt-3 border-top pt-3">
                            <h6>Campaign Info</h6>
                            <p><strong>Created:</strong> {new Date(campaign.createdAt).toLocaleDateString()}</p>
                            <p><strong>Ends:</strong> {new Date(campaign.endAt).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {campaign.status}</p>
                        </div>

                        <div className="mt-4">
                            <CampaignComments campaignId={campaign.id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
