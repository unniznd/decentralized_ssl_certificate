import React, { useState } from "react";
import Web3 from "web3";
import { abi, contractAddress } from "@/utils/constants";
import CertificateDisplay from "@/components/certifcate_display";

declare global {
  interface Window {
    ethereum: any;
  }
}

const View: React.FC = () => {
  const [domainAddr, setDomainAddr] = useState("");
  const [certificate, setCertificate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true); // Show the loading indicator
    setCertificate(null); // Clear the current certificate object
    try {
      const web3Instance = new Web3(window.ethereum);
      const contract = new web3Instance.eth.Contract(abi, contractAddress);
      const result = await contract.methods.getCertificate(domainAddr).call();
      setCertificate(result);
    } catch (error) {
      console.error("Error fetching certificate:", error);
    } finally {
      setIsLoading(false); // Hide the loading indicator
    }
  };

  return (
    <div className="view-container">
      <input
        type="text"
        placeholder="Enter domain address"
        value={domainAddr}
        onChange={(e) => setDomainAddr(e.target.value)}
        className="view-textbox"
      />
      <button onClick={handleSearch} className="view-button" disabled={isLoading}>
        {isLoading ? "Loading..." : "Search"}
      </button>
      {isLoading && <p>Loading certificate data...</p>}
      {certificate && <CertificateDisplay certificate={certificate} />}
    </div>
  );
};

export default View;
