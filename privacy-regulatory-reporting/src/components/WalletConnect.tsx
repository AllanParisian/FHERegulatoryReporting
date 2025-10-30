'use client';

import { useContract } from '@/hooks/useContract';
import { CONTRACT_ADDRESS } from '@/lib/contract';

export default function WalletConnect() {
  const { account, isConnected, isConnecting, network, connectWallet } = useContract();

  const handleConnect = async () => {
    const result = await connectWallet();
    if (!result.success) {
      alert(`Failed to connect wallet: ${result.error}`);
    }
  };

  const handleCheckStatus = () => {
    const ethereum = (window as any).ethereum;
    const statusMsg = `
System Status:
- MetaMask: ${ethereum ? '✅ Available' : '❌ Not available'}
- Wallet: ${isConnected ? '✅ Connected' : '❌ Not connected'}
- Account: ${account || 'Not connected'}
- Network: ${network ? `${network.name} (${network.chainId})` : 'Not connected'}
- Contract: ${CONTRACT_ADDRESS}
    `.trim();
    alert(statusMsg);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <button
          onClick={handleConnect}
          disabled={isConnected || isConnecting}
          className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}
        </button>
        <button
          onClick={handleCheckStatus}
          className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-6 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          Check Status
        </button>
      </div>

      {isConnected && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Connected Account:</span>
              <span className="font-mono text-gray-900">{account}</span>
            </div>
            {network && (
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Network:</span>
                <span className="text-gray-900">{network.name} ({network.chainId.toString()})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Contract:</span>
              <span className="font-mono text-gray-900 text-xs">{CONTRACT_ADDRESS}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
