import React, { useRef } from 'react';
import diseases from '../data/diseases';
import './Home.css';

function Home() {
  const aiEngineRef = useRef(null);

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
            <img src={disease.image} alt={disease.name} className="disease-img" />
            <div className="disease-name">{disease.name.replace(/^[A-Z]+-\s*/, '')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home; 
