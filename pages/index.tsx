import MetamaskConnect from '@/components/connect_wallet';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "@/components/home_page";
import Web3 from 'web3';


export default function Home() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = (connectedWeb3: Web3) => {
    setWeb3(connectedWeb3);
    getAccount(connectedWeb3);
  };

  const getAccount = async (web3: Web3) => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0] || null);
  };

  return (
    <div>
      {web3 ? (
        <HomePage address={account || ''}/>
      ) : (
        <MetamaskConnect onConnect={handleConnect} />
      )}
    </div>
  );
}
