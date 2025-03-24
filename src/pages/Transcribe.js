import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaUpload, FaFileDownload, FaCog, FaTimes, FaBrain } from 'react-icons/fa';
import { transcribeAudio, batchTranscribe, exportTranscription, getTranscriptionServiceStatus } from '../services/transcriptionService';
import { isAudioFile, formatFileSize, formatTime, downloadTextFile } from '../utils/fileUtils';
import { isFFmpegLoaded } from '../utils/ffmpegInit';

const Transcribe = ({ isPro, ffmpegLoaded, whisperLoaded, modelLoadProgress }) => {
  const [files, setFiles] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [error, setError] = useState('');
  const [ffmpegStatus, setFfmpegStatus] = useState(ffmpegLoaded);
  const [whisperStatus, setWhisperStatus] = useState({ 
    ready: whisperLoaded, 
    loading: modelLoadProgress > 0 && modelLoadProgress < 100, 
    error: null 
  });
  const [modelProgress, setModelProgress] = useState(modelLoadProgress || 0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [transcriptionOptions, setTranscriptionOptions] = useState({
    timestamps: false,
    speakerDiarization: false,
    highAccuracy: false
  });
  
  const fileInputRef = useRef(null);
  
  // Update FFmpeg status when prop changes
  useEffect(() => {
    setFfmpegStatus(ffmpegLoaded || isFFmpegLoaded());
  }, [ffmpegLoaded]);
  
  // Update Whisper status when props change
  useEffect(() => {
    setWhisperStatus(prev => ({
      ...prev,
      ready: whisperLoaded,
      loading: modelLoadProgress > 0 && modelLoadProgress < 100
    }));
    setModelProgress(modelLoadProgress || 0);
  }, [whisperLoaded, modelLoadProgress]);
  
  // Get Whisper status on component mount and periodically
  useEffect(() => {
    const checkStatus = async () => {
      const status = getTranscriptionServiceStatus();
      setWhisperStatus(status.whisper);
    };
    
    // Check immediately
    checkStatus();
    
    // Then check periodically
    const interval = setInterval(checkStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (!isPro && selectedFiles.length > 1) {
      setError('Batch processing is a Pro feature. Please upgrade or select a single file.');
      return;
    }
    
    const validFiles = selectedFiles.filter(file => isAudioFile(file));
    const invalidCount = selectedFiles.length - validFiles.length;
    
    if (invalidCount > 0) {
      setError(`${invalidCount} file(s) were not valid audio files and were removed.`);
    } else {
      setError('');
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };
  
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleTranscribe = async () => {
    if (files.length === 0) {
      setError('Please upload at least one audio file.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setModelProgress(0);
    setProcessingStatus('Preparing for transcription...');
    
    try {
      if (files.length === 1 || !isPro) {
        const fileToTranscribe = files[0];
        setCurrentFile(fileToTranscribe.name);
        setProcessingStatus(`Processing ${fileToTranscribe.name}...`);
        
        console.log('Starting transcription of file:', fileToTranscribe.name);
        
        const result = await transcribeAudio(fileToTranscribe, {
          ...transcriptionOptions,
          onProgress: (progress) => {
            console.log('Transcription progress:', progress);
            if (progress.progress) {
              setModelProgress(Math.round(progress.progress * 100));
              setProcessingStatus(`Transcribing ${fileToTranscribe.name}... ${Math.round(progress.progress * 100)}%`);
            }
          }
        });
        
        console.log('Transcription result:', result);
        
        if (result.success) {
          setTranscriptions([result]);
          if (result.usedRealModel) {
            setProcessingStatus('Transcription completed using Whisper model.');
          } else {
            setProcessingStatus('Transcription completed using simulation.');
          }
        } else {
          setError(result.error);
          setProcessingStatus('Transcription failed.');
        }
      } else if (isPro) {
        setProcessingStatus(`Processing ${files.length} files...`);
        
        const results = await batchTranscribe(files, {
          ...transcriptionOptions,
          onProgress: (progress) => {
            if (progress.progress) {
              setModelProgress(Math.round(progress.progress * 100));
              setProcessingStatus(`Transcribing files... ${Math.round(progress.progress * 100)}%`);
            }
          }
        });
        
        if (results.success) {
          setTranscriptions(results.data);
          const realModelCount = results.data.filter(r => r.usedRealModel).length;
          setProcessingStatus(`Transcription completed. ${realModelCount} of ${results.data.length} files used the real Whisper model.`);
        } else {
          setError(results.error);
          setProcessingStatus('Batch transcription failed.');
        }
      }
    } catch (err) {
      setError('An error occurred during transcription. Please try again.');
      setProcessingStatus('Transcription failed due to an error.');
      console.error('Transcription error:', err);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentFile(null);
        setModelProgress(0);
      }, 1000);
    }
  };
  
  const handleDownload = async (transcription, format = 'txt') => {
    if (!transcription) return;
    
    if (!isPro && format !== 'txt') {
      setError('Multiple export formats are a Pro feature. Please upgrade to access this feature.');
      return;
    }
    
    try {
      const result = await exportTranscription(transcription.data, format);
      
      if (result.success) {
        const filename = transcription.filename.replace(/\.[^/.]+$/, "");
        downloadTextFile(result.data, filename, format);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to download the transcription.');
      console.error(err);
    }
  };
  
  const resetTranscription = () => {
    setFiles([]);
    setTranscriptions([]);
    setError('');
    setProcessingStatus('');
  };
  
  const handleOptionChange = (option) => {
    if (!isPro && option !== 'timestamps') {
      setError(`${option === 'speakerDiarization' ? 'Speaker recognition' : 'High accuracy mode'} is a Pro feature. Please upgrade to access this feature.`);
      return;
    }
    
    setTranscriptionOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Render Whisper model status indicator
  const renderWhisperStatus = () => {
    if (whisperStatus.ready) {
      return (
        <span className="badge bg-success">
          <FaBrain className="me-1" /> Whisper Model Loaded
        </span>
      );
    } else if (whisperStatus.loading) {
      return (
        <span className="badge bg-warning text-dark">
          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
          Loading Whisper Model
        </span>
      );
    } else {
      return (
        <span className="badge bg-secondary">
          <FaBrain className="me-1" /> Using Simulation
        </span>
      );
    }
  };
  
  return (
    <div className="container">
      <h1 className="mb-4">Transcribe Audio</h1>
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            aria-label="Close"
            onClick={() => setError('')}
          ></button>
        </div>
      )}
      
      {!ffmpegStatus && (
        <div className="alert alert-info mb-4">
          <strong>Note:</strong> FFmpeg is loading in the background. This is used for audio conversion to improve transcription quality.
        </div>
      )}
      
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title">
                  <FaUpload className="me-2" />
                  Upload Audio Files
                </h5>
                {renderWhisperStatus()}
              </div>
              
              <div className="mb-3">
                <button 
                  className="btn btn-primary w-100 py-3"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaMicrophone className="me-2" />
                  Select Audio Files
                </button>
                <input 
                  type="file" 
                  className="d-none" 
                  accept="audio/*" 
                  multiple={isPro}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
              
              {!isPro && (
                <div className="small text-muted mb-3">
                  Free tier supports single file upload. Upgrade to Pro for batch processing.
                </div>
              )}
              
              {whisperStatus.loading && !whisperStatus.ready && (
                <div className="alert alert-info">
                  <div className="d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    <div>
                      <strong>Whisper model is loading:</strong> {modelProgress}%
                      <div className="progress mt-1" style={{ height: '10px' }}>
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated" 
                          role="progressbar" 
                          style={{ width: `${modelProgress}%` }}
                          aria-valuenow={modelProgress} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <small className="text-muted">You can still transcribe while the model loads. We'll use simulation as a fallback.</small>
                    </div>
                  </div>
                </div>
              )}
              
              {files.length > 0 && (
                <div>
                  <h6>Selected Files:</h6>
                  <ul className="list-group">
                    {files.map((file, index) => (
                      <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                        <div className="text-truncate">
                          <span className="me-2">{index + 1}.</span>
                          {file.name}
                          <span className="ms-2 small text-muted">({formatFileSize(file.size)})</span>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                <FaCog className="me-2" />
                Transcription Options
              </h5>
              
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="timestamps"
                  checked={transcriptionOptions.timestamps}
                  onChange={() => handleOptionChange('timestamps')}
                />
                <label className="form-check-label" htmlFor="timestamps">
                  Include Timestamps
                </label>
              </div>
              
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="speakerDiarization"
                  checked={transcriptionOptions.speakerDiarization}
                  onChange={() => handleOptionChange('speakerDiarization')}
                  disabled={!isPro}
                />
                <label className="form-check-label" htmlFor="speakerDiarization">
                  Speaker Recognition
                  {!isPro && <span className="ms-2 pro-badge">PRO</span>}
                </label>
              </div>
              
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="highAccuracy"
                  checked={transcriptionOptions.highAccuracy}
                  onChange={() => handleOptionChange('highAccuracy')}
                  disabled={!isPro}
                />
                <label className="form-check-label" htmlFor="highAccuracy">
                  High Accuracy Mode
                  {!isPro && <span className="ms-2 pro-badge">PRO</span>}
                </label>
              </div>
              
              <button 
                className="btn btn-primary w-100"
                onClick={handleTranscribe}
                disabled={isProcessing || files.length === 0}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    {processingStatus}
                  </>
                ) : 'Start Transcription'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <FaMicrophone className="me-2" />
                  Transcription Results
                </h5>
                
                {transcriptions.length > 0 && (
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={resetTranscription}
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {isProcessing && (
                <div className="text-center my-5">
                  <div className="loading-spinner mb-3"></div>
                  <p>{processingStatus}</p>
                  <p className="text-muted small">This may take a few moments</p>
                  
                  {modelProgress > 0 && (
                    <div className="progress mt-3 mb-3" style={{ height: '20px' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        style={{ width: `${modelProgress}%` }}
                        aria-valuenow={modelProgress} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  )}
                </div>
              )}
              
              {!isProcessing && transcriptions.length === 0 && (
                <div className="text-center my-5 text-muted">
                  <FaMicrophone size={48} className="mb-3 opacity-50" />
                  <p>No transcriptions yet. Upload an audio file and click "Start Transcription".</p>
                </div>
              )}
              
              {transcriptions.length > 0 && (
                <div>
                  {transcriptions.map((transcription, index) => (
                    <div className="mb-4" key={index}>
                      <h6 className="d-flex justify-content-between">
                        <span>
                          {transcription.filename}
                          {transcription.usedRealModel && (
                            <span className="badge bg-success ms-2">
                              <FaBrain className="me-1" /> Real Transcription
                            </span>
                          )}
                        </span>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-primary dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >
                            <FaFileDownload className="me-1" />
                            Download
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleDownload(transcription, 'txt')}
                              >
                                Text (.txt)
                              </button>
                            </li>
                            <li>
                              <button 
                                className={`dropdown-item ${!isPro ? 'disabled' : ''}`}
                                onClick={() => handleDownload(transcription, 'pdf')}
                              >
                                PDF (.pdf) {!isPro && <span className="ms-1 pro-badge">PRO</span>}
                              </button>
                            </li>
                            <li>
                              <button 
                                className={`dropdown-item ${!isPro ? 'disabled' : ''}`}
                                onClick={() => handleDownload(transcription, 'docx')}
                              >
                                Word (.docx) {!isPro && <span className="ms-1 pro-badge">PRO</span>}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </h6>
                      
                      <div className="card bg-light mb-3">
                        <div className="card-body">
                          {transcriptionOptions.timestamps && transcription.data.segments.length > 0 ? (
                            <div>
                              {transcription.data.segments.map((segment) => (
                                <div className="mb-2" key={segment.id}>
                                  <span className="badge bg-secondary me-2">
                                    {formatTime(segment.start)} - {formatTime(segment.end)}
                                  </span>
                                  
                                  {transcriptionOptions.speakerDiarization && isPro && (
                                    <span className="badge bg-primary me-2">
                                      Speaker {transcription.data.speakers.find(s => s.segments.includes(segment.id))?.id + 1 || 1}
                                    </span>
                                  )}
                                  
                                  <span>{segment.text}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="mb-0">{transcription.data.text}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcribe; 