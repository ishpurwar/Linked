"use client";

import Link from "next/link";
import { useWeb3 } from "../lib/Web3Provider";
import { useEffect, useState } from "react";
import { checkUserExists } from "../lib/supabase";
import { createDatingAppContract } from "@/lib/web3";
import {
  contractAddress,
  likeTokenAddress,
  superLikeTokenAddress,
} from "@/lib/constants";
export default function Home() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [userExists, setUserExists] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [currentAddress, setCurrentAddress] = useState<string>("");
  useEffect(() => {
    const checkExists = async (account: any) => {
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

    checkExists(account);
  }, [account]);
  useEffect(() => {
    if (signer) {
      setContract(createDatingAppContract(signer));
      // Get current user address
      signer.getAddress().then(setCurrentAddress);
    }
  }, [signer]);

  const handleTest = async (
    testName: string,
    testFunction: () => Promise<any>
  ) => {
    if (!contract) {
      alert("Please connect your wallet first");
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
        {/* Mutual Matches Section - Only for existing users */}
        {userExists && (
          <div className="max-w-4xl mx-auto mb-20 animate-fade-in">
            <div className="glass-purple p-8 rounded-3xl">
              <h2 className="text-3xl font-bold gradient-text mb-6 text-center">
                Your Mutual Matches 💕
              </h2>
              <p className="text-gray-300 text-center mb-8">
                People who liked you back - start a conversation!
              </p>

              <div className="space-y-4">
                <button
                  onClick={() =>
                    handleTest("getMutualMatches", async () => {
                      if (!contract)
                        throw new Error("Contract not initialized");
                      return await contract.getMutualMatches();
                    })
                  }
                  className="w-full btn-purple px-6 py-3 rounded-lg font-semibold"
                  disabled={loading.getMutualMatches}
                >
                  {loading.getMutualMatches
                    ? "Loading..."
                    : "Get Mutual Matches"}
                </button>

                {results.getMutualMatches && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Your Matches:
                    </h3>
                    {Array.isArray(results.getMutualMatches) &&
                    results.getMutualMatches.length > 0 ? (
                      <div className="grid gap-4">
                        {results.getMutualMatches.map(
                          (matchAddress: string, index: number) => (
                            <div
                              key={index}
                              className="glass p-4 rounded-xl flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <span className="text-xl">💕</span>
                                </div>
                                <div>
                                  <p className="text-white font-semibold">
                                    Match #{index + 1}
                                  </p>
                                  <p className="text-gray-300 text-sm font-mono">
                                    {matchAddress.slice(0, 6)}...
                                    {matchAddress.slice(-4)}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  // For now, we'll show an alert. You can later integrate with a chat system
                                  alert(
                                    `Starting chat with ${matchAddress.slice(
                                      0,
                                      6
                                    )}...${matchAddress.slice(-4)}`
                                  );
                                  // TODO: Integrate with actual chat functionality
                                }}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
                              >
                                <span>💬</span>
                                Chat
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="glass p-6 rounded-xl text-center">
                        <div className="text-4xl mb-4">💔</div>
                        <p className="text-gray-300">No mutual matches yet.</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Keep swiping to find your perfect match!
                        </p>
                        <Link
                          href="/match"
                          className="inline-block mt-4 btn-purple px-6 py-2 rounded-lg"
                        >
                          Discover People
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {results.getMutualMatches &&
                  typeof results.getMutualMatches === "string" && (
                    <div className="glass p-4 rounded-xl">
                      <p className="text-red-400">
                        Error: {results.getMutualMatches}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
        {/* Match Celebration Section */}
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
        </div>
      </div>
    </div>
  );
}
