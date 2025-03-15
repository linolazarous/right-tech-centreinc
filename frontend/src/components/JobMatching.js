import React, { useEffect, useState } from "react";
import axios from "axios";

const JobMatching = ({ userId }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/api/jobs?userId=${userId}`);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [userId]);

  return (
    <div className="job-matching">
      <h3>Job Matches</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobMatching;