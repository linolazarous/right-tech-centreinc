import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

const AdBanner = ({ userId }) => {
  const [adContent, setAdContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ads?userId=${userId}`);
        setAdContent(response.data.content);
        setError(null);
      } catch (error) {
        console.error("Error fetching ad:", error);
        setError("Failed to load ad content");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [userId]);

  if (loading) return <div className="ad-banner loading">Loading ad...</div>;
  if (error) return <div className="ad-banner error">{error}</div>;

  return (
    <div className="ad-banner">
      <h3>Personalized Ad</h3>
      <p>{adContent}</p>
    </div>
  );
};

AdBanner.propTypes = {
  userId: PropTypes.string.isRequired
};

export default AdBanner;
