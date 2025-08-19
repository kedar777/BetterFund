import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NewCampaign() {
    const navigate = useNavigate();

    const [formInput, setFormInput] = useState({
        name: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
        target: ""
    });

    const [documentFile, setDocumentFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Check if user is logged in when component mounts
    useEffect(() => {
        const checkLoginStatus = () => {
            const loginStatus = localStorage.getItem('userLoggedIn') === 'true';
            const userId = localStorage.getItem('userId');
            
            console.log("Login status:", loginStatus, "User ID:", userId);
            
            // User must be logged in AND have a userId
            if (loginStatus && userId) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setIsCheckingAuth(false);
        };

        checkLoginStatus();

        // Listen for login status changes
        const handleLoginStatusChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('loginStatusChanged', handleLoginStatusChange);
        
        return () => {
            window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
        };
    }, []);

    const handleInput = (e) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            e.target.value = "";
            setDocumentFile(null);
            return;
        }
        setDocumentFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Double-check authentication before submitting
        const userId = localStorage.getItem("userId");
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (!userLoggedIn || !userId) {
            alert("You must be logged in to create a campaign. Please log in first.");
            navigate('/login');
            return;
        }

        setIsLoading(true);

        // 🚫 Validation for past start date
        if (formInput.startDate < today) {
            alert("Start date cannot be in the past.");
            setIsLoading(false);
            return;
        }

        // 🚫 End date must be >= start date
        if (formInput.endDate < formInput.startDate) {
            alert("End date cannot be before start date.");
            setIsLoading(false);
            return;
        }

        const categoryMap = {
            Medical: 1,
            Natural: 2,
            Education: 3,
            Community: 4
        };

        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("title", formInput.name);
            formData.append("description", formInput.description);
            formData.append("categoryId", categoryMap[formInput.category]);
            formData.append("startDate", formInput.startDate);
            formData.append("endDate", formInput.endDate);
            formData.append("targetAmt", formInput.target);
            formData.append("documentFile", documentFile);

            const response = await fetch("http://localhost:8080/api/campaign/create", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Server Error");

            alert("Campaign created successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error creating campaign:", error);
            alert("Failed to create campaign. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h3>Checking authentication...</h3>
            </div>
        );
    }

    // Show login prompt if user is not logged in
    if (!isLoggedIn) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <div className="card-content">
                        <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Login Required</h2>
                        <p style={{ color: '#718096', marginBottom: '2rem' }}>
                            You need to be logged in to create a campaign. Please log in to continue.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/login" className="btn-login">
                                Log In
                            </Link>
                            <Link to="/register" className="btn-login">
                                Sign Up
                            </Link>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Link to="/" style={{ color: '#3182ce', textDecoration: 'none' }}>
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show the campaign creation form if user is logged in
    return (
        <div className="container">
            <h2>Create New Campaign</h2>
            <form onSubmit={handleSubmit} className="form">

                <div className="form-group">
                    <label className="form-label">Campaign Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formInput.name}
                        onChange={handleInput}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={formInput.description}
                        onChange={handleInput}
                        className="form-input"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                        name="category"
                        value={formInput.category}
                        onChange={handleInput}
                        className="form-input"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Community">Community</option>
                        <option value="Education">Education</option>
                        <option value="Medical">Medical</option>
                        <option value="Natural">Natural</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formInput.startDate}
                        onChange={handleInput}
                        className="form-input"
                        min={today} // ✅ Prevent past dates
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formInput.endDate}
                        onChange={handleInput}
                        className="form-input"
                        min={formInput.startDate || today} // ✅ Prevent before start date
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Target Amount</label>
                    <input
                        type="number"
                        name="target"
                        value={formInput.target}
                        onChange={handleInput}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Upload Document</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="form-input"
                        required
                    />
                </div>

                <button type="submit" className="btn-login" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Campaign"}
                </button>
            </form>
        </div>
    );
}