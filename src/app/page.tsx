"use client";

import Link from "next/link";
import { useWeb3 } from "../lib/Web3Provider";
import { useEffect, useState, useCallback } from "react";
import { checkUserExists } from "../lib/supabase";
import { createDatingAppContract } from "@/lib/web3";
import {
  contractAddress,
  likeTokenAddress,
  superLikeTokenAddress,
} from "@/lib/constants";
import ChatBox from "../components/ChatBox";
import ImageCarousel from "@/components/ImageCarousel";
import ProfileCard from "@/components/ProfileCard";
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

  // Auto-load all data when contract is ready and user exists
  useEffect(() => {
    const loadAllData = async () => {
      if (!contract || !userExists) return;

      const functions = [
        {
          name: "getMutualMatches",
          fn: async () => {
            // Call actual contract function
            const result = await (contract as any).getMutualMatches();
            if (!result) {
              return [];
            }

            // Process the result array and fetch profile data for each match
            const processedResult = [];
            for (const userAddress of result) {
              try {
                const tokenId = await (contract as any).getUserTokenId(
                  userAddress
                );
                const profile = await (contract as any).getProfileByTokenId(
                  Number(tokenId)
                );
                processedResult.push({
                  address: userAddress,
                  profile,
                  tokenId: Number(tokenId),
                });
              } catch (error) {
                console.error(
                  `Error fetching profile for ${userAddress}:`,
                  error
                );
                // Still include the address even if profile fetch fails
                processedResult.push({
                  address: userAddress,
                  profile: null,
                  tokenId: null,
                });
              }
            }
            return processedResult || [];
          },
        },
        {
          name: "getOutgoingLikes",
          fn: async () => {
            // Call actual contract function
            const result = await (contract as any).getOutgoingLikes();
            if (!result) {
              return [];
            }

            // Process the result array and fetch profile data for each match
            const processedResult = [];
            for (const userAddress of result) {
              try {
                const tokenId = await (contract as any).getUserTokenId(
                  userAddress
                );
                const profile = await (contract as any).getProfileByTokenId(
                  Number(tokenId)
                );
                processedResult.push({
                  address: userAddress,
                  profile,
                  tokenId: Number(tokenId),
                });
              } catch (error) {
                console.error(
                  `Error fetching profile for ${userAddress}:`,
                  error
                );
                // Still include the address even if profile fetch fails
                processedResult.push({
                  address: userAddress,
                  profile: null,
                  tokenId: null,
                });
              }
            }
            return processedResult || [];
          },
        },
        {
          name: "getIncomingLikes",
          fn: async () => {
            // Call actual contract function
            const result = await (contract as any).getIncomingLikes();
            if (!result) {
              return [];
            }

            // Process the result array and fetch profile data for each match
            const processedResult = [];
            for (const userAddress of result) {
              try {
                const tokenId = await (contract as any).getUserTokenId(
                  userAddress
                );
                const profile = await (contract as any).getProfileByTokenId(
                  Number(tokenId)
                );
                processedResult.push({
                  address: userAddress,
                  profile,
                  tokenId: Number(tokenId),
                });
              } catch (error) {
                console.error(
                  `Error fetching profile for ${userAddress}:`,
                  error
                );
                // Still include the address even if profile fetch fails
                processedResult.push({
                  address: userAddress,
                  profile: null,
                  tokenId: null,
                });
              }
            }
            return processedResult || [];
          },
        },
        {
          name: "getIncomingSuperLikes",
          fn: async () => {
            // Call actual contract function
            const result = await (contract as any).getIncomingSuperLikes();
            if (!result) {
              return [];
            }

            // Process the result array and fetch profile data for each match
            const processedResult = [];
            for (const userAddress of result) {
              try {
                const tokenId = await (contract as any).getUserTokenId(
                  userAddress
                );
                const profile = await (contract as any).getProfileByTokenId(
                  Number(tokenId)
                );
                processedResult.push({
                  address: userAddress,
                  profile,
                  tokenId: Number(tokenId),
                });
              } catch (error) {
                console.error(
                  `Error fetching profile for ${userAddress}:`,
                  error
                );
                // Still include the address even if profile fetch fails
                processedResult.push({
                  address: userAddress,
                  profile: null,
                  tokenId: null,
                });
              }
            }
            return processedResult || [];
          },
        },
        {
          name: "getOutgoingSuperLikes",
          fn: async () => {
            // Call actual contract function
            const result = await (contract as any).getOutgoingSuperLikes();
            if (!result) {
              return [];
            }

            // Process the result array and fetch profile data for each match
            const processedResult = [];
            for (const userAddress of result) {
              try {
                const tokenId = await (contract as any).getUserTokenId(
                  userAddress
                );
                const profile = await (contract as any).getProfileByTokenId(
                  Number(tokenId)
                );
                processedResult.push({
                  address: userAddress,
                  profile,
                  tokenId: Number(tokenId),
                });
              } catch (error) {
                console.error(
                  `Error fetching profile for ${userAddress}:`,
                  error
                );
                // Still include the address even if profile fetch fails
                processedResult.push({
                  address: userAddress,
                  profile: null,
                  tokenId: null,
                });
              }
            }
            return processedResult || [];
          },
        },
        {
          name: "getMutualSuperMatches",
          fn: async () => {
            // Call actual contract function
            const result = await (contract as any).getMutualSuperMatches();
            if (!result) {
              return [];
            }

            // Process the result array and fetch profile data for each match
            const processedResult = [];
            for (const userAddress of result) {
              try {
                const tokenId = await (contract as any).getUserTokenId(
                  userAddress
                );
                const profile = await (contract as any).getProfileByTokenId(
                  Number(tokenId)
                );
                processedResult.push({
                  address: userAddress,
                  profile,
                  tokenId: Number(tokenId),
                });
              } catch (error) {
                console.error(
                  `Error fetching profile for ${userAddress}:`,
                  error
                );
                // Still include the address even if profile fetch fails
                processedResult.push({
                  address: userAddress,
                  profile: null,
                  tokenId: null,
                });
              }
            }
            return processedResult || [];
          },
        },
      ];

      // Load all functions in parallel
      functions.forEach(({ name, fn }) => {
        handleTest(name, fn);
      });
    };

    loadAllData();
  }, [contract, userExists]);

  const handleTest = useCallback(
    async (
      testName: string,
      testFunction: () => Promise<string[] | string>
    ) => {
      if (!contract) {
        return;
      }

      setLoading((prev) => ({ ...prev, [testName]: true }));
      try {
        const result = await testFunction();
        setResults((prev) => ({ ...prev, [testName]: result }));
      } catch (error) {
        console.error(`Error in ${testName}:`, error);
        setResults((prev) => ({
          ...prev,
          [testName]: `Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [testName]: false }));
      }
    },
    [contract]
  );

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
            Welcome to Linked
          </h1>
          <p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            The future of dating is here. Connect, discover, and find your
            perfect match on the blockchain.
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
              <div className="text-center">
                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 glass-purple text-purple-300 px-6 py-3 rounded-lg text-sm hover:text-white transition-colors duration-300 group"
                >
                  <span className="group-hover:scale-110 transition-transform">
                    🧪
                  </span>
                  Test Smart Contract Functions
                </Link>
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
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Privacy First
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Your data stays on-chain, encrypted and secure. No central
                    authority.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Matching Feature Section - Inspired by design */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Smart Matching Algorithm
            </h2>
            <p className="text-gray-300 text-lg">
              The app helps in finding individuals with similar interests,
              facilitated by a compatibility percentage feature.
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

            {/* Right side - Features */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Our aim was to foster a sense of effortless and engaging
                  connection between like-minded individuals.
                </h3>
              </div>

              <div className="grid gap-4">
                <div
                  className="glass p-4 rounded-xl animate-slide-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="text-white font-semibold">
                        Precision Matching
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Advanced algorithm analyzes interests and compatibility
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="glass p-4 rounded-xl animate-slide-up"
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="text-white font-semibold">
                        Compatibility Score
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Real-time percentage based on shared interests
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="glass p-4 rounded-xl animate-slide-up"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="text-white font-semibold">
                        Instant Connections
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Connect immediately when interests align
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Section - Chat Style */}
        <div className="max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Solving Dating App Problems
            </h2>
            <p className="text-gray-300 text-lg">
              Traditional dating apps have issues. We&apos;re building the
              solution.
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
                  Dating app users often struggle to find a match who genuinely
                  shares their interests.
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
                  Our blockchain-based matching uses verified interests and
                  compatibility algorithms for genuine connections.
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
                  Some users may end up with no matches or likes at all,
                  damaging their self-esteem.
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
                  Token rewards and NFT profiles ensure every user has value and
                  opportunities to connect.
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
                  Scammers and bots infest dating apps, making it difficult to
                  connect with genuine people.
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
                  Blockchain verification and wallet connections ensure all
                  users are real and accountable.
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💜</span>
              </div>
            </div>
          </div>
        </div>
        {/* Comprehensive Matches & Likes Dashboard - Only for existing users */}
        {userExists && (
          <div className="max-w-6xl mx-auto mb-20 animate-fade-in">
            <div className="glass-purple p-8 rounded-3xl">
              <h2 className="text-4xl font-bold gradient-text mb-6 text-center">
                Your Dating Dashboard 💕
              </h2>
              <p className="text-gray-300 text-center mb-12">
                Manage all your connections, likes, and matches in one place!
              </p>

              {/* Main Grid Layout */}
              <div className="flex flex-col gap-10 ">
                {/* LEFT COLUMN - Matches & Incoming */}

                {/* Mutual Matches */}
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    💕 Mutual Matches
                  </h3>

                  {loading.getMutualMatches ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                      <span className="ml-3 text-gray-300">
                        Loading mutual matches...
                      </span>
                    </div>
                  ) : results.getMutualMatches &&
                    Array.isArray(results.getMutualMatches) &&
                    results.getMutualMatches.length > 0 ? (
                    <div className="space-y-3">
                     
                      
                      {(results.getMutualMatches as any[]).map(
                        (incomingSuperLike: any, index: number) => {
                          const address =
                            typeof incomingSuperLike === "string"
                              ? incomingSuperLike
                              : incomingSuperLike.address;
                          const profile =
                            typeof incomingSuperLike === "object"
                              ? incomingSuperLike.profile
                              : null;

                          return (
                            <ProfileCard
                              key={index}
                              address={address}
                              profile={profile}
                              index={index}
                              variant="outgoing"
                              statusLabel="YOU SUPER LIKED"
                              chat={true}
                              badge={
                                <div className="px-2 py-1 bg-red-500/80 text-white text-xs rounded-full">
                                   Match You
                                </div>
                              }
                            />
                          );
                        }
                      )}

                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">💔</div>
                      <p className="text-gray-300 text-sm">
                        No mutual matches yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Mutual Super Matches */}
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    ✨ Mutual Super Matches
                  </h3>

                  {loading.getMutualSuperMatches ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                      <span className="ml-3 text-gray-300">
                        Loading super matches...
                      </span>
                    </div>
                  ) : results.getMutualSuperMatches &&
                    Array.isArray(results.getMutualSuperMatches) &&
                    results.getMutualSuperMatches.length > 0 ? (
                    <div className="space-y-3">
                      {(results.getMutualSuperMatches as any[]).map(
                        (incomingSuperLike: any, index: number) => {
                          const address =
                            typeof incomingSuperLike === "string"
                              ? incomingSuperLike
                              : incomingSuperLike.address;
                          const profile =
                            typeof incomingSuperLike === "object"
                              ? incomingSuperLike.profile
                              : null;

                          return (
                            <ProfileCard
                              key={index}
                              address={address}
                              profile={profile}
                              index={index}
                              variant="outgoing"
                              statusLabel="YOU SUPER LIKED"
                              chat={true}
                              badge={
                                <div className="px-2 py-1 bg-yellow-500/80 text-white text-xs rounded-full">
                                  Super Match You
                                </div>
                              }
                            />
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">⭐</div>
                      <p className="text-gray-300 text-sm">
                        No mutual super matches yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Incoming Likes */}
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    💙 Incoming Likes
                  </h3>

                  {loading.getIncomingLikes ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-300">
                        Loading incoming likes...
                      </span>
                    </div>
                  ) : results.getIncomingLikes &&
                    Array.isArray(results.getIncomingLikes) &&
                    results.getIncomingLikes.length > 0 ? (
                    <div className="space-y-3">
                      {(results.getIncomingLikes as any[]).map(
                        (incomingSuperLike: any, index: number) => {
                          const address =
                            typeof incomingSuperLike === "string"
                              ? incomingSuperLike
                              : incomingSuperLike.address;
                          const profile =
                            typeof incomingSuperLike === "object"
                              ? incomingSuperLike.profile
                              : null;

                          return (
                            <ProfileCard
                              key={index}
                              address={address}
                              profile={profile}
                              index={index}
                              variant="outgoing"
                              statusLabel="YOU SUPER LIKED"
                              badge={
                                <div className="px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full">
                                  Liked You
                                </div>
                              }
                            />
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">💌</div>
                      <p className="text-gray-300 text-sm">
                        No incoming likes yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Incoming Super Likes */}
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    💖 Incoming Super Likes
                  </h3>

                  {loading.getIncomingSuperLikes ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                      <span className="ml-3 text-gray-300">
                        Loading super likes...
                      </span>
                    </div>
                  ) : results.getIncomingSuperLikes &&
                    Array.isArray(results.getIncomingSuperLikes) &&
                    results.getIncomingSuperLikes.length > 0 ? (
                    <div className="space-y-3">
                      {(results.getIncomingSuperLikes as any[]).map(
                        (incomingSuperLike: any, index: number) => {
                          const address =
                            typeof incomingSuperLike === "string"
                              ? incomingSuperLike
                              : incomingSuperLike.address;
                          const profile =
                            typeof incomingSuperLike === "object"
                              ? incomingSuperLike.profile
                              : null;

                          return (
                            <ProfileCard
                              key={index}
                              address={address}
                              profile={profile}
                              index={index}
                              variant="outgoing"
                              statusLabel="YOU SUPER LIKED"
                              badge={
                                <div className="px-2 py-1 bg-pink-500/80 text-white text-xs rounded-full">
                                  Super Liked You
                                </div>
                              }
                            />
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">🌟</div>
                      <p className="text-gray-300 text-sm">
                        No incoming super likes yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN - Outgoing */}

                {/* Outgoing Likes */}
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    💚 Your Likes
                  </h3>

                  {loading.getOutgoingLikes ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      <span className="ml-3 text-gray-300">
                        Loading your likes...
                      </span>
                    </div>
                  ) : results.getOutgoingLikes &&
                    Array.isArray(results.getOutgoingLikes) &&
                    results.getOutgoingLikes.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.getOutgoingLikes.map(
                        (outgoingLike: any, index: number) => {
                          const address =
                            typeof outgoingLike === "string"
                              ? outgoingLike
                              : outgoingLike.address;
                          const profile =
                            typeof outgoingLike === "object"
                              ? outgoingLike.profile
                              : null;

                          return (
                            <ProfileCard
                              key={index}
                              address={address}
                              profile={profile}
                              index={index}
                              variant="outgoing"
                              statusLabel="YOU LIKED"
                              badge={
                                <div className="px-2 py-1 bg-green-500/80 text-white text-xs rounded-full">
                                  Liked
                                </div>
                              }
                            />
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">💭</div>
                      <p className="text-gray-300 text-sm">
                        No outgoing likes yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Outgoing Super Likes */}
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    ⭐ Your Super Likes
                  </h3>

                  {loading.getOutgoingSuperLikes ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                      <span className="ml-3 text-gray-300">
                        Loading super likes...
                      </span>
                    </div>
                  ) : results.getOutgoingSuperLikes &&
                    Array.isArray(results.getOutgoingSuperLikes) &&
                    results.getOutgoingSuperLikes.length > 0 ? (
                    <div className="space-y-3">
                      {(results.getOutgoingSuperLikes as any[]).map(
                        (outgoingLike: any, index: number) => {
                          const address =
                            typeof outgoingLike === "string"
                              ? outgoingLike
                              : outgoingLike.address;
                          const profile =
                            typeof outgoingLike === "object"
                              ? outgoingLike.profile
                              : null;

                          return (
                            <ProfileCard
                              key={index}
                              address={address}
                              profile={profile}
                              index={index}
                              variant="outgoing"
                              statusLabel="YOU SUPER LIKED"
                              badge={
                                <div className="px-2 py-1 bg-yellow-500/80 text-white text-xs rounded-full">
                                  Super Liked
                                </div>
                              }
                            />
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">🌟</div>
                      <p className="text-gray-300 text-sm">
                        No outgoing super likes yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats Card */}
                <div className="glass p-6 rounded-2xl border border-purple-500/30">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    📊 Your Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-1">💕</div>
                      <p className="text-white font-semibold text-sm">
                        {results.getMutualMatches &&
                        Array.isArray(results.getMutualMatches)
                          ? (results.getMutualMatches as string[]).length
                          : 0}
                      </p>
                      <p className="text-gray-400 text-xs">Matches</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">✨</div>
                      <p className="text-white font-semibold text-sm">
                        {results.getMutualSuperMatches &&
                        Array.isArray(results.getMutualSuperMatches)
                          ? (results.getMutualSuperMatches as string[]).length
                          : 0}
                      </p>
                      <p className="text-gray-400 text-xs">Super Matches</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">💙</div>
                      <p className="text-white font-semibold text-sm">
                        {results.getIncomingLikes &&
                        Array.isArray(results.getIncomingLikes)
                          ? (results.getIncomingLikes as string[]).length
                          : 0}
                      </p>
                      <p className="text-gray-400 text-xs">Liked You</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">💚</div>
                      <p className="text-white font-semibold text-sm">
                        {results.getOutgoingLikes &&
                        Array.isArray(results.getOutgoingLikes)
                          ? (results.getOutgoingLikes as string[]).length
                          : 0}
                      </p>
                      <p className="text-gray-400 text-xs">Your Likes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-12 text-center space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/match"
                  className="btn-purple px-6 py-3 rounded-lg font-semibold"
                >
                  🔍 Discover More People
                </Link>
               
              </div>
            </div>
          </div>
        )}
        {/* Match Celebration Section */}{!userExists && (
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="glass-purple p-12 rounded-3xl">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-lime-400 rounded-3xl mb-6 animate-bounce">
                <span className="text-4xl font-bold text-black">
                  It&apos;s a match!
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-8 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
                <span className="text-3xl">👨</span>
              </div>
              <div
                className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-3xl">👩</span>
              </div>
            </div>

            <p className="text-white text-xl font-semibold mb-4">
              You and Jessica liked each other.
            </p>

            <p className="text-purple-300 mb-8">
              Start your blockchain-powered love story today!
            </p>

            {isConnected && (
              <Link
                href="/createprofile"
                className="btn-purple text-white px-8 py-4 rounded-xl text-lg font-semibold inline-block"
              >
                Create Your Profile Now
              </Link>
            )}
          </div>
        </div>)}
        {/* Demo Chat Section - For testing with your two addresses */}
        {isConnected && account && (
          <div className="max-w-4xl mx-auto mb-20 animate-fade-in">
            <div className="glass-purple p-8 rounded-3xl text-center">
              <h2 className="text-3xl font-bold gradient-text mb-6">
                💬 Test Real-time Chat
              </h2>
              <p className="text-gray-300 mb-6">
                Test the chat functionality between your two wallet addresses
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass p-4 rounded-xl">
                  <p className="text-white font-semibold mb-2">
                    Current Address:
                  </p>
                  <p className="text-gray-300 text-sm font-mono mb-4">
                    {account.slice(0, 10)}...{account.slice(-8)}
                  </p>
                  <button
                    onClick={() =>
                      startChat("0x1A05A7a19DC00A4ce12058a6A73e8F2C53eb3248")
                    }
                    className="btn-purple px-6 py-2 rounded-lg"
                  >
                    Chat with Test Address
                  </button>
                </div>

                <div className="glass p-4 rounded-xl">
                  <p className="text-white font-semibold mb-2">Test Address:</p>
                  <p className="text-gray-300 text-sm font-mono mb-4">
                    0x1A05A7a1...3eb3248
                  </p>
                  <p className="text-gray-400 text-xs">
                    Switch to this wallet to test both sides of the conversation
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
