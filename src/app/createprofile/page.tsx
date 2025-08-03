'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../../lib/Web3Provider';
import { createDatingAppContract, ProfileData } from '../../lib/web3';

export default function CreateProfile() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    age: 0,
    interests: '',
    uri: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signer) {
      setError('Please connect your wallet first');
      return;
    }

    if (!formData.name || !formData.age || !formData.interests) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const contract = createDatingAppContract(signer);
      
      // For now, we'll use a placeholder URI. In a real app, you'd upload to IPFS
      const profileDataWithUri = {
        ...formData,
        uri: formData.uri || `https://example.com/profile/${account}`,
      };

      const tx = await contract.createProfile(profileDataWithUri);
      setTxHash(tx.hash);
      
      // Wait for transaction confirmation
      await tx.wait();
      
      alert('Profile created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        age: 0,
        interests: '',
        uri: '',
      });
    } catch (error: any) {
      console.error('Error creating profile:', error);
      setError(error.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to create a dating profile
          </p>
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Your Dating Profile
        </h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Connected Wallet:</span>
          </p>
          <p className="text-xs text-gray-500 break-all">
            {account}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleInputChange}
              required
              min="18"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
              Interests *
            </label>
            <textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., hiking,music,cooking"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate interests with commas
            </p>
          </div>

          <div>
            <label htmlFor="uri" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image URI
            </label>
            <input
              type="url"
              id="uri"
              name="uri"
              value={formData.uri}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="https://example.com/your-image.jpg (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use a default URI
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {txHash && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-600 text-sm">
                Transaction submitted: 
                <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  View on Etherscan
                </a>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Creating a profile will mint an NFT and give you 100 free Like and SuperLike tokens!
          </p>
        </div>
      </div>
    </div>
  );
}