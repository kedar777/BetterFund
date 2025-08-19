// DocumentViewer.js
import React, { useState } from 'react';

export default function DocumentViewer({
  documents,          // <-- now an array
  campaignName,
  onClose,
  onApprove,
  onReject,
}) {
  const [verificationNotes, setVerificationNotes] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!documents || documents.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>No document available</h2>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    );
  }

  const currentDoc = documents[currentIndex];

  const handleDownload = () => {
    const byteCharacters = atob(currentDoc.content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentDoc.name || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-lg">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>Document Verification</h3>
            <p>{campaignName}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Document viewer */}
        <div className="modal-body">
          {currentDoc.name.toLowerCase().endsWith('.pdf') ? (
            <iframe
              title={currentDoc.name}
              src={`data:application/pdf;base64,${currentDoc.content}`}
              width="100%"
              height="100%"
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p>No preview available. Download to review.</p>
              <button className="btn btn-primary" onClick={handleDownload}>
                ⬇ Download "{currentDoc.name}"
              </button>
            </div>
          )}
        </div>

        {/* Download button (always visible below preview) */}
        <div style={{ padding: '0 1rem' }}>
          <button className="btn btn-outline" onClick={handleDownload}>
            ⬇ Download File
          </button>
        </div>

        {/* Verification notes */}
        <div className="modal-section">
          <textarea
            placeholder="Verification notes (optional)…"
            rows={3}
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
          />
        </div>

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onReject(verificationNotes)}
          >
            Reject Campaign
          </button>
          <button
            className="btn btn-success"
            onClick={() => onApprove(verificationNotes)}
          >
            Approve Campaign
          </button>
        </div>
      </div>

      {/* Simple CSS (scoped inside component) */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal-lg {
          background: white;
          width: 90vw;
          height: 90vh;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body {
          flex: 1;
          padding: 1rem;
          overflow: auto;
        }
        .modal-section {
          padding: 1rem;
        }
        .modal-actions {
          padding: 1rem;
          border-top: 1px solid #ddd;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          resize: vertical;
        }
      `}</style>
    </div>
  );
}