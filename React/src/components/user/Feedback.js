import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(parseInt(id));
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID missing");
      return;
    }

    const feedbackData = {
      userId,
      message,
      rating,
    };

    try {
      const res = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (res.ok) {
        setSubmitted(true);
        setMessage('');
        setRating(0);
        setHover(0);
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "3rem" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Feedback</h3>
        {submitted ? (
          <p className="text-success text-center">Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-control"
                rows="4"
                required
              />
            </div>

            <div className="mb-3 text-center">
              <label className="form-label d-block">Rating</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: 'pointer',
                    color: (hover || rating) >= star ? '#ffc107' : '#e4e5e9',
                    transition: 'color 200ms',
                  }}
                  fill={(hover || rating) >= star ? '#ffc107' : 'none'}
                />
              ))}
            </div>

            <button type="submit" className="btn">Submit Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
}
