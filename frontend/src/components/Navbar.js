import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="custom-navbar-horizontal">
      <div className="navbar-content">
        <Link className="navbar-brand" to="/">
          <span role="img" aria-label="leaf">🧑‍⚕️</span> <span>SkinAI</span>
        </Link>
        <ul className="navbar-links">
          <li>
            <Link className={`nav-link${location.pathname === '/' ? ' active' : ''}`} to="/">Home</Link>
          </li>
          <li>
            <Link className={`nav-link${location.pathname === '/ai-engine' ? ' active' : ''}`} to="/ai-engine">AI Engine</Link>
          </li>
          <li>
            <Link className={`nav-link${location.pathname === '/medicine' ? ' active' : ''}`} to="/medicine">Medicine</Link>
          </li>
          <li>
            <Link className={`nav-link${location.pathname === '/contact' ? ' active' : ''}`} to="/contact">Contact Us</Link>
          </li>
        </ul>
        {isAuthenticated && (
          <button className="btn-logout-arrow" onClick={handleLogout}>
            Logout
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 