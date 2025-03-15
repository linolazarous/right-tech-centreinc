import React, { useEffect, useState } from "react";
import axios from "axios";

const AdBanner = ({ userId }) => {
  const [adContent, setAdContent] = useState("");

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(`/api/ads?userId=${userId}`);
        setAdContent(response.data.content);
      } catch (error) {
        console.error("Error fetching ad:", error);
      }
    };

    fetchAd();
  }, [userId]);

  return (
    <div className="ad-banner">
      <h3>Personalized Ad</h3>
      <p>{adContent}</p>
    </div>
  );
};

export default AdBanner;