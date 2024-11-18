import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}
import Certificate from './certificate';
import Web3 from 'web3';
import { abi, contractAddress } from '@/utils/constants';
import { ToastContainer, toast } from 'react-toastify';

const HomePage: React.FC<{ address: string }> =({ address }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isCertificatedIssued, setIsCertificateIssued] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [domainAddress, setDomainAddress] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');

  const [certificateDomain, setCertificateDomain] = useState<string>('');
  const [certificateExpiry, setCertificateExpiry] = useState<string>('');
  const [isCertificatedExpired, setIsCertificateExpired] = useState<boolean>(false);

  useEffect(() => {
    const initWeb3 = async () => {
      setLoading(true);
      try {
        if ((window as any).ethereum) {
          const web3Instance = new Web3((window as any).ethereum);
          const contract = new web3Instance.eth.Contract(abi, contractAddress);
          const accounts = await web3Instance.eth.getAccounts();
          const result = await contract.methods.checkCertificateIssued().call({from: accounts[0]}) as any;
          setIsCertificateIssued(result);
          if(result){
            const certificate = await contract.methods.getCertificateByAddress()
            .call({from: accounts[0]}) as any;
            console.log(certificate)
            const expiryDate = new Date(Number(certificate[2])*1000);
            if(expiryDate < new Date()){
              setIsCertificateExpired(true);
            }
            setCertificateDomain(certificate[0]);
            setCertificateExpiry(expiryDate.toUTCString());
          }
        } else {
          console.error('Web3 provider not detected');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  const isValidIPAddress = (ip: string) => {
    const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
    return ipRegex.test(ip);
  };

  const isValidDomain = (domain: string) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+.*)$/;
    return domainRegex.test(domain);
  };

  const handleAddCertificate =  async () => {
    if(!domainAddress){
      toast.error('Domain Address is required');
      return;
    }
    if(!ipAddress){
      toast.error('IP Address is required');
      return;
    }
    if(!isValidDomain(domainAddress)){
      toast.error('Invalid Domain Address');
      return;
    }
    if(!isValidIPAddress(ipAddress)){
      toast.error('Invalid IP Address');
      return;
    }

    const web3Instance = new Web3((window as any).ethereum);   

    (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];

    const contract = new web3Instance.eth.Contract(abi, contractAddress);

    // Create transaction data
    const data = contract.methods.addCertificate(
      domainAddress, 
      ipAddress,  
      Math.floor((new Date().getTime() + 1000 * 60 * 60 * 24 * 365) / 1000),
    ).encodeABI();

    // Send the transaction
    const transactionObject = {
      from: address, 
      to: contractAddress,
      gas: 3000000,
      data,
    };
    let transactionReceipt;
    try{
      transactionReceipt = await web3Instance.eth.sendTransaction(transactionObject);
    }catch(error){
      console.error('Error adding certificate:', error);
      toast.error('An error occurred while adding certificate');
      return;
    }
  
    if (transactionReceipt.status) {
      toast.success('Added certificate successfully');
    } else {
      toast.error('An error occurred while adding certificate');
    }

    setShowModal(false);
    setIsCertificateIssued(true);
    toast.success('Certificate added successfully');
  };

  const handleRevokeCertificate = async () => {
    const web3Instance = new Web3((window as any).ethereum);   

    (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];

    const contract = new web3Instance.eth.Contract(abi, contractAddress);

    const data = contract.methods.revokeCertificate(
      certificateDomain
    ).encodeABI();

    const transactionObject = {
      from: address, 
      to: contractAddress,
      gas: 3000000,
      data,
    };
    let transactionReceipt;
    try{
      transactionReceipt = await web3Instance.eth.sendTransaction(transactionObject);
    }catch(error){
      console.error('Error adding certificate:', error);
      toast.error('An error occurred while adding certificate');
      return;
    }

    if (transactionReceipt.status) {
      setIsCertificateExpired(true);
      toast.success('Revoked certificate successfully');
    } else {
      toast.error('An error occurred while revoking certificate');
    }

  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-auto max-w-md p-6 rounded-lg flex flex-col items-center justify-center">
            <p className="text-2xl text-white font-bold mb-6">Welcome to Certificate Manager</p>
            <div className="mb-6">
              <p className="text-white">Loading...</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <nav className="navbar">
            <h1 className="navbar-title">Certificate Manager</h1>
            {!isCertificatedIssued && (
              <button
                className="add-certificate-button"
                onClick={() => setShowModal(true)}
              >
                Add Certificate
              </button>
            )}
          </nav>
          <main className="main-content">
            {isCertificatedIssued ? (
              <Certificate 
              domainName={certificateDomain} 
              expiry={certificateExpiry}
              handleRevokeCertificate={handleRevokeCertificate}
              isExpired={isCertificatedExpired}

               />
            ) : (
              <p className="text-white">No certificate issued yet</p>
            )}
          </main>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">Add Certificate</h2>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Domain Address"
                  value={domainAddress}
                  onChange={(e) => setDomainAddress(e.target.value)}
                />
                <input
                  type="text"
                  className="modal-input"
                  placeholder="IP Address"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                />
                <div className="modal-buttons">
                  <button className="modal-button add-button" onClick={handleAddCertificate}>
                    Add
                  </button>
                  <button className="modal-button cancel-button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default HomePage;
