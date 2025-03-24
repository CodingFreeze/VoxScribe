import React from 'react';
import { Link } from 'react-router-dom';
import { FaCrown, FaRocket, FaCog, FaUsers, FaFileExport, FaCheckCircle } from 'react-icons/fa';

const ProFeatures = ({ isPro }) => {
  const proFeatures = [
    {
      icon: <FaRocket className="text-primary" size={24} />,
      title: 'Batch Processing',
      description: 'Process multiple audio files at once, saving you time and effort. Perfect for handling large volumes of audio content.'
    },
    {
      icon: <FaCog className="text-primary" size={24} />,
      title: 'Advanced Settings',
      description: 'Fine-tune transcription parameters to optimize for accuracy vs. speed, depending on your specific needs.'
    },
    {
      icon: <FaUsers className="text-primary" size={24} />,
      title: 'Speaker Recognition',
      description: 'Automatically differentiate between speakers in your audio files, making multi-person transcriptions easier to follow.'
    },
    {
      icon: <FaFileExport className="text-primary" size={24} />,
      title: 'Multiple Export Formats',
      description: 'Export your transcriptions in various formats including PDF and DOCX, for easy sharing and integration with other tools.'
    }
  ];
  
  const pricingPlans = [
    {
      title: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic audio transcription',
        'Download as text file',
        'Single file processing',
        'Basic UI for transcription'
      ],
      button: {
        text: 'Current Plan',
        class: 'btn-outline-secondary disabled'
      },
      badge: 'free-badge'
    },
    {
      title: 'Pro',
      price: '$9.99',
      period: 'per month',
      features: [
        'Everything in Free plan',
        'Batch processing',
        'Speaker recognition',
        'Advanced settings',
        'Multiple export formats (PDF, DOCX)'
      ],
      button: {
        text: isPro ? 'Current Plan' : 'Upgrade Now',
        class: isPro ? 'btn-outline-primary disabled' : 'btn-accent'
      },
      badge: 'pro-badge'
    }
  ];
  
  return (
    <div className="container">
      <div className="text-center mb-5">
        <FaCrown className="text-warning mb-3" size={48} />
        <h1 className="display-5 mb-3">VoxScribe Pro Features</h1>
        <p className="lead">Unlock advanced capabilities for your transcription needs</p>
      </div>
      
      <div className="row mb-5">
        {proFeatures.map((feature, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card h-100 feature-card">
              <div className="card-body">
                <div className="d-flex mb-3">
                  {feature.icon}
                  <h3 className="h5 ms-3 mb-0 d-flex align-items-center">{feature.title}</h3>
                </div>
                <p className="card-text">{feature.description}</p>
                {!isPro && (
                  <div className="text-end">
                    <span className="pro-badge">PRO</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mb-5">
        <h2>Choose Your Plan</h2>
        <p className="text-muted">Select the plan that best suits your needs</p>
      </div>
      
      <div className="row justify-content-center mb-5">
        {pricingPlans.map((plan, index) => (
          <div className="col-md-6 col-lg-5 mb-4" key={index}>
            <div className={`card h-100 ${plan.title === 'Pro' ? 'shadow border-0' : ''}`}>
              <div className="card-header bg-transparent text-center py-4">
                <span className={plan.badge}>{plan.title}</span>
                <h3 className="my-3">{plan.price}</h3>
                <p className="text-muted mb-0">{plan.period}</p>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  {plan.features.map((feature, i) => (
                    <li className="mb-3 d-flex align-items-center" key={i}>
                      <FaCheckCircle className="text-success me-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer bg-transparent text-center py-4">
                {plan.title === 'Pro' ? (
                  <button 
                    className={`btn ${plan.button.class}`}
                    onClick={() => {
                      if (!isPro) {
                        // In a real app, this would open a payment dialog
                        alert('This is a demo. In a real app, this would redirect to a payment page.');
                      }
                    }}
                    disabled={isPro}
                  >
                    {plan.button.text}
                  </button>
                ) : (
                  <Link to="/transcribe" className="btn btn-outline-secondary">
                    Start Using
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mb-5">
        <p className="text-muted">
          <small>VoxScribe Pro works entirely offline. No data is sent to our servers. All processing happens locally on your device.</small>
        </p>
      </div>
    </div>
  );
};

export default ProFeatures; 