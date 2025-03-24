import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicrophone, FaRocket, FaFileDownload, FaCog, FaUsers, FaFileExport } from 'react-icons/fa';

const Home = ({ isPro }) => {
  const features = [
    {
      icon: <FaMicrophone size={28} className="text-primary mb-3" />,
      title: 'Audio Transcription',
      description: 'Convert your audio files to text with high accuracy using our lightweight Whisper model.',
      isPro: false
    },
    {
      icon: <FaFileDownload size={28} className="text-primary mb-3" />,
      title: 'Download Transcripts',
      description: 'Download your transcriptions as plain text files for further use.',
      isPro: false
    },
    {
      icon: <FaCog size={28} className="text-primary mb-3" />,
      title: 'Advanced Settings',
      description: 'Adjust transcription parameters for optimal accuracy vs. speed tradeoff.',
      isPro: true
    },
    {
      icon: <FaRocket size={28} className="text-primary mb-3" />,
      title: 'Batch Processing',
      description: 'Process multiple audio files in one go with our powerful batch processing feature.',
      isPro: true
    },
    {
      icon: <FaUsers size={28} className="text-primary mb-3" />,
      title: 'Speaker Recognition',
      description: 'Basic speaker differentiation in your transcriptions.',
      isPro: true
    },
    {
      icon: <FaFileExport size={28} className="text-primary mb-3" />,
      title: 'Multiple Export Formats',
      description: 'Export your transcriptions in various formats including PDF and DOCX.',
      isPro: true
    }
  ];

  return (
    <div className="text-center">
      <div className="py-5 mb-5 bg-light rounded-3">
        <div className="container">
          <h1 className="display-5 fw-bold mb-4">Convert Speech to Text Locally</h1>
          <p className="fs-4 mb-4">VoxScribe uses a lightweight version of Whisper to transcribe audio files directly on your device - no internet required!</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/transcribe" className="btn btn-primary btn-lg px-4 gap-3">
              Start Transcribing
            </Link>
            {!isPro && (
              <Link to="/pro-features" className="btn btn-outline-secondary btn-lg px-4">
                Explore Pro Features
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="mb-4">Features</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className={`card h-100 feature-card ${feature.isPro && !isPro ? 'locked-feature' : ''}`}>
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    {feature.icon}
                    {feature.isPro && (
                      <span className="ms-2 pro-badge">PRO</span>
                    )}
                  </div>
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text">{feature.description}</p>
                  {feature.isPro && !isPro && (
                    <div className="mt-auto pt-2">
                      <Link to="/pro-features" className="btn btn-sm btn-outline-primary">
                        Upgrade to Access
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 