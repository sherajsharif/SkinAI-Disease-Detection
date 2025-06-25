import React, { useState } from 'react';
import medicines from '../data/medicines';
import './Medicine.css';

function Medicine() {
  const [filter, setFilter] = useState('');

  // Get unique disease names for filter dropdown
  const diseaseOptions = Array.from(new Set(medicines.map(m => m['Disease Name'])));

  const filtered = filter
    ? medicines.filter(m => m['Disease Name'] === filter)
    : medicines;

  return (
    <div className="medicine-bg">
      <div className="medicine-header">
        <h1 className="medicine-title">Supplements <span role="img" aria-label="pill">💊</span></h1>
        <p className="medicine-subtitle">Buy supplements & medicine for skin diseases at one place</p>
        <div className="medicine-filter">
          <label htmlFor="disease-filter">Filter by Disease:</label>
          <select
            id="disease-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All</option>
            {diseaseOptions.map((d, idx) => (
              <option value={d} key={idx}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="medicine-grid">
        {filtered.map((med, idx) => (
          <div className="medicine-card animated-fade-in" key={idx}>
            <img src={med['Medicine Image']} alt={med['Medicine Name']} className="medicine-img" />
            <div className="medicine-name">{med['Medicine Name']}</div>
            <div className="medicine-disease">For: {med['Disease Name']}</div>
            <a href={med['Buy Link']} target="_blank" rel="noopener noreferrer" className="medicine-link">Buy/Info</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Medicine; 
