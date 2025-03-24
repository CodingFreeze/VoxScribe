import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Transcribe from './pages/Transcribe';
import ProFeatures from './pages/ProFeatures';
import AboutPage from './pages/AboutPage';

// Utils
import { preloadFFmpeg } from './utils/ffmpegInit';
import { initWhisperModel } from './services/whisperService';

function App() {
  const [isPro, setIsPro] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [whisperLoaded, setWhisperLoaded] = useState(false);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [modelLoadError, setModelLoadError] = useState(null);

  useEffect(() => {
    // Make sure to initialize Bootstrap JS components
    if (typeof document !== 'undefined') {
      // Import Bootstrap JS
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
    
    // Attempt to preload FFmpeg in the background
    const loadFFmpeg = async () => {
      try {
        console.log('Starting FFmpeg preload');
        await preloadFFmpeg();
        console.log('FFmpeg loaded successfully');
        setFfmpegLoaded(true);
      } catch (error) {
        console.warn('FFmpeg preloading failed, will load on demand:', error);
      }
    };
    
    // Attempt to preload Whisper model in the background
    const loadWhisper = async () => {
      try {
        console.log('Starting Whisper model preload');
        const updateProgress = (progress) => {
          console.log(`Whisper model loading progress: ${progress.progress * 100}%`);
          if (progress.progress) {
            setModelLoadProgress(Math.round(progress.progress * 100));
          }
        };
        
        // Wrap in a try-catch to handle JSON parse errors specifically
        try {
          await initWhisperModel(updateProgress);
          console.log('Whisper model loaded successfully');
          setWhisperLoaded(true);
          setModelLoadProgress(100);
        } catch (parseError) {
          // Check if it's a JSON parse error
          if (parseError.toString().includes("Unexpected token '<'")) {
            console.error('JSON parsing error when loading model:', parseError);
            throw new Error('Network error loading model. This often happens on first load and should resolve on retry.');
          } else {
            throw parseError; // Re-throw if it's not a JSON parse error
          }
        }
      } catch (error) {
        console.error('Whisper model preloading failed:', error);
        setModelLoadError(error.message || 'Failed to load Whisper model');
        
        // Retry loading after a delay
        setTimeout(() => {
          console.log('Retrying Whisper model load');
          loadWhisper();
        }, 5000);
      }
    };
    
    // Start both loading processes
    loadFFmpeg();
    loadWhisper();
  }, []);

  const toggleProStatus = () => {
    setIsPro(!isPro);
  };

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header isPro={isPro} toggleProStatus={toggleProStatus} />
        
        {modelLoadProgress > 0 && modelLoadProgress < 100 && !whisperLoaded && (
          <div className="bg-info text-white py-1">
            <div className="container d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              <div className="flex-grow-1">
                Loading Whisper Transcription Model: {modelLoadProgress}%
                <div className="progress mt-1" style={{ height: '5px' }}>
                  <div 
                    className="progress-bar bg-white" 
                    role="progressbar" 
                    style={{ width: `${modelLoadProgress}%` }}
                    aria-valuenow={modelLoadProgress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {modelLoadError && (
          <div className="bg-warning text-dark py-1">
            <div className="container">
              <small>
                <strong>Note:</strong> {modelLoadError}. The app will use simulation mode for transcription.
                <button 
                  className="btn btn-sm btn-dark ms-2" 
                  onClick={() => {
                    setModelLoadError(null);
                    setModelLoadProgress(0);
                    initWhisperModel((progress) => {
                      setModelLoadProgress(Math.round(progress.progress * 100));
                    }).then(() => setWhisperLoaded(true))
                      .catch(err => setModelLoadError(err.message));
                  }}
                >
                  Retry Loading
                </button>
              </small>
            </div>
          </div>
        )}
        
        <main className="flex-grow-1 container py-4">
          <Routes>
            <Route path="/" element={<Home isPro={isPro} />} />
            <Route path="/transcribe" element={
              <Transcribe 
                isPro={isPro} 
                ffmpegLoaded={ffmpegLoaded} 
                whisperLoaded={whisperLoaded}
                modelLoadProgress={modelLoadProgress}
              />
            } />
            <Route path="/pro-features" element={<ProFeatures isPro={isPro} />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
