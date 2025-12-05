import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../styles/FileSharing.css';

function FileSharing() {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    console.log("Sharing file...");
    
    setRecipient('');
    setMessage('');
    setSelectedFile(null);
  };

  const FilePlusSVG = ({ size, color }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color || "currentColor"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="feather feather-file-plus"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="13" x2="12" y2="19"/>
      <line x1="9" y1="16" x2="15" y2="16"/>
    </svg>
  );


  return (
    <Card className="file-sharing-card">
      <Card.Body>
        <Form onSubmit={handleShare}>
          
          {/* From Field (Read-only) */}
          <Form.Group className="mb-3">
            <Form.Label className="label-text">From:</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Your email address"
              value={sender} 
              onChange={(e) => setSender(e.target.value)}
              required
            />
          </Form.Group>

          {/* To Field */}
          <Form.Group className="mb-3">
            <Form.Label className="label-text">To:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Recipient email address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </Form.Group>

          {/* Message Field */}
          <Form.Group className="mb-3">
            <Form.Label className="label-text">Message:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-textarea"
            />
          </Form.Group>

          {/* File Upload Drop Zone */}
          <Form.Group className="mb-4">
            <Form.Label className="label-text">Upload file here:</Form.Label>
            <div
              className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <p className="file-name-display">{selectedFile.name}</p>
              ) : (
                  <div className="placeholder-content">
                    <FilePlusSVG size={48} />
                    <p>Drag and drop or click to upload</p>
                  </div>
              )}
            </div>
          </Form.Group>

          <div className="d-grid">
            <Button 
                variant="primary" 
                type="submit" 
                disabled={!recipient || !selectedFile}
                className="share-button"
            >
              Share File
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FileSharing;