import React, { useRef } from 'react';

function UploadSection({ onUploadSuccess, style }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.document_id);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <div style={{ ...style }}>
      <input
        type="file"
        accept=".pdf,.txt"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        onClick={handleButtonClick}
        style={{
          padding: '10px 16px',
          borderRadius: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Upload
      </button>
    </div>
  );
}

export default UploadSection;
