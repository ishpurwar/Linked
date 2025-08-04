"use client";

import { useState } from "react";
import { useWeb3 } from "../../lib/Web3Provider";
import ChatBox from "../../components/ChatBox";

export default function ChatTestPage() {
  const { account, isConnected, connectWallet } = useWeb3();
  const [showChat, setShowChat] = useState(false);
  const [chatWithAddress, setChatWithAddress] = useState<string>("");

  const testAddresses = [
    "0x4624D326C5b378baFa227E59a3C87A5c97808b67",
    "0x1A05A7a19DC00A4ce12058a6A73e8F2C53eb3248",
  ];

  const startChat = (address: string) => {
    setChatWithAddress(address);
    setShowChat(true);
  };

  const closeChat = () => {
    setShowChat(false);
    setChatWithAddress("");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen glass flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-6">Chat Test</h1>
          <p className="text-gray-300 mb-8">
            Connect your wallet to test the chat functionality
          </p>
          <button
            onClick={connectWallet}
            className="btn-purple px-8 py-4 rounded-xl text-xl font-semibold"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen glass p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8">
          💬 Real-time Chat Test
        </h1>

        <div className="glass-purple p-8 rounded-3xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Wallet</h2>
          <div className="glass p-4 rounded-xl">
            <p className="text-white font-semibold mb-2">Connected Address:</p>
            <p className="text-gray-300 font-mono text-sm">{account}</p>
          </div>
        </div>

        <div className="glass-purple p-8 rounded-3xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Test Chat Partners
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {testAddresses.map((address, index) => (
              <div key={address} className="glass p-6 rounded-xl">
                <h3 className="text-white font-semibold mb-2">
                  Test Address #{index + 1}
                </h3>
                <p className="text-gray-300 font-mono text-sm mb-4">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  {address === account
                    ? "(Current wallet)"
                    : "Available for chat"}
                </p>
                <button
                  onClick={() => startChat(address)}
                  disabled={address === account}
                  className="btn-purple px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {address === account ? "Same wallet" : "Start Chat"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-purple p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-6">How to Test</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <p>Connect with your first wallet address</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <p>Click &ldquo;Start Chat&rdquo; with the other test address</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <p>Send some messages</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <p>Switch to your second wallet (MetaMask account switching)</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                5
              </span>
              <p>
                Start a chat with the first address to see real-time messaging!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      {showChat && account && chatWithAddress && (
        <ChatBox
          currentUserAddress={account}
          otherUserAddress={chatWithAddress}
          onClose={closeChat}
        />
      )}
    </div>
  );
}
