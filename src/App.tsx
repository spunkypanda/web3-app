import React, { useState, useEffect } from 'react';
import { useWeb3React, UnsupportedChainIdError, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider, Network } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'

import { getWalletAddress } from './utils';
import './App.css';

export const ChainId: Record<string, number> = {
  ETH_MAINNET: 1,
  ETH_ROPSTEN: 3,
  ETH_RINKEBY: 4,
  ETH_GOERLI: 5,
  ETH_KOVAN: 42,
  POLYGON_MAINNET: 137,
}

function ConnectWallet() {
  const injectedConnector = new InjectedConnector({ supportedChainIds: Object.values(ChainId) })
  const { account, activate, active, chainId, error, library } = useWeb3React<Web3Provider>()
  const [networkInfo, setNetworkInfo] = useState<Network>();
  const [balance, setBalance]= useState('0.0');

  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
  if (isUnsupportedChainIdError) {
    console.error(error);
  }

  const onClick = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    library?.getNetwork().then((networkInfo) => {
      setNetworkInfo(networkInfo);
    });

    if (account) {
      library?.getBalance(account).then((result) => {
        setBalance((+result/1e18).toString());
      });
    } else {
      setBalance('');
    }
  }, [library, account]);

  return (
    <div className="App">
      <header className="App-header">
        {
          active ? (
            <div>
              <div>ChainId: {chainId}</div>
              <div>Network: {networkInfo?.name}</div>
              <div>Account: {getWalletAddress(account)} {active && (
                <span>✅ </span>
              )}
              </div>
              <div>Balance: {balance}</div>
            </div>
          ) : (
            <button type="button" onClick={onClick}>
              Connect Wallet
            </button>
          )
        }
      </header>
    </div>
  )
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App(data: any) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div>
        <nav style={{ textAlign: 'center' }}>
          <h2>Hello World</h2>
        </nav>
        <ConnectWallet />
      </div>
    </Web3ReactProvider>
  );
}

export default App;
