import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SkinDiseasePredictor.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/predict';

// SVG Icons as components
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function SkinDiseasePredictor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warningType, setWarningType] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showCamera) {
      setCameraReady(false); // Reset when camera opens
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
          let errorMessage = 'Unable to access camera. ';
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings.';
          } else if (err.name === 'NotFoundError') {
            errorMessage += 'No camera device was found. Please make sure your camera is connected.';
          } else if (err.name === 'NotReadableError') {
            errorMessage += 'Your camera might be in use by another application.';
          } else if (!window.isSecureContext) {
            errorMessage += 'Camera access requires a secure connection (HTTPS).';
          } else {
            errorMessage += err.message || 'Please make sure you have granted camera permissions.';
          }
          setError({
            type: 'camera',
            message: 'Camera Access Error',
            guidance: errorMessage
          });
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

  const getWarningMessage = (errorMessage) => {
    const msg = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
    if (msg.includes('No significant skin area detected')) {
      return {
        type: 'non-skin',
        message: 'Please upload a clear image of the affected skin area. Screenshots or non-skin images cannot be analyzed.',
        guidance: 'Tips: Take a well-lit photo of the affected skin area. Ensure the skin condition is clearly visible in the image.'
      };
    } else if (msg.includes('confidence')) {
      return {
        type: 'low-confidence',
        message: 'The image could not be analyzed with sufficient confidence.',
        guidance: 'Tips: Ensure the image is clear, well-lit, and focused on the affected area.'
      };
    } else if (msg.includes('file type')) {
      return {
        type: 'invalid-format',
        message: 'Please upload images in PNG, JPG, JPEG, or WEBP format only.',
        guidance: 'Tips: Most phone camera photos are in these formats by default.'
      };
    } else {
      return {
        type: 'general',
        message: 'Unable to process the image.',
        guidance: 'Please try uploading a different image of the affected skin area.'
      };
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setWarningType(null);
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
    setWarningType(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = typeof err.response?.data === 'object' 
        ? err.response.data.details || err.response.data.error 
        : err.message || 'Prediction failed';
      const warning = getWarningMessage(errorMessage);
      setError(warning);
      setWarningType(warning.type);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        streamRef.current = null;
      });
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragging');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="app-title">Skin Disease Detection</h1>
          <p className="app-subtitle">Upload or capture a photo for instant analysis</p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout} style={{ height: '40px' }}>
          Logout
        </button>
      </div>

      <div className="upload-guidelines">
        <div className="guidelines-header">
          <span>📸 Image Guidelines</span>
        </div>
        <ul className="guidelines-list">
          <li>Take a clear, well-lit photo of the affected skin area</li>
          <li>Ensure the skin condition is clearly visible</li>
          <li>Avoid screenshots or non-medical images</li>
          <li>Use PNG, JPG, JPEG, or WEBP format</li>
        </ul>
      </div>

      <div className="main-card">
        <div className="upload-section">
          <div
            className="upload-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!previewUrl ? (
              <>
                <UploadIcon />
                <p>Drag and drop your image here or choose an option below</p>
              </>
            ) : (
              <div className="preview-section">
                <img src={previewUrl} alt="Preview" className="img-preview" />
              </div>
            )}
          </div>

          <div className="upload-options">
            <label className="option-button">
              <UploadIcon />
              Choose File
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </label>
            <button className="option-button" onClick={() => setShowCamera(true)}>
              <CameraIcon />
              Use Camera
            </button>
          </div>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={handleSubmit}
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
        </div>

        {error ? (
          <div className={`alert ${warningType === 'general' ? 'alert-danger' : 'alert-warning'} animated-fade-in`}>
            <div className="alert-icon">⚠️</div>
            <div>
              <h6 className="alert-heading">{error.message}</h6>
              <p className="mb-0 mt-2 small">{error.guidance}</p>
            </div>
          </div>
        ) : result && (
          <div className="result-card animated-fade-in">
            <div className="result-header">
              <div className="result-icon">✓</div>
              <h4>Results</h4>
            </div>
            <div className="card-body">
              <h5 className="card-title">
                Detected Disease:
                <span className="badge bg-success ms-2">
                  {result.class}
                </span>
              </h5>
              <div className="mt-3">
                <label className="form-label">Confidence Level:</label>
                <div className="confidence-bar-outer">
                  <div
                    className="confidence-bar-inner"
                    style={{
                      width: `${(result.confidence * 100).toFixed(1)}%`,
                      transition: 'width 1s cubic-bezier(0.4,0,0.2,1)'
                    }}
                  >
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCamera && (
        <div className="camera-overlay">
          <div className="camera-container">
            <div className="camera-header">
              <h3>Take a Photo</h3>
              <button className="close-button" onClick={stopCamera}>
                <CloseIcon />
              </button>
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
                <CameraIcon />
                <span>Take Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkinDiseasePredictor; 