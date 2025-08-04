'use client';

import Link from "next/link";
import { useWeb3 } from "../lib/Web3Provider";

export default function Home() {
  const { isConnected, connectWallet } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to Linked
          </h1>
          

          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-gray-600">Connect your wallet to get started</p>
              <button 
                onClick={connectWallet} 
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
                <Link 
                  href="/createprofile" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
                >
                  Create Your Profile
                </Link>
                <Link 
                  href="/match" 
                  className="bg-white text-gray-800 border-2 border-gray-300 px-8 py-3 rounded-lg text-lg hover:border-pink-500 hover:text-pink-600 transition-colors"
                >
                  Discover Matches
                </Link>
              </div>
              <div className="text-center">
                <Link 
                  href="/test" 
                  className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  🧪 Test Smart Contract Functions
                </Link>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}