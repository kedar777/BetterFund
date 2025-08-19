import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function NewRequest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formInput, setFormInput] = useState({
        description: '',
        value: '',
        recipient: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Creating request:', formInput);

            // API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Request created successfully!');
            navigate(`/campaign/${id}/requests`);
        } catch (error) {
            console.error('Error creating request:', error);
            alert('Failed to create request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    Create a New Request
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={formInput.description}
                            onChange={handleInput}
                            className="form-textarea"
                            placeholder="Enter request description"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (₹)</label>
                        <input
                            type="number"
                            name="value"
                            value={formInput.value}
                            onChange={handleInput}
                            className="form-input"
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Recipient Address</label>
                        <input
                            type="text"
                            name="recipient"
                            value={formInput.recipient}
                            onChange={handleInput}
                            className="form-input"
                            placeholder="Enter recipient address"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(`/campaign/${id}/requests`)}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn"
                            style={{ flex: 1 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 