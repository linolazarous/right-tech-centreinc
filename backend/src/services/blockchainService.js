const Web3 = require('web3');
const contractABI = require('../contracts/CertificateContract.json');
const logger = require('../utils/logger');

const web3 = new Web3(process.env.BLOCKCHAIN_NODE_URL);
const contractAddress = process.env.CERTIFICATE_CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

/**
 * Issue certificate on blockchain
 * @param {string} studentAddress - Student wallet address
 * @param {string} courseId - Course ID
 * @param {string} certificateHash - Certificate hash
 * @returns {Promise<Object>} Transaction result
 */
exports.issueCertificate = async (studentAddress, courseId, certificateHash) => {
  try {
    // Validate inputs
    if (!web3.utils.isAddress(studentAddress)) {
      throw new Error('Invalid student address');
    }

    if (!certificateHash || typeof certificateHash !== 'string') {
      throw new Error('Invalid certificate hash');
    }

    logger.info(`Issuing certificate for ${studentAddress}, course ${courseId}`);

    const accounts = await web3.eth.getAccounts();
    const adminAccount = accounts[0];

    const tx = await contract.methods
      .issueCertificate(studentAddress, courseId, certificateHash)
      .send({ 
        from: adminAccount,
        gas: 500000 
      });

    logger.info(`Certificate issued in tx ${tx.transactionHash}`);
    return {
      success: true,
      transactionHash: tx.transactionHash,
      blockNumber: tx.blockNumber,
      certificateId: `${courseId}-${studentAddress}-${Date.now()}`
    };
  } catch (error) {
    logger.error(`Certificate issuance failed: ${error.message}`);
    throw new Error('Failed to issue certificate on blockchain');
  }
};
