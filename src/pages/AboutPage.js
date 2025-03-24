import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicrophone, FaLaptopCode, FaLock, FaUserFriends, FaGlobe, FaCloud, FaRocket, FaUserCog } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h1 className="display-5 mb-3">About VoxScribe</h1>
        <p className="lead">A powerful local transcription tool.</p>
      </div>
      
      <div className="row mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h2 className="h3 mb-4">Our Story</h2>
          <p>
            VoxScribe was created to provide an accessible, privacy-focused solution for audio transcription without requiring an internet connection or sending sensitive data to the cloud.
          </p>
          <p>
            Built on the powerful Whisper model, VoxScribe brings state-of-the-art speech recognition technology directly to your device. 
            This approach ensures your data stays private while still delivering high-quality transcriptions.
          </p>
          <p>
            Our mission is to make audio transcription accessible to everyone, from students and researchers to professionals and content creators, all with a focus on privacy and ease of use.
          </p>
        </div>
        
        <div className="col-lg-6">
          <h2 className="h3 mb-4">Core Values</h2>
          
          <div className="d-flex mb-3">
            <div className="me-3">
              <FaLaptopCode size={24} className="text-primary" />
            </div>
            <div>
              <h5>Local-First Processing</h5>
              <p>All transcription happens directly on your device, with no data sent to external servers.</p>
            </div>
          </div>
          
          <div className="d-flex mb-3">
            <div className="me-3">
              <FaLock size={24} className="text-primary" />
            </div>
            <div>
              <h5>Privacy by Design</h5>
              <p>We designed VoxScribe with privacy as a fundamental principle, not an afterthought.</p>
            </div>
          </div>
          
          <div className="d-flex mb-3">
            <div className="me-3">
              <FaMicrophone size={24} className="text-primary" />
            </div>
            <div>
              <h5>High-Quality Transcription</h5>
              <p>Leveraging the latest in speech recognition technology to provide accurate transcriptions.</p>
            </div>
          </div>
          
          <div className="d-flex">
            <div className="me-3">
              <FaUserFriends size={24} className="text-primary" />
            </div>
            <div>
              <h5>User-Centered Design</h5>
              <p>Our interface is designed to be intuitive, accessible, and enjoyable to use.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h2 className="h3 mb-4">How It Works</h2>
              
              <ol className="list-group list-group-numbered mb-4">
                <li className="list-group-item border-0 bg-transparent">
                  <div className="fw-bold">Load Your Audio</div>
                  Upload your audio file through our simple interface.
                </li>
                <li className="list-group-item border-0 bg-transparent">
                  <div className="fw-bold">Local Processing</div>
                  Our application processes the audio locally using a lightweight version of the Whisper model.
                </li>
                <li className="list-group-item border-0 bg-transparent">
                  <div className="fw-bold">Review Results</div>
                  The transcription appears on screen, ready for you to review and use.
                </li>
                <li className="list-group-item border-0 bg-transparent">
                  <div className="fw-bold">Export and Share</div>
                  Download your transcription in the format of your choice (Pro tier offers more options).
                </li>
              </ol>
              
              <div className="text-center">
                <Link to="/transcribe" className="btn btn-primary">
                  Try It Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="h3 mb-4">Future Considerations</h2>
          
          <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <FaGlobe className="text-primary me-3" size={24} />
                    <h5 className="card-title mb-0">Language Expansion</h5>
                  </div>
                  <p className="card-text">
                    While our MVP focuses on English transcription, future versions will expand to support multiple languages and dialects, making VoxScribe accessible to a global audience.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <FaCloud className="text-primary me-3" size={24} />
                    <h5 className="card-title mb-0">Cloud Sync/Backup</h5>
                  </div>
                  <p className="card-text">
                    Future versions will include optional cloud backup and synchronization features, allowing users to securely store and access their transcriptions across multiple devices.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <FaRocket className="text-primary me-3" size={24} />
                    <h5 className="card-title mb-0">Performance Enhancements</h5>
                  </div>
                  <p className="card-text">
                    We plan to optimize the transcription engine and UI for faster processing, reduced memory usage, and improved accuracy, including support for larger and more complex audio files.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <FaUserCog className="text-primary me-3" size={24} />
                    <h5 className="card-title mb-0">User Account Management</h5>
                  </div>
                  <p className="card-text">
                    For Pro users, we'll implement local user management and licensing mechanisms, as well as team collaboration features for businesses and organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h2 className="h3 mb-0">The Full VoxScribe Vision</h2>
            </div>
            <div className="card-body">
              <p>
                While this MVP demonstrates the core functionality of VoxScribe, our vision for the fully implemented application includes:
              </p>
              
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">
                  <strong>Enhanced Transcription Engine:</strong> Utilizing larger, more accurate Whisper models with optimized performance for desktop environments.
                </li>
                <li className="list-group-item">
                  <strong>Real-time Transcription:</strong> Support for live audio input from microphones and other sources with instant transcription feedback.
                </li>
                <li className="list-group-item">
                  <strong>Advanced Editing Tools:</strong> Built-in text editor with spell check, formatting options, and the ability to correct transcription errors easily.
                </li>
                <li className="list-group-item">
                  <strong>Customizable AI:</strong> Train the model on your specific vocabulary, technical terms, or accents to improve accuracy for your unique needs.
                </li>
                <li className="list-group-item">
                  <strong>Transcription Projects:</strong> Organize multiple related audio files into projects, with shared vocabularies and settings.
                </li>
                <li className="list-group-item">
                  <strong>True Speaker Recognition:</strong> Accurately distinguish between different speakers in meetings or interviews.
                </li>
                <li className="list-group-item">
                  <strong>Advanced Export Options:</strong> Export to various formats with customized styling, timestamps, and speaker labeling.
                </li>
                <li className="list-group-item">
                  <strong>Integration Capabilities:</strong> Connect with popular word processors, note-taking apps, and productivity tools.
                </li>
              </ul>
              
              <p>
                Our goal is to create the most powerful local transcription tool available, one that respects user privacy while delivering professional-grade results comparable to cloud-based alternatives.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-5">
        <h2 className="h3 mb-4">Frequently Asked Questions</h2>
        
        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                Is my data really processed locally?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Yes, all processing happens directly on your device. Your audio files are never sent to any external server, ensuring complete privacy.
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                What audio formats are supported?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                VoxScribe supports most common audio formats including MP3, WAV, M4A, FLAC, and OGG.
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                How accurate is the transcription?
              </button>
            </h2>
            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                VoxScribe uses a lightweight version of the Whisper model, which provides good accuracy for most clear audio. For optimal results, use high-quality recordings with minimal background noise.
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                What's the difference between Free and Pro plans?
              </button>
            </h2>
            <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                The Free plan offers basic transcription and text file download. The Pro plan adds batch processing, speaker recognition, advanced settings, and export to formats like PDF and DOCX.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 