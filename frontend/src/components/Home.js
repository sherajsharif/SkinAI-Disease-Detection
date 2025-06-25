import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Home.css';

const API_URL = `${process.env.REACT_APP_API_URL}/api/diseases`;

function Home() {
  const [diseases, setDiseases] = useState([]);
  const aiEngineRef = useRef(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setDiseases(res.data))
      .catch(() => setDiseases([]));
  }, []);

  const handleCardClick = (disease) => {
    // Scroll to AI Engine section if present
    const aiSection = document.getElementById('ai-engine-section');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Optionally highlight or set selected disease
  };

  return (
    <div className="home-bg">
      <div className="home-header">
        <h1 className="home-title">Skin Disease Detection</h1>
        <p className="home-subtitle">This AI Engine will help to detect disease from the following skin conditions</p>
      </div>
      <div className="disease-grid">
        {diseases.map((disease, idx) => (
          <div className="disease-card animated-fade-in" key={idx} onClick={() => handleCardClick(disease)}>
            <img src={disease.image_url} alt={disease.disease_name} className="disease-img" />
            <div className="disease-name">{disease.disease_name.replace(/^[A-Z]+-\s*/, '')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home; 
