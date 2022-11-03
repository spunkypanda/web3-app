import React, { useState, useEffect } from 'react';
import * as ethers from 'ethers';
import logo from './logo.svg';
import './App.css';

function App() {
  const [haveMetamask, setHaveMetamask] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');

  const checkMetamaskAvailability = () => {
    // @ts-ignore-next-line
    if (!window.ethereum) {
      setHaveMetamask(false);
    }
    setHaveMetamask(true);
  };

  const getWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}....${address.slice(34, 42)}`;
  };

  const connectWallet = async () => {
    try {

      // @ts-ignore-next-line
      if (!window.ethereum) {
        setHaveMetamask(false);
      }

      // @ts-ignore-next-line
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = getWalletAddress(accounts[0])
      setAccountAddress(walletAddress);
      setIsConnected(true);

      // @ts-ignore-next-line
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(balance);
      setAccountBalance(bal);

    } catch (err) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkMetamaskAvailability();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{color: 'gray' }}>
          <h2>Crypto balance checker</h2>
        </div>
        {
          haveMetamask ? (
            <div>
              <button onClick={connectWallet} disabled={isConnected} >Connect wallet</button>
              {(isConnected && accountAddress && accountBalance) && (
                <p>
                  <b>Address: </b>{accountAddress}
                  <br></br>
                  <b>Balance: </b>{(+accountBalance).toFixed(6)} ETH
                </p>
              )}
            </div>
          ) : (
            <div><h3>Please install metamask</h3></div>
          )
        }
      </header>
    </div>
  );
}

export default App;
