import React from 'react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {currentYear} VoxScribe. All rights reserved.</p>
            <small className="text-muted">Powered by local Whisper model</small>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <a href="https://github.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
              <FaGithub size={20} />
            </a>
            <a href="https://twitter.com" className="text-white" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 