"use client";

import React, { useState } from "react";
import { useWeb3 } from "../../lib/Web3Provider";
import { createDatingAppContract, ProfileData } from "../../lib/web3";
import MultiImageUpload from "../../components/MultiImageUpload";
import { createUser } from "@/lib/supabase";

export default function CreateProfile() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    age: 0,
    interests: "",
    uri: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signer) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.age || !formData.interests) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.uri.length === 0) {
      setError("Please upload at least one profile image");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const contract = createDatingAppContract(signer);

      const tx = await contract.createProfile(formData);
      setTxHash(tx.hash);

      // Wait for transaction confirmation
      await tx.wait();

      alert("Profile created successfully!");
      await createUser({
        Blk_Id: account?.toLowerCase() || "",
        wallet_address: account?.toLowerCase() || "",
        profile_id: tx.hash,
        profile_name: formData.name,
      });
      // Reset form
      setFormData({
        name: "",
        age: 0,
        interests: "",
        uri: [],
      });
    } catch (error: any) {
      console.error("Error creating profile:", error);
      setError(error.message || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative z-10 glass-purple p-8 rounded-2xl text-center max-w-md mx-4 animate-scale-in">
          <h1 className="text-3xl font-bold mb-4 gradient-text">
            Connect Your Wallet
          </h1>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to create a dating profile
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
    <div className="min-h-screen relative overflow-hidden py-12">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto glass-purple rounded-2xl shadow-2xl p-8 animate-scale-in">
        <h1 className="text-3xl font-bold text-center mb-8 gradient-text">
          Create Your Dating Profile
        </h1>

        <div className="mb-6 glass p-4 rounded-lg animate-slide-up">
          <p className="text-sm text-purple-300">
            <span className="font-semibold">Connected Wallet:</span>
          </p>
          <p className="text-xs text-gray-400 break-all">{account}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 glass border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              placeholder="Enter your name"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ""}
              onChange={handleInputChange}
              required
              min="18"
              max="100"
              className="w-full px-4 py-3 glass border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              placeholder="Enter your age"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <label
              htmlFor="interests"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Interests *
            </label>
            <textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 glass border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
              placeholder="e.g., hiking,music,cooking"
            />
            <p className="text-xs text-purple-300 mt-1">
              Separate interests with commas
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <MultiImageUpload
              images={formData.uri}
              onImagesChange={(images) =>
                setFormData((prev) => ({ ...prev, uri: images }))
              }
              maxImages={5}
            />
          </div>

          {error && (
            <div className="glass border border-red-500/50 rounded-lg p-4 animate-slide-up">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
    
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-purple text-white py-4 px-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Profile...
              </span>
            ) : (
              "Create Profile"
            )}
          </button>
        </form>

        <div
          className="mt-8 text-center animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="text-sm text-gray-400">
            Creating a profile will mint an NFT and give you 100 free Like and
            SuperLike tokens!
          </p>
        </div>
      </div>
    </div>
  );
}
