import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/candidates/${id}`, {
        headers : {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((response) => {
        setCandidate(response.data);
      })
      .catch((error) => {
        console.error('Error fetching candidate:', error);
      });
  }, [id]);

  if (!candidate) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{`${candidate.firstName} ${candidate.lastName}`}</h1>
      <p>Date of Birth: {candidate.dob}</p>
      <p>State of Residency: {candidate.state}</p>
      <p>Description: {candidate.description}</p>
      {/* Render additional candidate details as needed */}
      <Link to="/candidates" style={{ color: '#fe920072' }}>Go Back</Link>
    </div>
  );
}

export default CandidateProfile;
