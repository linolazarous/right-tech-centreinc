import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getBlockchainData } from '../services/blockchainService';

const Blockchain = ({ userId }) => {
    const [blockchainData, setBlockchainData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlockchainData = async () => {
            try {
                const data = await getBlockchainData(userId);
                setBlockchainData(data);
                setError(null);
            } catch (err) {
                setError('Failed to load blockchain data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlockchainData();
    }, [userId]);

    if (loading) return <div className="loading">Loading blockchain information...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="blockchain-container">
            <h1>Blockchain Technology</h1>
            <p>Learn about decentralized applications and smart contracts</p>
            
            <div className="blockchain-content">
                <h2>Your Learning Progress on Blockchain</h2>
                {blockchainData?.certificates?.length > 0 ? (
                    <div className="certificate-list">
                        <h3>Your Blockchain Certificates:</h3>
                        <ul>
                            {blockchainData.certificates.map(cert => (
                                <li key={cert.id}>
                                    {cert.name} - {cert.date}
                                    <span className="tx-hash">TX: {cert.transactionHash}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No blockchain certificates yet</p>
                )}
                
                <div className="blockchain-demo">
                    <h3>Interactive Demo</h3>
                    <button className="demo-button">Create Smart Contract</button>
                    <button className="demo-button">Verify Certificate</button>
                </div>
            </div>
        </div>
    );
};

Blockchain.propTypes = {
    userId: PropTypes.string.isRequired
};

export default Blockchain;
