// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract DomainCertificate {
    struct Certificate {
        string domain;
        string ip;
        uint256 expiryDate;
        address owner;
        bool isRevoked;
    }
    struct CertificateInfo{
        bool isIssued;
        string domain;
    }

    mapping(string => Certificate) private certificates;
    mapping(address => CertificateInfo) private isCertificateIssued;

    modifier onlyDomainOwner(string memory domain) {
        require(certificates[domain].owner == msg.sender, "Domain not owned by sender");
        _;
    }

    event CertificateCreated(string domain, string ip, uint256 expiryDate, address owner);
    event CertificateRevoked(string domain, string ip, uint256 expiryDate, address owner);

    function addCertificate(string calldata domain, string calldata ip, uint256 expiryDate) external {
        require(bytes(domain).length > 0, "Domain cannot be empty");
        require(bytes(ip).length > 0, "IP cannot be empty");
        require(expiryDate > block.timestamp, "Expiry date must be in the future");
        require(certificates[domain].owner == address(0), "Domain already registered");
        require(!isCertificateIssued[msg.sender].isIssued, "Certificate already issued");

        isCertificateIssued[msg.sender].isIssued = true;
        isCertificateIssued[msg.sender].domain = domain;
        certificates[domain] = Certificate({
            domain: domain,
            ip: ip,
            expiryDate: expiryDate,
            owner: msg.sender,
            isRevoked: false
        });

        emit CertificateCreated(domain, ip, expiryDate, msg.sender);
    }

    function revokeCertificate(string calldata domain) external onlyDomainOwner(domain) {
        Certificate storage cert = certificates[domain];
        require(!cert.isRevoked, "Certificate already revoked");
        require(cert.expiryDate > block.timestamp, "Certificate already expired");

        cert.expiryDate = block.timestamp;
        cert.isRevoked = true;

        emit CertificateRevoked(cert.domain, cert.ip, cert.expiryDate, cert.owner);
    }

    function getCertificate(string calldata domain) external view returns (string memory, string memory, uint256, address, bool) {
        Certificate storage cert = certificates[domain];
        require(cert.owner != address(0), "Domain not registered");
        return (cert.domain, cert.ip, cert.expiryDate, cert.owner, cert.isRevoked);
    }

    function getCertificateByAddress() external view returns (string memory, string memory, uint256, address, bool) {
        Certificate storage cert = certificates[isCertificateIssued[msg.sender].domain];
        require(cert.owner != address(0), "Domain not registered");
        return (cert.domain, cert.ip, cert.expiryDate, cert.owner, cert.isRevoked);
    }

    function checkCertificateIssued() external view returns (bool) {
        return isCertificateIssued[msg.sender].isIssued;
    }
}
