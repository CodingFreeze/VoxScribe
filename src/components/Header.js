import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaMicrophone, FaCrown } from 'react-icons/fa';

const Header = ({ isPro, toggleProStatus }) => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaMicrophone className="text-primary me-2" size={24} />
          <span className="fw-bold">VoxScribe</span>
          {isPro && (
            <span className="ms-2 pro-badge">PRO</span>
          )}
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/transcribe">
                Transcribe
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/pro-features">
                Pro Features
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
          </ul>
          
          <button 
            className={`btn ${isPro ? 'btn-outline-primary' : 'btn-accent'} d-flex align-items-center`}
            onClick={toggleProStatus}
          >
            <FaCrown className="me-1" />
            {isPro ? 'Cancel Pro' : 'Upgrade to Pro'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header; 