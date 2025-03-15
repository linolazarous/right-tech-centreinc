import React, { useState } from "react";
import axios from "axios";

const Metaverse = () => {
  const [campusName, setCampusName] = useState("");
  const [campus, setCampus] = useState(null);

  const createCampus = async () => {
    try {
      const response = await axios.post("/api/metaverse/create", {
        campusName,
      });
      setCampus(response.data);
    } catch (error) {
      console.error("Error creating campus:", error);
    }
  };

  return (
    <div>
      <h1>Create Virtual Campus</h1>
      <input
        type="text"
        placeholder="Campus Name"
        value={campusName}
        onChange={(e) => setCampusName(e.target.value)}
      />
      <button onClick={createCampus}>Create Campus</button>
      {campus && <pre>{JSON.stringify(campus, null, 2)}</pre>}
    </div>
  );
};

export default Metaverse;