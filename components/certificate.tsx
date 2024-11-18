import React from 'react';

interface CertificateProps {
  domainName: string;
  expiry: string;
  isExpired: boolean;
  handleRevokeCertificate: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ domainName, expiry, isExpired, handleRevokeCertificate }) => {
  return (
    <div className="relative bg-black p-6 rounded-lg w-full max-w-md mx-auto mb-8 overflow-hidden">
      {/* Blurred overlay if expired */}
      {isExpired && (
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-10">
          <span className="text-red-500 text-lg font-bold">Certificate Expired or Revoked</span>
        </div>
      )}

      {/* Card Content */}
      <div className={`relative z-0 ${isExpired ? 'blur-sm' : ''}`}>
        <h2 className="text-xl text-white font-bold mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
          {domainName}
        </h2>
        <p className="text-gray-500 mb-4 overflow-hidden overflow-ellipsis">
          {expiry}
        </p>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full focus:outline-none ${
              isExpired
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-700 focus:shadow-outline-blue'
            }`}
            onClick={handleRevokeCertificate}
            disabled={isExpired}
          >
            Revoke Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
