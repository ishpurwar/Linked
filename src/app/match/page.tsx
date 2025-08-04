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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="relative z-10 glass-purple p-8 rounded-2xl text-center max-w-md mx-4 animate-scale-in">
          <h1 className="text-3xl font-bold mb-4 gradient-text">Connect Your Wallet</h1>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to discover matches
          </p>
          <button
            onClick={connectWallet}
            className="btn-purple text-white px-6 py-3 rounded-lg animate-glow"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* Romantic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            💕 Discover Matches
          </h1>
          <p className="text-gray-300 text-lg">
            Browse profiles and find your perfect match on the blockchain
          </p>
        </div>

        {/* Token Balance Display */}
        <div className="glass-purple rounded-2xl p-6 mb-8 max-w-md mx-auto animate-slide-up card-hover">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Your Token Balance</h3>
          <div className="flex justify-between items-center space-x-6">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl animate-float">💕</span>
                <span className="text-sm text-purple-300">Like Tokens</span>
              </div>
              <p className="text-2xl font-bold text-pink-400">{parseFloat(likeTokenBalance).toFixed(1)}</p>
            </div>
            <div className="w-px h-12 bg-purple-500/30"></div>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl animate-float" style={{ animationDelay: '1s' }}>⭐</span>
                <span className="text-sm text-purple-300">Super Like Tokens</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{parseFloat(superLikeTokenBalance).toFixed(1)}</p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <span className="ml-4 text-gray-300 text-lg">Finding your perfect matches...</span>
          </div>
        )}

        {error && (
          <div className="glass border border-red-500/50 rounded-2xl p-6 mb-8 max-w-2xl mx-auto animate-scale-in">
            <p className="text-red-400 text-center text-lg">{error}</p>
            <button
              onClick={fetchAllUsers}
              className="mt-4 btn-purple text-white px-6 py-3 rounded-lg mx-auto block"
            >
              Try Again
            </button>
          </div>
        )}

        {users.length === 0 && !isLoading && !error && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-6 animate-float">💔</div>
            <p className="text-gray-300 text-xl mb-2">No other users found on the platform yet.</p>
            <p className="text-purple-400 mt-2">Be the first to create connections!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
          {users.map((user) => (
            <div
              key={user.address}
              className="glass-purple rounded-2xl overflow-hidden card-hover animate-scale-in relative"
            >
              {/* Profile Image */}
              <div className="h-[450px] overflow-hidden relative">
                {user.profile?.uri && user.profile.uri.length > 0 ? (
                  <ImageCarousel 
                    images={user.profile.uri}
                    alt={user.profile.name || 'Profile'}
                    className="h-full"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <div className="text-8xl text-purple-300 animate-pulse-slow">👤</div>
                  </div>
                )}
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
                
                {/* Profile Info - Overlaying at the top */}
                <div className="absolute top-0 left-0 right-0 p-6 z-10">
                  {user.profile ? (
                    <>
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white mb-1 gradient-text">
                          {user.profile.name}
                        </h3>
                        <p className="text-gray-300 text-lg">
                          Age: {user.profile.age}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-purple-300 mb-3">
                          💫 Interests:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.profile.interests.split(',').map((interest, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 glass border border-purple-400/30 text-purple-200 text-sm rounded-full hover:bg-purple-500/20 transition-colors"
                            >
                              {interest.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        Unknown User
                      </h3>
                      <p className="text-gray-400 text-sm">Profile data unavailable</p>
                    </div>
                  )}

                  {/* Address (truncated) */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-mono">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Overlaying at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex justify-between items-center space-x-4">
                  {/* Cross button (left) */}
                  <button
                    onClick={() => fetchAllUsers()} // Refreshes to show new profiles
                    disabled={likeLoading[user.address] || superLikeLoading[user.address]}
                    className="w-14 h-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300"
                    aria-label="Skip"
                  >
                    <span className="text-2xl text-white">✕</span>
                  </button>
                  
                  {/* Like button (middle) */}
                  <button
                    onClick={() => handleLike(user.address)}
                    disabled={likeLoading[user.address] || superLikeLoading[user.address]}
                    className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                    aria-label="Like"
                  >
                    {likeLoading[user.address] ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                    <span className="text-2xl animate-pulse">❤️</span>
                    )}
                  </button>
                  
                  {/* Super Like button (right) */}
                  <button
                    onClick={() => handleSuperLike(user.address)}
                    disabled={likeLoading[user.address] || superLikeLoading[user.address]}
                    className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                    aria-label="Super Like"
                  >
                    {superLikeLoading[user.address] ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                    <span className="text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</span>
                    )}
                  </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Refresh Button */}
        {users.length > 0 && (
          <div className="text-center mt-12 animate-fade-in">
            <button
              onClick={fetchAllUsers}
              disabled={isLoading}
              className="glass-purple text-purple-300 px-8 py-4 rounded-xl hover:text-white transition-all duration-300 disabled:opacity-50 border border-purple-500/30 hover:border-purple-400 font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
                  Refreshing...
                </span>
              ) : (
                '🔄 Refresh Profiles'
              )}
            </button>
          </div>
        )}
      

      
      </div>
    </div>
  );
}
