const Web3 = require('web3');
   const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
   const contractABI = require('../contracts/CertificateContract.json');
   const contractAddress = 'YOUR_CONTRACT_ADDRESS';
   const contract = new web3.eth.Contract(contractABI, contractAddress);

   exports.issueCertificate = async (data) => {
       const accounts = await web3.eth.getAccounts();
       await contract.methods.issueCertificate(data.studentAddress, data.courseId, data.certificateHash).send({ from: accounts[0] });
       return { success: true };
   };