const CertificateService = require('../services/certificateService');

   exports.issueCertificate = async (req, res) => {
       try {
           const certificate = await CertificateService.issueCertificate(req.body);
           res.status(201).json(certificate);
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   };