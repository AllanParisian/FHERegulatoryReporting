'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

export function useContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<ethers.Network | null>(null);

  const connectWallet = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);

      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask browser extension.');
      }

      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts available. Please make sure MetaMask is unlocked.');
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const ethersSigner = await provider.getSigner();
      const address = await ethersSigner.getAddress();
      const networkInfo = await provider.getNetwork();

      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        ethersSigner
      );

      setSigner(ethersSigner);
      setAccount(address);
      setContract(contractInstance);
      setNetwork(networkInfo);
      setIsConnected(true);

      return { success: true, address };
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      return { success: false, error: error.message };
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0 || accounts[0] !== account) {
          window.location.reload();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  return {
    contract,
    signer,
    account,
    isConnected,
    isConnecting,
    network,
    connectWallet,
  };
}
