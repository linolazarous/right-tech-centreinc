import React, { useState } from "react";
import axios from "axios";

const Subscription = ({ userId }) => {
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = () => {
    axios.get(`/api/subscriptions/${userId}`)
      .then((response) => setSubscriptions(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  return (
    <div>
      <h1>Subscriptions</h1>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription.id}>
            <p>Plan: {subscription.plan}</p>
            <p>Duration: {subscription.duration} months</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscription;