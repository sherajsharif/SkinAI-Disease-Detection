import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import medicines from '../data/medicines';
import diseases from '../data/diseases';
import './AIEngine.css';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Disease name should be passed via location.state.disease or fallback to query param
  const detectedDisease = location.state?.disease || new URLSearchParams(window.location.search).get('disease');

  if (!detectedDisease) {
    // If no disease info, redirect to AI Engine
    navigate('/ai-engine');
    return null;
  }

  const diseaseInfo = diseases.find(d => d.name.toLowerCase() === detectedDisease.toLowerCase());
  const recommendedMeds = medicines.filter(m => m['Disease Name'].toLowerCase().includes(detectedDisease.toLowerCase()));

  let medsToShow = recommendedMeds;
  if (recommendedMeds.length === 0) {
    medsToShow = medicines.length > 0 ? [medicines[0]] : [];
  }

  return (
    <div className="ai-bg">
      <div className="ai-card">
        <div className="ai-result-card animated-fade-in mt-4">
          <h2 className="ai-result-title">Disease: <span className="badge bg-success ms-2">{diseaseInfo?.name || detectedDisease}</span></h2>
          <div className="ai-result-layout">
            {/* Disease Image and Description */}
            <div className="ai-result-main">
              {diseaseInfo?.image && (
                <img src={diseaseInfo.image} alt={diseaseInfo.name} className="disease-info-img" />
              )}
              <h4 className="disease-info-title">{diseaseInfo?.name || detectedDisease}</h4>
              <p className="disease-info-desc">{diseaseInfo?.description || 'No description available.'}</p>
              {diseaseInfo?.steps && (
                <div className="disease-info-steps">
                  <strong>Prevention:</strong>
                  <ul>
                    {diseaseInfo.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Medicine Section */}
            <div className="medicine-section mt-4">
              <h5>Recommended Medicines:</h5>
              <div className="medicine-grid">
                {medsToShow.map((med, idx) => (
                  <div className="medicine-card" key={idx}>
                    <img src={med['Medicine Image']} alt={med['Medicine Name']} className="medicine-img" />
                    <div className="medicine-name">{med['Medicine Name']}</div>
                    <a href={med['Buy Link']} target="_blank" rel="noopener noreferrer" className="medicine-link">Buy/Info</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage; 