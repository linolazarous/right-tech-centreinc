import React, { useState } from 'react';
import { verifyCertificate } from '../services/blockchainService';

const CertificateVerification = () => {
    const [certificateHash, setCertificateHash] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    const handleVerify = async () => {
        const result = await verifyCertificate(certificateHash);
        setVerificationResult(result);
    };

    return (
        <div>
            <h1>Certificate Verification</h1>
            <input
                type="text"
                placeholder="Enter Certificate Hash"
                value={certificateHash}
                onChange={(e) => setCertificateHash(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>
            {verificationResult && (
                <div>
                    <p>Verification Result: {verificationResult.success ? 'Valid' : 'Invalid'}</p>
                </div>
            )}
        </div>
    );
};

export default CertificateVerification;