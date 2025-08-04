'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../lib/Web3Provider';
import { createDatingAppContract } from '../../lib/web3';
import ImageCarousel from '../../components/ImageCarousel';

interface Profile {
  name: string;
  age: string;
  interests: string;
  uri: string[]; // Changed to array
  owner: string;
}

interface UserCard {
  address: string;
  profile: Profile | null;
  tokenId: number | null;
}

export default function Match() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [users, setUsers] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    if (!signer) return;

    setIsLoading(true);
    setError(null);

    try {
      const contract = createDatingAppContract(signer);
      const allUserAddresses = await contract.getAllUsers();
      
      const userCards: UserCard[] = [];

      for (const userAddress of allUserAddresses) {
        try {
          // Skip current user
          if (userAddress.toLowerCase() === account?.toLowerCase()) {
            continue;
          }

          const tokenId = await contract.getUserTokenId(userAddress);
          const profile = await contract.getProfileByTokenId(Number(tokenId));
          
          userCards.push({
            address: userAddress,
            profile,
            tokenId: Number(tokenId)
          });
        } catch (profileError) {
          console.error(`Error fetching profile for ${userAddress}:`, profileError);
          // Add user without profile data
          userCards.push({
            address: userAddress,
            profile: null,
            tokenId: null
          });
        }
      }

      setUsers(userCards);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && signer) {
      fetchAllUsers();
    }
  }, [isConnected, signer, account]);

  const handleLike = (userAddress: string) => {
    // Placeholder function - will be implemented later
    console.log('Like clicked for:', userAddress);
  };

  const handleSuperLike = (userAddress: string) => {
    // Placeholder function - will be implemented later
    console.log('Super Like clicked for:', userAddress);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to discover matches
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Matches
          </h1>
          <p className="text-gray-600">
            Browse profiles and find your perfect match
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-gray-600">Loading profiles...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-red-600 text-center">{error}</p>
            <button
              onClick={fetchAllUsers}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors block mx-auto"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && users.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-600 text-lg">No other users found on the platform yet.</p>
            <p className="text-gray-500 mt-2">Be the first to create connections!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div
              key={user.address}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Profile Image */}
              <div className="h-64">
                {user.profile?.uri && user.profile.uri.length > 0 ? (
                  <ImageCarousel 
                    images={user.profile.uri}
                    alt={user.profile.name || 'Profile'}
                    className="h-full"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <div className="text-6xl text-gray-400">👤</div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6">
                {user.profile ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {user.profile.name}
                      </h3>
                      <p className="text-gray-600">
                        Age: {user.profile.age}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Interests:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {user.profile.interests.split(',').map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full"
                          >
                            {interest.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      Unknown User
                    </h3>
                    <p className="text-gray-500 text-sm">Profile data unavailable</p>
                  </div>
                )}

                {/* Address (truncated) */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleLike(user.address)}
                    className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>❤️</span>
                    <span>Like</span>
                  </button>
                  <button
                    onClick={() => handleSuperLike(user.address)}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>⭐</span>
                    <span>Super</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        {users.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchAllUsers}
              disabled={isLoading}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Profiles'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
