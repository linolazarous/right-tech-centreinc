import React, { useEffect, useState } from "react";
import axios from "axios";

const VRCareerFair = ({ userId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/vr-events?userId=${userId}`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  return (
    <div className="vr-career-fair">
      <h3>VR Career Fairs</h3>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default VRCareerFair;