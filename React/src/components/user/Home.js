import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthStorage } from '../auth/auth';
// Unified Card component for both Campaign and Success Story
function UnifiedCard(props) {
  const isCampaign = props.hasOwnProperty('balance');
  const progressPercentage = isCampaign && props.target > 0 ? (props.balance / props.target) * 100 : null;
  return (
    <div className="card unified-card">
      {/* Only show image for success stories, not for campaigns */}
      {!isCampaign && props.imageURL && (
        <div className="card-image-wrapper">
          <img
            src={props.imageURL}
            alt="success story"
            className="card-image"
          />
        </div>
      )}
      <div
        className="card-content unified-card-content"
        style={{
          minHeight: '260px',
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {isCampaign && (
            <div className="card-category-row">
              <span className="card-category-badge" style={{ background: getCategoryColor(props.category) }}>
                {props.category}
              </span>
            </div>
          )}
          <h3 className="card-title">{isCampaign ? props.name : props.title}</h3>
          <p className="card-description">{isCampaign ? props.description : props.description}</p>
          {isCampaign ? (
            <>
              <p className="card-raised"><strong>₹{props.balance.toLocaleString()}</strong> raised</p>
              <p className="card-target">Target: ₹{props.target.toLocaleString()}</p>
              <div className="card-progress">
                <div
                  className="card-progress-bar"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="card-creator">by {props.creatorId}</p>
            </>
          ) : (
            <>
              <p className="card-success-creator">Creator: {props.userName}</p>
              <p className="card-success-dates">{props.startDate} – {props.endDate}</p>
              <p className="card-success-fund">Fund Raised: {props.fundRaised}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


// Category color mapping
const getCategoryColor = (category) => {
  const colors = {
    'Medical': '#e53e3e',
    'Education': '#3182ce',
    'Personal': '#805ad5',
    'Community': '#38a169',
    'Natural Disaster': '#d69e2e',
  };
  return colors[category] || '#718096';
};

// How it works card component
const Feature = ({ title, text, icon }) => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div style={{
      width: '64px',
      height: '64px',
      margin: '0 auto 1rem',
      background: '#e2e8f0',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem'
    }}>
      {icon}
    </div>
    <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>{title}</h3>
    <p style={{ color: '#718096' }}>{text}</p>
  </div>
);

export default function Home() {
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [successStories, setSuccessStories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Carousel index for success stories (start index for 3 visible)
  const [storyIndex, setStoryIndex] = useState(0);
  // Carousel index for campaigns (start index for 3 visible)
  const [campaignIndex, setCampaignIndex] = useState(0);
  
    useEffect(() => {
      // Use the proper auth system to check login status
      const loginStatus = AuthStorage.isLoggedIn();
      console.log("User logged in status:", loginStatus); // Debug log
      setIsLoggedIn(loginStatus);
  
      // Listen for login status changes
      const handleLoginStatusChange = () => {
        const newStatus = AuthStorage.isLoggedIn();
        console.log("Login status changed:", newStatus);
        setIsLoggedIn(newStatus);
      };
  
      window.addEventListener('loginStatusChanged', handleLoginStatusChange);
      
      // Cleanup event listener
      return () => {
        window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
      };
    }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/campaign/active")
      .then(res => res.json())
      .then(data => {
        let formatted = [];
        if (Array.isArray(data) && data.length > 0) {
          formatted = data.map(c => {
            const categoryName = c.category?.cname || 'Uncategorized';
            return {
              id: c.campaignId,
              name: c.title,
              description: "Help support this cause with your contribution.",
              creatorId: c.user?.username || 'Unknown',
              imageURL: '/placeholder.jpg',
              target: c.targetAmt || 0,
              balance: c.wallet?.amount || 0,
              category: categoryName
            };
          });
        }
        setCampaignList(formatted);
      })
      .catch(err => {
        console.error("Error fetching campaigns:", err);
        setCampaignList([]);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/successstories")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched success stories:", data);
        const formatted = data.map(story => ({
          id: story.successId,
          userName: story.userName,
          title: story.campaignTitle,
          startDate: new Date(story.campaignStartDate).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          }),
          endDate: new Date(story.campaignEndDate).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          }),
          fundRaised: `₹${story.fundRaised?.toLocaleString() || 0}`,
          description: story.updates,
          imageURL: `http://localhost:8080${story.imageURL}`
        }));
        setSuccessStories(formatted);
      })
      .catch(err => {
        console.error("Error fetching success stories:", err);
        setSuccessStories([]);
      });
  }, []);

  const categories = ['All', ...new Set(campaignList.map(c => c.category))];

  const filteredCampaigns = selectedCategory === 'All'
    ? campaignList
    : campaignList.filter(campaign =>
        campaign.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div>
      {/* Banner Section */}
      <div className="container" style={{ width: '100%', background: 'linear-gradient(90deg, #e6fffa 0%, #f7fafc 100%)', padding: '2.5rem 0 1.5rem 0', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/BetterFundLogo.png"
          alt="BetterFund Banner"
          style={{ maxWidth: 200, width: '100%', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(44,122,123,0.10)' }}
        />
        <h2 style={{ fontSize: '2.2rem', color: '#2d3748', marginBottom: '0.5rem', textAlign: 'center' }}>
          Need Funds to Pay For a Medical Emergency or Social Cause?
        </h2>
        <div style={{ margin: '1.5rem 0' }}>
          <Link to="/campaign/new" className="btn" style={{ fontSize: 20, padding: '0.8rem 2.5rem', borderRadius: 8, background: '#2c7a7b', color: '#fff', fontWeight: 600, boxShadow: '0 2px 8px rgba(44,122,123,0.10)' }}>
            Start a Fundraiser for FREE
          </Link>
        </div>
        <div style={{ color: '#2d3748', fontWeight: 500, fontSize: '1.1rem', marginTop: 8 }}>
          BetterFund’s <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2c7a7b' }}>0%</span> Platform fees* ensures maximum funds for you
        </div>
      </div>

      <div className="container">
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#2d3748'
        }}>
          Open Campaigns
        </h2>

        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => { setSelectedCategory(category); setCampaignIndex(0); }}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '2rem',
                background: selectedCategory === category ? getCategoryColor(category) : '#e2e8f0',
                color: selectedCategory === category ? 'white' : '#4a5568',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredCampaigns.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCampaignIndex((prev) => prev === 0 ? Math.max(filteredCampaigns.length - 3, 0) : prev - 1)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#2c7a7b',
                padding: '0 0.5rem'
              }}
              aria-label="Previous Campaigns"
              disabled={filteredCampaigns.length <= 3}
            >
              &#8592;
            </button>
            <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'center' }}>
              {filteredCampaigns.slice(campaignIndex, campaignIndex + 3).map((el, i) => (
                <Link to={`/campaign/${el.id}`} style={{ textDecoration: 'none' }} key={el.id || i}>
                  <UnifiedCard {...el} />
                </Link>
              ))}
            </div>
            <button
              onClick={() => setCampaignIndex((prev) => prev + 1 >= filteredCampaigns.length - 2 ? 0 : prev + 1)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#2c7a7b',
                padding: '0 0.5rem'
              }}
              aria-label="Next Campaigns"
              disabled={filteredCampaigns.length <= 3}
            >
              &#8594;
            </button>
          </div>
        ) : (
          <div className="grid">
            <div className="card">
              <div className="card-content">
                <h3>No campaigns in this category</h3>
                <p>Try selecting a different category or be the first to create a campaign in this category!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Stories Section */}
      <div className="container" style={{ marginTop: '4rem', maxWidth: 1200, textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#2d3748'
        }}>
          Success Stories
        </h2>

        {successStories.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => setStoryIndex((prev) => prev === 0 ? Math.max(successStories.length - 3, 0) : prev - 1)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#2c7a7b',
                padding: '0 0.5rem'
              }}
              aria-label="Previous Stories"
              disabled={successStories.length <= 3}
            >
              &#8592;
            </button>
            <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'center' }}>
              {successStories.slice(storyIndex, storyIndex + 3).map((story, idx) => (
                <UnifiedCard key={story.id || idx} {...story} />
              ))}
            </div>
            <button
              onClick={() => setStoryIndex((prev) => prev + 1 >= successStories.length - 2 ? 0 : prev + 1)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#2c7a7b',
                padding: '0 0.5rem'
              }}
              aria-label="Next Stories"
              disabled={successStories.length <= 3}
            >
              &#8594;
            </button>
          </div>
        ) : (
          <p style={{ color: '#718096' }}>No success stories found.</p>
        )}
      </div>

      <div className="container" id="howitworks">
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#2d3748'
        }}>
          How BetterFund Works
        </h2>
        <div className="grid">
          <Feature
            icon="📢"
            title="Create a Campaign for Fundraising"
            text="It'll take only 2 minutes. Just enter a few details about the funds you are raising for."
          />
          <Feature
            icon="📤"
            title="Share your Campaign"
            text="All you need to do is share the Campaign with your friends, family and others. In no time, support will start pouring in."
          />
          <Feature
            icon="💰"
            title="Request and Withdraw Funds"
            text="The funds raised can be withdrawn directly to the recipient when approved by the campaign creator and platform admins."
          />
        </div>

          {/* Only show feedback section if user is logged in */}
                 {isLoggedIn ? (
                   <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                     <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>
                       For any queries or suggestions:{' '}
                       <Link 
                         to="/feedback" 
                         className="cta-button"
                         style={{
                           marginLeft: '0.5rem',
                           color: '#3182ce',
                           textDecoration: 'underline'
                         }}
                       >
                         Give Feedback
                       </Link>
                     </h3>
                   </div>
                 ) : null}
      </div>
    </div>
  );
}
