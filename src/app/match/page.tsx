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
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});
  const [superLikeLoading, setSuperLikeLoading] = useState<Record<string, boolean>>({});
  const [likeTokenBalance, setLikeTokenBalance] = useState<string>('0');
  const [superLikeTokenBalance, setSuperLikeTokenBalance] = useState<string>('0');

  const fetchTokenBalances = async () => {
    if (!signer || !account) return;

    try {
      const contract = createDatingAppContract(signer);
      const likeBalance = await contract.getLikeTokenBalance(account);
      const superLikeBalance = await contract.getSuperLikeTokenBalance(account);
      
      setLikeTokenBalance(likeBalance);
      setSuperLikeTokenBalance(superLikeBalance);
    } catch (error) {
      console.error('Error fetching token balances:', error);
    }
  };

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
      fetchTokenBalances();
    }
  }, [isConnected, signer, account]);

  const handleLike = async (userAddress: string) => {
    if (!signer || !account) {
      alert('Please connect your wallet first');
      return;
    }

    setLikeLoading(prev => ({ ...prev, [userAddress]: true }));
    
    try {
      const contract = createDatingAppContract(signer);
      
      // Check if user has enough tokens and allowance
      const balance = await contract.getLikeTokenBalance(account);
      const allowance = await contract.checkLikeTokenAllowance(account);
      
      console.log('Like token balance:', balance);
      console.log('Like token allowance:', allowance);
      
      if (parseFloat(balance) < 1) {
        alert('Insufficient Like tokens! You need to get more tokens first.');
        return;
      }
      
      // If allowance is less than 1, approve tokens first
      if (parseFloat(allowance) < 1) {
        alert('Approving tokens for spending...');
        const approveTx = await contract.approveLikeTokens();
        console.log('Approval transaction submitted:', approveTx.hash);
        await approveTx.wait();
        console.log('Tokens approved successfully!');
      }
      
      // Now send the like
      const tx = await contract.likeUser(userAddress);
      
      // Show transaction hash to user
      console.log('Like transaction submitted:', tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      
      // Refresh token balances
      await fetchTokenBalances();
      
      alert('Like sent successfully! 💕');
    } catch (error: any) {
      console.error('Error liking user:', error);
      
      // Handle specific error messages
      if (error.message?.includes('Already liked this user')) {
        alert('You have already liked this user!');
      } else if (error.message?.includes('insufficient funds')) {
        alert('Insufficient tokens to send a like');
      } else if (error.message?.includes('Create your profile first')) {
        alert('Please create your profile first');
      } else if (error.message?.includes('ERC20InsufficientAllowance')) {
        alert('Token approval failed. Please try again.');
      } else {
        alert('Failed to send like. Please try again.');
      }
    } finally {
      setLikeLoading(prev => ({ ...prev, [userAddress]: false }));
    }
  };

  const handleSuperLike = async (userAddress: string) => {
    if (!signer || !account) {
      alert('Please connect your wallet first');
      return;
    }

    setSuperLikeLoading(prev => ({ ...prev, [userAddress]: true }));
    
    try {
      const contract = createDatingAppContract(signer);
      
      // Check if user has enough tokens and allowance
      const balance = await contract.getSuperLikeTokenBalance(account);
      const allowance = await contract.checkSuperLikeTokenAllowance(account);
      
      console.log('Super like token balance:', balance);
      console.log('Super like token allowance:', allowance);
      
      if (parseFloat(balance) < 1) {
        alert('Insufficient Super Like tokens! You need to get more tokens first.');
        return;
      }
      
      // If allowance is less than 1, approve tokens first
      if (parseFloat(allowance) < 1) {
        alert('Approving tokens for spending...');
        const approveTx = await contract.approveSuperLikeTokens();
        console.log('Approval transaction submitted:', approveTx.hash);
        await approveTx.wait();
        console.log('Tokens approved successfully!');
      }
      
      // Now send the super like
      const tx = await contract.superLikeUser(userAddress);
      
      // Show transaction hash to user
      console.log('Super like transaction submitted:', tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      
      // Refresh token balances
      await fetchTokenBalances();
      
      alert('Super like sent successfully! ⭐💕');
    } catch (error: any) {
      console.error('Error super liking user:', error);
      
      // Handle specific error messages
      if (error.message?.includes('Already super liked this user')) {
        alert('You have already super liked this user!');
      } else if (error.message?.includes('insufficient funds')) {
        alert('Insufficient tokens to send a super like');
      } else if (error.message?.includes('Create your profile first')) {
        alert('Please create your profile first');
      } else if (error.message?.includes('ERC20InsufficientAllowance')) {
        alert('Token approval failed. Please try again.');
      } else {
        alert('Failed to send super like. Please try again.');
      }
    } finally {
      setSuperLikeLoading(prev => ({ ...prev, [userAddress]: false }));
    }
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

        {/* Token Balance Display */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Your Token Balance</h3>
          <div className="flex justify-between items-center space-x-4">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">💕</span>
                <span className="text-sm text-gray-600">Like Tokens</span>
              </div>
              <p className="text-xl font-bold text-pink-600">{parseFloat(likeTokenBalance).toFixed(1)}</p>
            </div>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span className="text-sm text-gray-600">Super Like Tokens</span>
              </div>
              <p className="text-xl font-bold text-purple-600">{parseFloat(superLikeTokenBalance).toFixed(1)}</p>
            </div>
          </div>
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
                    disabled={likeLoading[user.address] || superLikeLoading[user.address]}
                    className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {likeLoading[user.address] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>❤️</span>
                        <span>Like</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSuperLike(user.address)}
                    disabled={likeLoading[user.address] || superLikeLoading[user.address]}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {superLikeLoading[user.address] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>⭐</span>
                        <span>Super</span>
                      </>
                    )}
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
