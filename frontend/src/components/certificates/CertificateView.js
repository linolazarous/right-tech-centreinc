import React from 'react';

const CertificateView = ({ certificate }) => {
  return (
    <div className="bg-white border-2 border-gold-400 rounded-lg p-8 text-center">
      <div className="mb-8">
        <img
          src="/images/certificate-logo.png"
          alt="Right Tech Centre"
          className="h-16 mx-auto mb-4"
        />
        <h1 className="text-3xl font-serif font-bold text-gray-800">Certificate of Completion</h1>
      </div>

      <div className="my-8">
        <p className="text-lg text-gray-600 mb-2">This certifies that</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{certificate.studentName}</h2>
        <p className="text-lg text-gray-600 mb-2">has successfully completed the course</p>
        <h3 className="text-xl font-semibold text-gray-800">{certificate.courseName}</h3>
      </div>

      <div className="flex justify-between items-center mt-12">
        <div className="text-center">
          <div className="border-t-2 border-gray-400 pt-2">
            <p className="font-semibold">Date</p>
            <p>{new Date(certificate.date).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="text-center">
          <img
            src="/images/signature.png"
            alt="Director Signature"
            className="h-12 mx-auto mb-2"
          />
          <div className="border-t-2 border-gray-400 pt-2">
            <p className="font-semibold">Director</p>
            <p>Right Tech Centre</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Certificate ID: {certificate.id}
        </p>
      </div>
    </div>
  );
};

export default CertificateView;
