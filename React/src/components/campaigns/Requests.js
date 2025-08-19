import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Requests() {
    const { id } = useParams();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with API call to get requests
        setRequests([
            {
                id: 1,
                description: 'Medical supplies for emergency',
                value: 5000,
                recipient: '0x1234567890abcdef',
                complete: false,
                approvalCount: 3,
                finalize: false,
            },
            {
                id: 2,
                description: 'Food distribution program',
                value: 3000,
                recipient: '0x1234567890abcdef',
                complete: false,
                approvalCount: 2,
                finalize: false,
            },
        ]);
        setIsLoading(false);
    }, [id]);

    const handleApprove = async (requestId) => {
        try {
            // TODO: Replace with API call to approve request
            console.log('Approving request:', requestId);
            alert('Request approved successfully!');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request. Please try again.');
        }
    };

    const handleFinalize = async (requestId) => {
        try {
            console.log('Finalizing request:', requestId);
            alert('Request finalized successfully!');
        } catch (error) {
            console.error('Error finalizing request:', error);
            alert('Failed to finalize request. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <Link to={`/campaign/${id}`} className="btn btn-secondary" style={{ marginRight: '1rem' }}>
                    ← Back to Campaign
                </Link>
                <Link to={`/campaign/${id}/requests/new`} className="btn">
                    Create Request
                </Link>
            </div>

            <h1 style={{ marginBottom: '2rem' }}>Campaign Requests</h1>

            {requests.length > 0 ? (
                <div className="grid">
                    {requests.map((request) => (
                        <div key={request.id} className="card">
                            <div className="card-content">
                                <h3 className="card-title">Request #{request.id}</h3>
                                <p className="card-description">{request.description}</p>

                                <div style={{ marginBottom: '1rem' }}>
                                    <p><strong>Amount:</strong> ₹{request.value.toLocaleString()}</p>
                                    <p><strong>Recipient:</strong> {request.recipient}</p>
                                    <p><strong>Approvals:</strong> {request.approvalCount}</p>
                                    <p><strong>Status:</strong> {request.complete ? 'Completed' : 'Pending'}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {!request.complete && (
                                        <button
                                            onClick={() => handleApprove(request.id)}
                                            className="btn btn-secondary"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {!request.complete && request.approvalCount > 0 && (
                                        <button
                                            onClick={() => handleFinalize(request.id)}
                                            className="btn"
                                        >
                                            Finalize
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="card-content">
                        <h3>No requests found</h3>
                        <p>This campaign doesn't have any spending requests yet.</p>
                    </div>
                </div>
            )}
        </div>
    );
} 