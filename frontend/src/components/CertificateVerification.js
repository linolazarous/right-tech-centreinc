import React, { useState } from 'react';
import { verifyCertificate } from '../services/blockchainService';

const CertificateVerification = () => {
    const [certificateId, setCertificateId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async () => {
        if (!certificateId.trim()) {
            setError('Please enter a certificate ID');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const result = await verifyCertificate(certificateId.trim());
            setVerificationResult(result);
        } catch (err) {
            setError('Verification failed. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="certificate-verification">
            <h1>Certificate Verification</h1>
            <div className="verification-form">
                <input
                    type="text"
                    placeholder="Enter Certificate ID or scan QR code"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    aria-label="Certificate ID"
                />
                <button 
                    onClick={handleVerify} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify'}
                </button>
                <button className="qr-scanner">Scan QR Code</button>
            </div>
            
            {error && <div className="error">{error}</div>}
            
            {verificationResult && (
                <div className={`verification-result ${verificationResult.valid ? 'valid' : 'invalid'}`}>
                    <h2>Verification Result</h2>
                    <p>Status: {verificationResult.valid ? 'Valid' : 'Invalid'}</p>
                    {verificationResult.details && (
                        <div className="certificate-details">
                            <h3>Certificate Details</h3>
                            <p>Issued to: {verificationResult.details.recipientName}</p>
                            <p>Course: {verificationResult.details.courseName}</p>
                            <p>Issued on: {new Date(verificationResult.details.issueDate).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CertificateVerification;
