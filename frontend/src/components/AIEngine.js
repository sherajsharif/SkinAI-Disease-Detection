import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import medicines from '../data/medicines';
import diseases from '../data/diseases';
import './AIEngine.css';
import { useNavigate } from 'react-router-dom';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/predict`;

function AIEngine() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [recommendedMeds, setRecommendedMeds] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError(null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setDiseaseInfo(null);
    setRecommendedMeds([]);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      // Use local diseases and medicines data to get info
      const detectedDisease = response.data.class;
      // Redirect to result page with disease name
      navigate('/result', { state: { disease: detectedDisease } });
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  // Camera logic
  useEffect(() => {
    if (showCamera) {
      setCameraReady(false);
      const startCamera = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera API is not supported in your browser');
          }
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          alert('Unable to access camera: ' + (err.message || 'Unknown error'));
          setShowCamera(false);
        }
      };
      startCamera();
    }
    // Cleanup on hide
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [showCamera]);

  const openCamera = () => setShowCamera(true);
  const closeCamera = () => setShowCamera(false);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(blob));
      closeCamera();
    }, 'image/jpeg');
  };

  return (
    <div className="ai-bg">
      <div className="ai-card">
        <h2 className="ai-title">AI Engine <span role="img" aria-label="ai">🧬</span></h2>
        <div className="ai-predict-layout">
          {/* Left Info Card */}
          <div className="ai-info-card ai-info-left">
            <h3>Why is it necessary to detect skin disease?</h3>
            <p>Skin diseases can significantly impact quality of life. Early detection helps prevent complications, reduces treatment costs, and improves outcomes. Using AI for diagnosis increases accuracy and accessibility, empowering users to take control of their skin health.</p>
          </div>
          {/* Center Upload/Card */}
          <div className="ai-center-card">
            <form onSubmit={handleSubmit}>
              <div className="ai-upload-zone">
                {!previewUrl ? (
                  <>
                    <p>Drag and drop your image here or choose an option below</p>
                  </>
                ) : (
                  <div className="ai-preview-section">
                    <img src={previewUrl} alt="Preview" className="ai-img-preview" />
                  </div>
                )}
              </div>
              <div className="ai-upload-options">
                <label className="ai-option-button">
                  <span role="img" aria-label="upload">📁</span> Choose File
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </label>
                <button type="button" className="ai-camera-btn" title="Open Camera" onClick={openCamera}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2zm9 4a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <button
                className="btn btn-primary btn-lg w-100 ai-detect-btn"
                type="submit"
                disabled={loading || !selectedFile}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Analyzing...
                  </span>
                ) : (
                  'Detect Disease'
                )}
              </button>
            </form>
            {error && (
              <div className="alert alert-danger animated-fade-in mt-4">
                <div className="alert-icon">⚠️</div>
                <div>
                  <h6 className="alert-heading">{error}</h6>
                </div>
              </div>
            )}
            <div className="ai-instructions">
              <h3>How to use the AI Engine</h3>
              <ul>
                <li>Upload a clear image of the affected skin area.</li>
                <li>Click "Detect Disease" to get instant results.</li>
                <li>See disease info, steps, and recommended medicines below.</li>
              </ul>
            </div>
          </div>
          {/* Right Info Card */}
          <div className="ai-info-card ai-info-right">
            <h3>Prevent Skin Disease: Follow these steps</h3>
            <ul>
              <li>Maintain good personal hygiene.</li>
              <li>Avoid sharing personal items (towels, razors, etc.).</li>
              <li>Moisturize regularly to prevent dryness.</li>
              <li>Protect your skin from excessive sun exposure.</li>
              <li>Seek medical advice for persistent symptoms.</li>
            </ul>
            <a className="ai-more-info-btn" href="https://medcoeckapwstorprd01.blob.core.usgovcloudapi.net/pfw-images/borden/mil-quantitative-physiology/QPchapter09.pdf" target="_blank" rel="noopener noreferrer">More info</a>
          </div>
        </div>
        {/* Result Section */}
        {/* Removed in-place result rendering, now handled by ResultPage */}
      </div>
      {/* Camera Overlay */}
      {showCamera && (
        <div className="camera-overlay">
          <div className="camera-container">
            <div className="camera-header">
              <h3>Take a Photo</h3>
              <button className="close-button" onClick={closeCamera}>&times;</button>
            </div>
            <div className="camera-instructions">
              <ul>
                <li>Position the affected area in the center</li>
                <li>Ensure good lighting</li>
                <li>Hold the camera steady</li>
              </ul>
            </div>
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-feed"
                onLoadedMetadata={() => setCameraReady(true)}
              />
              {!cameraReady && (
                <div className="camera-loading">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading camera...</span>
                  </div>
                  <p>Initializing camera...</p>
                </div>
              )}
            </div>
            <div className="camera-controls">
              <button
                className="camera-button capture-button"
                onClick={captureImage}
                disabled={!cameraReady}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2zm9 4a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style={{marginLeft: '0.5rem'}}>Take Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIEngine; 
