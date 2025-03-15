const Web3 = require('web3');
const contractABI = require('../contracts/CertificateContract.json');
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const contract = new web3.eth.Contract(contractABI, contractAddress);

exports.issueCertificate = async (studentAddress, courseId, certificateHash) => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.issueCertificate(studentAddress, courseId, certificateHash).send({ from: accounts[0] });
    return { success: true };
};