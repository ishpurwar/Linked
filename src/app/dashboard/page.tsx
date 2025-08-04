"use client";

import { useWeb3 } from "../../lib/Web3Provider";
import { useEffect, useState, useCallback } from "react";
import { checkUserExists } from "../../lib/supabase";
import { createDatingAppContract } from "@/lib/web3";
import ChatBox from "../../components/ChatBox";
import ProfileCard from "@/components/ProfileCard";
import Link from "next/link";

export default function Dashboard() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [userExists, setUserExists] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [results, setResults] = useState<Record<string, any>>({});
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
      testFunction: () => Promise<any>
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

  if (!isConnected) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-4xl font-bold gradient-text mb-6">
              Connect Your Wallet
            </h1>
            <p className="text-gray-300 mb-8">
              You need to connect your wallet to access your dating dashboard.
            </p>
            <button
              onClick={connectWallet}
              className="btn-purple text-white px-8 py-4 rounded-xl text-xl font-semibold"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userExists) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">👤</div>
            <h1 className="text-4xl font-bold gradient-text mb-6">
              Create Your Profile First
            </h1>
            <p className="text-gray-300 mb-8">
              You need to create a profile before accessing your dashboard.
            </p>
            <Link
              href="/createprofile"
              className="btn-purple text-white px-8 py-4 rounded-xl text-xl font-semibold inline-block"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Your Dating Dashboard
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Manage all your connections, likes, and matches in one place!
          </p>
        </div>

        {/* Comprehensive Matches & Likes Dashboard */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-in">
          <div className="glass-purple p-8 rounded-3xl">
            <h2 className="text-4xl font-bold gradient-text mb-6 text-center">
              💕 Your Connections
            </h2>

            {/* Main Grid Layout */}
            <div className="flex flex-col gap-10">
              {/* Mutual Matches */}
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
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  💕 All Your Matches
                </h3>

                {loading.getMutualMatches || loading.getMutualSuperMatches ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="ml-3 text-gray-300">
                      Loading matches...
                    </span>
                  </div>
                ) : (
                  (() => {
                    interface MatchItem {
                      address: string;
                      profile: any;
                      type: "match" | "super_match";
                      badge: JSX.Element;
                    }

                    const allMatches: MatchItem[] = [];

                    // Add mutual matches
                    if (
                      results.getMutualMatches &&
                      Array.isArray(results.getMutualMatches)
                    ) {
                      results.getMutualMatches.forEach((match: any) => {
                        const address =
                          typeof match === "string" ? match : match.address;
                        const profile =
                          typeof match === "object" ? match.profile : null;

                        allMatches.push({
                          address,
                          profile,
                          type: "match",
                          badge: (
                            <div className="px-2 py-1 bg-red-500/80 text-white text-xs rounded-full">
                              💕 Match
                            </div>
                          ),
                        });
                      });
                    }

                    // Add mutual super matches
                    if (
                      results.getMutualSuperMatches &&
                      Array.isArray(results.getMutualSuperMatches)
                    ) {
                      results.getMutualSuperMatches.forEach(
                        (superMatch: any) => {
                          const address =
                            typeof superMatch === "string"
                              ? superMatch
                              : superMatch.address;
                          const profile =
                            typeof superMatch === "object"
                              ? superMatch.profile
                              : null;

                          allMatches.push({
                            address,
                            profile,
                            type: "super_match",
                            badge: (
                              <div className="px-2 py-1 bg-yellow-500/80 text-white text-xs rounded-full">
                                ⭐ Super Match
                              </div>
                            ),
                          });
                        }
                      );
                    }

                    return allMatches.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allMatches.map((match, index) => (
                          <ProfileCard
                            key={`${match.address}-${index}`}
                            address={match.address}
                            profile={match.profile}
                            index={index}
                            variant="outgoing"
                            statusLabel={
                              match.type === "super_match"
                                ? "MUTUAL SUPER MATCH"
                                : "MUTUAL MATCH"
                            }
                            chat={true}
                            badge={match.badge}
                            startChat={startChat}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-2xl mb-2">💔</div>
                        <p className="text-gray-300 text-sm">
                          No matches yet. Keep swiping to find your perfect
                          match!
                        </p>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Incoming Likes */}

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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            variant="incoming"
                            statusLabel="SUPER LIKED YOU"
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
              <Link
                href="/chat"
                className="glass text-white border-2 border-purple-500/50 px-6 py-3 rounded-lg font-semibold hover:border-purple-400 hover:bg-purple-600/20 transition-all duration-300"
              >
                💬 Chat Room
              </Link>
              <Link
                href="/"
                className="glass text-white border-2 border-purple-500/50 px-6 py-3 rounded-lg font-semibold hover:border-purple-400 hover:bg-purple-600/20 transition-all duration-300"
              >
                🏠 Back to Home
              </Link>
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
