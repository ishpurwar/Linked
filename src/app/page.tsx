"use client";

import Link from "next/link";
import { useWeb3 } from "../lib/Web3Provider";
import { useEffect, useState, useCallback } from "react";
import { checkUserExists } from "../lib/supabase";
import { createDatingAppContract } from "@/lib/web3";

import ChatBox from "../components/ChatBox";

export default function Home() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [userExists, setUserExists] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [results, setResults] = useState<Record<string, string[] | string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [currentAddress, setCurrentAddress] = useState<string>("");

  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatWithAddress, setChatWithAddress] = useState<string>("");
  useEffect(() => {
    const checkExists = async (account: string) => {
      if (account) {
        try {
          const user = await checkUserExists(account);
          setUserExists(!!user);
        } catch (error) {
          console.error("Error checking user existence:", error);
          setUserExists(false);
        }
      } else {
        setUserExists(false);
      }
    };

    if (account) {
      checkExists(account);
    }
  }, [account]);
  useEffect(() => {
    if (signer) {
      setContract(createDatingAppContract(signer));
      // Get current user address
      signer.getAddress().then(setCurrentAddress);
    }
  }, [signer]);

 

  // Function to start chat
  const startChat = (address: string) => {
    setChatWithAddress(address);
    setShowChat(true);
  };

  // Function to close chat
  const closeChat = () => {
    setShowChat(false);
    setChatWithAddress("");
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-8xl mb-6 animate-float">💕</div>
          <h1 className="text-6xl font-bold gradient-text mb-6 animate-slide-up">
            Get Linked
          </h1>
          <p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            A dating platform where your likes are tokens you spend and earn.
          </p>

          {!isConnected ? (
            <div
              className="space-y-6 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="text-gray-400 text-lg">
                Connect your wallet to start your journey
              </p>
              <button
                onClick={connectWallet}
                className="btn-purple text-white px-8 py-4 rounded-xl text-xl font-semibold animate-glow"
              >
                Connect Wallet
              </button>
              <div className="mt-8 glass-purple p-6 rounded-2xl max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-white mb-3">
                  ✨ Why Choose Linked?
                </h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>🔒 Decentralized and secure</li>
                  <li>🎭 Own your profile as an NFT</li>
                  <li>💎 Earn tokens for interactions</li>
                  <li>🌟 Truly anonymous until you match</li>
                </ul>
              </div>
            </div>
          ) : (
            <div
              className="space-y-8 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex gap-6 items-center justify-center flex-col sm:flex-row">
                {!userExists && (
                  <Link
                    href="/createprofile"
                    className="btn-purple text-white px-8 py-4 rounded-xl text-xl font-semibold group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="group-hover:scale-110 transition-transform">
                        👤
                      </span>
                      Create Your Profile
                    </span>
                  </Link>
                )}
                {userExists && (
                  <Link
                    href="/match"
                    className="glass text-white border-2 border-purple-500/50 px-8 py-4 rounded-xl text-xl font-semibold hover:border-purple-400 hover:bg-purple-600/20 transition-all duration-300 card-hover group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="group-hover:scale-110 transition-transform">
                        💝
                      </span>
                      Discover Matches
                    </span>
                  </Link>
                )}
              </div>
              

              {/* Feature cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                <div
                  className="glass-purple p-6 rounded-2xl card-hover animate-slide-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="text-3xl mb-3">🎭</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    NFT Profiles
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Your profile is minted as an NFT, giving you true ownership
                    of your digital identity.
                  </p>
                </div>
                <div
                  className="glass-purple p-6 rounded-2xl card-hover animate-slide-up"
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="text-3xl mb-3">💎</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Token Economy
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Earn Like and SuperLike tokens. Use them strategically to
                    show interest.
                  </p>
                </div>
                <div
                  className="glass-purple p-6 rounded-2xl card-hover animate-slide-up"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="text-3xl mb-3">🎁</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    100  Like & SuperLike Tokens
                  </h3>
                  <p className="text-gray-300 text-sm">
                    100 free Like & SuperLike tokens to kickstart your
                    connections.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Matching Feature Section */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Let's get linked
            </h2>
            <p className="text-gray-300 text-lg">
              Leverage on-chain profiles and token-based interactions to forge genuine connections based on shared interests and real engagement.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Profile Cards */}
            <div className="relative">
              {/* Profile Card 1 */}
              <div
                className="glass-purple p-6 rounded-2xl mb-6 card-hover animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">👨</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Alex</h3>
                    <p className="text-gray-300">25 years old</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Cooking
                  </span>
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Art
                  </span>
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Development
                  </span>
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Guitar
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Piano
                  </span>
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Board games
                  </span>
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Anime
                  </span>
                  <span className="px-3 py-1 bg-lime-400 text-black text-sm rounded-full font-medium">
                    Gaming
                  </span>
                </div>
              </div>

              {/* Profile Card 2 */}
              <div
                className="glass-purple p-6 rounded-2xl card-hover animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">👩</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Sarah</h3>
                    <p className="text-gray-300">23 years old</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-lime-400 text-black px-4 py-2 rounded-full font-bold">
                    <span className="text-purple-600">💜</span>
                    <span>94%</span>
                  </div>
                </div>
              </div>

              {/* Floating Match Notification */}
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                <div className="bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce">
                  <span className="font-bold text-lg">it&apos;s a match!</span>
                </div>
              </div>

              {/* Floating Hearts */}
              <div className="absolute -top-4 left-1/4 text-3xl animate-float">
                ❤️
              </div>
            </div>

            {/* Right side - Description */}
            <div className="text-center lg:text-left">
              <p className="text-pink-500 text-3xl font-extrabold">
                Leverage on-chain profiles and token-based interactions to forge genuine connections based on shared interests and real engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Problems Section - Chat Style */}
        <div className="max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-pink-500 mb-4">
              Solving Dating App Problems
            </h2>
            <p className="text-pink-300 text-xl">
              Traditional dating apps have issues. We&apos;re building the solution.
            </p>
          </div>

          <div className="space-y-8">
            {/* Problem Bubble 1 */}
            <div
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-2xl rounded-tl-sm max-w-md">
                <p className="font-medium">
                  Users spam likes carelessly, leading to meaningless matches and overwhelming genuine users with fake interest.
                </p>
              </div>
            </div>

            {/* Solution Bubble 1 */}
            <div
              className="flex items-start gap-4 justify-end animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="bg-lime-400 text-black p-4 rounded-2xl rounded-tr-sm max-w-md">
                <p className="font-medium">
                  Tokenized likes require users to spend tokens for each like, making interactions more thoughtful and genuine while preventing spam.
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💜</span>
              </div>
            </div>

            {/* Problem Bubble 2 */}
            <div
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-2xl rounded-tl-sm max-w-md">
                <p className="font-medium">
                  Scammers and bots infest dating apps, making it difficult to connect with genuine people.
                </p>
              </div>
            </div>

            {/* Solution Bubble 2 */}
            <div
              className="flex items-start gap-4 justify-end animate-slide-up"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="bg-lime-400 text-black p-4 rounded-2xl rounded-tr-sm max-w-md">
                <p className="font-medium">
                  Blockchain verification and wallet connections ensure all users are real and accountable.
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💜</span>
              </div>
            </div>

            {/* Problem Bubble 3 */}
            <div
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: "1s" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-2xl rounded-tl-sm max-w-md">
                <p className="font-medium">
                  Users lose interest quickly when matches don't value their likes, creating a throwaway mentality.
                </p>
              </div>
            </div>

            {/* Solution Bubble 3 */}
            <div
              className="flex items-start gap-4 justify-end animate-slide-up"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="bg-lime-400 text-black p-4 rounded-2xl rounded-tr-sm max-w-md">
                <p className="font-medium">
                  When likes cost tokens, every interaction has real value. Users appreciate and respond more to meaningful gestures.
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💜</span>
              </div>
            </div>

            {/* Problem Bubble 4 */}
            <div
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-2xl rounded-tl-sm max-w-md">
                <p className="font-medium">
                  Traditional apps have unlimited likes, making it impossible to gauge genuine interest from casual browsing.
                </p>
              </div>
            </div>

            {/* Solution Bubble 4 */}
            <div
              className="flex items-start gap-4 justify-end animate-slide-up"
              style={{ animationDelay: "1.6s" }}
            >
              <div className="bg-lime-400 text-black p-4 rounded-2xl rounded-tr-sm max-w-md">
                <p className="font-medium">
                  Limited token supply creates scarcity. Users save their tokens for profiles they're truly interested in, creating authentic connections.
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💜</span>
              </div>
            </div>

            {/* Problem Bubble 5 */}
            <div
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: "1.8s" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-2xl rounded-tl-sm max-w-md">
                <p className="font-medium">
                  Premium features are locked behind paywalls, creating unfair advantages for wealthy users.
                </p>
              </div>
            </div>

            {/* Solution Bubble 7 */}
            <div
              className="flex items-start gap-4 justify-end animate-slide-up"
              style={{ animationDelay: "2s" }}
            >
              <div className="bg-lime-400 text-black p-4 rounded-2xl rounded-tr-sm max-w-md">
                <p className="font-medium">
                  Earn tokens through genuine interactions and profile engagement. Active users can access premium features without spending money.
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💜</span>
              </div>
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
