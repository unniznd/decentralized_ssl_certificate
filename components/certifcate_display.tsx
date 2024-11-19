interface CertificateProps {
certificate: any;
}

const CertificateDisplay: React.FC<CertificateProps> = ({ certificate }) => {
    return (
        <div className="certificate-container">
        <h2>Certificate Details</h2>
        <p><strong>Domain:</strong> {certificate[0]}</p>
        <p><strong>IP Address:</strong> {certificate[1]}</p>
        <p><strong>Expiration Timestamp:</strong> {new Date(Number(certificate[2])*1000).toString()}</p>
        <p><strong>Owner Address:</strong> {certificate[3]}</p>
        </div>
    );
};

export default CertificateDisplay;
