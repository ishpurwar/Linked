'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/Web3Provider';
import { createDatingAppContract } from '@/lib/web3';
import { contractAddress, likeTokenAddress, superLikeTokenAddress } from '@/lib/constants';

export default function TestPage() {
  const { signer, isConnected, connectWallet } = useWeb3();
  const [contract, setContract] = useState<any>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [currentAddress, setCurrentAddress] = useState<string>('');

  useEffect(() => {
    if (signer) {
      setContract(createDatingAppContract(signer));
      // Get current user address
      signer.getAddress().then(setCurrentAddress);
    }
  }, [signer]);

  const handleTest = async (testName: string, testFunction: () => Promise<any>) => {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
      setResults(prev => ({ 
        ...prev, 
        [testName]: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testFunctions = [
    {
      name: 'getIncomingLikes',
      label: 'Get Incoming Likes',
      description: 'Get addresses of users who have liked you',
      action: () => contract.getIncomingLikes(),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'getOutgoingLikes',
      label: 'Get Outgoing Likes',
      description: 'Get addresses of users you have liked',
      action: () => contract.getOutgoingLikes(),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'getMutualMatches',
      label: 'Get Mutual Matches',
      description: 'Get addresses of users with mutual likes',
      action: () => contract.getMutualMatches(),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'getIncomingSuperLikes',
      label: 'Get Incoming Super Likes',
      description: 'Get addresses of users who have super liked you',
      action: () => contract.getIncomingSuperLikes(),
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      name: 'getOutgoingSuperLikes',
      label: 'Get Outgoing Super Likes',
      description: 'Get addresses of users you have super liked',
      action: () => contract.getOutgoingSuperLikes(),
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      name: 'getMutualSuperMatches',
      label: 'Get Mutual Super Matches',
      description: 'Get addresses of users with mutual super likes',
      action: () => contract.getMutualSuperMatches(),
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  const tokenFunctions = [
    {
      name: 'getLikeTokenBalance',
      label: 'Get Like Token Balance',
      description: 'Check your Like token balance',
      action: () => contract.getLikeTokenBalance(currentAddress),
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      name: 'getSuperLikeTokenBalance',
      label: 'Get Super Like Token Balance',
      description: 'Check your Super Like token balance',
      action: () => contract.getSuperLikeTokenBalance(currentAddress),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'approveLikeTokens',
      label: 'Approve Like Tokens',
      description: 'Approve contract to spend your Like tokens',
      action: () => contract.approveLikeTokens(),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'approveSuperLikeTokens',
      label: 'Approve Super Like Tokens',
      description: 'Approve contract to spend your Super Like tokens',
      action: () => contract.approveSuperLikeTokens(),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  const formatResult = (result: any) => {
    if (Array.isArray(result)) {
      return result.length === 0 
        ? 'No results found' 
        : result.map((address, index) => (
            <div key={index} className="font-mono text-sm break-all">
              {address}
            </div>
          ));
    }
    if (typeof result === 'string' && result.startsWith('Error:')) {
      return <span className="text-red-400">{result}</span>;
    }
    return <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Smart Contract Test Page</h1>
          <p className="text-gray-300 mb-8">Connect your wallet to test the smart contract functions</p>
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Smart Contract Function Tests</h1>
          <p className="text-gray-300 mb-2">Test the DatingApp smart contract functions</p>
          <p className="text-sm text-gray-400 font-mono break-all">
            Current Address: {currentAddress}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testFunctions.map((testFunc) => (
            <div key={testFunc.name} className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{testFunc.label}</h3>
              <p className="text-gray-400 text-sm mb-4">{testFunc.description}</p>
              <button
                onClick={() => handleTest(testFunc.name, testFunc.action)}
                disabled={loading[testFunc.name]}
                className={`w-full ${testFunc.color} text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading[testFunc.name] ? 'Loading...' : 'Test Function'}
              </button>
            </div>
          ))}
        </div>

        {/* Token Functions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Token Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tokenFunctions.map((tokenFunc) => (
              <div key={tokenFunc.name} className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">{tokenFunc.label}</h4>
                <p className="text-gray-400 text-xs mb-3">{tokenFunc.description}</p>
                <button
                  onClick={() => handleTest(tokenFunc.name, tokenFunc.action)}
                  disabled={loading[tokenFunc.name]}
                  className={`w-full ${tokenFunc.color} text-white font-bold py-2 px-3 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading[tokenFunc.name] ? 'Loading...' : 'Test'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Test Results</h2>
          {Object.keys(results).length === 0 ? (
            <p className="text-gray-400">No tests run yet. Click a button above to test a function.</p>
          ) : (
            Object.entries(results).map(([testName, result]) => (
              <div key={testName} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {testName.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="bg-gray-900 rounded p-4 overflow-auto">
                  {formatResult(result)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Additional Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Additional Test Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleTest('getAllUsers', () => contract.getAllUsers())}
              disabled={loading.getAllUsers}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
              {loading.getAllUsers ? 'Loading...' : 'Get All Users'}
            </button>
            <button
              onClick={() => handleTest('getTotalProfiles', () => contract.getTotalProfiles())}
              disabled={loading.getTotalProfiles}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
              {loading.getTotalProfiles ? 'Loading...' : 'Get Total Profiles'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">How to Test</h3>
          <div className="space-y-2 text-gray-300">
            <p>1. Make sure you have created a profile first</p>
            <p>2. Check your token balances using the token functions above</p>
            <p>3. If you don't have tokens, create a profile to get 100 free tokens</p>
            <p>4. Approve tokens before liking/super liking other users</p>
            <p>5. To test likes and matches, you need other users to interact with</p>
            <p>6. Use the main app to like/super like other users</p>
            <p>7. Come back here to test if the functions return the correct data</p>
            <p>8. Each button tests a specific smart contract function</p>
          </div>
        </div>

        {/* Token Addresses for Reference */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Contract Information</h3>
          <div className="space-y-2 text-sm text-gray-300 font-mono">
            <p><span className="text-gray-400">Dating Contract:</span> {contractAddress}</p>
            <p><span className="text-gray-400">Like Token:</span> {likeTokenAddress}</p>
            <p><span className="text-gray-400">Super Like Token:</span> {superLikeTokenAddress}</p>
          </div>
        </div>        {/* How Like System Works */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">How the Like System Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-2">Regular Likes ❤️</h4>
              <ul className="space-y-1 text-sm">
                <li>• Sends 1 LikeToken to the target user</li>
                <li>• Creates a match if both users like each other</li>
                <li>• Tracked in incoming/outgoing likes arrays</li>
                <li>• Can only like each user once</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">Super Likes ⭐</h4>
              <ul className="space-y-1 text-sm">
                <li>• Sends 1 SuperLikeToken to the target user</li>
                <li>• Creates a super match if both users super like each other</li>
                <li>• Tracked separately from regular likes</li>
                <li>• Shows extra interest in the person</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
